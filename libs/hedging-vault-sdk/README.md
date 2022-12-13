# Hedging Vault SDK

This is a library with common functionality for Hedging Vault implementation. It contains code used both in the front-end and in unit tests.

The purpose of this library is to collect common functionality in one place and to avoid code duplication. Also to provide a third-party with an easy way to integrate the Hedging Vault into their project.

## Repository Files

### percentageUtils.ts

Contains functions for working with percentages. It is the counterpart for the `PercentageUtils.sol` contract in the `hedging-vault` repository. It allows to convert a floating-point number percentage to a fixed-point number percentage in the format used by the Solidity contracts. And it also allows to manipulate and used these Solidity percentages in typescript.

### PRBMathUtils.ts

Contains a single function to transform a price rate into the format used by the Solidity contracts. Mainly used by the Operator page to calculate the right price rate for the Uniswap routes. It is also used in the unit tests for the `hedging-vault` repository.

### revertMessages.ts

It is an attempt at standardizing the revert messages used in the Solidity contracts. It is used in the unit tests for the `hedging-vault` repository. It only contains one revert message as of now.

### types.ts

It contains some types used in the Solidity contracts that cannot be imported from typechain. In particular it contains the `LifecycleStates` enum, that has no names in the typechain exports, and the hashed values for the different roles in the system, used by the `AccessControl` contract.

### utils.ts

Contains miscellaneous functions for parsing prices and percentages, and converting amounts based on a price rate.

### vaultCollateralization.ts

Contains the calculation for the vault collateralization aproximation. This calculation tries to solve the question of how many assets must be hedged taking into account that part of the funds must be used to pay for the premium. This is not a trivial calculation and the approach taken does a single-step iteration to approximate the result. It is used by the Operator to calculate the Potion Protocol route and by the unit tests for the `hedging-vault` repository.

### vaultEstimations.ts

Contains several calculation used in the front-end to calculate the different values that are needed for the Operator to estimate the balance that will be present in the Vault for the next round. Due to the fact that this amount will depend on the price of the hedged asset, the functions in this file try to aid the calculations by estimating different values. The functions are not integrated yet in the Operator page, but some are used in the front-end.

### exchangeInputForOutput.ts

Contains the logic and calculations to swap deposit tokens for withdrawal tokens. Those methods are used in the Hedging Vault page.
