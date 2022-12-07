# Potion Subgraph (Hedging Vault)

This subgraph tracks changes Investment Vaults, Rounds, Deposits and Withdrawals, with data aggregated to the vault level. The data stored in the subgraph tracks actions like the following:

- changes in the PotionBuyAction strategy configuration
- start and end of rounds with shares computation
- user deposit requests
- user withdrawal requests

## Requirements

The following binaries are required to run the subgraph

- `yarn`
- `docker`

The following binaries are required to run the test suite

- `postgre`

## Running Locally

This is designed to be ran within the `potion-protocol` repository. It requires the multivault deployment setup, for more informations check the dedicated [README](../../scripts/multivault-helpers/README.md).

There are instructions in [the potion-protocol README](../../README.md) on how to mock all of the data, including running the dockerized [graph-node](https://github.com/graphprotocol/graph-node).

Once the `graph-node` is launched and running locally at `http://localhost:8020`, use the commands `yarn codegen && yarn-deploy-local` to deploy the subgraph.
To launch the entire stack with just one command instead check the helpers script in [the potion-protocol README](../../README.md).

## Deploy

## Deploy on hosted service

First log in to https://thegraph.com/hosted-service/dashboard and create yourself a subgraph. Once you have a subgraph you should see an "access token" in the top-center.

1. Ensure you have the correct config in subgraph.yaml. Check the [multivault-helpers](../../scripts/multivault-helpers/README.md) for more informations.
2. Authenticate the CLI: `yarn auth-hosted <your access token>`
3. Build the subgraph: `yarn codegen && yarn build`
4. Deploy the subgraph: `yarn deploy-hosted <your subgraph name>`.

## Deploy on graph studio

First log in to https://thegraph.com/studio/ and create yourself a subgraph. Once you have a subgraph you should see a "deploy key" in the top-right.

N.B. Never "Publish" your subgraph if it's only intended for testing!

1. Ensure you have the correct config in subgraph.yaml. Check the [multivault-helpers](../../scripts/multivault-helpers/README.md) for more informations.
2. Authenticate the CLI: `yarn auth-studio <your deploy key>`
3. Build the subgraph: `yarn codegen && yarn build`
4. Deploy the subgraph: `yarn deploy-studio <your subgraph name>`. You will need to specify a version number.

## Entity Documentation

Visit [docs/schema.md](docs/schema.md)

## Querying the Subgraph

The entities below can be queried locally viewing the explorer at: [http://localhost:8000/subgraphs/name/potion-subgraph-hv/graphql](http://localhost:8000/subgraphs/name/potion-subgraph-hv/graphql). Here's a link to [documentation on the query language](https://thegraph.com/docs/graphql-api#schema).
Queries used in the frontend can be found [here](../../libs/subgraph-queries-hv)

## Running tests

Unit tests can be run with the multivault environment or with a minimal testing environment (used in the CI) that can be prepared running `yarn prepare-test-unit`.
