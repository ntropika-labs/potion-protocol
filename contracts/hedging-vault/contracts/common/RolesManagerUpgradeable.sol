/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IRolesManager } from "../interfaces/IRolesManager.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
    @title RolesManagerUpgradeable

    @author Roberto Cano <robercano>
    
    @notice The RolesManager contract is a helper contract that provides a three access roles: Admin,
    Strategist and Operator. The scope of the different roles is as follows:
      - Admin: The admin role is the only role that can change the other roles, including the Admin
      role itself. 
      - Strategist: The strategist role is the one that can change the vault and action parameters
      related to the investment strategy. Things like slippage percentage, maximum premium, principal
      percentages, etc...
      - Operator: The operator role is the one that can cycle the vault and the action through its
      different states


    @dev It provides a functionality similar to the AccessControl contract from OpenZeppelin. The decision
    to implement the roles manually was made to avoid exposiing a higher attack surface area coming from 
    the AccessControl contract, plus reducing the size of the deployment as well

    @dev The Admin can always change the Strategist address, Operator address and also change the Admin address.
    The Strategist and Operator roles have no special access except the access given explcitiely by their
    respective modifiers `onlyStrategist` and `onlyOperator`

    @dev This contract is intended to be always initialized in an unchained way as it may be shared
    among different helper contracts that need to scope their functions to the Admin or Keeper role.
 */

contract RolesManagerUpgradeable is Initializable, ContextUpgradeable, IRolesManager {
    // STORAGE

    /**
        @notice The address of the admin role

        @dev The admin role is the only role that can change the other roles, including the Admin itself
     */
    address private _adminAddress;

    /**
        @notice The address of the strategist role

        @dev The strategist role is the one that can change the vault and action parameters related to the
        investment strategy. Things like slippage percentage, maximum premium, principal percentages, etc...
     */
    address private _strategistAddress;

    /**
        @notice The address of the operator role

        @dev The operator role is the one that can cycle the vault and the action through its different states
     */
    address private _operatorAddress;

    /**
        @notice The address of the vault

        @dev The vault address is used in the actions to only allow the vault to call enterPosition and exitPosition
     */
    address private _vaultAddress;

    /// MODIFIERS

    /**
      @notice Modifier to scope functions to only be accessible by the Admin
     */
    modifier onlyAdmin() {
        require(_msgSender() == _adminAddress, "Only the Admin can call this function");
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Strategist
     */
    modifier onlyStrategist() {
        require(_msgSender() == _strategistAddress, "Only the Strategist can call this function");
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Operator
     */
    modifier onlyOperator() {
        require(_msgSender() == _operatorAddress, "Only the Operator can call this function");
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Vault
     */
    modifier onlyVault() {
        require(_msgSender() == _vaultAddress, "Only the Vault can call this function");
        _;
    }

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.

        @dev The Vault role is not initialized here. Instead, the admin must call
             `changeVault` to set the vault role address
     */
    // solhint-disable-next-line func-name-mixedcase
    function __RolesManager_init_unchained(
        address adminAddress,
        address strategistAddress,
        address operatorAddress
    ) internal onlyInitializing {
        __changeAdmin(adminAddress);
        __changeStrategist(strategistAddress);
        __changeOperator(operatorAddress);
    }

    /// FUNCTIONS

    /**
        @inheritdoc IRolesManager

        @dev Only the previous Admin can change the address to a new one
     */
    function changeAdmin(address newAdminAddress) external onlyAdmin {
        __changeAdmin(newAdminAddress);
    }

    /**
        @inheritdoc IRolesManager

        @dev Only the Admin can change the address to a new one
     */
    function changeStrategist(address newStrategistAddress) external onlyAdmin {
        __changeStrategist(newStrategistAddress);
    }

    /**
        @inheritdoc IRolesManager

        @dev Only the Admin can change the address to a new one
     */
    function changeOperator(address newOperatorAddress) external onlyAdmin {
        __changeOperator(newOperatorAddress);
    }

    /**
        @inheritdoc IRolesManager

        @dev Only the Admin can change the address to a new one
     */
    function changeVault(address newVaultAddress) external onlyAdmin {
        __changeVault(newVaultAddress);
    }

    /**
        @inheritdoc IRolesManager
     */
    function getAdmin() public view returns (address) {
        return _adminAddress;
    }

    /**
        @inheritdoc IRolesManager
     */
    function getStrategist() public view returns (address) {
        return _strategistAddress;
    }

    /**
        @inheritdoc IRolesManager
     */
    function getOperator() public view returns (address) {
        return _operatorAddress;
    }

    /**
        @inheritdoc IRolesManager
     */
    function getVault() public view returns (address) {
        return _vaultAddress;
    }

    /// INTERNALS

    /**
        @notice See { changeAdmin }
     */
    function __changeAdmin(address newAdminAddress) private {
        require(newAdminAddress != address(0), "New Admin address cannot be the null address");

        address prevAdminAddress = _adminAddress;

        _adminAddress = newAdminAddress;

        emit AdminChanged(prevAdminAddress, newAdminAddress);
    }

    /**
        @notice See { changeStrategist }
     */
    function __changeStrategist(address newStrategistAddress) private {
        require(newStrategistAddress != address(0), "New Strategist address cannot be the null address");

        address prevStrategistAddress = _strategistAddress;

        _strategistAddress = newStrategistAddress;

        emit StrategistChanged(prevStrategistAddress, newStrategistAddress);
    }

    /**
        @notice See { changeOperator }
     */
    function __changeOperator(address newOperatorAddress) private {
        require(newOperatorAddress != address(0), "New Operator address cannot be the null address");

        address prevOperatorAddress = _operatorAddress;

        _operatorAddress = newOperatorAddress;

        emit OperatorChanged(prevOperatorAddress, newOperatorAddress);
    }

    /**
        @notice See { changeVault }
     */
    function __changeVault(address newVaultAddress) private {
        require(newVaultAddress != address(0), "New Vault address cannot be the null address");

        address prevVaultAddress = _vaultAddress;

        _vaultAddress = newVaultAddress;

        emit VaultChanged(prevVaultAddress, newVaultAddress);
    }

    /**
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[46] private __gap;
}
