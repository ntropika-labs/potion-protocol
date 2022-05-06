# Potion Subgraph

This subgraph tracks changes Pools, Curves, Criterias, and oTokens, with data aggregated to the pool level. The data stored in the subgraph tracks actions like the following:

- Liquidity deposits / withdraws from individual pools
- Pools changing curves
- Pools changing criteria sets
- Option purchase and exercise by users from pools
- Settlement and distibution of capital after expiry of an option.


## Requirements

The following binaries are required to run the subgraph

- `yarn`
- `docker`
- `jq`

The following binaries are required to run the test suite

- `postgre`

## Running Locally

This is designed to be ran within the `potion-protocol` repository. `yarn prepare` looks for the relative import of json files located in `contracts/core/deployments` to find the deployed address of contracts.

There are instructions in [the potion-protocol README](../../README.md) on how to mock all of the data, including running the dockerized [graph-node](https://github.com/graphprotocol/graph-node).

Once the `graph-node` is launched and running locally at `http://localhost:8020`, use the commands `yarn prepare-ganache && yarn build-deploy` to deploy the potion-subgraph.
To launch the entire stack with just one command instead run `yarn local-env`.

Example Queries: [docs/schemas.md](docs/schemas.md)

## Deploy

## Deploy on hosted service

First log in to https://thegraph.com/hosted-service/dashboard and create yourself a subgraph. Once you have a subgraph you should see an "access token" in the top-center.

1. Ensure you have the correct config in subgraph.yaml. E.g. run `yarn prepare-kovan` or `yarn prepare-kovan-independent`
2. Authenticate the CLI: `yarn auth-hosted <your access token>`
3. Build the subgraph: `yarn codegen && yarn build`
4. Deploy the subgraph: `yarn deploy-hosted <your subgraph name>`. You will need to specify a version number.

## Deploy on graph studio

First log in to https://thegraph.com/studio/ and create yourself a subgraph. Once you have a subgraph you should see a "deploy key" in the top-right.

N.B. Never "Publish" your subgraph if it's only intended for testing!

1. Ensure you have the correct config in subgraph.yaml. E.g. run `yarn prepare-mainnet`
2. Authenticate the CLI: `yarn auth-studio <your deploy key>`
3. Build the subgraph: `yarn codegen && yarn build`
4. Deploy the subgraph: `yarn deploy-studio <your subgraph name>`. You will need to specify a version number.

## Entity Documentation

Visit [docs/schemas.md](docs/schemas.md)

## Running tests

Remember to run the `codegen` before `unit-test`

