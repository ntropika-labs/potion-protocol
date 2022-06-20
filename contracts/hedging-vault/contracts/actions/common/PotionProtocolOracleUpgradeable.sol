/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../common/RolesManagerUpgradeable.sol";

import { OtokenInterface } from "../../interfaces/IOtoken.sol";
import { IPotionLiquidityPool } from "../../interfaces/IPotionLiquidityPool.sol";

/**
    @title PotionProtocolOracleUpgradeable

    @notice Oracle contract for the Potion Protocol potion buy. It takes care of holding the information
    about the counterparties that will be used to buy a particular potion (otoken) with a maximum allowed
    premium

    @dev It is very basic and it just aims to abstract the idea of an Oracle into a separate contract
    but it is still very coupled with PotionProtocolHelperUpgradeable

    @dev It inherits from the RolesManagerUpgradeable contract to scope the parameters setting
    functions for only the Keeper role.

    @dev It does not initialize the RolesManagerUpgradeable as that is a contract that is shared
    among several other contracts of the Action. The initialization will happen in the Action contract

 */
contract PotionProtocolOracleUpgradeable is RolesManagerUpgradeable {
    /**
        @notice The information required to buy a specific otoken with a specific maximum premium requirement

        @custom:member otoken The address of the otoken to buy
        @custom:member counterpartyDetails The list of liquidity providers that will be used to buy the otoken
        @custom:member maxPremium The maximum allowed premium for the otoken buy
        @custom:member totalSizeInOtokens The total number of otokens to buy using the given sellers list
     */
    struct PotionBuyInfo {
        OtokenInterface otoken;
        IPotionLiquidityPool.CounterpartyDetails[] sellers;
        uint256 maxPremium;
        uint256 totalSizeInOtokens;
    }

    /**
        @notice Information on the buy of an OToken 

        @dev otoken => PotionBuyInfo
    */
    mapping(OtokenInterface => PotionBuyInfo) private _potionBuyInfo;

    /// UPGRADEABLE INITIALIZERS

    /**
        @notice This does not chain the initialization to the parent contract.
        Also this contract does not need to initialize anything itself.
     */
    // solhint-disable-next-line func-name-mixedcase, no-empty-blocks
    function __PotionProtocolOracle_init_unchained() internal onlyInitializing {
        // Empty on purpose
    }

    /// FUNCTIONS

    /**
        @notice Sets the potion buy information for a specific otoken

        @param info The swap information for the pair

        @dev Only the Keeper role can call this function

        @dev See { PotionBuyInfo }
     */
    function setSwapInfo(PotionBuyInfo calldata info) external onlyKeeper {
        _potionBuyInfo[info.otoken] = info;
    }

    /**
        @notice Gets the potion buy information for a given OToken

        @param otoken The address of the otoken to buy from

        @return The Potion Buy information for the given otoken

     */
    function getSwapInfo(OtokenInterface otoken) public view returns (PotionBuyInfo memory) {
        return _potionBuyInfo[otoken];
    }
}
