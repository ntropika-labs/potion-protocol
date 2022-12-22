# HV Operator

The hedging vault operator is the account in charge of supplying and reviewing the information required to keep the vault running. His/her main task is issuing the commands to allow the vault to enter the next round which in turn keeps protecting the principal deposited into the vault.

You can read more about the hedging vault implementation in the documents available in the repo.

**DISCLAIMER: the operator page is still much a work in progress**

## Requirements

The hedging vault is configured to grant the operator role **only to a specific address** that can be supplied using the `operatorAddress` field in [Deploy config](../contracts/hedging-vault/scripts/config/deployConfig.ts). If not explicitly supplied the `operatorAddress` will default to the admin address which is the deployer itself.

Before being able to proceed to the next round we need to meet a specific condition on time, this is due to how the protocol works.Behind the scenes the vaults insures the total principal by purchasing option tokens in the form of potions with a duration equal to the cycle duration set for the vault. Thus before being able to proceed to the next round we need to wait at least until the current cycle completes, which is in turn when the potions expire.The vaults user page displays prominenty the countdown until the next round and when expired it will display the message `Next cycle will start soon`.

## Goal

The operator is the only account in charge of **moving the vault forward to the next round**. The task comprises of two different actions:

1. Loading data required for the contracts to complete the operation
2. Reviewing the data for correctness
3. Submitting the data to the contracts to actually enter the next round

These operations can all be accomplished from the operator page available within the DApp.

## Quick Start

