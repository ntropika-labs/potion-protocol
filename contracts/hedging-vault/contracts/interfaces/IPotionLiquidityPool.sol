/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./ICurveManager.sol";
import "./ICriteriaManager.sol";

import "./IOtoken.sol";

// TODO: Add a description of the interface
interface IPotionLiquidityPool {
    /*
        @notice The details of a given counterparty that will be used to buy a potion

        @custom:member lp The LP to buy from
        @custom:member poolId The pool (belonging to LP) that will colalteralize the otoken
        @custom:member curve The curve used to calculate the otoken premium
        @custom:member criteria The criteria associated with this curve, which matches the otoken
        @custom:member orderSizeInOtokens The number of otokens to buy from this particular counterparty
    */
    struct CounterpartyDetails {
        address lp; // The LP to buy from
        uint256 poolId; // The pool (belonging to LP) that will colalteralize the otoken
        ICurveManager.Curve curve; // The curve used to calculate the otoken premium
        ICriteriaManager.Criteria criteria; // The criteria associated with this curve, which matches the otoken
        uint256 orderSizeInOtokens; // The number of otokens to buy from this particular counterparty
    }

    /**
       @notice Buy a OTokens from the specified list of sellers.
       
       @param _otoken The identifier (address) of the OTokens being bought.
       @param _sellers The LPs to buy the new OTokens from. These LPs will charge a premium to collateralize the otoken.
       @param _maxPremium The maximum premium that the buyer is willing to pay, denominated in collateral tokens (wei) and aggregated across all sellers
       
       @return premium The aggregated premium paid.
     */
    function buyOtokens(
        IOtoken _otoken,
        CounterpartyDetails[] memory _sellers,
        uint256 _maxPremium
    ) external returns (uint256 premium);

    /**
        @notice Creates a new otoken, and then buy it from the specified list of sellers.
     
        @param underlyingAsset A property of the otoken that is to be created.
        @param strikeAsset A property of the otoken that is to be created.
        @param collateralAsset A property of the otoken that is to be created.
        @param strikePrice A property of the otoken that is to be created.
        @param expiry A property of the otoken that is to be created.
        @param isPut A property of the otoken that is to be created.
        @param sellers The LPs to buy the new otokens from. These LPs will charge a premium to collateralize the otoken.
        @param maxPremium The maximum premium that the buyer is willing to pay, denominated in collateral tokens (wei) and aggregated across all sellers
        
        @return premium The total premium paid.
     */
    function createAndBuyOtokens(
        address underlyingAsset,
        address strikeAsset,
        address collateralAsset,
        uint256 strikePrice,
        uint256 expiry,
        bool isPut,
        CounterpartyDetails[] memory sellers,
        uint256 maxPremium
    ) external returns (uint256 premium);

    /**
       @notice Retrieve unused collateral from Opyn into this contract. Does not redistribute it to our (unbounded number of) LPs.
               Redistribution can be done by calling redistributeSettlement(addresses).

       @param _otoken The identifier (address) of the expired OToken for which unused collateral should be retrieved.
     */
    function settleAfterExpiry(IOtoken _otoken) external;

    /**
        @notice Get the ID of the existing Opyn vault that Potion uses to collateralize a given OToken.
        
        @param _otoken The identifier (token contract address) of the OToken. Not checked for validity in this view function.
        
        @return The unique ID of the vault, > 0. If no vault exists, the returned value will be 0
     */
    function getVaultId(IOtoken _otoken) external view returns (uint256);
}
