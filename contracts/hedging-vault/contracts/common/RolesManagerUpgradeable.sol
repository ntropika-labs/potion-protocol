/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ContextUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/**
    @title RolesManagerUpgradeable

    @notice The RolesManager contract is a helper contract that provides a two access roles: Admin
    and Keeper, and the corresponding modifiers to scope the access of functions in inheriting contracts
    
    @dev It provides a functionality similar to the AccessControl contract from OpenZeppelin. The decision
    to implement the roles manually was made to avoid exposiing a higher attack surface area coming from 
    the AccessControl contract, plus reducing the size of the deployment as well

    @dev The Admin can always change the Keeper address and also change the Admin address. The Keeper
    role has no special access except that given explicitely by using the `onlyKeeper` modifier.

    @dev This contract is intended to be always initialized in an unchained way as it may be shared
    among different helper contracts that need to scope their functions to the Admin or Keeper role.
 */

contract RolesManagerUpgradeable is Initializable, ContextUpgradeable {
    // STORAGE
    address public adminRole;
    address public keeperRole;

    /// MODIFIERS

    /**
      @notice Modifier to scope functions to only be accessible by the Admin
     */
    modifier onlyAdmin() {
        require(_msgSender() == adminRole, "Only the Admin can call this function");
        _;
    }

    /**
      @notice Modifier to scope functions to only be accessible by the Keeper
     */
    modifier onlyKeeper() {
        require(_msgSender() == keeperRole, "Only the Admin can call this function");
        _;
    }

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.
     */
    // solhint-disable-next-line func-name-mixedcase
    function __RolesManager_init_unchained(address adminRole_, address keeperRole_) internal onlyInitializing {
        adminRole = adminRole_;
        keeperRole = keeperRole_;
    }

    /// FUNCTIONS

    /**
        @notice Changes the existing Admin address to a new one

        @dev Only the previous Admin can change the address to a new one
     */
    function changeAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin address cannot be the null address");

        adminRole = newAdmin;
    }

    /**
        @notice Changes the existing Keeper address to a new one

        @dev Only the Admin can change the address to a new one
     */
    function changeKeeper(address newKeeper) external onlyAdmin {
        require(newKeeper != address(0), "New keeper address cannot be the null address");

        keeperRole = newKeeper;
    }

    /**
       @dev This empty reserved space is put in place to allow future versions to add new
       variables without shifting down storage in the inheritance chain.
       See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     
       @dev The size of the gap plus the size of the storage variables defined
       above must equal 50 storage slots
     */
    uint256[48] private __gap;
}
