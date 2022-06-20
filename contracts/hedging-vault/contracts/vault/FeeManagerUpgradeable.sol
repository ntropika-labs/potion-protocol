/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { RolesManagerUpgradeable } from "../common/RolesManagerUpgradeable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Address } from "@openzeppelin/contracts/utils/Address.sol";

/**
    @title FeeManagerUpgradeable

    @notice Handles the fees that the vault pays-off to the Keeper

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract
 */

contract FeeManagerUpgradeable is RolesManagerUpgradeable {
    using SafeERC20 for IERC20;
    using Address for address payable;

    /// CONSTANTS

    /**
        @notice The number of decimals used for the fee percentage
     */
    uint256 public constant FEE_DECIMALS = 6;

    /**
        @notice The factor used to scale the fee percentage when calculating the fee
        on an amount
     */
    uint256 public constant FEE_SCALE = 10**FEE_DECIMALS;

    /// STORAGE

    /**
        @notice Management fee that the vault pays-off to the Keeper, typically
        based on the principal amount that the vault manages at a certain point in time.
        Used to incentivize the Keeper to keep the vault running.

        @dev This fee is a percentage with `FEE_DECIMALS` decimals
     */
    uint256 private _managementFee;

    /**
        @notice Performance fee that the vault pays-off to the Keeper, typically
        based on the earnings of the vault until a certain point in time.
        Used to incentivize the Keeper to select the best investment strategy.

        @dev This fee is a percentage with `FEE_DECIMALS` decimals
     */
    uint256 private _performanceFee;

    /**
        @notice The receipient of all the fees defined in the manager
     */
    address payable private _feesRecipient;

    /// EVENTS
    event ManagementFeeChanged(uint256 oldManagementFee, uint256 newManagementFee);
    event PerformanceFeeChanged(uint256 oldPerformanceFee, uint256 newPerformanceFee);
    event FeesReceipientChanged(address indexed oldFeeReceipient, address indexed newFeeReceipient);
    event FeesSent(
        address indexed receipient,
        address indexed token,
        uint256 managementAmount,
        uint256 performanceAmount
    );
    event FeesETHSent(address indexed receipient, uint256 managementAmount, uint256 performanceAmount);

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice Initializes the current state to Unlocked

        @dev Can only be called if the contracts has NOT been initialized

        @dev The name of the init function is marked as `_unchained` because it does not
        initialize the RolesManagerUpgradeable contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __FeeManager_init_unchained(
        uint256 managementFee_,
        uint256 performanceFee_,
        address payable feeReceipient_
    ) internal onlyInitializing {
        _setManagementFee(managementFee_);
        _setPerformanceFee(performanceFee_);
        _setFeesRecipient(feeReceipient_);
    }

    /// FUNCTIONS

    /**
        @notice Sets the new management fee

        @param newManagementFee The new management fee with `FEE_DECIMALS` decimals

        @dev Only the admin can change the management fee
     */
    function setManagementFee(uint256 newManagementFee) external onlyAdmin {
        _setManagementFee(newManagementFee);
    }

    /**
        @notice Sets the new performance fee

        @param newPerformanceFee The new performance fee with `FEE_DECIMALS` decimals

        @dev Only the admin can change the performance fee
     */
    function setPerformanceFee(uint256 newPerformanceFee) external onlyAdmin {
        _setPerformanceFee(newPerformanceFee);
    }

    /**
        @notice Returns the current management fee

        @return The current management fee with `FEE_DECIMALS` decimals
     */
    function getManagementFee() public view returns (uint256) {
        return _managementFee;
    }

    /**
        @notice Returns the current performance fee

        @return The current performance fee with `FEE_DECIMALS` decimals
     */
    function getPerformanceFee() public view returns (uint256) {
        return _performanceFee;
    }

    /**
        @notice Sets the new performance fee

        @dev Only the admin can change the performance fee
     */
    function setFeesRecipient(address payable newFeesRecipient) external onlyAdmin {
        _setFeesRecipient(newFeesRecipient);
    }

    // INTERNALS

    /**
        @notice Calculates the amount to be payed according to the management fee
        @param principalAmount The amount of principal to which the management fee is applied

        @dev TODO Use the new OpenZeppelin Math.mulDiv once it is released 
    */
    function _calculateManagementPayment(uint256 principalAmount) internal view returns (uint256) {
        // Solidity rounds down by default which is desired in this case. No need to use the SafeMath
        // anymore since Solidity 0.8
        return (principalAmount * _managementFee) / FEE_SCALE;
    }

    /**
        @notice Calculates the amount to be payed according to the performance fee
        @param earningsAmount The amount of earnings to which the performance fee is applied

        @dev TODO Use the new OpenZeppelin Math.mulDiv once it is released 
    */
    function _calculatePerformancePayment(uint256 earningsAmount) internal view returns (uint256) {
        // Solidity rounds down by default which is desired in this case. No need to use the SafeMath
        // anymore since Solidity 0.8
        return (earningsAmount * _performanceFee) / FEE_SCALE;
    }

    /**
        @notice Calculates the total amount of management + performance fee to be payed and
        sends it to the fees recipient in the given token

        @param token The token to be used for the payment
        @param principalAmount The amount of principal to which the management fee is applied
        @param earningsAmount The amount of earnings to which the performance fee is applied
     */
    function _payFees(
        IERC20 token,
        uint256 principalAmount,
        uint256 earningsAmount
    ) internal {
        uint256 managementAmount = _calculateManagementPayment(principalAmount);
        uint256 performanceAmount = _calculatePerformancePayment(earningsAmount);

        emit FeesSent(_feesRecipient, address(token), managementAmount, performanceAmount);

        token.safeTransfer(_feesRecipient, managementAmount + performanceAmount);
    }

    /**
        @notice Calculates the total amount of management + performance fee to be payed and
        sends it to the fees recipient in ETH

        @param principalAmount The amount of principal to which the management fee is applied
        
    */
    function _payFeesETH(uint256 principalAmount, uint256 earningsAmount) internal {
        uint256 managementAmount = _calculateManagementPayment(principalAmount);
        uint256 performanceAmount = _calculatePerformancePayment(earningsAmount);

        emit FeesETHSent(_feesRecipient, managementAmount, performanceAmount);

        _feesRecipient.sendValue(managementAmount + performanceAmount);
    }

    /// PRIVATE FUNCTIONS

    /**
        @notice Sets the new management fee
     */
    function _setManagementFee(uint256 newManagementFee) private {
        require(newManagementFee <= 100 * FEE_SCALE, "Management fee must be less than or equal to 100");
        uint256 oldManagementFee = _managementFee;

        _managementFee = newManagementFee;

        emit ManagementFeeChanged(oldManagementFee, newManagementFee);
    }

    /**
        @notice Sets the new performance fee

        @dev Only the admin can change the performance fee
     */
    function _setFeesRecipient(address payable newFeesRecipient) private {
        require(newFeesRecipient != _feesRecipient, "Fees recipient is the same as before");

        address oldFeesReceipient = newFeesRecipient;

        _feesRecipient = newFeesRecipient;

        emit FeesReceipientChanged(oldFeesReceipient, newFeesRecipient);
    }

    /**
        @notice Sets the new performance fee
     */
    function _setPerformanceFee(uint256 newPerformanceFee) private {
        require(newPerformanceFee <= 100 * FEE_SCALE, "Performance fee must be less than or equal to 100");
        uint256 oldPerformanceFee = _performanceFee;
        _performanceFee = newPerformanceFee;

        emit ManagementFeeChanged(oldPerformanceFee, newPerformanceFee);
    }

    /**
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[47] private __gap;
}
