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

    struct BuyPotionParams {
        address underlyingAsset;
        uint256 strikePriceInUSDC;
        uint256 expirationTimestamp;
        uint256 maxPremiumInUSDC;
        address targetPotionAddress;
        IPotionLiquidityPool.CounterpartyDetails[] sellers;
        IERC20 USDC;
    }

    /**
        @notice See { PotionProtocolLib }
     */
    function buyPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynFactory opynFactory,
        BuyPotionParams calldata params
    ) external returns (uint256 actualPremiumInUSDC) {
        return
            PotionProtocolLib.buyPotion(
                potionLiquidityPoolManager,
                opynFactory,
                params.underlyingAsset,
                params.strikePriceInUSDC,
                params.expirationTimestamp,
                params.maxPremiumInUSDC,
                params.targetPotionAddress,
                params.sellers,
                params.USDC
            );
    }

    /**
        @notice See { PotionProtocolLib }
     */
    function redeemPotion(
        IPotionLiquidityPool potionLiquidityPoolManager,
        IOpynController opynController,
        address targetPotionAddress,
        uint256 totalSizeInPotions
    ) external {
        PotionProtocolLib.redeemPotion(
            potionLiquidityPoolManager,
            opynController,
            targetPotionAddress,
            totalSizeInPotions
        );
    }
}
