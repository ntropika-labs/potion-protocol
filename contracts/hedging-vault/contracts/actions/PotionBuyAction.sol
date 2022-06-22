/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./common/BaseActionUpgradeable.sol";
import { PotionProtocolHelperUpgradeable } from "./common/PotionProtocolHelperUpgradeable.sol";
import "../versioning/PotionBuyActionV0.sol";
import "../library/PercentageUtils.sol";

/**
    @title PotionBuyAction

    @author Roberto Cano <robercano>

    @notice Investment action that buys a potion with the given amount of asset

 */
contract PotionBuyAction is BaseActionUpgradeable, PotionProtocolHelperUpgradeable, PotionBuyActionV0 {
    using PercentageUtils for uint256;

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here
     */
    function initialize(
        address adminRole,
        address keeperRole,
        address loanedAsset,
        address USDC,
        address potionLiquidityPoolManager
    ) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the loaned
        // asset is not allowed to be refunded and also USDC because the action will hold some of it
        // at some times. This prevents the admin to accidentally refund those assets
        address[] memory cannotRefundTokens = new address[](2);
        cannotRefundTokens[0] = loanedAsset;
        cannotRefundTokens[1] = USDC;

        __BaseAction_init_chained(adminRole, keeperRole, cannotRefundTokens);
        __PotionProtocolHelper_init_unchained(potionLiquidityPoolManager, USDC);
    }

    /**
        @inheritdoc IAction

        @dev The Potion Buy action needs the 
     */
    function enterPosition(
        IERC20, /*asset*/
        uint256 /*amountReceived*/
    ) external pure {
        revert("todo");
    }

    /**
        @inheritdoc IAction
     */
    function exitPosition(
        IERC20 /*asset*/
    )
        external
        pure
        returns (
            uint256 /*amountReturned*/
        )
    {
        revert("todo");
    }

    /**
        @inheritdoc IAction
     */
    function canPositionBeExited()
        external
        pure
        returns (
            bool /*canExit*/
        )
    {
        revert("todo");
    }

    /**
        @inheritdoc PotionBuyActionV0
     */
    function setMaxPremiumPercentage(uint256 maxPremiumPercentage_) external override onlyAdmin {
        require(
            maxPremiumPercentage_ > 0 && maxPremiumPercentage_ <= PercentageUtils.PERCENTAGE_100,
            "maxPremiumPercentage must be >0 or <= 100"
        );
        maxPremiumPercentage = maxPremiumPercentage_;
    }

    /**
        @inheritdoc PotionBuyActionV0
     */

    function setPremiumSlippage(uint256 premiumSlippage_) external override onlyAdmin {
        require(
            premiumSlippage_ > 0 && premiumSlippage_ <= PercentageUtils.PERCENTAGE_100,
            "premiumSlippage must be >0 or <= 100"
        );
        premiumSlippage = premiumSlippage_;
    }
}
