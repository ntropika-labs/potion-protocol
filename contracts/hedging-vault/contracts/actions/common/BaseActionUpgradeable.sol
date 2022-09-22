/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IAction.sol";
import "../../common/EmergencyLockUpgradeable.sol";
import "../../common/LifecycleStatesUpgradeable.sol";
import "../../common/RefundsHelperUpgreadable.sol";
import "../../common/RolesManagerUpgradeable.sol";
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
 */

abstract contract BaseActionUpgradeable is
    IAction,
    RolesManagerUpgradeable, // Making explicit inheritance here, although it is not necessary
    EmergencyLockUpgradeable,
    LifecycleStatesUpgradeable,
    RefundsHelperUpgreadable,
    ReentrancyGuardUpgradeable
{
    // UPGRADEABLE INITIALIZER

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here
     */
    // solhint-disable-next-line func-name-mixedcase
    function __BaseAction_init_chained(
        address adminAddress,
        address strategistAddress,
        address operatorAddress,
        address[] memory cannotRefundTokens
    ) internal onlyInitializing {
        __RolesManager_init_unchained(adminAddress, operatorAddress);
        __EmergencyLock_init_unchained();
        __LifecycleStates_init_unchained();
        __RefundsHelper_init_unchained(cannotRefundTokens, false);
        __ReentrancyGuard_init_unchained();

        _grantRole(RolesManagerUpgradeable.STRATEGIST_ROLE, strategistAddress);
    }
}
