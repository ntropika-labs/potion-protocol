/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionBuyAction } from "../interfaces/IPotionBuyAction.sol";
import { ISwapToUSDCAction } from "../interfaces/ISwapToUSDCAction.sol";
import { IVault } from "../interfaces/IVault.sol";
import { IRoundsInputVault } from "../interfaces/IRoundsInputVault.sol";
import { IRoundsOutputVault } from "../interfaces/IRoundsOutputVault.sol";
import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IUniswapV3Oracle } from "../interfaces/IUniswapV3Oracle.sol";
import { IPotionProtocolOracle } from "../interfaces/IPotionProtocolOracle.sol";
import { ILifecycleStates } from "../interfaces/ILifecycleStates.sol";
import "../interfaces/IHedgingVaultOrchestrator.sol";

/**  
    @title HedgingVaultOrchestrator

    @author Roberto Cano <robercano>

    @notice Helper contract to allow the operator to enter and exit a position of a hedging vault using only
    one transaction. The Hedging Vault is an investment vault using the PotionBuyAction strategy. The helper
    talks to both the vault and the action separately to configure the necessary swap routes and potion buy
    counterparties, and then enters the position. This also allows to minimize the amount of slippage in the
    Uniswap V3 swap and the Potion Protocol buy.
 */
contract HedgingVaultOrchestrator is Ownable, IHedgingVaultOrchestrator {
    IVault public investmentVault;
    IPotionBuyAction public potionBuyAction;
    ISwapToUSDCAction public swapToUSDCAction;
    IRoundsInputVault public roundsInputVault;
    IRoundsOutputVault public roundsOutputVault;

    IVaultV0.Strategy private _potionBuyStrategy;
    IVaultV0.Strategy private _swapToUSDCStrategy;

    /// CONSTRUCTOR

    /**
        @notice Constructor for the HedgingVaultOrchestrator contract

        @param potionBuyStrategy_ The default strategy to buy potions
        @param swapToUSDCStrategy_ The fallback strategy to swap to USDC
     */
    constructor(IVaultV0.Strategy memory potionBuyStrategy_, IVaultV0.Strategy memory swapToUSDCStrategy_) {
        _potionBuyStrategy = potionBuyStrategy_;
        _swapToUSDCStrategy = swapToUSDCStrategy_;
    }

    // STATE MODIFIERS

    /**
        @inheritdoc IHedgingVaultOrchestrator
    */
    function setSystemAddresses(
        address investmentVault_,
        address potionBuyAction_,
        address swapToUSDCAction_,
        address roundsInputVault_,
        address roundsOutputVault_
    ) external onlyOwner {
        investmentVault = IVault(investmentVault_);
        potionBuyAction = IPotionBuyAction(potionBuyAction_);
        swapToUSDCAction = ISwapToUSDCAction(swapToUSDCAction_);
        roundsInputVault = IRoundsInputVault(roundsInputVault_);
        roundsOutputVault = IRoundsOutputVault(roundsOutputVault_);
    }

    /**
        @inheritdoc IHedgingVaultOrchestrator
     */
    function nextRound(
        IUniswapV3Oracle.SwapInfo calldata potionBuyExitSwapInfo,
        PotionBuyInfo calldata potionBuyEnterBuyInfo,
        IUniswapV3Oracle.SwapInfo calldata potionBuyEnterSwapInfo,
        IUniswapV3Oracle.SwapInfo calldata swapToUSDCExitSwapInfo,
        IUniswapV3Oracle.SwapInfo calldata swapToUSDCEnterSwapInfo
    ) external onlyOwner {
        ILifecycleStates.LifecycleState vaultState = investmentVault.getLifecycleState();

        if (vaultState == ILifecycleStates.LifecycleState.Locked) {
            // Exit position
            potionBuyAction.setSwapInfo(potionBuyExitSwapInfo);
            swapToUSDCAction.setSwapInfo(swapToUSDCExitSwapInfo);

            investmentVault.exitPosition();
        }

        // The order of operation here should not be of importance: the ratio of
        // assets/shares remains the same after either of these operations
        roundsInputVault.nextRound();
        roundsOutputVault.nextRound();

        // Enter position
        potionBuyAction.setPotionBuyInfo(potionBuyEnterBuyInfo);
        potionBuyAction.setSwapInfo(potionBuyEnterSwapInfo);
        swapToUSDCAction.setSwapInfo(swapToUSDCEnterSwapInfo);

        // Main strategy
        /* solhint-disable-next-line no-empty-blocks */
        try investmentVault.enterPositionWith(_potionBuyStrategy) {
            // Empty on purpose
        } catch {
            // Fallback strategy
            investmentVault.enterPositionWith(_swapToUSDCStrategy);
        }
    }

    /// GETTERS

    /**
        @inheritdoc IHedgingVaultOrchestrator
     */
    function canEnterNextRound() external view returns (bool) {
        return investmentVault.canPositionBeExited();
    }

    /**
        @inheritdoc IHedgingVaultOrchestrator
     */
    function potionBuyStrategy() external view returns (IVaultV0.Strategy memory) {
        return _potionBuyStrategy;
    }

    /**
        @inheritdoc IHedgingVaultOrchestrator
     */
    function swapToUSDCStrategy() external view returns (IVaultV0.Strategy memory) {
        return _swapToUSDCStrategy;
    }
}
