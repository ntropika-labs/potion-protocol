/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IFeeManager } from "../interfaces/IFeeManager.sol";
import { RolesManagerUpgradeable } from "../common/RolesManagerUpgradeable.sol";
import "../library/PercentageUtils.sol";
import { IERC20Upgradeable as IERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/IERC20Upgradeable.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";
import { AddressUpgradeable as Address } from "@openzeppelin/contracts-upgradeable-4.7.3/utils/AddressUpgradeable.sol";

/**
    @title FeeManagerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Handles the fees that the vault pays-off to the Keeper

    @dev See { IFeeManager }

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract
 */

contract FeeManagerUpgradeable is RolesManagerUpgradeable, IFeeManager {
    using SafeERC20 for IERC20;
    using Address for address payable;
    using PercentageUtils for uint256;

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
        @inheritdoc IFeeManager
     */
    function setManagementFee(uint256 newManagementFee) external onlyAdmin {
        _setManagementFee(newManagementFee);
    }

    /**
        @inheritdoc IFeeManager
     */
    function setPerformanceFee(uint256 newPerformanceFee) external onlyAdmin {
        _setPerformanceFee(newPerformanceFee);
    }

    /**
        @inheritdoc IFeeManager
     */
    function getManagementFee() public view returns (uint256) {
        return _managementFee;
    }

    /**
        @inheritdoc IFeeManager
     */
    function getPerformanceFee() public view returns (uint256) {
        return _performanceFee;
    }

    /**
        @inheritdoc IFeeManager
     */
    function setFeesRecipient(address payable newFeesRecipient) external onlyAdmin {
        _setFeesRecipient(newFeesRecipient);
    }

    /**
        @inheritdoc IFeeManager
     */
    function getFeesRecipient() external view returns (address) {
        return _feesRecipient;
    }

    // INTERNALS

    /**
        @notice Calculates the amount to be payed according to the management fee
        @param principalAmount The amount of principal to which the management fee is applied

        @dev TODO Use the new OpenZeppelin Math.mulDiv once it is released 
    */
    function _calculateManagementPayment(uint256 principalAmount) internal view returns (uint256) {
        return principalAmount.applyPercentage(_managementFee);
    }

    /**
        @notice Calculates the amount to be payed according to the performance fee
        @param earningsAmount The amount of earnings to which the performance fee is applied

        @dev TODO Use the new OpenZeppelin Math.mulDiv once it is released 
    */
    function _calculatePerformancePayment(uint256 earningsAmount) internal view returns (uint256) {
        return earningsAmount.applyPercentage(_performanceFee);
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
        require(
            PercentageUtils.isPercentageInRange(newManagementFee),
            "Management fee must be less than or equal to 100"
        );
        uint256 oldManagementFee = _managementFee;

        _managementFee = newManagementFee;

        emit ManagementFeeChanged(oldManagementFee, newManagementFee);
    }

    /**
        @notice Sets the new performance fee
     */
    function _setPerformanceFee(uint256 newPerformanceFee) private {
        require(
            PercentageUtils.isPercentageInRange(newPerformanceFee),
            "Performance fee must be less than or equal to 100"
        );
        uint256 oldPerformanceFee = _performanceFee;
        _performanceFee = newPerformanceFee;

        emit ManagementFeeChanged(oldPerformanceFee, newPerformanceFee);
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
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[47] private __gap;
}
