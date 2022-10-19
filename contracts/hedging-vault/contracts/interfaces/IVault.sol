/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IRolesManager } from "../interfaces/IRolesManager.sol";
import { ILifecycleStates } from "../interfaces/ILifecycleStates.sol";
import { IEmergencyLock } from "../interfaces/IEmergencyLock.sol";
import { IRefundsHelper } from "../interfaces/IRefundsHelper.sol";
import { IFeeManager } from "../interfaces/IFeeManager.sol";
import { IVaultV0 } from "../interfaces/IVaultV0.sol";

/**  
    @title IVault

    @author Roberto Cano <robercano>

    @notice Interface for the a vault that executes investment actions on each investment cycle

    @dev An IVault represents a vault that contains a set of investment actions. When entering the
    position, all the actions in the vault are executed in order, one after the other. If all
    actions succeed, then the position is entered. Once the position can be exited, the investment
    actions are also exited and the profit/loss of the investment cycle is realized.
 */
interface IVault is IRolesManager, ILifecycleStates, IEmergencyLock, IRefundsHelper, IFeeManager, IVaultV0 {
    // Empty on purpose
}
