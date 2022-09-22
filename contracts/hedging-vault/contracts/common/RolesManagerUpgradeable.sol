/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { AccessControlEnumerableUpgradeable } from "@openzeppelin/contracts-upgradeable-4.7.3/access/AccessControlEnumerableUpgradeable.sol";

import "../interfaces/IRolesManager.sol";

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

contract RolesManagerUpgradeable is AccessControlEnumerableUpgradeable, IRolesManager {
    // ROLES
    bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant VAULT_ROLE = keccak256("VAULT_ROLE");
    bytes32 public constant INVESTOR_ROLE = keccak256("INVESTOR_ROLE");

    /// MODIFIERS

    /**
      @notice Modifier to scope functions to only be accessible by the Admin
     */
    modifier onlyAdmin() {
        _checkRole(ADMIN_ROLE);
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Strategist
     */
    modifier onlyStrategist() {
        _checkRole(STRATEGIST_ROLE);
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Operator
     */
    modifier onlyOperator() {
        _checkRole(OPERATOR_ROLE);
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Vault
     */
    modifier onlyVault() {
        _checkRole(VAULT_ROLE);
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Investor

      @dev It first checks if there is any address assigned the Investor role. If there is none,
      it is assumed that any address can call the function. Otherwise the specific address is
      check against the Investor list
     */
    modifier onlyInvestor() {
        if (getRoleMemberCount(INVESTOR_ROLE) > 0) {
            _checkRole(INVESTOR_ROLE);
        }
        _;
    }

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.

        @param adminAddress The address that will be assigned the Admin role
        @param operatorAddress The address that will be assigned the Operator role

        @dev The Vault role is not initialized here. Instead, the admin must call
             `changeVault` to set the vault role address
     */
    // solhint-disable-next-line func-name-mixedcase
    function __RolesManager_init_unchained(address adminAddress, address operatorAddress) internal onlyInitializing {
        _grantRole(ADMIN_ROLE, adminAddress);
        _grantRole(OPERATOR_ROLE, operatorAddress);
    }
}
