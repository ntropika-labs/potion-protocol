/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../vault/FeeManagerUpgradeable.sol";

/**
    @title TestWrapperActionsContainer

    @author Roberto Cano <robercano>

    @notice Test wrapper for the ActionsManagerUpgradeable contract. This wrapper exposes
    an external `initialize` function that calls the internal initializers. This allows
    to unit test the contract in isolation.
 */
contract TestWrapperFeeManager is FeeManagerUpgradeable {
    /**
        @notice Initializes the contract
     */
    function initialize(
        address owner,
        uint256 managementFee_,
        uint256 performanceFee_,
        address payable feeReceipient_
    ) external initializer {
        __RolesManager_init_unchained(owner, owner, owner);
        __FeeManager_init_unchained(managementFee_, performanceFee_, feeReceipient_);
    }

    /**
        @notice See { FeeManagerUpgradeable }
    */
    function calculateManagementPayment(uint256 principalAmount) external view returns (uint256) {
        return _calculateManagementPayment(principalAmount);
    }

    /**
        @notice See { FeeManagerUpgradeable }
    */
    function calculatePerformancePayment(uint256 earningsAmount) external view returns (uint256) {
        return _calculatePerformancePayment(earningsAmount);
    }

    /**
        @notice See { FeeManagerUpgradeable }
    */
    function payFees(
        IERC20 token,
        uint256 principalAmount,
        uint256 earningsAmount
    ) external {
        _payFees(token, principalAmount, earningsAmount);
    }

    /**
        @notice See { FeeManagerUpgradeable }
    */
    function payFeesETH(uint256 principalAmount, uint256 earningsAmount) external {
        _payFeesETH(principalAmount, earningsAmount);
    }

    /**
        @notice Enable reception of Ether
    */
    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}
}
