/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

// TODO: Add a description of the interface
interface ICriteriaManager {
    struct Criteria {
        address underlyingAsset;
        address strikeAsset;
        bool isPut;
        uint256 maxStrikePercent;
        uint256 maxDurationInDays; // Must be > 0 for valid criteria. Doubles as existence flag.
    }
}
