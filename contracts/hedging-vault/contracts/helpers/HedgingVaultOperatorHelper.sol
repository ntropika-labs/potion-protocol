/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**  
    @title HedgingVaultOperatorHelpers

    @author Roberto Cano <robercano>

    @notice Helper contract to allow the operator to enter and exit a position of a hedging vault using only
    one transaction. The Hedging Vault is an investment vault using the PotionBuyAction strategy. The helper
    talks to both the vault and the action separately to configure the necessary swap routes and potion buy
    counterparties, and then enters the position. This also allows to minimize the amount of slippage in the
    Uniswap V3 swap and the Potion Protocol buy.
 */
contract HedgingVaultOperatorHelper {
    uint256 private dummy;
}
