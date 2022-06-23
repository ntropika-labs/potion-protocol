/**
 * SPDX-License-Identifier: UNLICENSED
 */
pragma solidity 0.8.14;

/**
 * @title Public Controller interface
 * @notice For use by consumers and end users. Excludes permissioned (e.g. owner-only) functions
 */
interface IOpynController {
    /**
     * @dev return if an expired oToken is ready to be settled, only true when price for underlying,
     * strike and collateral assets at this specific expiry is available in our Oracle module
     * @param _otoken oToken
     */
    function isSettlementAllowed(address _otoken) external view returns (bool);
}
