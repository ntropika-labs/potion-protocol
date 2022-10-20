/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./IAction.sol";
import "./IUniswapV3Oracle.sol";

/**
    @title ISwapToUSDCAction

    @author Roberto Cano <robercano>

    @dev See { SwapToUSDCAction }
    @dev See { SwapToUSDCActionV0 }

    @dev This interface is not inherited by SwapToUSDCAction itself and only serves to expose the functions
    that are used by the Operator to configure parameters. In particular it is used by { HedgingVaultOrchestrator }
    to aid in the operation of the vault
    
 */
/* solhint-disable-next-line no-empty-blocks */
interface ISwapToUSDCAction is IAction, IUniswapV3Oracle {
    // Empty on purpose
}
