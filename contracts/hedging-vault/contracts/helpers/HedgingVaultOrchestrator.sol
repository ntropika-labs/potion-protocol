/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../interfaces/IPotionBuyAction.sol";
import "../interfaces/IVault.sol";
import { PotionBuyInfo } from "../interfaces/IPotionBuyInfo.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IUniswapV3Oracle.sol";
import "../interfaces/IPotionProtocolOracle.sol";

/**  
    @title HedgingVaultOrchestrator

    @author Roberto Cano <robercano>

    @notice Helper contract to allow the operator to enter and exit a position of a hedging vault using only
    one transaction. The Hedging Vault is an investment vault using the PotionBuyAction strategy. The helper
    talks to both the vault and the action separately to configure the necessary swap routes and potion buy
    counterparties, and then enters the position. This also allows to minimize the amount of slippage in the
    Uniswap V3 swap and the Potion Protocol buy.
 */
contract HedgingVaultOrchestrator is Ownable {
    IVault public hedgingVault;
    IPotionBuyAction public potionBuyAction;

    /**
        @notice Sets the addresses of the vault and the action to be used to enter and exit the position.

        @param hedgingVault_ The vault to be used to enter and exit the position.
        @param potionBuyAction_ The action to be used to enter and exit the position.
    */
    function setSystemAddresses(address hedgingVault_, address potionBuyAction_) external onlyOwner {
        hedgingVault = IVault(hedgingVault_);
        potionBuyAction = IPotionBuyAction(potionBuyAction_);
    }

    /**
        @notice Enters the position of the hedging vault by setting first the Potion buy counterparties list
        and the Uniswap V3 swap route, and then entering the position.

        @param swapInfo The Uniswap V3 route to swap some hedged asset for USDC to pay the Potion Protocol premium
        @param potionBuyInfo List of counterparties to use for the Potion Protocol buy

        @dev Only the owner of the contract (i.e. the Operator) can call this function
     */
    function enterPosition(IUniswapV3Oracle.SwapInfo calldata swapInfo, PotionBuyInfo calldata potionBuyInfo)
        external
        onlyOwner
    {
        potionBuyAction.setPotionBuyInfo(potionBuyInfo);
        potionBuyAction.setSwapInfo(swapInfo);
        hedgingVault.enterPosition();
    }

    /**
        @notice Exits the position of the hedging vault by setting first the Uniswap V3 swap route,
        and then exiting the position.

        @param swapInfo The Uniswap V3 route to swap the received pay-out from USDC back to the hedged asset

        @dev Only the owner of the contract (i.e. the Operator) can call this function
     */
    function exitPosition(IUniswapV3Oracle.SwapInfo calldata swapInfo) external onlyOwner {
        potionBuyAction.setSwapInfo(swapInfo);
        hedgingVault.exitPosition();
    }

    /**
        @notice Convenience function to know if a position can be entered or not

        @dev Just redirects the call to the hedging vault
     */
    function canPositionBeEntered() external view returns (bool) {
        return hedgingVault.canPositionBeEntered();
    }

    /**
        @notice Convenience function to know if a position can be exited or not

        @dev Just redirects the call to the hedging vault
     */
    function canPositionBeExited() external view returns (bool) {
        return hedgingVault.canPositionBeExited();
    }
}
