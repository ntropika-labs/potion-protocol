/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./common/BaseActionUpgradeable.sol";
import { UniswapV3HelperUpgradeable } from "./common/UniswapV3HelperUpgradeable.sol";
import { PercentageUtils } from "../library/PercentageUtils.sol";
import { SafeERC20Upgradeable as SafeERC20 } from "@openzeppelin/contracts-upgradeable-4.7.3/token/ERC20/utils/SafeERC20Upgradeable.sol";

import "../versioning/SwapToUSDCActionV0.sol";

/**
    @title SwapToUSDCAction

    @author Roberto Cano <robercano>

    @notice Investment action that swaps the underlying asset to USDC to keep it safe from Black Swan events

    @dev The action needs a Uniswap V3 Route to do the swap both at the enter position and the exit position

    @dev AUDIT: a possible attack that a malicious user could perform is sending USDC to this contract to increase the amount
                that would be swapped in during exit position. This could make the swap in route to not be the ideal one
                for the swap, having a greater slippage, and thus reverting the swap if the slippage is too high. This however
                seems unlikely and probably the new added USDC could cover for the added slippage. This is something we need
                to research further.

 */
contract SwapToUSDCAction is BaseActionUpgradeable, UniswapV3HelperUpgradeable, SwapToUSDCActionV0 {
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
        @param swapPercentage The percentage of the investment asset to swap to USDC
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
        uint256 swapPercentage;
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
        _setSwapPercentage(initParams.swapPercentage);

        USDC = IERC20(initParams.USDC);
    }

    /// STATE CHANGERS

    /**
        @inheritdoc IAction

        @dev The Swap to USDC action takes the following steps to enter a position:
            - Swap all the investment asset to USDC and keep it in the action

        @audit It is protected with the nonReentrant modifier to avoid re-entrancy. In any case
        the only contract allowed to call this function is the InvestmentVault and the call would only happen
        upon instruction of the operator. A possible attack vector would be for a malicious actor to deposit
        some assets in the RoundsInputVault when the PotionBuyAction is trying to enter the position, but
        that is countermeasure by the fact that assets have been already transferred to the PotionBuyContract
        before doing any external call. And considering the ERC-777, although deprecated, the owner of the tokens
        is the InvestmentVault which will not use the ERC-777 callback.
    */
    function enterPosition(address investmentAsset, uint256 amountToInvest)
        external
        onlyVault
        onlyUnlocked
        nonReentrant
    {
        _setLifecycleState(LifecycleState.Locked);

        // At this moment in the lifecycle of the vault, this external call could only come back
        // as a new deposit request or withdrawal request, and the respective Rounds vaults are both
        // moved to the next rounds at this point, so there is no risk of a malicious user affecting the
        // operations performed inside this action
        IERC20(investmentAsset).safeTransferFrom(_msgSender(), address(this), amountToInvest);

        uint256 amountToSwap = PercentageUtils.applyPercentage(amountToInvest, swapPercentage);

        _swapInput(investmentAsset, address(USDC), amountToSwap, swapSlippage, maxSwapDurationSecs);

        emit ActionPositionEntered(investmentAsset, amountToSwap);
    }

    /**
        @inheritdoc IAction

        @dev Even though the exit position can only be called by the Vault, it is also 
             protected against reentrancy in case the Vault is compromised

        @audit It is protected with the nonReentrant modifier to avoid re-entrancy. In any case
        the only contract allowed to call this function is the InvestmentVault and the call would only happen
        upon instruction of the operator. A possible attack vector would be for a malicious actor to deposit
        some assets in the RoundsInputVault when the PotionBuyAction is trying to enter the position, but
        that is countermeasure by the fact that assets have been already transferred to the PotionBuyContract
        before doing any external call. And considering the ERC-777, although deprecated, the owner of the tokens
        is the InvestmentVault which will not use the ERC-777 callback.
     */
    // slither-disable-next-line reentrancy-no-eth
    function exitPosition(address investmentAsset)
        external
        onlyVault
        onlyLocked
        nonReentrant
        returns (uint256 amountReturned)
    {
        IERC20 investmentAssetERC20 = IERC20(investmentAsset);

        // Using balanceOf here, check the comment in the contract header about an attacker sending USDC to this contract
        uint256 amountToConvertToAssset = USDC.balanceOf(address(this));

        _swapInput(address(USDC), investmentAsset, amountToConvertToAssset, swapSlippage, maxSwapDurationSecs);

        // Using balanceOf here is safe as the whole balance is just sent back to the vault. If an attacker sends
        // underlying to this contract, it will just end up as profits in the vault
        amountReturned = investmentAssetERC20.balanceOf(address(this));

        SafeERC20.safeTransfer(investmentAssetERC20, _msgSender(), amountReturned);

        _setLifecycleState(LifecycleState.Unlocked);

        emit ActionPositionExited(investmentAsset, amountReturned);
    }

    /**
        @inheritdoc ISwapToUSDCActionV0
     */
    function setSwapSlippage(uint256 swapSlippage_) external override onlyStrategist {
        _setSwapSlippage(swapSlippage_);
    }

    /**
        @inheritdoc ISwapToUSDCActionV0
     */
    function setMaxSwapDuration(uint256 durationSeconds) external override onlyStrategist {
        _setMaxSwapDuration(durationSeconds);
    }

    /**
        @inheritdoc ISwapToUSDCActionV0
     */
    function setSwapPercentage(uint256 swapPercentage_) external override onlyStrategist {
        _setSwapPercentage(swapPercentage_);
    }

    // GETTERS

    /**
        @inheritdoc IAction
     */
    function canPositionBeEntered(
        address /*investmentAsset*/
    ) public view returns (bool canEnter) {
        canEnter = (getLifecycleState() == LifecycleState.Unlocked);
    }

    /**
        @inheritdoc IAction
     */
    function canPositionBeExited(
        address /*investmentAsset*/
    ) public view returns (bool canExit) {
        canExit = (getLifecycleState() == LifecycleState.Locked);
    }

    /// INTERNAL FUNCTIONS

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
        @dev See { setSwapPercentage }
     */
    function _setSwapPercentage(uint256 swapPercentage_) internal {
        swapPercentage = swapPercentage_;

        emit SwapPercentageChanged(swapPercentage_);
    }
}
