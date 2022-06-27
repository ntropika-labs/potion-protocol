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
 */
// solhint-disable-next-line no-empty-blocks
interface IPotionBuyAction is IAction, IUniswapV3Oracle, IPotionProtocolOracle {
    // Empty on purpose
}
