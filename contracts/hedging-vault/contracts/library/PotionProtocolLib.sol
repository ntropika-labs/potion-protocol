/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "../interfaces/IPotionLiquidityPool.sol";
import { IOtoken } from "../interfaces/IOtoken.sol";
import { IOpynFactory } from "../interfaces/IOpynFactory.sol";
import { IOpynController } from "../interfaces/IOpynController.sol";
import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";

import "./PercentageUtils.sol";
import "./PriceUtils.sol";
import "./OpynProtocolLib.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC20Upgradeable.sol";
import { IERC20MetadataUpgradeable as IERC20Metadata } from "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC20MetadataUpgradeable.sol";

/**
    @title PotionProtocolLib

    @author Roberto Cano <robercano>

    @notice Helper library to buy potions from the Potion Protocol
 */

library PotionProtocolLib {
    using PercentageUtils for uint256;
    using OpynProtocolLib for IOpynFactory;

    /// CONSTANTS
    uint256 public constant OTOKEN_DECIMALS = 8;

    /// FUNCTIONS

    /**
        @notice Buys the specified amount of potions with the given parameters

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param opynFactory Address of the Opyn Factory
        @param underlyingAsset Address of the underlying asset of the potion to buy
        @param strikePriceInUSDC Strike price of the potion to buy, in USDC, with 6 decimals
        @param expirationTimestamp Expiration timestamp of the potion to buy
        @param maxPremiumInUSDC Maximum premium to pay for the potion, in USDC
        @param targetPotionAddress Address of the potion to buy
        @param sellers List of liquidity providers to use to buy the potion
        @param USDC Address of the USDC token

        @return actualPremiumInUSDC The actual premium paid for the purchase of potions
     */
    function buyPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynFactory opynFactory,
        address underlyingAsset,
        uint256 strikePriceInUSDC,
        uint256 expirationTimestamp,
        uint256 maxPremiumInUSDC,
        address targetPotionAddress,
        IPotionLiquidityPool.CounterpartyDetails[] memory sellers,
        IERC20 USDC
    ) internal returns (uint256 actualPremiumInUSDC) {
        SafeERC20.safeApprove(USDC, address(potionLiquidityPoolManager), maxPremiumInUSDC);

        address oToken = opynFactory.getExistingOtoken(
            underlyingAsset,
            address(USDC),
            strikePriceInUSDC,
            expirationTimestamp
        );

        if (oToken == address(0)) {
            address targetOToken = opynFactory.getTargetOtoken(
                underlyingAsset,
                address(USDC),
                strikePriceInUSDC,
                expirationTimestamp
            );

            require(targetOToken == targetPotionAddress, "Otoken does not exist and target address does not match");

            actualPremiumInUSDC = potionLiquidityPoolManager.createAndBuyOtokens(
                underlyingAsset,
                address(USDC),
                address(USDC),
                strikePriceInUSDC,
                expirationTimestamp,
                true,
                sellers,
                maxPremiumInUSDC
            );
        } else {
            require(oToken == targetPotionAddress, "Otoken does exist but target address does not match");

            actualPremiumInUSDC = potionLiquidityPoolManager.buyOtokens(IOtoken(oToken), sellers, maxPremiumInUSDC);
        }

        if (actualPremiumInUSDC < maxPremiumInUSDC) {
            SafeERC20.safeApprove(USDC, address(potionLiquidityPoolManager), 0);
        }
    }

    /**
        @notice Settles the specified potion after it has expired

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param buyInfo The information used to previously purchase the potions
     */
    function settlePotion(IPotionLiquidityPool potionLiquidityPoolManager, PotionBuyInfo memory buyInfo) internal {
        IOtoken potion = IOtoken(buyInfo.targetPotionAddress);

        IPotionLiquidityPool.PoolIdentifier[] memory pools = _getPoolsInfo(buyInfo);

        potionLiquidityPoolManager.settleAndRedistributeSettlement(potion, pools);
    }

    /**
        @notice Redeems the specified potion after it has expired

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param opynController Address of the Opyn controller to claim the payout
        @param targetPotionAddress Address of the potion to redeem
        @param totalSizeInPotions The total amount of potions to redeem
        
        @dev The settlement will send back the proceeds of the expired potion to this contract

        @dev The settled amount is not available in the contract. Check the below TODO for more info
     */
    function redeemPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynController opynController,
        address targetPotionAddress,
        uint256 totalSizeInPotions
    ) internal {
        uint256 potionVaultId = potionLiquidityPoolManager.getVaultId(IOtoken(targetPotionAddress));

        IOpynController.ActionArgs[] memory redeemArgs = _getRedeemPotionAction(
            address(this),
            targetPotionAddress,
            potionVaultId,
            totalSizeInPotions
        );

        opynController.operate(redeemArgs);
    }

    /**
        @notice Retrieves the payout amount for an expired potion

        @param opynController Address of the Opyn controller to retrieve the payout amount
        @param potion Potion (otoken) to retrieve the payout amount for
        @param amount The amount of potions to retrieve the payout amount for

        @return payout The amount of USDC that will be returned to the buyer
     */
    function getPayout(
        IOpynController opynController,
        address potion,
        uint256 amount
    ) internal view returns (uint256 payout) {
        payout = opynController.getPayout(potion, amount);
    }

    /**
        @notice Retrieves the redeem action arguments for an expired potion

        @param owner Address of the buyer of the potion
        @param potion Potion (otoken) to settle
        @param vaultId The vault id of the potion to redeem
        @param amount The amount of USDC that will be returned to the buyer

        @return The redeem action arguments
    */
    function _getRedeemPotionAction(
        address owner,
        address potion,
        uint256 vaultId,
        uint256 amount
    ) private pure returns (IOpynController.ActionArgs[] memory) {
        IOpynController.ActionArgs[] memory redeemArgs = new IOpynController.ActionArgs[](1);
        redeemArgs[0] = IOpynController.ActionArgs({
            actionType: IOpynController.ActionType.Redeem,
            owner: owner,
            secondAddress: owner,
            asset: potion,
            vaultId: vaultId,
            amount: amount,
            index: 0,
            data: ""
        });

        return redeemArgs;
    }

    /**
        @notice Retrieves the list of pools from the counterparties list

        @param buyInfo Structure with the counterparties list

        @return pools The list of pools to be settled
     */
    function _getPoolsInfo(PotionBuyInfo memory buyInfo)
        private
        pure
        returns (IPotionLiquidityPool.PoolIdentifier[] memory pools)
    {
        pools = new IPotionLiquidityPool.PoolIdentifier[](buyInfo.sellers.length);

        for (uint256 i = 0; i < buyInfo.sellers.length; i++) {
            pools[i] = IPotionLiquidityPool.PoolIdentifier({
                lp: buyInfo.sellers[i].lp,
                poolId: buyInfo.sellers[i].poolId
            });
        }
    }
}
