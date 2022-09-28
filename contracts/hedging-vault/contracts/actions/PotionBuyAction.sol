/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./common/BaseActionUpgradeable.sol";
import { PotionProtocolHelperUpgradeable } from "./common/PotionProtocolHelperUpgradeable.sol";
import { UniswapV3HelperUpgradeable } from "./common/UniswapV3HelperUpgradeable.sol";
import "../versioning/PotionBuyActionV0.sol";
import "../library/PercentageUtils.sol";
import "../library/OpynProtocolLib.sol";
import "../library/TimeUtils.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
    @title PotionBuyAction

    @author Roberto Cano <robercano>

    @notice Investment action that implements a protective put on the assets received. For this, it uses the Potion
    Protocol to buy the Put Options required to protect the assets. It protects the 100% of the received assets with
    the limitation that the paid premium cannot be greater than a configured maximum premium percentage value.

    @dev The Potion Buy action uses Uniswap V3 to swap between the investment asset and USDC, which is required in order
    to pay for the Potion Protocol premium. Because of this, the action defines a swap slippage value that is used to limit
    the amount of slippage that is allowed on the swap operation.

    @dev The action also allows to configure a slippage value for the premium when the potions are bought. This value is
    different from the maximum premium percentage. The former is used to account for slippage when the potions are bought,
    while the latter is used to limit how much percentage of the received investment can be used as premium. This last
    parameter can be used to shape the investing performance of the action


 */
contract PotionBuyAction is
    BaseActionUpgradeable,
    UniswapV3HelperUpgradeable,
    PotionProtocolHelperUpgradeable,
    PotionBuyActionV0
{
    using PercentageUtils for uint256;
    using SafeERC20 for IERC20;
    using OpynProtocolLib for IOpynController;

    /**
        @notice Structure with all initialization parameters for the Potion Buy action

        @param adminAddress The address of the admin of the Action
        @param strategistAddress The address of the strategist of the Action
        @param operatorAddress The address of the operator of the Action
        @param investmentAsset The address of the asset managed by this Action
        @param USDC The address of the USDC token
        @param uniswapV3SwapRouter The address of the Uniswap V3 swap router
        @param potionLiquidityPoolManager The address of the Potion Protocol liquidity manager contract
        @param opynAddressBook The address of the Opyn Address Book where other contract addresses can be found
        @param maxPremiumPercentage The maximum percentage of the received investment that can be used as premium
        @param premiumSlippage The slippage percentage allowed on the premium when buying potions
        @param swapSlippage The slippage percentage allowed on the swap operation
        @param maxSwapDurationSecs The maximum duration of the swap operation in seconds
        @param cycleDurationSecs The duration of the investment cycle in seconds
        @param strikePercentage The strike percentage on the price of the hedged asset, as a uint256
               with `PercentageUtils.PERCENTAGE_DECIMALS` decimals
     */
    struct PotionBuyInitParams {
        address adminAddress;
        address strategistAddress;
        address operatorAddress;
        address investmentAsset;
        address USDC;
        address uniswapV3SwapRouter;
        address potionLiquidityPoolManager;
        address opynAddressBook;
        uint256 maxPremiumPercentage;
        uint256 premiumSlippage;
        uint256 swapSlippage;
        uint256 maxSwapDurationSecs;
        uint256 cycleDurationSecs;
        uint256 strikePercentage;
    }

    /// INITIALIZERS

    /**
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here

        @param initParams Initialization parameters for the Potion Buy action

        @dev See { PotionBuyInitParams }

     */
    function initialize(PotionBuyInitParams calldata initParams) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the loaned
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
        __PotionProtocolHelper_init_unchained(
            initParams.potionLiquidityPoolManager,
            initParams.opynAddressBook,
            initParams.USDC
        );

        _setMaxPremiumPercentage(initParams.maxPremiumPercentage);
        _setPremiumSlippage(initParams.premiumSlippage);
        _setSwapSlippage(initParams.swapSlippage);
        _setMaxSwapDuration(initParams.maxSwapDurationSecs);
        _setCycleDuration(initParams.cycleDurationSecs);
        _setStrikePercentage(initParams.strikePercentage);

        // Get the next time
        uint256 todayAt8UTC = TimeUtils.calculateTodayWithOffset(block.timestamp, TimeUtils.SECONDS_TO_0800_UTC);
        nextCycleStartTimestamp = todayAt8UTC > block.timestamp
            ? todayAt8UTC
            : todayAt8UTC + initParams.cycleDurationSecs;
    }

    /// STATE CHANGERS

    /**
        @inheritdoc IAction

        @dev The Potion Buy action takes the following steps to enter a position:
            - Transfer the investment amount to the Action contract
            - Calculate the premium needed for buying the potions, including slippage
            - Check if the premium needed is higher than the allowed maximum premium percentage. The
              premium to be paid cannot be greater than this percentage on the investment amount
            - Swap part of the investment asset to get the calculated needed premium in USDC
            - Buy the potions using the calculated premium and the new USDC balance in the Action
              contract

     */
    function enterPosition(address investmentAsset, uint256 amountToInvest)
        external
        onlyVault
        onlyUnlocked
        onlyAfterCycleStart
        nonReentrant
    {
        _updateNextCycleStart();
        _setLifecycleState(LifecycleState.Locked);

        // TODO: We could calculate the amount of USDC that will be needed to buy the potion and just
        // TODO: transfer enough asset needed to swap for that. However it is simpler to transfer everything for now

        // The caller is the operator, so we can trust doing this external call first
        IERC20(investmentAsset).safeTransferFrom(_msgSender(), address(this), amountToInvest);

        bool isValid;
        uint256 maxPremiumNeededInUSDC;

        (isValid, maxPremiumNeededInUSDC) = _calculatePotionMaxPremium(
            investmentAsset,
            nextCycleStartTimestamp,
            amountToInvest,
            premiumSlippage
        );
        require(isValid, "Cannot calculate the required premium");

        uint256 maxPremiumAllowedInAsset = amountToInvest.applyPercentage(maxPremiumPercentage);
        uint256 maxPremiumAllowedInUSDC = _calculateAssetValueInUSDC(investmentAsset, maxPremiumAllowedInAsset);

        require(maxPremiumNeededInUSDC <= maxPremiumAllowedInUSDC, "The premium needed is too high");

        _swapOutput(investmentAsset, address(getUSDC()), maxPremiumNeededInUSDC, swapSlippage, maxSwapDurationSecs);
        _buyPotions(investmentAsset, nextCycleStartTimestamp, amountToInvest, premiumSlippage);

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
    function calculateCurrentPayout(address investmentAsset) external view returns (bool isFinal, uint256 payout) {
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
}
