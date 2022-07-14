/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.14;

import "../../library/PercentageUtils.sol";

/**
    @title TestWrapperPercentageUtils

    @author Roberto Cano <robercano>
    
    @notice Test wrapper for the PercentageUtils library. This wrapper exposes
    all internal functions as external. This allows to unit test the library in isolation.
 */
contract TestWrapperPercentageUtils {
    uint256 public PERCENTAGE_DECIMALS = PercentageUtils.PERCENTAGE_DECIMALS;
    uint256 public PERCENTAGE_FACTOR = PercentageUtils.PERCENTAGE_FACTOR;
    uint256 public PERCENTAGE_100 = PercentageUtils.PERCENTAGE_100;

    /**
        @notice See { PercentageUtils }
     */
    function addPercentage(uint256 amount, uint256 percentage) external pure returns (uint256) {
        return PercentageUtils.addPercentage(amount, percentage);
    }

    /**
        @notice See { PercentageUtils }
     */
    function substractPercentage(uint256 amount, uint256 percentage) external pure returns (uint256) {
        return PercentageUtils.substractPercentage(amount, percentage);
    }

    /**
        @notice See { PercentageUtils }
     */
    function applyPercentage(uint256 amount, uint256 percentage) external pure returns (uint256) {
        return PercentageUtils.applyPercentage(amount, percentage);
    }

    /**
        @notice See { PercentageUtils }
     */
    function isPercentageInRange(uint256 percentage) external pure returns (bool) {
        return PercentageUtils.isPercentageInRange(percentage);
    }
}
