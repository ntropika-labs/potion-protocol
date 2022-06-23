/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

/**    
    @title HedgingVaultV0
        
    @author Roberto Cano <robercano>

    @notice Storage and interface for the V0 of the Vault
 */
abstract contract PotionBuyActionV0 {
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

    /// MODIFIERS
    modifier onlyAfterCycleStart() {
        require(block.timestamp >= nextCycleStartTimestamp, "Next cycle has not started yet");
        _;
    }

    /// EVENTS
    event MaxPremiumPercentageChanged(uint256 maxPremiumPercentage);
    event PremiumSlippageChanged(uint256 premiumSlippage);
    event SwapSlippageChanged(uint256 swapSlippage);
    event MaxSwapDurationChanged(uint256 maxSwapDurationSecs);
    event CycleDurationChanged(uint256 cycleDurationSecs);

    /// ERRORS
    error MaxPremiumPercentageOutOfRange(uint256 maxPremiumPercentage);
    error PremiumSlippageOutOfRange(uint256 premiumSlippage);
    error SwapSlippageOutOfRange(uint256 swapSlippage);
    error CycleDurationTooShort(uint256 cycleDurationSecs, uint256 minCycleDurationSecs);

    /// FUNCTIONS

    /**
        @notice Sets the new maximum percentage of the received loan that can be used as
        premium to buy potions

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setMaxPremiumPercentage(uint256 maxPremiumPercentage_) external virtual;

    /**
        @notice Sets the new slippage allowed on the premium when the potions are bought

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setPremiumSlippage(uint256 premiumSlippage_) external virtual;

    /**
        @notice Sets the new slippage allowed on Uniswap when the assets are swapped

        @dev Reverts if the percentage is less than 0 or greater than 100
     */
    function setSwapSlippage(uint256 swapSlippage_) external virtual;

    /**
        @notice Sets the maximum duration in seconds for a Uniswap swap operation
     */
    function setMaxSwapDuration(uint256 durationSeconds) external virtual;

    /**
        @notice Set the investment cycle duration in seconds
     */
    function setCycleDuration(uint256 durationSeconds) external virtual;
}
