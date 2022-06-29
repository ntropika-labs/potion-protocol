/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../library/OpynProtocolLib.sol";

/**
    @title TestWrapperOpynProtocolLib

    @author Roberto Cano <robercano>

    @notice Test wrapper for the OpynProtocolLib library. This wrapper exposes
    all internal functions as external. This allows to unit test the library in isolation.
 */
contract TestWrapperOpynProtocolLib {
    /// FUNCTIONS

    /**
        @notice See { OpynProtocolLib }
     */
    function isPotionRedeemable(IOpynController opynController, address potion) external view returns (bool) {
        return OpynProtocolLib.isPotionRedeemable(opynController, potion);
    }
}
