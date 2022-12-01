import { ethers, network } from "hardhat";
import { BigNumber, Signer } from "ethers";

import * as HedgingVaultUtils from "hedging-vault-sdk";
import { CurveCriteria, HyperbolicCurve } from "contracts-math";
import { ifMocksEnabled, asMock, DAY_IN_SECONDS } from "contracts-utils";

import { HedgingVaultEnvironmentDeployment } from "../hedging-vault/deployHedgingVaultEnvironment";

import {
    ERC20PresetMinterPauser,
    IPotionLiquidityPool,
    IUniswapV3Oracle,
    MockChainlinkAggregatorV3,
} from "../../typechain";
import { PotionBuyInfoStruct } from "../../typechain/contracts/actions/PotionBuyAction";
import { getEncodedSwapPath } from "./uniswapV3Utils";
import { calculateOrderSize } from "hedging-vault-sdk";

/**
    @notice Miscelaneous calculations utils to simulate the behaviour of the vault given some input parameters

    @author Roberto Cano <robercano>
 */

/**
    @notice Interface that holds the results of the Vault Simulation
 */
interface TestConditions {
    uniswapEnterPositionInputAmount: BigNumber;
    uniswapEnterPositionInputAmountWithSlippage: BigNumber;
    uniswapExitPositionOutputAmount: BigNumber;
    uniswapExitPositionOutputAmountWithSlippage: BigNumber;
    potionBuyInfo: PotionBuyInfoStruct;
    potionBuySwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    potionBuySwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapEnterPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCSwapExitPosition: IUniswapV3Oracle.SwapInfoStruct;
    swapToUSDCAmountUSDC: BigNumber;
    underlyingAssetExitPriceInUSD: BigNumber;
    expirationTimestamp: BigNumber;
    maxPremiumWithSlippageInUSDC: BigNumber;
    totalUSDCInActionAfterPayout: BigNumber;
    amountProtectedInUnderlying: BigNumber;
}

export function calculatePremium(
    pool: IPotionLiquidityPool.PoolOfCapitalStructOutput,
    curve: HyperbolicCurve,
    deltaX: BigNumber,
): BigNumber {
    const currentLockedAmount = pool.locked.toNumber();
    const currentTotalAmount = pool.total.toNumber();
    const delta = deltaX.toNumber();

    const newLockedAmount = currentLockedAmount + delta;

    const newPremium = newLockedAmount * curve.evalAt(newLockedAmount / currentTotalAmount);
    const previousPremium = currentLockedAmount * curve.evalAt(currentLockedAmount / currentTotalAmount);

    return BigNumber.from(Math.floor(newPremium - previousPremium));
}

export async function getRouterPremium(
    tEnv: HedgingVaultEnvironmentDeployment,
    amountToBeInvested: BigNumber,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
) {
    // The Potion Protocol sample deployment creates some pools of capitals using the default ethers signers. We
    // use the first pool of capital and copy its curve and criteria here. The lp address is the address of the
    // deployer of the contracts (i.e.: signer[0]). And the pool id is always 0
    const amountProtectedInUnderlying = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
    const amountProtectedInUSDC = amountProtectedInUnderlying
        .mul(underlyingAssetPriceInUSD)
        .div(USDCPriceInUSD)
        .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

    const collateralRequiredInUSDC = HedgingVaultUtils.applyPercentage(amountProtectedInUSDC, tEnv.strikePercentage);

    const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);

    const lpAddress = (await ethers.getSigners())[0].address;
    const pool = await tEnv.potionLiquidityPoolManager.lpPools(lpAddress, 0);

    return calculatePremium(pool, curve, collateralRequiredInUSDC);
}

