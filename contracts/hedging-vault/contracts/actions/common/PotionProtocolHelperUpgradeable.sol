/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { PotionProtocolOracleUpgradeable } from "./PotionProtocolOracleUpgradeable.sol";
import "../../library/PotionProtocolLib.sol";
import "../../library/PercentageUtils.sol";
import "../../library/OpynProtocolLib.sol";
import { IPotionLiquidityPool } from "../../interfaces/IPotionLiquidityPool.sol";
import { IOpynAddressBook } from "../../interfaces/IOpynAddressBook.sol";
import { IOpynController } from "../../interfaces/IOpynController.sol";
import { IOpynFactory } from "../../interfaces/IOpynFactory.sol";
import { IOpynOracle } from "../../interfaces/IOpynOracle.sol";

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
        @notice The address of the Opyn address book

        @dev This is used to get the addresses of the other Opyn contracts
     */
    IOpynAddressBook private _opynAddressBook;

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
        @param opynAddressBook The address of the Opyn Address Book where other contract addresses can be found
        @param USDC The address of the USDC contract
     */
    // solhint-disable-next-line func-name-mixedcase
    function __PotionProtocolHelper_init_unchained(
        address potionLiquidityPoolManager,
        address opynAddressBook,
        address USDC
    ) internal onlyInitializing {
        __PotionProtocolOracle_init_unchained();

        _potionLiquidityPoolManager = IPotionLiquidityPool(potionLiquidityPoolManager);

        _opynAddressBook = IOpynAddressBook(opynAddressBook);

        _USDC = IERC20(USDC);
    }

    /// INTERNALS

    /**
        @notice Calculates the premium required to buy potions and the strike price denominated in USDC
        for the indicated amount of assets, the intended strike percentage and the intended slippage

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePercentage The strike percentage of the asset price as a uint256 with 
               `PercentageUtils.PERCENTAGE_DECIMALS` decimals
        @param expirationTimestamp The timestamp when the potion expires
        @param amount The amount of assets to be hedged
        @param slippage The slippage percentage to be used to calculate the premium

        @return isValid Whether the maximum premium could be calculated or not
        @return maxPremiumInUSDC The maximum premium needed to buy the potions
     */
    function _calculatePotionParameters(
        address hedgedAsset,
        uint256 strikePercentage,
        uint256 expirationTimestamp,
        uint256 amount,
        uint256 slippage
    )
        internal
        view
        returns (
            bool isValid,
            uint256 maxPremiumInUSDC,
            uint256 strikePriceInUSDC
        )
    {
        strikePriceInUSDC = _calculateStrikePrice(hedgedAsset, strikePercentage);

        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePriceInUSDC, expirationTimestamp);
        if (buyInfo.targetPotionAddress == address(0) || amount != buyInfo.totalSizeInPotions) {
            return (false, type(uint256).max, type(uint256).max);
        }

        isValid = true;
        maxPremiumInUSDC = buyInfo.expectedPremiumInUSDC.addPercentage(slippage);
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePriceInUSDC The strike price of the potion with 8 decimals
        @param expirationTimestamp The timestamp when the potion expires
        @param amount The amount of assets to be hedged
        @param slippage The slippage percentage to be used to calculate the premium

        @return actualPremium The actual premium used to buy the potions

     */
    function _buyPotions(
        address hedgedAsset,
        uint256 strikePriceInUSDC,
        uint256 expirationTimestamp,
        uint256 amount,
        uint256 slippage
    ) internal returns (uint256 actualPremium) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePriceInUSDC, expirationTimestamp);

        require(buyInfo.targetPotionAddress != address(0), "Potion buy info not found for the given asset");
        require(amount == buyInfo.totalSizeInPotions, "Insured amount greater than expected amount");

        actualPremium = _potionLiquidityPoolManager.buyPotion(
            IOpynFactory(_opynAddressBook.getOtokenFactory()),
            buyInfo,
            slippage,
            getUSDC()
        );
    }

    /**
        @notice Redeems the potions bought once the expiration timestamp is reached

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param strikePriceInUSDC The strike price of the potion with 8 decimals
        @param expirationTimestamp The timestamp when the potion expires

        @return settledAmount The amount of USDC settled after the redemption
     */
    function _redeemPotions(
        address hedgedAsset,
        uint256 strikePriceInUSDC,
        uint256 expirationTimestamp
    ) internal returns (uint256 settledAmount) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePriceInUSDC, expirationTimestamp);

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
        uint256 strikePriceInUSDC,
        uint256 expirationTimestamp
    ) internal view returns (bool) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, strikePriceInUSDC, expirationTimestamp);
        IOpynController opynController = IOpynController(_opynAddressBook.getController());
        return opynController.isPotionRedeemable(buyInfo.targetPotionAddress);
    }

    /**
        @notice Calculates the strike price of the potion given the hedged asset and the strike percentage

        @param hedgedAsset The address of the asset to be hedged, used to get the price from the Opyn Oracle
        @param strikePercentage The strike percentage of the asset price as a uint256 with 
               `PercentageUtils.PERCENTAGE_DECIMALS` decimals

        @return The strike price of the potion in USDC with 8 decimals

        @dev This function calls the Opyn Oracle to get the price of the asset, so its value might
             change if called in different blocks.
     */
    function _calculateStrikePrice(address hedgedAsset, uint256 strikePercentage) internal view returns (uint256) {
        IOpynOracle opynOracle = IOpynOracle(_opynAddressBook.getOracle());

        uint256 priceInUSDC = opynOracle.getPrice(hedgedAsset);

        return priceInUSDC.applyPercentage(strikePercentage);
    }

    /// GETTERS

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
        @notice Returns the Opyn Address Book address

        @return The address of the Opyn Address Book
     */
    function getOpynAddressBook() external view returns (IOpynAddressBook) {
        return _opynAddressBook;
    }
}
