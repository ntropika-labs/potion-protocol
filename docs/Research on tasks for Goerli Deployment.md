# Research on tasks for Goerli Deployment

# Potion Protocol

- Supports defining any number of custom underlying tokens
- Only exports the first underlying token as `SampleUnderlyingToken`. The rest of the underlying tokens are not exported in the package `index.ts`. This means that the Hedging Vault only has access to a single underlying token (the first one)
- Whitelisting of products in independent Opyn is already done when deploying the custom underlying
- Goerli is already supported in the contracts deployment scripts

## Opyn

- Does NOT seem to have a Goerli deployment, Opyn team has been asked about it, waiting for an answer
    - Opyn team say they will deploy in Goerli by the end of the week of the 22nd of August
- The Opyn Oracle price feed can be configured in such a way that we could deploy a custom asset and associate whatever Chainlink price feed we want. This allows us to deploy a fake WETH and then use the real WETH price feed from Chainlink

## Chainlink

- Chainlink price feeds are available in Goerli, but just some of them
- The list of price feeds can be found here: [Price Feeds](https://docs.chain.link/docs/ethereum-addresses/#Goerli%20Testnet)

## Uniswap

- Uniswap is also deployed in Goerli, the deployment addresses are the same ones as in Mainnet and can be found here: [Uniswap Deployment Addresses](https://docs.uniswap.org/protocol/reference/deployments)
- Uniswap has available the app interface for Goerli and custom tokens can be added to it, so it seems sensible to add liquidity directly through the interface for our Hedging Vault deployment. Automating it would be a huge investment and doesn’t have much value for us

## The Graph

- Hosted service already supports Goerli
- Decentralized service currently has Goerli support in beta testing for indexers, it will probably be available for deployments in the next months

# App changes

- Remove Kovan and add Goerli as a compatible network for Onboard: `apps/potion-dapp/src/helpers/onboard.ts`;
- Create a Goerli tokenlist in `libs/potion-tokenlist/src/goerli.json`
- Coingecko doesn’t support Goerli and custom tokens. We need a way to get prices. Maybe from the oracle?

# How to test

This takes into account that we deploy a custom collateral token (PotionUSDC?) and we are in control of it - we can mint and transfer it between us.

To test redeemable/claimable/withdrawable Potions, we can create a Pool with a 200% max strike price and a very high premium curve, buy a 1day Potion and wait for it to expire.

## How to obtain USDC/WETH

We can create a custom pool on Goerli Uniswap with PotionUSDC/ETH and WETH/ETH, so people can get collateral tokens and underlying tokens for the Hedging Vault.