/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

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

contract RolesManagerUpgradeable is Initializable, ContextUpgradeable {
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
    address private _operatorAddress;

    /**
        @notice The address of the operator role

        @dev The operator role is the one that can cycle the vault and the action through its different states
     */
    address private _strategistAddress;

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

    /// EVENTS
    event AdminChanged(address indexed prevAdminAddress, address indexed newAdminAddress);
    event StrategistChanged(address indexed prevStrategistAddress, address indexed newStrategistAddress);
    event OperatorChanged(address indexed prevOperatorAddress, address indexed newOperatorAddress);

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.
     */
    // solhint-disable-next-line func-name-mixedcase
    function __RolesManager_init_unchained(
        address adminAddress,
        address strategistAddress,
        address operatorAddress
    ) internal onlyInitializing {
        _adminAddress = adminAddress;
        _strategistAddress = strategistAddress;
        _operatorAddress = operatorAddress;
    }

    /// FUNCTIONS

    /**
        @notice Changes the existing Admin address to a new one

        @dev Only the previous Admin can change the address to a new one
     */
    function changeAdmin(address newAdminAddress) external onlyAdmin {
        require(newAdminAddress != address(0), "New Admin address cannot be the null address");

        address prevAdminAddress = _adminAddress;

        _adminAddress = newAdminAddress;

        emit AdminChanged(prevAdminAddress, newAdminAddress);
    }

    /**
        @notice Changes the existing Strategist address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeStrategist(address newStrategistAddress) external onlyAdmin {
        require(newStrategistAddress != address(0), "New Strategist address cannot be the null address");

        address prevStrategistAddress = _strategistAddress;

        _strategistAddress = newStrategistAddress;

        emit StrategistChanged(prevStrategistAddress, newStrategistAddress);
    }

    /**
        @notice Changes the existing Operator address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeOperator(address newOperatorAddress) external onlyAdmin {
        require(newOperatorAddress != address(0), "New Strategist address cannot be the null address");

        address prevOperatorAddress = _operatorAddress;

        _operatorAddress = newOperatorAddress;

        emit StrategistChanged(prevOperatorAddress, newOperatorAddress);
    }

    /**
        @notice Returns the current Admin address
     */
    function getAdmin() public view returns (address) {
        return _adminAddress;
    }

    /**
        @notice Returns the current Strategist address
     */
    function getStrategist() public view returns (address) {
        return _strategistAddress;
    }

    /**
        @notice Returns the current Operator address
     */
    function getOperator() public view returns (address) {
        return _operatorAddress;
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
