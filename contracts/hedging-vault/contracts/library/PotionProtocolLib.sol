/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionLiquidityPool } from "../interfaces/IPotionLiquidityPool.sol";
import { IOtoken } from "../interfaces/IOtoken.sol";
import { IOpynFactory } from "../interfaces/IOpynFactory.sol";
import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";

import "./PercentageUtils.sol";
import "./OpynProtocolLib.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable/interfaces/IERC20Upgradeable.sol";

/**
    @title PotionProtocolLib

    @author Roberto Cano <robercano>

    @notice Helper library to buy potions from the Potion Protocol
 */

library PotionProtocolLib {
    using PercentageUtils for uint256;
    using OpynProtocolLib for IOpynFactory;

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
        @param potion Potion (otoken) to settle

        @dev The settlement will send back the proceeds of the expired potion to this contract

        @dev The settled amount is not available in the contract. Check the below TODO for more info
     */
    function redeemPotion(IPotionLiquidityPool potionLiquidityPoolManager, address potion) internal {
        // TODO: There is no way to get the amount of proceeds returned by the protocol. We may
        // TODO: need to retrieve manually the USDC balance before and after in order to get it
        potionLiquidityPoolManager.settleAfterExpiry(IOtoken(potion));
    }
}
