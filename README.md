# Potion Protocol

Amazing risk management protocol!

# TODO

# contracts/core

Some tests for the core contracts have been currently modified because of an issue between `ethers.js` and `hardhat` where the revert reason emitted
by `hardhat` is not understood by `ethers.js`. The `hardhat` team is working on a fix but as of version 2.9.3 the fix is not yet available. The affected
files are:

- [CurvePricing.test.js](./contracts/core/test/CurvePricing.test.ts)
- [PotionLiquidityPool.Upgrades.test.js](./contracts/core/test/PotionLiquidityPool.Upgrades.test.ts)
