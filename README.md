# Potion Protocol - Electron Wrapper

This branch contains the source code to develop an [Electron](https://electronjs.org/) app that can be used as a generic wrapper around existing DApps.  
The project is a fork of [Vite Electron Builder](https://github.com/cawa-93/vite-electron-builder) which has been configured to work in our monorepo environment.

**The implementation is still a work in progress and should not be intended for production.**

Before getting started please be sure to have installed the [Requirements](#requirements).

## Requirements

The following binaries are required to run the project

- [NodeJS](https://nodejs.org/en/download/) (v16)

  - To install and manage Node we suggest to use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)

- [Yarn](https://yarnpkg.com/getting-started/install)

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

You can run the `bin/check-dependencies` script to check if everything is installed correctly

## Quick Start

**Please refer to [Setup instructions](./setup_instructions.md) in the `main` branch for detailed setup instructions.**

**Please refer to [Wrapper README](./apps/electron-wrapper/README.md) for more info about the Electron Wrapper.**

The steps below describe how to use the [price-source-benchmark](../price-source-benchmark/README.md) inside the wrapper.

1. Run `cp .env.example .env` to copy the environment example file and customize the following variables:

2. Define the following environment variables in your `.env` file:

   ```bash
   # editing .env in the root folder
   ...
   VITE_ETHEREUM_NETWORK="mainnet"
   VITE_ALCHEMY_KEY="your Alchemy key"
   VITE_INFURA_KEY="your Infura key"
   VITE_ORACLE_ADDRESS="0x789cD7AB3742e23Ce0952F6Bc3Eb3A73A0E08833" # opyn oracle address for mainnet
   ...
   ```

   - `VITE_ETHEREUM_NETWORK` - One of the networks available for the Opyn Gamma protocol. The updated list is also available [here](https://opyn.gitbook.io/opyn/getting-started/abis-smart-contract-addresses)
   - `VITE_ALCHEMY_KEY` - API key for [`Alchemy`](https://docs.alchemy.com/alchemy/introduction/getting-started)
   - `VITE_INFURA_KEY` - API key for [`Infura`](https://docs.infura.io/infura/getting-started)
   - `VITE_ORACLE_ADDRESS` - This is the [oracle contract](../../contracts/gamma-protocol/contracts/core/Oracle.sol) address for the Opyn Gamma protocol [Oracle](https://opyn.gitbook.io/opyn/contracts/oracle). You can find the address for your network at [Smart Contract Addresses](https://opyn.gitbook.io/opyn/getting-started/abis-smart-contract-addresses).

3. Run `yarn nx run electron-wrapper:postinstall` to generate the `apps/electron-wrapper/.electron-vendors.cache.json` file that is then used by Vite to build the app with the correct version of chrome and node

4. Start the benchmark app

   ```bash
   yarn dev price-source-benchmark
   ```

5. Run `yarn nx run electron-wrapper:watch` to watch for file changes in the `electron-wrapper`
