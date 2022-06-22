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

    /// EVENTS
    event MaxPremiumPercentageChanged(uint256 maxPremiumPercentage);
    event PremiumSlippageChanged(uint256 premiumSlippage);
    event SwapSlippageChanged(uint256 swapSlippage);
    event MaxSwapDurationChanged(uint256 maxSwapDurationSecs);

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
}
