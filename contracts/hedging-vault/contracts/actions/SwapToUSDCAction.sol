/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./common/BaseActionUpgradeable.sol";
import { UniswapV3HelperUpgradeable } from "./common/UniswapV3HelperUpgradeable.sol";
import "../library/PercentageUtils.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
    @title SwapToUSDCAction

    @author Roberto Cano <robercano>

    @notice Investment action that swaps the underlying asset to USDC to keep it safe from Black Swan events

    @dev The action needs a Uniswap V3 Route to do the swap both at the enter position and the exit position

 */
contract SwapToUSDCAction is BaseActionUpgradeable, UniswapV3HelperUpgradeable {
    using PercentageUtils for uint256;
    using SafeERC20 for IERC20;

    /**
        @notice Structure with all initialization parameters for the Potion Buy action

        @param adminAddress The address of the admin of the Action
        @param strategistAddress The address of the strategist of the Action
        @param operatorAddress The address of the operator of the Action
        @param investmentAsset The address of the asset managed by this Action
        @param USDC The address of the USDC token
        @param uniswapV3SwapRouter The address of the Uniswap V3 swap router
        @param swapSlippage The slippage percentage allowed on the swap operation
        @param maxSwapDurationSecs The maximum duration of the swap operation in seconds
     */
    struct SwapToUSDCInitParams {
        address adminAddress;
        address strategistAddress;
        address operatorAddress;
        address investmentAsset;
        address USDC;
        address uniswapV3SwapRouter;
        uint256 swapSlippage;
        uint256 maxSwapDurationSecs;
    }

    /// INITIALIZERS

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here

        @param initParams Initialization parameters for the Swap to USDC action

        @dev See { SwapToUSDCInitParams }

     */
    function initialize(SwapToUSDCInitParams calldata initParams) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the underlying
        // asset is not allowed to be refunded and also USDC because the action will hold some of it
        // at some times. This prevents the admin to accidentally refund those assets
        address[] memory cannotRefundTokens = new address[](2);
        cannotRefundTokens[0] = initParams.investmentAsset;
        cannotRefundTokens[1] = initParams.USDC;

        __BaseAction_init_chained(
            initParams.adminAddress,
            initParams.strategistAddress,
            initParams.operatorAddress,
            cannotRefundTokens
        );
        __UniswapV3Helper_init_unchained(initParams.uniswapV3SwapRouter);

        _setSwapSlippage(initParams.swapSlippage);
        _setMaxSwapDuration(initParams.maxSwapDurationSecs);
    }

    /// STATE CHANGERS

    /**
        @inheritdoc IAction

        @dev The Swap to USDC action takes the following steps to enter a position:
            - Swap all the investment asset to USDC and keep it in the action
    */
    function enterPosition(address investmentAsset, uint256 amountToInvest)
        external
        onlyVault
        onlyUnlocked
        onlyAfterCycleStart
        nonReentrant
    {
        _setLifecycleState(LifecycleState.Locked);

        // The caller is the vault, so we can trust doing this external call first
        IERC20(investmentAsset).safeTransferFrom(_msgSender(), address(this), amountToInvest);

        uint256 premiumWithSlippageInUSDC = _calculatePremiumWithSlippage(
            investmentAsset,
            nextCycleStartTimestamp,
            premiumSlippage
        );

        _swapOutput(investmentAsset, address(getUSDC()), premiumWithSlippageInUSDC, swapSlippage, maxSwapDurationSecs);
        (uint256 amountPotionsInAssets, uint256 actualPremiumInUSDC) = _buyPotions(
            investmentAsset,
            nextCycleStartTimestamp,
            premiumWithSlippageInUSDC
        );

        _validateMaxPremium(investmentAsset, amountToInvest, actualPremiumInUSDC);
        _validateHedgingRate(investmentAsset, amountToInvest, amountPotionsInAssets, actualPremiumInUSDC);

        emit ActionPositionEntered(investmentAsset, amountToInvest);
    }

    /**
        @inheritdoc IAction
     */
    function exitPosition(address investmentAsset)
        external
        onlyVault
        onlyLocked
        onlyAfterCycleEnd
        nonReentrant
        returns (uint256 amountReturned)
    {
        require(_isPotionRedeemable(investmentAsset, nextCycleStartTimestamp), "The Potion is not redeemable yet");

        IERC20 investmentAssetERC20 = IERC20(investmentAsset);
        IERC20 USDC = getUSDC();

        _redeemPotions(investmentAsset, nextCycleStartTimestamp);
        uint256 amountToConvertToAssset = USDC.balanceOf(address(this));

        _swapInput(address(USDC), investmentAsset, amountToConvertToAssset, swapSlippage, maxSwapDurationSecs);

        amountReturned = investmentAssetERC20.balanceOf(address(this));

        SafeERC20.safeTransfer(investmentAssetERC20, _msgSender(), amountReturned);

        _setLifecycleState(LifecycleState.Unlocked);

        emit ActionPositionExited(investmentAsset, amountReturned);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setMaxPremiumPercentage(uint256 maxPremiumPercentage_) external override onlyStrategist {
        _setMaxPremiumPercentage(maxPremiumPercentage_);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setPremiumSlippage(uint256 premiumSlippage_) external override onlyStrategist {
        _setPremiumSlippage(premiumSlippage_);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setSwapSlippage(uint256 swapSlippage_) external override onlyStrategist {
        _setSwapSlippage(swapSlippage_);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setMaxSwapDuration(uint256 durationSeconds) external override onlyStrategist {
        _setMaxSwapDuration(durationSeconds);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setCycleDuration(uint256 durationSeconds) external override onlyStrategist {
        _setCycleDuration(durationSeconds);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setStrikePercentage(uint256 strikePercentage_) external override onlyStrategist {
        _setStrikePercentage(strikePercentage_);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setHedgingRate(uint256 hedgingRate_) external override onlyStrategist {
        _setHedgingRate(hedgingRate_);
    }

    /**
        @inheritdoc IPotionBuyActionV0
     */
    function setHedgingRateSlippage(uint256 hedgingRateSlippage_) external override onlyStrategist {
        _setHedgingRateSlippage(hedgingRateSlippage_);
    }

    // GETTERS

    /**
        @inheritdoc IAction
     */
    function canPositionBeEntered(
        address /*investmentAsset*/
    ) public view returns (bool canEnter) {
        canEnter = _isNextCycleStarted() && getLifecycleState() == LifecycleState.Unlocked;
    }

    /**
        @inheritdoc IAction
     */
    function canPositionBeExited(address investmentAsset) public view returns (bool canExit) {
        canExit =
            _isNextCycleStarted() &&
            _isPotionRedeemable(investmentAsset, nextCycleStartTimestamp) &&
            getLifecycleState() == LifecycleState.Locked;
    }

    /**
        @inheritdoc IPotionBuyActionV0
    */
    function calculateCurrentPayout(address investmentAsset)
        external
        view
        returns (
            bool isFinal,
            uint256 payout,
            uint256 orderSize
        )
    {
        return _calculateCurrentPayout(investmentAsset, nextCycleStartTimestamp);
    }

    /// INTERNAL FUNCTIONS

    /**
        @dev See { setMaxPremiumPercentage }
     */
    function _setMaxPremiumPercentage(uint256 maxPremiumPercentage_) internal {
        if (maxPremiumPercentage_ <= 0 || maxPremiumPercentage_ > PercentageUtils.PERCENTAGE_100) {
            revert MaxPremiumPercentageOutOfRange(maxPremiumPercentage_);
        }

        maxPremiumPercentage = maxPremiumPercentage_;

        emit MaxPremiumPercentageChanged(maxPremiumPercentage_);
    }

    /**
        @dev See { setPremiumSlippage }
    */
    function _setPremiumSlippage(uint256 premiumSlippage_) internal {
        if (premiumSlippage_ <= 0 || premiumSlippage_ > PercentageUtils.PERCENTAGE_100) {
            revert PremiumSlippageOutOfRange(premiumSlippage_);
        }

        premiumSlippage = premiumSlippage_;

        emit PremiumSlippageChanged(premiumSlippage_);
    }

    /**
        @dev See { setSwapSlippage }
     */
    function _setSwapSlippage(uint256 swapSlippage_) internal {
        if (swapSlippage_ <= 0 || swapSlippage_ >= PercentageUtils.PERCENTAGE_100) {
            revert SwapSlippageOutOfRange(swapSlippage_);
        }

        swapSlippage = swapSlippage_;

        emit SwapSlippageChanged(swapSlippage_);
    }

    /**
        @dev See { setMaxSwapDuration }
     */
    function _setMaxSwapDuration(uint256 durationSeconds) internal {
        maxSwapDurationSecs = durationSeconds;

        emit MaxSwapDurationChanged(durationSeconds);
    }

    /**
        @dev See { setCycleDuration }
     */
    function _setCycleDuration(uint256 durationSeconds) internal {
        if (durationSeconds < MIN_CYCLE_DURATION) {
            revert CycleDurationTooShort(durationSeconds, MIN_CYCLE_DURATION);
        }

        cycleDurationSecs = durationSeconds;

        emit CycleDurationChanged(durationSeconds);
    }

    /**
        @dev See { setStrikePercentage }
     */
    function _setStrikePercentage(uint256 strikePercentage_) internal {
        if (strikePercentage_ == 0) {
            revert StrikePercentageIsZero();
        }

        strikePercentage = strikePercentage_;

        emit StrikePercentageChanged(strikePercentage_);
    }

    /**
        @dev See { setStrikePercentage }
     */
    function _setHedgingRate(uint256 hedgingRate_) internal {
        if (hedgingRate_ == 0) {
            revert HedgingRateIsZero();
        }

        hedgingRate = hedgingRate_;

        emit HedgingRateChanged(hedgingRate_);
    }

    /**
        @dev See { setStrikePercentage }
     */
    function _setHedgingRateSlippage(uint256 hedgingRateSlippage_) internal {
        hedgingRateSlippage = hedgingRateSlippage_;

        emit HedgingRateSlippageChanged(hedgingRateSlippage_);
    }

    /**
        @notice Checks if the next cycle has already started or not

        @return True if the next cycle has already started, false otherwise
     */

    function _isNextCycleStarted() internal view returns (bool) {
        return block.timestamp >= nextCycleStartTimestamp;
    }

    /**
        @notice Updates the start of the next investment cycle

        @dev It has a bit of a complex logic to account for skipped cycles. If one or more
        cycles have been skipped, then we need to bring the next cycle start close to the current
        timestamp. To do so we calculate the current cycle offset from the cycle start that is closest
        to now, but in the past. Then we substract this offset from now to get the start of the current
        cycle. We then calculate the next cycle start from the previous by adding the cycle duration
     */
    function _updateNextCycleStart() internal {
        uint256 currentCycleOffset = (block.timestamp - nextCycleStartTimestamp) % cycleDurationSecs;
        uint256 lastCycleExpectedStart = block.timestamp - currentCycleOffset;

        nextCycleStartTimestamp = lastCycleExpectedStart + cycleDurationSecs;
    }

    /**
        @notice Validates that the actual premium being paid does not exceed the maximum allowed

        @param investmentAsset The asset to be invested
        @param amountToInvest The amount of assets to be invested, with `investmentAsset` decimals
        @param actualPremiumInUSDC The actual premium being paid, with 6 decimals
     */
    function _validateMaxPremium(
        address investmentAsset,
        uint256 amountToInvest,
        uint256 actualPremiumInUSDC
    ) private view {
        uint256 maxPremiumAllowedInAsset = amountToInvest.applyPercentage(maxPremiumPercentage);
        uint256 maxPremiumAllowedInUSDC = _convertAssetToUSDCOnLivePrice(investmentAsset, maxPremiumAllowedInAsset);

        if (actualPremiumInUSDC > maxPremiumAllowedInUSDC) {
            revert PremiumExceedsMaxPremium(actualPremiumInUSDC, maxPremiumAllowedInUSDC);
        }
    }

    /**
        @notice Validates that the effective hedging rate is in range with the expected one

        @param investmentAsset The asset to be invested
        @param amountToInvestInAssets The amount of assets to be invested, with `investmentAsset` decimals
        @param amountPotionsInAssets The amount of potions that were bought, with `investmentAsset` decimals
        @param actualPremiumInUSDC The actual premium being paid, with 6 decimals

        @dev If this cycle there were no assets in the vault, skip the check
     */
    function _validateHedgingRate(
        address investmentAsset,
        uint256 amountToInvestInAssets,
        uint256 amountPotionsInAssets,
        uint256 actualPremiumInUSDC
    ) private view {
        if (amountToInvestInAssets == 0) {
            return;
        }

        uint256 actualPremiumInAsset = _convertUSDCToAssetOnLivePrice(investmentAsset, actualPremiumInUSDC);

        uint256 actualHedgedAmountInAssets = amountToInvestInAssets - actualPremiumInAsset;

        uint256 actualHedgingRate = PercentageUtils.toPercentage(amountPotionsInAssets, actualHedgedAmountInAssets);

        uint256 hedgingRateWithSlippage = hedgingRate.subtractPercentage(hedgingRateSlippage);

        if (actualHedgingRate < hedgingRateWithSlippage) {
            revert HedgingRateOutOfRange(hedgingRate, actualHedgingRate, hedgingRateSlippage);
        }
    }
}
