/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IOpynController } from "../interfaces/IOpynController.sol";
import { IOpynFactory } from "../interfaces/IOpynFactory.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC20Upgradeable.sol";

/**
    @title OpynProtocolLib

    @author Roberto Cano <robercano>

    @notice Helper library to query the Opyn protocol
 */
library OpynProtocolLib {
    /// FUNCTIONS

    /**
        @notice Returns whether the given potion can be redeemed already or not

        @dev Unfortunately the Potion Protocol does not have a function to check if a potion can be redeemed
        or not, and it relies on the Opyn Controller for doing this. Wrapping this up in a library to make it
        more accesible
     */
    function isPotionRedeemable(IOpynController opynController, address potion) internal view returns (bool) {
        return opynController.isSettlementAllowed(potion);
    }

    /**
        @notice get the address at which a new oToken with these parameters would be deployed
        
        @param underlyingAsset asset that the option references
        @param USDC Address of the USDC token
        @param strikePrice strike price with decimals = 18
        @param expiry expiration timestamp as a unix timestamp
        
        @return the address of target otoken.
     */
    function getExistingOtoken(
        IOpynFactory opynFactory,
        address underlyingAsset,
        address USDC,
        uint256 strikePrice,
        uint256 expiry
    ) internal view returns (address) {
        return opynFactory.getOtoken(underlyingAsset, USDC, USDC, strikePrice, expiry, true);
    }

    /**
        @notice get the address at which a new oToken with these parameters would be deployed
     
        @param underlyingAsset asset that the option references
        @param USDC Address of the USDC token
        @param strikePrice strike price with decimals = 18
        @param expiry expiration timestamp as a unix timestamp

     @return targetAddress the address this oToken would be deployed at
     */
    function getTargetOtoken(
        IOpynFactory opynFactory,
        address underlyingAsset,
        address USDC,
        uint256 strikePrice,
        uint256 expiry
    ) internal view returns (address) {
        return opynFactory.getTargetOtokenAddress(underlyingAsset, USDC, USDC, strikePrice, expiry, true);
    }

    /**
        @notice Retrieves the amount of oTokens that the given account owns

        @param opynFactory Address of the Opyn Factory
        @param underlyingAsset Address of the underlying asset of the potion to buy
        @param strikePriceInUSDC Strike price of the potion to buy, in USDC, with 6 decimals
        @param expirationTimestamp Expiration timestamp of the potion to buy

        @return The amount of oTokens that the given account owns
     */
    function getOtokenBalance(
        IOpynFactory opynFactory,
        address underlyingAsset,
        uint256 strikePriceInUSDC,
        uint256 expirationTimestamp,
        IERC20 USDC,
        address account
    ) internal view returns (uint256) {
        address oToken = getExistingOtoken(
            opynFactory,
            underlyingAsset,
            address(USDC),
            strikePriceInUSDC,
            expirationTimestamp
        );

        if (oToken == address(0)) {
            return 0;
        }

        IERC20 oTokenERC20 = IERC20(oToken);
        return oTokenERC20.balanceOf(account);
    }
}
