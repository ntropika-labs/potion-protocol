/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../interfaces/IPotionLiquidityPool.sol";
import "../../interfaces/IOtoken.sol";

/**
    @title MockPotionLiquidityPool

    @author Roberto Cano <robercano>

    @notice Mock contract for the potion protocol liquidity pool
*/
contract MockPotionLiquidityPool is IPotionLiquidityPool {
    // This state variable is used to change the state of the contract so the compiler does not
    // complain about the mocked functions being view or pure. We cannot make them view or pure
    // because then Typechain generates an interface that does not match that of IPotionLiquidityPool
    uint256 private __silenceCompilerWarning;
    bool private _enableRevertBuyOtokens;

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function buyOtokens(
        IOtoken, /*_otoken*/
        IPotionLiquidityPool.CounterpartyDetails[] memory, /*_sellers*/
        uint256 _maxPremium
    ) external returns (uint256 premium) {
        __silenceCompilerWarning = 1;
        if (_enableRevertBuyOtokens) {
            revert("MockPotionLiquidityPool: buy otoken failed");
        }
        return _maxPremium;
    }

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function createAndBuyOtokens(
        address, /*underlyingAsset*/
        address, /*strikeAsset*/
        address, /*collateralAsset*/
        uint256, /*strikePrice*/
        uint256, /*expiry*/
        bool, /*isPut*/
        CounterpartyDetails[] memory, /*sellers*/
        uint256 maxPremium
    ) external returns (uint256 premium) {
        __silenceCompilerWarning = 1;
        if (_enableRevertBuyOtokens) {
            revert("MockPotionLiquidityPool: buy otoken failed");
        }
        return maxPremium;
    }

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function settleAfterExpiry(
        IOtoken /*_otoken*/
    ) external {
        // do nothing
        __silenceCompilerWarning = 1;
    }

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function settleAndRedistributeSettlement(
        IOtoken, /*_otoken*/
        PoolIdentifier[] calldata /*_pools*/
    ) external {
        // do nothing
        __silenceCompilerWarning = 1;
    }

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function getVaultId(
        IOtoken /*_otoken*/
    ) external pure returns (uint256) {
        return 1;
    }

    /**
        @inheritdoc IPotionLiquidityPool
    */
    function lpPools(
        address, /*lpAddress*/
        uint256 /*poolId*/
    ) external pure returns (PoolOfCapital memory) {
        uint256 dummy = 0;
        return
            PoolOfCapital({
                total: 917299615717, // Value coming from the Potion Protocol sample deployment
                locked: 0,
                curveHash: keccak256(abi.encodePacked(dummy)),
                criteriaSetHash: keccak256(abi.encodePacked(dummy))
            });
    }

    function setRevertBuyOtokens(bool enable) external {
        _enableRevertBuyOtokens = enable;
    }
}
