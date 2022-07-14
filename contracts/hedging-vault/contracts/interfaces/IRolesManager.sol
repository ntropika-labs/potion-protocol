/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**
    @title IRolesManager

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

    @dev The Admin can always change the Strategist address, Operator address and also change the Admin address.
    The Strategist and Operator roles have no special access except the access given explcitiely by their
    respective modifiers `onlyStrategist` and `onlyOperator`.
 */

interface IRolesManager {
    /// EVENTS
    event AdminChanged(address indexed prevAdminAddress, address indexed newAdminAddress);
    event StrategistChanged(address indexed prevStrategistAddress, address indexed newStrategistAddress);
    event OperatorChanged(address indexed prevOperatorAddress, address indexed newOperatorAddress);
    event VaultChanged(address indexed prevVaultAddress, address indexed newVaultAddress);

    /// FUNCTIONS

    /**
        @notice Changes the existing Admin address to a new one

        @dev Only the previous Admin can change the address to a new one
     */
    function changeAdmin(address newAdminAddress) external;

    /**
        @notice Changes the existing Strategist address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeStrategist(address newStrategistAddress) external;

    /**
        @notice Changes the existing Operator address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeOperator(address newOperatorAddress) external;

    /**
        @notice Changes the existing Vault address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeVault(address newVaultAddress) external;

    /**
        @notice Returns the current Admin address
     */
    function getAdmin() external view returns (address);

    /**
        @notice Returns the current Strategist address
     */
    function getStrategist() external view returns (address);

    /**
        @notice Returns the current Operator address
     */
    function getOperator() external view returns (address);

    /**
        @notice Returns the current Vault address
     */
    function getVault() external view returns (address);
}
