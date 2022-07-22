/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
 * @title Public Controller interface
 * @notice For use by consumers and end users. Excludes permissioned (e.g. owner-only) functions
 */
interface IOpynController {
    // possible actions that can be performed
    enum ActionType {
        OpenVault,
        MintShortOption,
        BurnShortOption,
        DepositLongOption,
        WithdrawLongOption,
        DepositCollateral,
        WithdrawCollateral,
        SettleVault,
        Redeem,
        Call,
        Liquidate
    }

    struct ActionArgs {
        // type of action that is being performed on the system
        ActionType actionType;
        // address of the account owner
        address owner;
        // address which we move assets from or to (depending on the action type)
        address secondAddress;
        // asset that is to be transfered
        address asset;
        // index of the vault that is to be modified (if any)
        uint256 vaultId;
        // amount of asset that is to be transfered
        uint256 amount;
        // each vault can hold multiple short / long / collateral assets but we are restricting the scope to only 1 of each in this version
        // in future versions this would be the index of the short / long / collateral asset that needs to be modified
        uint256 index;
        // any other data that needs to be passed in for arbitrary function calls
        bytes data;
    }

    /**
        @notice return if an expired oToken is ready to be settled, only true when price for underlying,
        strike and collateral assets at this specific expiry is available in our Oracle module
        
        @param _otoken oToken

        @return true if the expired oToken is ready to be settled, false otherwise
     */
    function isSettlementAllowed(address _otoken) external view returns (bool);

    /**
        @notice get an oToken's payout/cash value after expiry, in the collateral asset

        @param _otoken oToken address
        @param _amount amount of the oToken to calculate the payout for, always represented in 1e8
        
        @return amount of collateral to pay out
     */
    function getPayout(address _otoken, uint256 _amount) external view returns (uint256);

    /**
        @notice execute a number of actions on specific vaults
        @dev can only be called when the system is not fully paused
        @param _actions array of actions arguments
     */
    function operate(ActionArgs[] memory _actions) external;
}
