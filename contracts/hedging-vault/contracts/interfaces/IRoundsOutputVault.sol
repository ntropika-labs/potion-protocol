/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./IBaseRoundsVault.sol";

/**
    @title IRoundsOutputVault

    @notice The IRoundsOutputVault contract allows users to deposit shares from the target vault into
    this contract while the  target vault is locked, and receipts are minted to the users for this deposits. Upon
    round completion, the shares are redeemed in the target vault and the corresponding funds are collected.

    Users can then exchange their receipts from previous rounds for the corresponding funds held in this vault.

    @author Roberto Cano <robercano>
 */
interface IRoundsOutputVault is IBaseRoundsVault {
    // EVENTS
    event SharesRedeemed(uint256 indexed roundId, address indexed account, uint256 shares, uint256 assets);
}
