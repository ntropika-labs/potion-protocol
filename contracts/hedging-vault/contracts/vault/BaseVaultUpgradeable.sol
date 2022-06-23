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
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

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
    // UPGRADEABLE INITIALIZER

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here

        @param adminAddress The address of the admin of the Vault
        @param strategistAddress The address of the strategist of the Vault
        @param operatorAddress The address of the operator of the Vault
        @param underlyingAsset The address of the asset managed by this vault
        @param managementFee The fee percentage charged for the management of the Vault
        @param performanceFee The fee percentage charged for the performance of the Vault
        @param feesRecipient The address of the account that will receive the fees
        @param actions The list of investment actions to be executed in the Vault
     */
    function initialize(
        address adminAddress,
        address strategistAddress,
        address operatorAddress,
        address underlyingAsset,
        uint256 managementFee,
        uint256 performanceFee,
        address payable feesRecipient,
        IAction[] calldata actions
    ) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the underlying
        // asset is not allowed to be refunded to prevent the admin from accidentally refunding the
        // underlying asset
        address[] memory cannotRefundToken = new address[](1);
        cannotRefundToken[0] = underlyingAsset;

        __RolesManager_init_unchained(adminAddress, strategistAddress, operatorAddress);
        __ERC4626Cap_init_unchained(underlyingAsset);
        __EmergencyLock_init_unchained();
        __LifecycleStates_init_unchained();
        __RefundsHelper_init_unchained(cannotRefundToken, false);
        __FeeManager_init_unchained(managementFee, performanceFee, feesRecipient);
        __ActionsManager_init_unchained(actions);
        __ReentrancyGuard_init_unchained();
    }
}