To be able to test the app locally you will first need to setup and spin up your development environment. Please refer to [Quick Start](../README.md#quick-start) or [Setup Instructions](../setup_instructions.md) for how to do so.

**If you are not using a development environment substitute the domain you deployed the DApp on to each occurence of `localhost:5173`**

1. Navigate to the Discover Hedging Vaults page `localhost:5173/hedging-vaults`
2. Select the vault you want to operate on. If you already deposited at least once for this vault, the vault will appear in the "My Vaults" section.
3. Navigate to the vault page by clicking the corresponding card
4. Ensure that the time to next cycle is expired. You can check the value in the top header for the vault user page or from the operator page in the `time until next cycle` field.
5. Append `/operator` at the end of the url in the address bar and navigate to that page.

   Eg: If the current url is `localhost:5173/hedging-vaults/0xfcDA1542A74064CcFa4D7392879B9EbC5b4880F7` it becomes `localhost:5173/hedging-vaults/0xfcDA1542A74064CcFa4D7392879B9EbC5b4880F7/operator`

6. From the vault operator page click the `Load Data` button to load data required to enter the next round
7. Review the data. The information in split between two tabs:
   - `Enter position`: displays the info required to enter the next round. These comprise of a list of counterparties and a uniswap route to exchange assets for USDC to pay for the potion premium.
   - `Exit position`: displays the info required to exit the current round (if any). these comprise of the uniswap route to exchange to current payout to the underlying used by the vault.
8. Click the `Enter next round` button to start the operator
9. Confirm the transaction
10. In case you are operating locally:
    - to be able to proceed to the next round you will need to settle the option and eventually set the price for the oracles. Once you entered the round, the correct command will be displayed in the top section of the page (if you don't see the command try refreshing the page). *If the command is not displaying it means a potion was not purchased and the PotionBuyAction strategy has failed*.
    - to complete a round you will need to way for until the current cycle completes ( base on `cycle duration`), or you can fast forward the chain time using the commands in the top left bar

## Debug info

To be able to review the underlying operations executed while issuing the command to enter the next round, the operator page shows a bunch of debug information:

- `total deposit`: The total amount of assets deposited for the vault in use. This comprises deposits from all accounts that interacted with the selected vault.
- `total withdraw`: The total amount of assets withdrawn for the vault in use. This comprises withdrawals from all accounts that interacted with the selected vault.
- `spot price at round end`: Spot price of the asset for the vault.
- `potion initial premium (1st run)`: The premium calculated over the total hedged amount (including the premium we are going to pay for the potions which is not going to be hedged)
- `potion estimated premium (2nd run)`: The actual premium we are going to pay over the actual order size
- `order size`: The actual order size expressed in otokens
- `action balance (und)`: The underlying balance for the `PotionBuyAction` strategy
- `action balance (usdc)`: The USDC balance for the `PotionBuyAction`
- A block of pre-formatted code showing values used for computations
- A block of pre-formatted code showing the expected hedging rate, the hedging rate slippage and the actual hedging rate.

## Development

The main entry point for the operator is the [operator page](../apps/potion-dapp/src/views/Vault/VaultOperator.vue). The page is in charge of loading all main components used while performing operations:

- `useInvestmentVaultContract`: initializes the `InvestmentVault` contract to fetch: - `vaultStatus`: the current vault status, which indicates if the vault is initialized or is still unlocked - `totalSupply`: the total number of shares available in the `InvestmentVault` - `totalShares`: the total number of shares available in the `RoundsOutputVault`
- `useHedgingVaultOrchestratorContract`: initializes the `HedgingVaultOrchestrator` contract which exposes: - the method `enterNextRound` to enter the next round - `canEnterNextRound`: a flag to signal if we are allowed to enter the next round
- `usePotionBuyActionContract`: initializes the `PotionBuyAction` strategy, which is the strategy used by all vaults to insure the principal. The contract exposes all info related to the strategy configuration and the actual status (like the current payout and the next cycle timestamp)
- `useVaultOperatorEnterPosition`: is in charge of loading the actual data used to enter the next round and . Behind the scenes the composable will calculate the actual principal to hedge and load the required info from the potion depth router and the uniswap alpha router.The composable converts the data to a flat object to be able to display the info to the user before encoding the values in the format required by contracts.
- `useVaultOperatorExitPosition`: is in charge of loading the actual data used to exit the current round. Behind the scenes the composable will load the required info from the uniswap alpha router to convert the payout to underlying tokens.The composable converts the data to a flat object to be able to display the info to the user before encoding the values in the format required by contracts.

**In a local or testnet environment the uniswap alpha router is mocked**

## Mocked utilities

We developed contract and front-end utilities to replicate some functionalities of the DApp in a local/staging environment without the burden that come with them. The [Vite config file](../apps/potion-dapp/vite.config.ts) handles replacing the actual files with the mocked implementation at compilation time and offers the ability to further customize this behavior.

### Mocking uniswap router

The uniswap alpha router implemented [here](../apps/potion-dapp/src/helpers/premiumSwapRouter.ts) is only required in a production environment. In a test/staging environment where we have much more control over the assets and the oracles we don't need to hit the router (and wait until it loads the route). Thus we developed [mockedPremiumswapRouter](../apps/potion-dapp/src/helpers/mockedPremiumSwapRouter.ts) which handles the calls to the uniswap router and stores a reference to a flat object containing the minimum amount of info required to complete the operations.

**It's also possible to enable the uniswap alpha router in a local/staging environment by commenting out the alias for `@premium-swap-router` in the vite config file. This setup depends on [mockedVaultOperatorUtils](../apps/potion-dapp/src/helpers/mockedVaultOperatorUtils.ts)**

### Mocking the operator utils

The [vaultOperatorUtils](../apps/potion-dapp/src/helpers/vaultOperatorUtils.ts) isolates some variables in a separate file to be able to mock those. The file contains the actual data used in a production environment, while the [mockedVaultOperatorUtils](../apps/potion-dapp/src/helpers/mockedVaultOperatorUtils.ts) contains the values we set in a local/staging environment.

## Edge cases

- _Running out of liquidity for the pools_
  In case we don't have pools with enough liquidity for the underlying asset of the vault, we might incur in an error caused by the inability to purchase potions for the asset.
- _Fast forwarding time_
  To be able to enter the next round we need to first meet the next cycle timestamp deadline, this means advancing the chain time in a local environment or wait until the deadline in a production/staging environment.
