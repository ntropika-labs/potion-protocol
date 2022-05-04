// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.4;

import { PotionLiquidityPool } from "../PotionLiquidityPool.sol";

contract PotionLiquidityPoolUpgradeTest is PotionLiquidityPool {
    uint256 public upgradeTestVal;

    function setUpgradeTestVal(uint256 _v) public {
        upgradeTestVal = _v;
    }
}