export async function getPotionBuyInfo(
    tEnv: HedgingVaultEnvironmentDeployment,
    amountToBeInvested: BigNumber,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
): Promise<{ potionBuyInfo: PotionBuyInfoStruct; expectedPremiumInUSDC: BigNumber }> {
    const spotPriceUSDC = BigNumber.from(10).pow(6).mul(underlyingAssetPriceInUSD).div(USDCPriceInUSD);
    const curve = new HyperbolicCurve(0.1, 0.1, 0.1, 0.1);
    const criteria = new CurveCriteria(tEnv.underlyingAsset.address, tEnv.USDC.address, true, 120, 365); // PUT, max 120% strike & max 1 year duration

    const lpAddress = (await ethers.getSigners())[0].address;

    const undelyingDecimals = await tEnv.underlyingAsset.decimals();

    const initialPremiumInUSDC = await getRouterPremium(
        tEnv,
        amountToBeInvested,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );
    const { effectiveVaultSize } = await calculateOrderSize(
        amountToBeInvested,
        undelyingDecimals,
        tEnv.hedgingRate,
        tEnv.strikePercentage,
        spotPriceUSDC,
        initialPremiumInUSDC,
    );
    const expectedPremiumInUSDC = await getRouterPremium(
        tEnv,
        effectiveVaultSize,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    const otokensAmount = effectiveVaultSize.div(10000000000); // oToken uses 8 decimals
    const strikePriceInUSDC = HedgingVaultUtils.applyPercentage(underlyingAssetPriceInUSD, tEnv.strikePercentage);
    const nextCycleStartTimestamp = await tEnv.potionBuyAction.nextCycleStartTimestamp();
    const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

    const potionOtokenAddress = await tEnv.opynFactory.getTargetOtokenAddress(
        tEnv.underlyingAsset.address,
        tEnv.USDC.address,
        tEnv.USDC.address,
        strikePriceInUSDC,
        expirationTimestamp,
        true,
    );

    const counterparties: IPotionLiquidityPool.CounterpartyDetailsStruct[] = [
        {
            lp: lpAddress,
            poolId: 0,
            curve: curve.asSolidityStruct(),
            criteria: criteria,
            orderSizeInOtokens: otokensAmount,
        },
    ];

    const potionBuyInfo: PotionBuyInfoStruct = {
        targetPotionAddress: potionOtokenAddress,
        underlyingAsset: tEnv.underlyingAsset.address,
        strikePriceInUSDC: strikePriceInUSDC,
        expirationTimestamp: expirationTimestamp,
        sellers: counterparties,
        expectedPremiumInUSDC: expectedPremiumInUSDC,
    };

    return { potionBuyInfo, expectedPremiumInUSDC };
}

export async function getSwapInfo(
    inputToken: ERC20PresetMinterPauser,
    outputToken: ERC20PresetMinterPauser,
    inputTokenPriceInUSD: BigNumber,
    outputTokenPriceInUSD: BigNumber,
): Promise<IUniswapV3Oracle.SwapInfoStruct> {
    return {
        inputToken: inputToken.address,
        outputToken: outputToken.address,
        expectedPriceRate: HedgingVaultUtils.getRateInUD60x18(
            Number(ethers.utils.formatUnits(inputTokenPriceInUSD, 8)),
            Number(ethers.utils.formatUnits(outputTokenPriceInUSD, 8)),
            await inputToken.decimals(),
            await outputToken.decimals(),
        ),
        swapPath: getEncodedSwapPath([inputToken.address, outputToken.address]),
    } as IUniswapV3Oracle.SwapInfoStruct;
}

export async function setupTestConditions(
    tEnv: HedgingVaultEnvironmentDeployment,
    underlyingAssetPriceInUSD: BigNumber,
    USDCPriceInUSD: BigNumber,
    amountToBeInvested: BigNumber,
    exitPriceDecreasePercentage: BigNumber,
): Promise<TestConditions> {
    /*
        CHAINLINK ORACLES
    */
    await (tEnv.chainlinkAggregatorUSDC as unknown as MockChainlinkAggregatorV3).setAnswer(USDCPriceInUSD);
    await (tEnv.chainlinkAggregatorUnderlying as unknown as MockChainlinkAggregatorV3).setAnswer(
        underlyingAssetPriceInUSD,
    );

    /*
        POTION BUY INFO
    */
    const { potionBuyInfo, expectedPremiumInUSDC } = await getPotionBuyInfo(
        tEnv,
        amountToBeInvested,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    /*
        COLLATERAL
    */
    const amountProtectedInUnderlying = HedgingVaultUtils.applyPercentage(amountToBeInvested, tEnv.hedgingRate);
    const amountProtectedInUSDC = amountProtectedInUnderlying
        .mul(underlyingAssetPriceInUSD)
        .div(USDCPriceInUSD)
        .div(BigNumber.from(1000000000000)); // USDC only uses 6 decimals, so divide by 10**(18 - 6)

    const maxPremiumWithSlippageInUSDC = HedgingVaultUtils.addPercentage(expectedPremiumInUSDC, tEnv.premiumSlippage);
    const nextCycleStartTimestamp = await tEnv.potionBuyAction.nextCycleStartTimestamp();
    const expirationTimestamp = nextCycleStartTimestamp.add(DAY_IN_SECONDS);

    const uniswapEnterPositionInputAmount = maxPremiumWithSlippageInUSDC
        .mul(BigNumber.from(1000000000000))
        .mul(USDCPriceInUSD)
        .div(underlyingAssetPriceInUSD);

    const uniswapEnterPositionInputAmountWithSlippage = HedgingVaultUtils.addPercentage(
        uniswapEnterPositionInputAmount,
        tEnv.swapSlippage,
    );

    const underlyingAssetPricePercentage = tEnv.strikePercentage.sub(exitPriceDecreasePercentage);
    const underlyingAssetExitPriceInUSD = HedgingVaultUtils.applyPercentage(
        underlyingAssetPriceInUSD,
        underlyingAssetPricePercentage,
    );
    const payoutInUSDC = HedgingVaultUtils.applyPercentage(amountProtectedInUSDC, exitPriceDecreasePercentage);

    // TODO: when using the mocked version of the vault, the premium is never sent to the Potion Protocol,
    // TODO: so the maximum premium remains in the vault
    let totalUSDCInActionAfterPayout: BigNumber;
    if (network.name === "hardhat") {
        totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC.sub(expectedPremiumInUSDC);
    } else {
        totalUSDCInActionAfterPayout = maxPremiumWithSlippageInUSDC;
    }

    /*
        SWAP INFO
    */
    const potionBuySwapEnterPosition = await getSwapInfo(
        tEnv.underlyingAsset as ERC20PresetMinterPauser,
        tEnv.USDC as ERC20PresetMinterPauser,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );
    const swapToUSDCSwapEnterPosition = potionBuySwapEnterPosition;

    const potionBuySwapExitPosition = await getSwapInfo(
        tEnv.USDC as ERC20PresetMinterPauser,
        tEnv.underlyingAsset as ERC20PresetMinterPauser,
        USDCPriceInUSD,
        underlyingAssetExitPriceInUSD,
    );

    const swapToUSDCSwapExitPosition = potionBuySwapExitPosition;

    /*
        EXIT CALCULATIONS
    */
    const uniswapExitPositionOutputAmount = totalUSDCInActionAfterPayout
        .mul(potionBuySwapExitPosition.expectedPriceRate as BigNumber)
        .div(BigNumber.from("1000000000000000000"));

    const uniswapExitPositionOutputAmountWithSlippage = HedgingVaultUtils.subtractPercentage(
        uniswapExitPositionOutputAmount,
        tEnv.swapSlippage,
    );

    /*
        OPYN ORACLE
    */
    await tEnv.opynOracle.setStablePrice(tEnv.underlyingAsset.address, underlyingAssetPriceInUSD);
    await tEnv.opynOracle.setStablePrice(tEnv.USDC.address, USDCPriceInUSD);

    /*
        MOCKS SETUP
    */
    ifMocksEnabled(() => {
        asMock(tEnv.potionLiquidityPoolManager).buyOtokens.returns(async () => {
            // Transfer
            await tEnv.USDC.connect(asMock(tEnv.potionLiquidityPoolManager).wallet as unknown as Signer).transferFrom(
                tEnv.potionBuyAction.address,
                tEnv.potionLiquidityPoolManager.address,
                expectedPremiumInUSDC,
            );
            return expectedPremiumInUSDC;
        });
        asMock(tEnv.opynController)
            .isSettlementAllowed.whenCalledWith(potionBuyInfo.targetPotionAddress)
            .returns(false);

        asMock(tEnv.USDC).approve.reset();
        asMock(tEnv.USDC).approve.returns(true);

        asMock(tEnv.underlyingAsset).approve.reset();
        asMock(tEnv.underlyingAsset).approve.returns(true);

        asMock(tEnv.opynController).isSettlementAllowed.whenCalledWith(potionBuyInfo.targetPotionAddress).returns(true);
        asMock(tEnv.opynController).getPayout.returns(() => {
            return payoutInUSDC;
        });

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        asMock(tEnv.opynController).operate.returns(async (args: any) => {
            if (args[0][0].actionType !== 8) {
                return;
            }
            // TODO: This is failing and I'm not sure if it is a Smock problem or a logic
            // TODO: problem in the tests. Talking to the smock team it seems likely that it
            // TODO: is a problem with the smock library and calling the EVM from an async callback
            // await tEnv.USDC.connect(ownerAccount).mint(potionBuy.address, payoutInUSDC);
        });
    });

    // Swap To USDC swapped amount
    const underlyingDecimals = await tEnv.underlyingAsset.decimals();
    const swapToUSDCAmountUSDC = HedgingVaultUtils.convertAmountToUSDC(
        amountToBeInvested,
        underlyingDecimals,
        underlyingAssetPriceInUSD,
        USDCPriceInUSD,
    );

    return {
        uniswapEnterPositionInputAmount,
        uniswapEnterPositionInputAmountWithSlippage,
        uniswapExitPositionOutputAmount,
        uniswapExitPositionOutputAmountWithSlippage,
        potionBuyInfo,
        potionBuySwapEnterPosition,
        potionBuySwapExitPosition,
        swapToUSDCSwapEnterPosition,
        swapToUSDCSwapExitPosition,
        swapToUSDCAmountUSDC,
        underlyingAssetExitPriceInUSD,
        expirationTimestamp,
        maxPremiumWithSlippageInUSDC,
        totalUSDCInActionAfterPayout,
        amountProtectedInUnderlying,
    };
}
