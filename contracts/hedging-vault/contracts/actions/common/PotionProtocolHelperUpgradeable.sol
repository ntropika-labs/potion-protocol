/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { PotionProtocolOracleUpgradeable } from "./PotionProtocolOracleUpgradeable.sol";
import "../../library/PotionProtocolLib.sol";
import "../../library/PercentageUtils.sol";
import "../../library/OpynProtocolLib.sol";
import { IPotionLiquidityPool } from "../../interfaces/IPotionLiquidityPool.sol";
import { IOpynController } from "../../interfaces/IOpynController.sol";

/**
    @title PotionProtocolHelperUpgradeable

    @notice Helper contract that handles the configuration to perform Uniswap V3 multi-hop swaps. It
    uses the `UniswapV3SwapLib` to perform the swaps.

    @dev It inherits from the RolesManagerUpgradeable contract to scope the the parameters setting
    functions for only the Keeper role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the Action. The initialization will happen in the Action contract
 */
contract PotionProtocolHelperUpgradeable is PotionProtocolOracleUpgradeable {
    using PotionProtocolLib for IPotionLiquidityPool;
    using OpynProtocolLib for IOpynController;
    using PercentageUtils for uint256;

    /**
        @notice The address of the Potion Protocol liquidity pool manager
     */
    IPotionLiquidityPool private _potionLiquidityPoolManager;

    /**
        @notice The address of the Opyn Protocol controller

        @dev Used to determine if a potion can be redeemed or not
     */
    IOpynController private _opynController;

    /**
        @notice Maps the address of an asset with the address of the potion that will be used to hedge it

        @dev token address => potion address
     */
    mapping(address => address) private _potionAssetpotion;

    /**
        @notice Address of the USDC contract. Used to calculate the settled amounts for
        redeeming potions

        @dev Unfortunately the Potion Protocol does not return the settled amount when 
        calling redeemPotions, so it is needed to get the USDC balance before and after the call
        to be able to calculate the settled amount
     */
    IERC20 private _USDC;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice It does chain the initialization to the parent contract because both contracts
        are quite coupled and `UniswapV3OracleUpgradeable` MUST not be used anywhere else in
        the inheritance chain.

        @param potionLiquidityPoolManager The address of the Potion Protocol liquidity pool manager
        @param opynController The address of the Opyn Protocol controller
        @param USDC The address of the USDC contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __PotionProtocolHelper_init_unchained(
        address potionLiquidityPoolManager,
        address opynController,
        address USDC
    ) internal onlyInitializing {
        __PotionProtocolOracle_init_unchained();

        _potionLiquidityPoolManager = IPotionLiquidityPool(potionLiquidityPoolManager);
        _opynController = IOpynController(opynController);

        _USDC = IERC20(USDC);
    }

    /// FUNCTIONS

    /**
        @notice Sets the potion associated with a hedged asset

        @param hedgedAsset The address of the asset to be hedged
        @param potion The address of the potion that will be used to hedge the asset
     */
    function _setPotion(address hedgedAsset, address potion) internal {
        _potionAssetpotion[hedgedAsset] = potion;
    }

    /**
        @notice Returns the potion associated with a hedged asset

        @param hedgedAsset The address of the asset to be hedged

        @return The address of the potion that will be used to hedge the asset
     */
    function getPotion(address hedgedAsset) public view returns (address) {
        return _potionAssetpotion[hedgedAsset];
    }

    /**
        @notice Calculates the premium required to buy potions for the indicated amount of
        assets and the intended slippage

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param amount The amount of assets to be hedged
        @param slippage The slippage percentage to be used to calculate the premium

        @return isValid Whether the maximum premium could be calculated or not
        @return maxPremiumInUSDC The maximum premium needed to buy the potions
     */
    function _calculateMaxPremium(
        address hedgedAsset,
        uint256 amount,
        uint256 slippage
    ) internal view returns (bool isValid, uint256 maxPremiumInUSDC) {
        address potion = getPotion(hedgedAsset);
        if (potion == address(0)) {
            return (false, type(uint256).max);
        }

        PotionBuyInfo memory buyInfo = getPotionBuyInfo(potion);
        if (amount != buyInfo.totalSizeInPotions) {
            return (false, type(uint256).max);
        }

        isValid = true;
        maxPremiumInUSDC = buyInfo.expectedPremiumInUSDC.addPercentage(slippage);
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets
     */
    function _buyPotions(
        address hedgedAsset,
        uint256 amount,
        uint256 slippage
    ) internal returns (uint256 actualPremium) {
        address potion = getPotion(hedgedAsset);
        require(potion != address(0), "Potion not found for the given asset");

        PotionBuyInfo memory buyInfo = getPotionBuyInfo(potion);

        require(amount == buyInfo.totalSizeInPotions, "Insured amount greater than expected amount");

        actualPremium = _potionLiquidityPoolManager.buyPotion(
            potion,
            buyInfo.sellers,
            buyInfo.expectedPremiumInUSDC,
            slippage,
            getUSDC()
        );
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets
     */
    function _redeemPotions(address hedgedAsset) internal returns (uint256 settledAmount) {
        address potion = getPotion(hedgedAsset);
        uint256 prevUSDCBalance = getUSDCBalance(address(this));

        _potionLiquidityPoolManager.redeemPotion(potion);

        settledAmount = getUSDCBalance(address(this)) - prevUSDCBalance;
    }

    /**
        @notice Checks if the potion for the given asset can be redeemed already

        @param hedgedAsset The address of the hedged asset related to the potion to be redeemed

        @return Whether the potion can be redeemed or not
     */
    function _isPotionRedeemable(address hedgedAsset) internal view returns (bool) {
        address potion = getPotion(hedgedAsset);
        return _opynController.isPotionRedeemable(potion);
    }

    /**
        @notice Returns the USDC address configured in the contract

        @return The address of the USDC contract
     */
    function getUSDC() public view returns (IERC20) {
        return _USDC;
    }

    /**
        @notice Returns the current balance of USDC for the given account

        @param account The address of the account to get the USDC balance for

        @return The current balance of USDC for the given account
     */
    function getUSDCBalance(address account) public view returns (uint256) {
        return _USDC.balanceOf(account);
    }

    /**
        @notice Returns the Potion Protocol liquidity manager address

        @return The address of the Potion Protocol liquidity manager
    */
    function getPotionLiquidityManager() external view returns (IPotionLiquidityPool) {
        return _potionLiquidityPoolManager;
    }

    /**
        @notice Returns the Opyn Controller address

        @return The address of the Opyn Controller
     */
    function getOpynController() external view returns (IOpynController) {
        return _opynController;
    }
}
