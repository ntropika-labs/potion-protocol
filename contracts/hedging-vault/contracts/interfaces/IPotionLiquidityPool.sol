/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "./ICurveManager.sol";
import "./ICriteriaManager.sol";

import "./IOtoken.sol";

interface IPotionLiquidityPool {
    struct CounterpartyDetails {
        address lp; // The LP to buy from
        uint256 poolId; // The pool (belonging to LP) that will colalteralize the otoken
        ICurveManager.Curve curve; // The curve used to calculate the otoken premium
        ICriteriaManager.Criteria criteria; // The criteria associated with this curve, which matches the otoken
        uint256 orderSizeInOtokens; // The number of otokens to buy from this particular counterparty
    }

    function buyOtokens(
        IOtoken _otoken,
        CounterpartyDetails[] memory _sellers,
        uint256 _maxPremium
    ) external returns (uint256 premium);

    function settleAfterExpiry(IOtoken _otoken) external;
}
