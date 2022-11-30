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
        address lp;
        uint256 poolId;
        ICurveManager.Curve curve;
        ICriteriaManager.Criteria criteria;
        uint256 orderSizeInOtokens;
    }

    /**
        @notice The data associated with a given pool of capital, belonging to one LP

        @custom:member total The total (locked or unlocked) of capital in the pool, denominated in collateral tokens
        @custom:member locked The amount of locked capital in the pool, denominated in collateral tokens
        @custom:member curveHash Identifies the curve to use when pricing the premiums charged for any otokens
                                 sold (& collateralizated) by this pool
        @custom:member criteriaSetHash Identifies the set of otokens that this pool is willing to sell (& collateralize)
    */
    struct PoolOfCapital {
        uint256 total;
        uint256 locked;
        bytes32 curveHash;
        bytes32 criteriaSetHash;
    }

    /**
        @notice The keys required to identify a given pool of capital in the lpPools map.

        @custom:member lp The LP that owns the pool
        @custom:member poolId The ID of the pool
    */
    struct PoolIdentifier {
        address lp;
        uint256 poolId;
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
       @notice Retrieve unused collateral from Opyn, and redistribute it to the specified LPs.
       
       @param _otoken The identifier (address) of the expired otoken for which unused collateral should be retrieved.
       @param _pools The pools of capital to which the collateral should be redistributed. These pools must be (a subset of) the pools that provided collateral for the specified otoken.
     */
    function settleAndRedistributeSettlement(IOtoken _otoken, PoolIdentifier[] calldata _pools) external;

    /**
        @notice Get the ID of the existing Opyn vault that Potion uses to collateralize a given OToken.
        
        @param _otoken The identifier (token contract address) of the OToken. Not checked for validity in this view function.
        
        @return The unique ID of the vault, > 0. If no vault exists, the returned value will be 0
     */
    function getVaultId(IOtoken _otoken) external view returns (uint256);

    /**
        @dev Returns the data about the pools of capital, indexed first by LP
             address and then by an (arbitrary) numeric poolId

        @param lpAddress The address of the LP that owns the pool
        @param poolId The ID of the pool owned by the LP

        @return The data about the pool of capital
    */
    function lpPools(address lpAddress, uint256 poolId) external view returns (PoolOfCapital memory);
}
