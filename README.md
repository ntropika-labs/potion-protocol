# Potion Protocol

**Amazing risk management protocol!**  
Potion is a decentralized protocol for the creation of price insurance contracts running on the Ethereum network. For more information on how it works, check out the [Potion Docs project](https://github.com/potion-labs/potion-dev/tree/master/potion-docs).

Before getting started please be sure to have installed the [Requirements](#requirements).

## Requirements

The following binaries are required to run the project

- [NodeJS](https://nodejs.org/en/download/) (v16)

- [Yarn](https://yarnpkg.com/getting-started/install)

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

Some configuration is required before spinning up the environment.  
Run `cp .env.example .env` to copy the environment example file and customize the following variables:

- `VITE_ENDPOINT_PROVIDER` - choose one between `infura` and `alchemy`
- `VITE_ALCHEMY_KEY` or `VITE_INFURA_KEY` (depending on what you chose for the endpoint provider) and insert your API key
- Setup [Ganache volume](#using-ganache-databases)

To bootstrap your development environment you can run one of the following commands from the project root folder:

- `yarn dev potion-dapp` starts Vite development server for [Potion DApp](#appspotion-dapp) on `localhost:3000`

- `yarn nx run potion-dapp:local-dev` spins up docker environment and starts Vite development server for [Potion DApp](#appspotion-dapp) on `localhost:3000`

- `yarn nx run potion-dapp:local-dev-test` spins up docker environment and starts Vite development for [Potion DApp](#appspotion-dapp) on `localhost:3000` with a [mocked](#mocked-web3-onboard) instance of `web3-onboard` (useful for testing or if you can't connect a wallet)

The last two scripts, which run via Nx, share the same logic (except for the mocked Onboard instance) and behined the scene run `bin/create-local-env-headless` to start and seed the environment:

1. Spin up the Docker environment with `docker compose up -d -V`, starting the following services:

   - `potion_postgres`: [PostgreSql](https://github.com/postgres/postgres) database to store indexed data

   - `potion_ipfs`: local [IPFS](https://github.com/ipfs/go-ipfs) instance on which to upload the subgraph

   - `potion_ganache`: [Ganache](https://github.com/trufflesuite/ganache) instance for a local blockchain

   - `potion_graph_node`: [Graph Node](https://github.com/graphprotocol/graph-node) to index the data from the blockchain and expose it using GraphQL

2. Once containers are up and ready to accept new connections:

   - If this is the first time running this environment, seeds the database by running the template and deploying both the contracts and the subgraph

   - If the database is already available, only runs the template for the subgraph and deploys it

## Using ganache databases

The ganache container is configured to use databases from a volume, this is used to store our previous interactions and/or restore known states for tests/debugging.

### Setting up ganache databases

1. Create a folder that will be used as a named volume (it is higly recommended to set up it outside the monorepo to avoid permissions issues with tools)

2. Put the path (relative or absolute will both work) inside the `.env` file into the `GANACHE_VOLUME` variable. This folder will be mounted to the `/opt` path within the container. See [example](#ganache-example-config).

3. Put into the `DATABASE_PATH` variable the path (from inside the container) to the database that you want to use. See [example](#ganache-example-config).

### Creating/restoring databases

1. Copy the databases in the `ganache_seeds` to the volume folder (there is a `prepare-seeds` script into the `bin` folder that will copy the databases in the correct place using your `.env` file).
   It is possible to copy entire folders to "create" a new database (eg, copy the `base` database to `develop`).
2. If you are using the `base` database ensure that `CHAIN_TIME` is set to **2021-01-01 09:00:00+00:00**

If you want to generate a new database from scratch instead, run the `create-local-env` script.

### Ganache example config

- #### Content of `.env`

```sh
... other variables

GANACHE_VOLUME="../docker-data/potion-protocol/ganache" # path to a folder on your system, used as source for the ganache volume.
DATABASE_PATH="/opt/base" # path within the ganache container ( '/opt' is required )
CHAIN_TIME="2021-01-01 09:00:00+00:00"

... other variables
```

- #### Content of local folder

  `../docker-data/potion-protocol/ganache`

  > base  
  > develop  
  > e2e-create-pool  
  > e2e-show-pool  
  > ... other databases

- #### Content of ganache container

  `/opt`

  > base  
  > develop  
  > e2e-create-pool  
  > e2e-show-pool  
  > tests # this folder is used internally to store db files from e2e-testing  
  > ... other databases

## Ganache and block time

**IMPORTANT**: Ganache by default uses the host local time to determine the timestamp of the next block, this can cause issues with expirations not working because the time turned back or create inconsistency in the charts.  
To avoid this issue on the CI the `base` database has been created with the date **2020-01-01 00:00:00+00:00** but because the deployment script fast forwards one year you should start the blockchain locally from **2021-01-01 09:00:00+00:00**.  
Every time that you do a fast forward remember to update your starting time to reflect it, otherwise next time that you restart the containers you will incur into a time mismatch.

## Testing

The project currently implements e2e testing for `potion-dapp` and component testing for `potion-ui`.
Both workspaces are configured to use [Cypress](https://github.com/cypress-io/cypress) as a testing tool.

### Potion DApp testing

Tests are located within `cypress/e2e` folder.

#### `yarn nx run potion-dapp:local-test-e2e`

- Spin up Docker environment if not started
- Copy `ganache_seeds` to `DATABASE_PATH` folder
- Start Vite development server with mocked onboard with files from your latest build on `localhost:3000`
- Open Cypress with an interactive session

#### `yarn nx run potion-dapp:ci-test-e2e`

**Requires a running docker environment**

- Build `potion-dapp` with mocked onboard
- Start Vite preview server with files from your latest build on `localhost:5050`
- Run the whole test suite with Cypress headless mode.  
  _Browser defaults to Electron_

To have more control over what commands are issues to start the testing environment you can use:

- `yarn nx run potion-dapp:test-e2e`: Start Vite preview server with files from your latest build and open Cypress interactive session
- `yarn nx run potion-dapp:test-e2e-dev`: Open Cypress interactive session for an existing Vite development server running on `localhost:3000`
- `yarn nx run potion-dapp:test-e2e-ci-dev`: Run the whole test suite with Cypress headless mode for an existing Vite development server running on `localhost:3000`
- `yarn nx run potion-dapp:test-e2e-ci`: Start Vite preview server with files from your latest build and run the test suite with Cypress headless mode

### Potion UI testing

Tests are located within each component subfolder and are named as `{component}.cy.ts`

#### `yarn nx run potion-ui:test-component-ci`

- Run the whole test suite with Cypress headless mode.

#### `yarn nx run potion-ui:cypress`

- Open Cypress with an interactive session

### Mocked `web3-onboard`

In order to test actions involving interaction with a Wallet, a mocked version of `web3-onboard` is injected at compilation time, based on an environment variable. This is also the difference between the commands `yarn nx run potion-dapp:build` and `yarn nx run potion-dapp:build-test`.  
This mocked instance implements all the methods available in the original library that are used within `potion-dapp`, exposing the same interface and also offering the same degree of reactivity. All methods are supposed to be called in an headless environment, thus eliminating the requirement for user interaction.
To achieve the statefulness required by the app, this instance uses a local state to store information and its methods refer to this single source of truth to interact with current state.

## Monorepo overview

This repository hosts all of the code for the Potion Protocol and as such comprises:

- The [DApp](#appspotion-dapp) used to show front-facing information to the end user.
- The [Subgraph](#appssubgraph) that tracks changes Pools, Curves, Criterias, and oTokens, with data aggregated to the pool level.
- The [Contracts](#contractscore) containing the Smart Contracts of the Potion protocol

For ease of maintenance we have a single `package.json` file in the root of the monorepo, which lists all dependencies for all projects.  
Each project then has it's own `package.json` listing all scripts that can be run against that particular project.  
To enanche the development experience we are making use of Yarn workspaces togheter with Nx to simplify and coordinate issuing commands for different projects.  
For example:

```bash
yarn nx run potion-dapp:local-dev
```

- Run a command throught `nx`
- Relative to the `potion-dapp` project
- A command defined either in `package.json` or `project.json`. Scripts defined in a `project.json` are exclusive of Nx and cannot run outside of it

### apps/potion-dapp

[Read more](./apps/potion-dapp/README.md)

Project containing files for the Vue3 app in charge of showing and updating data to and from the protocol.

### apps/subgraph

[Read more](./apps/subgraph/README.md)

Local subgraph tracking updates to the protocol entities.

### bin

This folder contains all scripts developed to assist in spinning up the environment and running development operations.  
These consist of:

- `check-dependencies`: Check for Docker dependencies required to run the stack locally
- `create-local-env`: Spin up local Docker environment removing existing one if any
- `create-local-env-headless`: Spin up local Docker environment by also checking for available environments and the current Ganache database.
- `prepare-seeds`: Switch current [Ganache seed](#ganacheseeds) by changing `GANACHE_VOLUME` env variable and refreshing current env
- `prepare-seeds-headless`: Switch current [Ganache seed](#ganacheseeds) by changing `GANACHE_VOLUME` env variable. _It's used by the CI._
- `setup-database-seed`: Based on supplied parameters copies one or all seeds to your `DATABASE_PATH` folder. When called with `--all` flag, restores all database seeds from `ganache_seeds` folder and creates the `tests` subfolder used in e2e-testing.  
  _Called by default when running `yarn nx run potion-dapp:local-test-e2e`_

### contracts/core

[Read more](./contracts/core/README.md)

Some tests for the core contracts have been currently modified because of an issue between `ethers.js` and `hardhat` where the revert reason emitted
by `hardhat` is not understood by `ethers.js`. The `hardhat` team is working on a fix but as of version 2.9.3 the fix is not yet available. The affected
files are:

- [CurvePricing.test.js](./contracts/core/test/CurvePricing.test.ts)
- [PotionLiquidityPool.Upgrades.test.js](./contracts/core/test/PotionLiquidityPool.Upgrades.test.ts)

### contracts/gamma-protocol

[Read more](./contracts/gamma-protocol/README.md)

This workspace provides the required files for the core contracts of the Potion Protocol

### ganache_seeds

This folder contains a set of subfolders containing seed data for Ganache.  
Different seeds are useful for testing different features of the DApp.

### libs/contracts-math

[Read more](./libs/contracts-math/README.md)

### libs/dapp-types

This library contains a single `index.ts` file with types shared among apps and libraries

### libs/locales

This library contains all locales and their data available within the app.  
For ease of use and to also allow for import within tests those data have been extracted to its own library.

### libs/potion-router

### libs/potion-tokenlist

This library hosts configuration files for the tokens available on different networks supported by the protocol.

### libs/potion-ui

[Read more](./libs/potion-ui/README.md)

This library contains all the UI components used within Potion DApp.

### libs/potion-unocss

This library contains the configuration used for [UnoCSS](https://github.com/unocss/unocss).  
It's contained in it's own library to share config between apps and libraries.

### libs/subgraph-queries

[Read more](./libs/subgraph-queries/README.md)

## Customization

All these different projects allow or require for some sort of configuration.  
Much of these are exposed as environment variables configurable from the `.env` file within the project root folder.

### Environment variables

See `.env.example` for available environment variables and their purpose.
