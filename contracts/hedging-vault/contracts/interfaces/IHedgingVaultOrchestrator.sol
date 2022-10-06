/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";
import { IUniswapV3Oracle } from "../interfaces/IUniswapV3Oracle.sol";

/**  
    @title IHedgingVaultOrchestrator

    @author Roberto Cano <robercano>

    @notice Helper contract to allow the operator to enter and exit a position of a hedging vault using only
    one transaction. The Hedging Vault is an investment vault using the PotionBuyAction strategy. This contract
    helps orchestrate the Hedging Vault and the Rounds Vault in order to transition from one round to the next.

    @dev The `nextRound` function should be called once the previous round has ended and the payout is available.
 */
interface IHedgingVaultOrchestrator {
    /**
        @notice Sets the addresses of the vault and the action to be used to enter and exit the position.

        @param hedgingVault The vault to be used to enter and exit the position.
        @param potionBuyAction The action to be used to enter and exit the position.
        @param roundsInputVault The rounds input vault to be used to enter and exit the position.
        @param roundsOutputVault The rounds output vault to be used to enter and exit the position.
    */
    function setSystemAddresses(
        address hedgingVault,
        address potionBuyAction,
        address roundsInputVault,
        address roundsOutputVault
    ) external;

    /**
        @notice Cycles the hedging vault system and goes to the next round. If it is the very first round (i.e. the vault
        is not locked), it just notifies the rounds vaults for the next round and enters the position.

        If it is not the very first round, it exits the position, notifies the rounds vaults for the next round, and then
        enters the position again.

        @param prevRoundExitSwapInfo The Uniswap V3 route to swap the received pay-out from USDC back to the hedged asset
        @param nextRoundPotionBuyInfo List of counterparties to use for the Potion Protocol buy
        @param nextRoundEnterSwapInfo The Uniswap V3 route to swap some hedged asset for USDC to pay the Potion Protocol premium
        
        @dev Only the owner of the contract (i.e. the Operator) can call this function
     */
    function nextRound(
        IUniswapV3Oracle.SwapInfo calldata prevRoundExitSwapInfo,
        PotionBuyInfo calldata nextRoundPotionBuyInfo,
        IUniswapV3Oracle.SwapInfo calldata nextRoundEnterSwapInfo
    ) external;

    /**
        @notice Convenience function to know if the next round can be entered or not

        @dev This checks if the position can be exited. This cannot account for the possibility of the position
        to be entered as this information is not made available until the position is exited
     */
    function canEnterNextRound() external view returns (bool);
}