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
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/interfaces/IERC20Metadata.sol";

/**
    @title PotionProtocolLib

    @author Roberto Cano <robercano>

    @notice Helper library to buy potions from the Potion Protocol
 */

library PotionProtocolLib {
    using PercentageUtils for uint256;
    using OpynProtocolLib for IOpynFactory;

    /// CONSTANTS
    uint256 private constant OTOKEN_DECIMALS = 8;

    /// FUNCTIONS

    /**
        @notice Buys the specified amount of potions with the given parameters

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param buyInfo The information required to buy a specific potion with a specific maximum premium requirement
        @param slippage Slippage to apply to the premium to calculate the maximum premium allowed

        @return actualPremium The actual premium paid for the purchase of potions

        @dev Convenience function that calculates the slippage on the premium and calls the
        pool manager. Abstracted here in case it is needed to expand the logic in the future.
     */

    function buyPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynFactory opynFactory,
        PotionBuyInfo memory buyInfo,
        uint256 slippage,
        IERC20 USDC
    ) internal returns (uint256 actualPremium) {
        uint256 maxPremium = buyInfo.expectedPremiumInUSDC.addPercentage(slippage);

        SafeERC20.safeApprove(USDC, address(potionLiquidityPoolManager), maxPremium);

        address oToken = opynFactory.getExistingOtoken(
            buyInfo.underlyingAsset,
            address(USDC),
            buyInfo.strikePriceInUSDC,
            buyInfo.expirationTimestamp
        );

        if (oToken == address(0)) {
            address targetOToken = opynFactory.getTargetOtoken(
                buyInfo.underlyingAsset,
                address(USDC),
                buyInfo.strikePriceInUSDC,
                buyInfo.expirationTimestamp
            );

            require(
                targetOToken == buyInfo.targetPotionAddress,
                "Otoken does not exist and target address does not match"
            );

            actualPremium = potionLiquidityPoolManager.createAndBuyOtokens(
                buyInfo.underlyingAsset,
                address(USDC),
                address(USDC),
                buyInfo.strikePriceInUSDC,
                buyInfo.expirationTimestamp,
                true,
                buyInfo.sellers,
                maxPremium
            );
        } else {
            require(oToken == buyInfo.targetPotionAddress, "Otoken does exist but target address does not match");

            actualPremium = potionLiquidityPoolManager.buyOtokens(IOtoken(oToken), buyInfo.sellers, maxPremium);
        }

        if (actualPremium < maxPremium) {
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
        potionLiquidityPoolManager.settleAfterExpiry(potion);
    }

    /**
        @notice Redeems the specified potion after it has expired

        @param potionLiquidityPoolManager Address of the Potion Protocol liquidity manager
        @param opynController Address of the Opyn controller to claim the payout
        @param buyInfo The information used to previously purchase the potions
        
        @dev The settlement will send back the proceeds of the expired potion to this contract

        @dev The settled amount is not available in the contract. Check the below TODO for more info
     */
    function redeemPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynController opynController,
        PotionBuyInfo memory buyInfo
    ) internal {
        IOtoken potion = IOtoken(buyInfo.targetPotionAddress);

        uint256 potionVaultId = potionLiquidityPoolManager.getVaultId(potion);

        IOpynController.ActionArgs[] memory redeemArgs = _getRedeemPotionAction(
            address(this),
            address(potion),
            potionVaultId,
            buyInfo.totalSizeInPotions
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
        @notice Gets the amount of potions required to cover the specified amount of the hedged asset

        @param hedgedAsset The asset being hedged by the potions
        @param amount The amount of the hedged asset to be covered by the potions

        @return The amount of potions required to cover the specified amount of the hedged asset
     */
    function getPotionsAmount(address hedgedAsset, uint256 amount) internal view returns (uint256) {
        uint256 hedgedAssetDecimals = IERC20Metadata(hedgedAsset).decimals();

        // Convert with a 1:1 ratio, just adjust the decimals
        return PriceUtils.convertAmount(hedgedAssetDecimals, OTOKEN_DECIMALS, amount, 1, 1);
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
}
