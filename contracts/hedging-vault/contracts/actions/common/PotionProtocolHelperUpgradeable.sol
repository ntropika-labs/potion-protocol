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
import { IOpynFactory } from "../../interfaces/IOpynFactory.sol";

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
        @notice The address of the Opyn Protocol factory

        @dev Used to get the address of the otoken contract
     */
    IOpynFactory private _opynFactory;

    /**
        @notice Maps the address of an asset with the address of the potion that will be used to hedge it

        @dev token address => potion address
     */
    mapping(address => address) private _assetToPotion;

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
        @param opynFactory The address of the Opyn Protocol factory
        @param USDC The address of the USDC contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __PotionProtocolHelper_init_unchained(
        address potionLiquidityPoolManager,
        address opynController,
        address opynFactory,
        address USDC
    ) internal onlyInitializing {
        __PotionProtocolOracle_init_unchained();

        _potionLiquidityPoolManager = IPotionLiquidityPool(potionLiquidityPoolManager);
        _opynController = IOpynController(opynController);
        _opynFactory = IOpynFactory(opynFactory);

        _USDC = IERC20(USDC);
    }

    /// FUNCTIONS

    /**
        @notice Calculates the premium required to buy potions for the indicated amount of
        assets and the intended slippage

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePrice The strike price of the potion with 8 decimals
        @param expirationTimestamp The timestamp when the potion expires
        @param amount The amount of assets to be hedged
        @param slippage The slippage percentage to be used to calculate the premium

        @return isValid Whether the maximum premium could be calculated or not
        @return maxPremiumInUSDC The maximum premium needed to buy the potions
     */
    function _calculateMaxPremium(
        address hedgedAsset,
        uint256 strikePrice,
        uint256 expirationTimestamp,
        uint256 amount,
        uint256 slippage
    ) internal view returns (bool isValid, uint256 maxPremiumInUSDC) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePrice, expirationTimestamp);
        if (buyInfo.targetPotionAddress == address(0) || amount != buyInfo.totalSizeInPotions) {
            return (false, type(uint256).max);
        }

        isValid = true;
        maxPremiumInUSDC = buyInfo.expectedPremiumInUSDC.addPercentage(slippage);
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePrice The strike price of the potion with 8 decimals
        @param expirationTimestamp The timestamp when the potion expires
        @param amount The amount of assets to be hedged
        @param slippage The slippage percentage to be used to calculate the premium

        @return actualPremium The actual premium used to buy the potions

     */
    function _buyPotions(
        address hedgedAsset,
        uint256 strikePrice,
        uint256 expirationTimestamp,
        uint256 amount,
        uint256 slippage
    ) internal returns (uint256 actualPremium) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePrice, expirationTimestamp);

        require(buyInfo.targetPotionAddress != address(0), "Potion buy info not found for the given asset");
        require(amount == buyInfo.totalSizeInPotions, "Insured amount greater than expected amount");

        actualPremium = _potionLiquidityPoolManager.buyPotion(_opynFactory, buyInfo, slippage, getUSDC());
    }

    /**
        @notice Redeems the potions bought once the expiration timestamp is reached

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePrice The strike price of the potion with 8 decimals
        @param expirationTimestamp The timestamp when the potion expires

        @return settledAmount The amount of USDC settled after the redemption
     */
    function _redeemPotions(
        address hedgedAsset,
        uint256 strikePrice,
        uint256 expirationTimestamp
    ) internal returns (uint256 settledAmount) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePrice, expirationTimestamp);

        uint256 prevUSDCBalance = getUSDCBalance(address(this));

        _potionLiquidityPoolManager.redeemPotion(buyInfo.targetPotionAddress);

        settledAmount = getUSDCBalance(address(this)) - prevUSDCBalance;
    }

    /**
        @notice Checks if the potion for the given asset can be redeemed already

        @param hedgedAsset The address of the hedged asset related to the potion to be redeemed

        @return Whether the potion can be redeemed or not
     */
    function _isPotionRedeemable(
        address hedgedAsset,
        uint256 strikePrice,
        uint256 expirationTimestamp
    ) internal view returns (bool) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePrice, expirationTimestamp);
        return _opynController.isPotionRedeemable(buyInfo.targetPotionAddress);
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
