/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../interfaces/IVaultV0.sol";

/**
    @title InvestmentVaultV0

    @author Roberto Cano <robercano>
    
    @notice Storage and interface for the V0 of the Vault
 */

abstract contract InvestmentVaultV0 is IVaultV0 {
    /**
        @notice Default strategy to be used when no strategy is provided
     */
    Strategy internal DefaultStrategy;

    /**
        @notice The strategy used in the last enter position
     */
    Strategy internal _lastStrategy;
}
