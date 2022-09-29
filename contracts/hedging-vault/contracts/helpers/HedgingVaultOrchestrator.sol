/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionBuyAction } from "../interfaces/IPotionBuyAction.sol";
import { IVault } from "../interfaces/IVault.sol";
import { IRoundsInputVault } from "../interfaces/IRoundsInputVault.sol";
import { IRoundsOutputVault } from "../interfaces/IRoundsOutputVault.sol";
import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IUniswapV3Oracle } from "../interfaces/IUniswapV3Oracle.sol";
import { IPotionProtocolOracle } from "../interfaces/IPotionProtocolOracle.sol";
import { ILifecycleStates } from "../interfaces/ILifecycleStates.sol";
import { IHedgingVaultOrchestrator } from "../interfaces/IHedgingVaultOrchestrator.sol";

/**  
    @title HedgingVaultOrchestrator

    @author Roberto Cano <robercano>

    @notice Helper contract to allow the operator to enter and exit a position of a hedging vault using only
    one transaction. The Hedging Vault is an investment vault using the PotionBuyAction strategy. The helper
    talks to both the vault and the action separately to configure the necessary swap routes and potion buy
    counterparties, and then enters the position. This also allows to minimize the amount of slippage in the
    Uniswap V3 swap and the Potion Protocol buy.
 */
contract HedgingVaultOrchestrator is Ownable, IHedgingVaultOrchestrator {
    IVault public hedgingVault;
    IPotionBuyAction public potionBuyAction;
    IRoundsInputVault public roundsInputVault;
    IRoundsOutputVault public roundsOutputVault;

    /**
        @notice Sets the addresses of the vault and the action to be used to enter and exit the position.

        @param hedgingVault_ The vault to be used to enter and exit the position.
        @param potionBuyAction_ The action to be used to enter and exit the position.
    */
    function setSystemAddresses(
        address hedgingVault_,
        address potionBuyAction_,
        address roundsInputVault_,
        address roundsOutputVault_
    ) external onlyOwner {
        hedgingVault = IVault(hedgingVault_);
        potionBuyAction = IPotionBuyAction(potionBuyAction_);
        roundsInputVault = IRoundsInputVault(roundsInputVault_);
        roundsOutputVault = IRoundsOutputVault(roundsOutputVault_);
    }

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
    ) external onlyOwner {
        ILifecycleStates.LifecycleState vaultState = hedgingVault.getLifecycleState();

        if (vaultState == ILifecycleStates.LifecycleState.Locked) {
            potionBuyAction.setSwapInfo(prevRoundExitSwapInfo);
            hedgingVault.exitPosition();
        }

        potionBuyAction.setPotionBuyInfo(nextRoundPotionBuyInfo);
        potionBuyAction.setSwapInfo(nextRoundEnterSwapInfo);
        hedgingVault.enterPosition();
    }

    /**
        @notice Convenience function to know if the next round can be entered or not

        @dev This checks if the position can be exited. This cannot account for the possibility of the position
        to be entered as this information is not made available until the position is exited
     */
    function canEnterNextRound() external view returns (bool) {
        return hedgingVault.canPositionBeExited();
    }
}
