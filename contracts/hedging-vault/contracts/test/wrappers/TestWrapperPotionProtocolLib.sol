/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../library/PotionProtocolLib.sol";

/**
    @title TestWrapperPotionProtocolLib

    @author Roberto Cano <robercano>

    @notice Test wrapper for the PotionProtocolLib library. This wrapper exposes
    all internal functions as external. This allows to unit test the library in isolation.
 */
contract TestWrapperPotionProtocolLib {
    /// FUNCTIONS

    /**
        @notice See { PotionProtocolLib }
     */
    function buyPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynFactory opynFactory,
        PotionBuyInfo calldata buyInfo,
        uint256 slippage,
        IERC20 USDC
    ) external returns (uint256 actualPremium) {
        return PotionProtocolLib.buyPotion(potionLiquidityPoolManager, opynFactory, buyInfo, slippage, USDC);
    }

    /**
        @notice See { PotionProtocolLib }
     */
    function redeemPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynController opynController,
        PotionBuyInfo calldata buyInfo
    ) external {
        PotionProtocolLib.redeemPotion(potionLiquidityPoolManager, opynController, buyInfo);
    }
}
