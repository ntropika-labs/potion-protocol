/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IOpynController } from "../interfaces/IOpynController.sol";
import { IOpynFactory } from "../interfaces/IOpynFactory.sol";

import "hardhat/console.sol";

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
        bool ret = opynController.isSettlementAllowed(potion);
        console.log("isPotionRedeemable", ret);
        return ret;
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
}
