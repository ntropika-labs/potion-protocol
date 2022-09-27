/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./IBaseRoundsVault.sol";

/**
    @title IRoundsInputVault

    @notice The IRoundsInputVault contract allows users to deposit funds into this contract while the
    target vault is locked, and receipts are minted to the users for this deposits. Upon round completion, the
    funds are transferred to the target vault and the corresponding shares are collected.

    Users can then exchange their receipts from previous rounds for the corresponding shares held in this vault.

    @author Roberto Cano <robercano>
 */
interface IRoundsInputVault is IBaseRoundsVault {
    // EVENTS
    event AssetsDeposited(uint256 indexed roundId, address indexed account, uint256 assets, uint256 shares);
}
