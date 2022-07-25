import { IPotionLiquidityPool } from "../../typechain";
import { HyperbolicCurve } from "contracts-math";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

export function calculatePremium(
    pool: IPotionLiquidityPool.PoolOfCapitalStructOutput,
    curve: HyperbolicCurve,
    deltaX: BigNumber,
): BigNumber {
    const currentLockedAmount = pool.locked.toNumber();
    const currentTotalAmount = pool.total.toNumber();
    const delta = deltaX.toNumber();

    const newLockedAmount = currentLockedAmount + delta;

    const newPremium = newLockedAmount * curve.evalAt(newLockedAmount / currentTotalAmount);
    const previousPremium = currentLockedAmount * curve.evalAt(currentLockedAmount / currentTotalAmount);

    return BigNumber.from(Math.floor(newPremium - previousPremium));
}
