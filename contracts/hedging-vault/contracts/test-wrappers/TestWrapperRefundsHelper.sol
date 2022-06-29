/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../common/RefundsHelperUpgreadable.sol";

/**
    @title TestWrapperRefundsHelper

    @author Roberto Cano <robercano>

    @notice Test wrapper for the TestWrapperRefundsHelper contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperRefundsHelper is RefundsHelperUpgreadable {
    /**
        @notice Initializes the contract
     */
    function initialize(
        address adminAddress,
        address strategistAddress,
        address operatorAddress,
        address[] memory _cannotRefundToken,
        bool cannotRefundETH_
    ) external initializer {
        __RolesManager_init_unchained(adminAddress, strategistAddress, operatorAddress);
        __RefundsHelper_init_unchained(_cannotRefundToken, cannotRefundETH_);
    }

    /**
        Default payable function to receive Ether
     */
    // solhint-disable-next-line no-empty-block
    receive() external payable {}
}
