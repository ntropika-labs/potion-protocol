/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../common/EmergencyLockUpgradeable.sol";
import "../common/LifecycleStatesUpgradeable.sol";
import "../common/RefundsHelperUpgreadable.sol";
import "../common/RolesManagerUpgradeable.sol";
import "../extensions/ERC4626CapUpgradeable.sol";
import "./FeeManagerUpgradeable.sol";
import "./ActionsManagerUpgradeable.sol";
import "../interfaces/IVault.sol";
import "@openzeppelin/contracts-upgradeable-4.7.3/security/ReentrancyGuardUpgradeable.sol";

/**
    @title BaseVaultUpgradeable

    @author Roberto Cano <robercano>
    
    @notice Base contract for the Vault contract. It serves as a commonplace to take care of
    the inheritance order and the storage order of the contracts, as this is very important
    to keep consistent in order to be able to upgrade the contracts. The order of the contracts
    is also important to not break the C3 lineralization of the inheritance hierarchy.

    @dev Some of the contracts in the base hierarchy contain storage gaps to account for upgrades
    needed in those contracts. Those gaps allow to add new storage variables without shifting
    variables down the inheritance chain down. The gap is not used here and instead the versioned
    interfaces approach is chosen because it is more explicit.

    @dev The contract is upgradeable and follows the OpenZeppelin pattern to implement the
    upgradeability of the contract. Only the unchained initializer is provided as all
    contracts in the inheritance will be initialized in the Vault and Action contract

    @dev The separation between the base vault and the vault itself is based on the upgradeability
    of the contracts. Up to this point all contracts support upgradeability by allocating gaps in
    their storage definitions. Or not allocating gaps, in which case the storage of that particular
    contract cannot be updated. The main vault contract will inherit first from the base vault,
    and then use the versioning contracts to expand its storage in case it is needed.
 */

abstract contract BaseVaultUpgradeable is
    RolesManagerUpgradeable, // Making explicit inheritance here, although it is not necessary
    ERC4626CapUpgradeable,
    EmergencyLockUpgradeable,
    LifecycleStatesUpgradeable,
    RefundsHelperUpgreadable,
    FeeManagerUpgradeable,
    ActionsManagerUpgradeable,
    ReentrancyGuardUpgradeable,
    IVault
{
    // Empty on purpose
}
