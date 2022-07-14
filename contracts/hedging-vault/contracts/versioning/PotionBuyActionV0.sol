/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { IPotionBuyActionV0 } from "../interfaces/IPotionBuyActionV0.sol";

/**    
    @title PotionBuyActionV0
        
    @author Roberto Cano <robercano>

    @notice Storage and interface for the V0 of the Vault
 */
abstract contract PotionBuyActionV0 is IPotionBuyActionV0 {
    // STORAGE

    /**
        @notice The minimum duration of a cycle in seconds
     */
    uint256 public constant MIN_CYCLE_DURATION = 1 days;

    /**
        @notice The maximum percentage of the received loan that can be used as premium to buy potions

        @dev The percentage is stored in the form of a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    uint256 public maxPremiumPercentage;

    /**
        @notice The percentage of slippage that is allowed on the premium
        when the potions are bought

        @dev The percentage is stored in the form of a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */

    uint256 public premiumSlippage;

    /**
        @notice The percentage of slippage that is allowed on Uniswap when it the asset is swapped for USDC and back

        @dev The percentage is stored in the form of a uint256 with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */

    uint256 public swapSlippage;

    /**
        @notice The maximum duration of a Uniswap swap operation, in seconds
     */
    uint256 public maxSwapDurationSecs;

    /**
        @notice Timestamp when the next investment cycle can start. The action cannot enter the position
        before this timestamp
     */
    uint256 public nextCycleStartTimestamp;

    /**
        @notice Duration of the investment cycle in seconds
     */
    uint256 public cycleDurationSecs;

    /**
        @notice Strike price for the hedged asset
     */
    uint256 public strikePriceInUSDC;

    /// MODIFIERS
    modifier onlyAfterCycleStart() {
        require(block.timestamp >= nextCycleStartTimestamp, "Next cycle has not started yet");
        _;
    }
}
