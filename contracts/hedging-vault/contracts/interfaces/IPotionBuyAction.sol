/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./IAction.sol";
import "./IUniswapV3Oracle.sol";
import "./IPotionProtocolOracle.sol";

/**
    @title IPotionBuyAction

    @author Roberto Cano <robercano>

    @dev See { PotionBuyAction }
    @dev See { PotionBuyActionV0 }

    @dev This interface is not inherited by PotionBuyAction itself and only serves to expose the functions
    that are used by the Operator to configure parameters. In particular it is used by { HedgingVaultOrchestrator }
    to aid in the operation of the vault
    
 */
/* solhint-disable-next-line no-empty-blocks */
interface IPotionBuyAction is IAction, IUniswapV3Oracle, IPotionProtocolOracle {
    // Empty on purpose
}
