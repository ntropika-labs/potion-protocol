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
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

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
        @notice Takes care of the initialization of all the contracts hierarchy. Any changes
        to the hierarchy will require to review this function to make sure that no initializer
        is called twice, and most importantly, that all initializers are called here

        @param adminAddress The address of the admin of the Action
        @param strategistAddress The address of the strategist of the Action
        @param operatorAddress The address of the operator of the Action
        @param investmentAsset The address of the asset managed by this Action
        @param USDC The address of the USDC token
        @param potionLiquidityPoolManager The address of the Potion Protocol liquidity manager contract
        @param maxPremiumPercentage_ The maximum percentage of the received investment that can be used as premium
        @param premiumSlippage_ The slippage percentage allowed on the premium when buying potions
        @param swapSlippage_ The slippage percentage allowed on the swap operation
        @param maxSwapDurationSecs_ The maximum duration of the swap operation in seconds
        @param cycleDurationSecs_ The duration of the investment cycle in seconds

     */
    function initialize(
        address adminAddress,
        address strategistAddress,
        address operatorAddress,
        address investmentAsset,
        address USDC,
        address potionLiquidityPoolManager,
        uint256 maxPremiumPercentage_,
        uint256 premiumSlippage_,
        uint256 swapSlippage_,
        uint256 maxSwapDurationSecs_,
        uint256 cycleDurationSecs_
    ) external initializer {
        // Prepare the list of tokens that are not allowed to be refunded. In particular the loaned
        // asset is not allowed to be refunded and also USDC because the action will hold some of it
        // at some times. This prevents the admin to accidentally refund those assets
        address[] memory cannotRefundTokens = new address[](2);
        cannotRefundTokens[0] = investmentAsset;
        cannotRefundTokens[1] = USDC;

        __BaseAction_init_chained(adminAddress, strategistAddress, operatorAddress, cannotRefundTokens);
        __PotionProtocolHelper_init_unchained(potionLiquidityPoolManager, USDC);

        _setMaxPremiumPercentage(maxPremiumPercentage_);
        _setPremiumSlippage(premiumSlippage_);
        _setSwapSlippage(swapSlippage_);
        _setMaxSwapDuration(maxSwapDurationSecs_);
        _setCycleDuration(cycleDurationSecs_);
    }

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
        onlyOperator
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

        (bool isValid, uint256 maxPremiumNeededInUSDC) = _calculateMaxPremium(
            address(investmentAsset),
            amountToInvest,
            premiumSlippage
        );
        require(isValid, "Cannot calculate the required premium");

        uint256 maxPremiumAllowedInAsset = amountToInvest.applyPercentage(maxPremiumPercentage);
        uint256 maxPremiumAllowedInUSDC = getSwapOutputAmount(
            investmentAsset,
            address(getUSDC()),
            maxPremiumAllowedInAsset
        );

        require(maxPremiumNeededInUSDC <= maxPremiumAllowedInUSDC, "The premium needed is too high");

        _swapOutput(investmentAsset, address(getUSDC()), maxPremiumNeededInUSDC, swapSlippage, maxSwapDurationSecs);
        _buyPotions(investmentAsset, amountToInvest, premiumSlippage);

        emit ActionPositionEntered(investmentAsset, amountToInvest);
    }

    /**
        @inheritdoc IAction
     */
    function exitPosition(address investmentAsset)
        external
        onlyOperator
        onlyLocked
        nonReentrant
        returns (uint256 amountReturned)
    {
        IERC20 investmentAssetERC20 = IERC20(investmentAsset);

        _redeemPotions(investmentAsset);
        uint256 amountToConvertToAssset = getUSDCBalance(address(this));

        _swapInput(address(getUSDC()), investmentAsset, amountToConvertToAssset, swapSlippage, maxSwapDurationSecs);

        amountReturned = investmentAssetERC20.balanceOf(address(this));

        SafeERC20.safeTransfer(investmentAssetERC20, _msgSender(), amountReturned);

        _setLifecycleState(LifecycleState.Unlocked);

        emit ActionPositionExited(investmentAsset, amountReturned);
    }

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
            _isPotionRedeemable(investmentAsset) &&
            getLifecycleState() == LifecycleState.Locked;
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
