/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import { PotionProtocolOracleUpgradeable } from "./PotionProtocolOracleUpgradeable.sol";
import "../../library/PotionProtocolLib.sol";
import { IPotionLiquidityPool } from "../../interfaces/IPotionLiquidityPool.sol";

import "@openzeppelin/contracts/interfaces/IERC20.sol";

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

    /**
        @notice The address of the Potion Protocol liquidity pool manager
     */
    IPotionLiquidityPool private _potionLiquidityPoolManager;

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
     */
    // solhint-disable-next-line func-name-mixedcase
    function __PotionProtocolHelper_init_unchained(address potionLiquidityPoolManager, address USDC)
        internal
        onlyInitializing
    {
        __PotionProtocolOracle_init_unchained();

        _potionLiquidityPoolManager = IPotionLiquidityPool(potionLiquidityPoolManager);

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

        actualPremium = _potionLiquidityPoolManager._buyPotions(
            potion,
            buyInfo.sellers,
            buyInfo.expectedPremium,
            slippage
        );
    }

    /**
        @notice Buys potions from the Potion Protocol to insure the specific amount of assets
     */
    function _redeemPotions(address hedgedAsset) internal returns (uint256 settledAmount) {
        address potion = getPotion(hedgedAsset);
        uint256 prevUSDCBalance = getUSDCBalance(address(this));

        _potionLiquidityPoolManager._redeemPotions(potion);

        settledAmount = getUSDCBalance(address(this)) - prevUSDCBalance;
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
}
