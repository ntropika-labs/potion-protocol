/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { PotionProtocolOracleUpgradeable } from "./PotionProtocolOracleUpgradeable.sol";
import "../../library/PotionProtocolLib.sol";
import "../../library/PercentageUtils.sol";
import "../../library/OpynProtocolLib.sol";
import "../../library/PriceUtils.sol";
import { IPotionLiquidityPool } from "../../interfaces/IPotionLiquidityPool.sol";
import { IOpynAddressBook } from "../../interfaces/IOpynAddressBook.sol";
import { IOpynController } from "../../interfaces/IOpynController.sol";
import { IOpynFactory } from "../../interfaces/IOpynFactory.sol";
import { IOpynOracle } from "../../interfaces/IOpynOracle.sol";
import { IERC20MetadataUpgradeable as IERC20Metadata } from "@openzeppelin/contracts-upgradeable-4.7.3/interfaces/IERC20MetadataUpgradeable.sol";

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
    using OpynProtocolLib for IOpynFactory;
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
    /* solhint-disable-next-line func-name-mixedcase */
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
        @notice Checks if there is a Potion information for the given asset and expiration timestamp

        @param hedgedAsset The address used to get the Potion info
        @param expirationTimestamp The expiration timestamp used to get the Potion info

        @return true if the potion info exists, false otherwise

        @dev The user of this contracts MUST make sure that this function is called before all of the
        other functions that use the potion info, as the check is not present in the other functions
    */
    function _hasPotionInfo(address hedgedAsset, uint256 expirationTimestamp) internal view returns (bool) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        return buyInfo.targetPotionAddress != address(0);
    }

    /**
        @notice Calculates the maximum premium required to buy potions and the strike price denominated in USDC
        for the indicated amount of assets by applying the indicated slippage

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param expirationTimestamp The timestamp when the potion expires
        @param slippage The slippage percentage to be used to calculate the premium

        @return The expected premium in USDC plus slippage
     */
    function _calculatePremiumWithSlippage(
        address hedgedAsset,
        uint256 expirationTimestamp,
        uint256 slippage
    ) internal view returns (uint256) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        return buyInfo.expectedPremiumInUSDC.addPercentage(slippage);
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param expirationTimestamp The timestamp when the potion expires
        @param premiumWithSlippageInUSDC The premium to be paid to buy the potions plus slippage, with 6 decimals

        @return amountPotionsInAssets The amount of potions bought, with `hedgedAsset` decimals
        @return actualPremiumInUSDC The actual premium used to buy the potions
     */
    function _buyPotions(
        address hedgedAsset,
        uint256 expirationTimestamp,
        uint256 premiumWithSlippageInUSDC
    ) internal returns (uint256 amountPotionsInAssets, uint256 actualPremiumInUSDC) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);

        actualPremiumInUSDC = _potionLiquidityPoolManager.buyPotion(
            IOpynFactory(_opynAddressBook.getOtokenFactory()),
            hedgedAsset,
            buyInfo.strikePriceInUSDC,
            expirationTimestamp,
            premiumWithSlippageInUSDC,
            buyInfo.targetPotionAddress,
            buyInfo.sellers,
            getUSDC()
        );

        uint256 hedgedAssetDecimals = IERC20Metadata(hedgedAsset).decimals();

        amountPotionsInAssets = PriceUtils.convertAmount(
            PotionProtocolLib.OTOKEN_DECIMALS,
            hedgedAssetDecimals,
            _calculateOrderSize(buyInfo),
            1,
            1
        );
    }

    /**
        @notice Redeems the potions bought once the expiration timestamp is reached

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param expirationTimestamp The timestamp when the potion expires

        @return The amount of USDC settled after the redemption
     */
    function _redeemPotions(address hedgedAsset, uint256 expirationTimestamp) internal returns (uint256) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        IOpynController opynController = IOpynController(_opynAddressBook.getController());

        (bool isPayoutFinal, uint256 settledAmount, uint256 orderSize) = _calculateCurrentPayout(
            hedgedAsset,
            expirationTimestamp
        );

        require(isPayoutFinal, "Potion cannot be redeemed yet");

        _potionLiquidityPoolManager.settlePotion(buyInfo);

        if (settledAmount > 0) {
            _potionLiquidityPoolManager.redeemPotion(opynController, buyInfo.targetPotionAddress, orderSize);
        }

        return settledAmount;
    }

    /**
        @notice Calculates the order size from the given Potion buy info

        @param buyInfo The information containing the list of sellers used to calculate the order size

        @return orderSize The order size in Otoken decimals (8 decimals)
    */
    function _calculateOrderSize(PotionBuyInfo memory buyInfo) internal pure returns (uint256 orderSize) {
        // The length of the sellers array is controlled by the operator. It should not be too long to avoid
        // running out of gas. As of this version the operator is considered a trusted party and assumed to
        // provide high quality data
        for (uint256 i = 0; i < buyInfo.sellers.length; i++) {
            orderSize += buyInfo.sellers[i].orderSizeInOtokens;
        }
    }

    /**
        @notice Checks if the potion for the given asset can be redeemed already

        @param hedgedAsset The address of the hedged asset related to the potion to be redeemed
        @param expirationTimestamp The timestamp when the potion expires

        @return Whether the potion can be redeemed or not
     */
    function _isPotionBought(address hedgedAsset, uint256 expirationTimestamp) internal view returns (bool) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        IOpynFactory opynFactory = IOpynFactory(_opynAddressBook.getOtokenFactory());

        uint256 otokenBalance = opynFactory.getOtokenBalance(
            hedgedAsset,
            buyInfo.strikePriceInUSDC,
            expirationTimestamp,
            _USDC,
            address(this)
        );

        return otokenBalance > 0;
    }

    /**
        @notice Checks if the potion for the given asset can be redeemed already

        @param hedgedAsset The address of the hedged asset related to the potion to be redeemed
        @param expirationTimestamp The timestamp when the potion expires

        @return Whether the potion can be redeemed or not
     */
    function _isPotionRedeemable(address hedgedAsset, uint256 expirationTimestamp) internal view returns (bool) {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        IOpynController opynController = IOpynController(_opynAddressBook.getController());
        return opynController.isPotionRedeemable(buyInfo.targetPotionAddress);
    }

    /// GETTERS

    /**
        @notice Returns the calculated payout for the current block, and whether that payout is final or not

        @param hedgedAsset The address of the asset to be hedged, used to get the associated potion information
        @param expirationTimestamp The timestamp when the potion expires

        @return isFinal Whether the payout is final or not. If the payout is final it won't change anymore. If it
                is not final it means that the potion has not expired yet and the payout may change in the future.
    */
    function _calculateCurrentPayout(address hedgedAsset, uint256 expirationTimestamp)
        internal
        view
        returns (
            bool isFinal,
            uint256 payout,
            uint256 orderSize
        )
    {
        PotionBuyInfo memory buyInfo = getPotionBuyInfo(hedgedAsset, expirationTimestamp);
        IOpynController opynController = IOpynController(_opynAddressBook.getController());

        isFinal = _isPotionRedeemable(hedgedAsset, expirationTimestamp);
        orderSize = _calculateOrderSize(buyInfo);

        // TODO: this call can revert if the potion is not redeemable yet. We should handle this case
        payout = PotionProtocolLib.getPayout(opynController, buyInfo.targetPotionAddress, orderSize);
    }

    /// GETTERS

    /**
        @notice Converts the given amount of assets to USDC by using the live price from the Opyn oracle

        @param hedgedAsset The address of the asset to be hedged, used to get the price from the Opyn Oracle
        @param amountInAsset The amount of asset to be converted to USDC, in `hedgedAsset` decimals

        @return amountInUSDC The amount of USDC equivalent to the given amount of assets, with 6 decimals

        @dev This function calls the Opyn Oracle to get the price of the asset, so its value might
             change if called in different blocks.
     */
    function _convertAssetToUSDCOnLivePrice(address hedgedAsset, uint256 amountInAsset)
        internal
        view
        returns (uint256 amountInUSDC)
    {
        IOpynOracle opynOracle = IOpynOracle(_opynAddressBook.getOracle());

        uint256 assetPriceInUSD = opynOracle.getPrice(address(hedgedAsset));
        uint256 USDCPriceInUSD = opynOracle.getPrice(address(_USDC));

        uint256 hedgedAssetDecimals = IERC20Metadata(hedgedAsset).decimals();
        uint256 USDCDecimals = IERC20Metadata(address(_USDC)).decimals();

        amountInUSDC = PriceUtils.convertAmount(
            hedgedAssetDecimals,
            USDCDecimals,
            amountInAsset,
            assetPriceInUSD,
            USDCPriceInUSD
        );
    }

    /**
        @notice Converts the given amount of USDC into the equivalent amount of assets by using the live price from the Opyn oracle

        @param hedgedAsset The address of the asset to be hedged, used to get the price from the Opyn Oracle
        @param amountInUSDC The amount in USDC to be converted to the equivalent amount of assets, with 6 decimals

        @return amountInAsset The amount of assets equivalent to the given amount of USDC, in `hedgedAsset` decimals

        @dev This function calls the Opyn Oracle to get the price of the asset, so its value might
             change if called in different blocks.
     */

    function _convertUSDCToAssetOnLivePrice(address hedgedAsset, uint256 amountInUSDC)
        internal
        view
        returns (uint256 amountInAsset)
    {
        IOpynOracle opynOracle = IOpynOracle(_opynAddressBook.getOracle());

        uint256 assetPriceInUSD = opynOracle.getPrice(address(hedgedAsset));
        uint256 USDCPriceInUSD = opynOracle.getPrice(address(_USDC));

        uint256 hedgedAssetDecimals = IERC20Metadata(hedgedAsset).decimals();
        uint256 USDCDecimals = IERC20Metadata(address(_USDC)).decimals();

        amountInAsset = PriceUtils.convertAmount(
            USDCDecimals,
            hedgedAssetDecimals,
            amountInUSDC,
            USDCPriceInUSD,
            assetPriceInUSD
        );
    }

    /**
        @notice Returns the USDC address configured in the contract

        @return The address of the USDC contract
     */
    function getUSDC() public view returns (IERC20) {
        return _USDC;
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
