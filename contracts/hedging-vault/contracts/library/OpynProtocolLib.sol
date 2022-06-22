/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IOpynController } from "../interfaces/IOpynController.sol";

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
}
