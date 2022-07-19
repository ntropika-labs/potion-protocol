/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
 * @title Public Controller interface
 * @notice For use by consumers and end users. Excludes permissioned (e.g. owner-only) functions
 */
interface IOpynController {
    /**
        @notice return if an expired oToken is ready to be settled, only true when price for underlying,
        strike and collateral assets at this specific expiry is available in our Oracle module
        
        @param _otoken oToken

        @return true if the expired oToken is ready to be settled, false otherwise
     */
    function isSettlementAllowed(address _otoken) external view returns (bool);

    /**
        @notice return a vault's proceeds pre or post expiry, the amount of collateral that can be removed from a vault
        
        @param _owner account owner of the vault
        @param _vaultId vaultId to return balances for
        
        @return amount of collateral that can be taken out
     */
    function getProceed(address _owner, uint256 _vaultId) external view returns (uint256);
}
