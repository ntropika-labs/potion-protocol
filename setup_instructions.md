# Potion Protocol Setup

This file describes how to setup the project for local development.

## Requirements

The following binaries are required to run the project

- [jq](https://github.com/stedolan/jq)

- [NodeJS](https://nodejs.org/en/download/) (v16)

  - To install and manage Node we suggest to use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)

- [Yarn](https://yarnpkg.com/getting-started/install)

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

You can run the `bin/check-dependencies` script to check if everything is installed correctly

## Setup

1.  Clone the repository in the `./potion-protocol` folder  
    `git clone https://github.com/ntropika-labs/potion-protocol.git potion-protocol`

2.  Move to the repository folder on your system  
    `cd potion-protocol`

3.  Copy the example [environment file](./.env.example) to a new env file  
    `cp .env.example .env`

4.  In order for the application to run properly, you must define the following set of variables in the new [environment file](./.env)

    ```bash
    # example .env file

    ...
    VITE_SUBGRAPH_ADDRESS="http://localhost:8000/subgraphs/name/potion-subgraph" # subgraph address for potion core contracts
    VITE_SUBGRAPH_HV_ADDRESS="http://localhost:8000/subgraphs/name/potion-hv-subgraph" # subgraph address for hedging vault contracts
    VITE_BLOCKNATIVE_API_KEY="your BlockNative API key"
    VITE_ENDPOINT_PROVIDER="alchemy"
    VITE_ALCHEMY_KEY="your Alchemy API key"
    VITE_INFURA_KEY="your Infura API key"
    GANACHE_VOLUME="../data/ganache"
    DATABASE_PATH="/opt/base"
    ...

    ```

    - `VITE_SUBGRAPH_ADDRESS` - Absolute url pointing to a running [Graph Node](https://github.com/graphprotocol/graph-node) deployment for the core contracts. In a local environment it's the address for the `graph-node` service deployed by the [docker-compose.yml](./docker-compose.yml).  
      See [Customization](./README.md#customization)

    - `VITE_SUBGRAPH_HV_ADDRESS` - Absolute url pointing to a running [Graph Node](https://github.com/graphprotocol/graph-node) deployment for the hedging vault contracts. In a local environment it's the address for the `graph-node` service deployed by the [docker-compose.yml](./docker-compose.yml).  
      See [Customization](./README.md#customization)

    - `VITE_BLOCKNATIVE_API_KEY` - This API key is required to fetch gas prices. A default key is generated on sign up and is available in your dashboard. You can register at [BlockNative](https://www.blocknative.com/) to get your own key.

    - `VITE_ENDPOINT_PROVIDER` - Choose one between `infura` or `alchemy`. This variable informs the DApp on what provider to use to fetch on-chain activity

    - `VITE_ALCHEMY_KEY` or `VITE_INFURA_KEY` - The variable to customize depends on the one chosen for the provider.

      - If you have `VITE_ENDPOINT_PROVIDER="alchemy"`, you want to customize the `VITE_ALCHEMY_KEY` variable
      - If you have `VITE_ENDPOINT_PROVIDER="infura"`, you want to customize the `VITE_INFURA_KEY` variable

      You can register at [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/) to get your own key.

5.  Once you have configured your environment you can run `yarn` to install all dependencies

    ```bash
    yarn install
    ```

### Hardhat development

Hardhat is used internally to develop and debug new features

6.  Run the [hardhat-localnode](./contracts/hedging-vault/package.json) script to spin up a local hardhat node

    ```bash
    yarn nx run @potion-protocol/hedging-vault:hardhat-localnode
    ```

7.  Run the [create-hardhat-env](./bin/create-hardhat-env) to bootstrap your environment with Hardhat

    ```bash
    ./bin/create-hardhat-env
    ```

8.  To start the development server for the [Potion Dapp](./apps/potion-dapp/README.md) you can issue this command.
    ```bash
    yarn dev potion-dapp
    ```
    This will make the Vite development server available on `localhost:5173`

### Ganache development

Ganace is used internally to run e2e tests

6.  In order for the application to run properly, you must define the following set of variables in the new [environment file](./.env)

    - `GANACHE_VOLUME` - A relative or absolute path on the host machine to mount into the `ganache` container using [bind mounts](https://docs.docker.com/storage/bind-mounts/). The folder will be managed by Docker and should be reserved for this purpose.  
      The volume will mount the contents of the `GANACHE_VOLUME` folder at the `/opt` path. Any database will be available from inside the container as `/opt/{folder name}` where `{folder name}` is the name of the folder.

    - `DATABASE_PATH` - An absolute path **inside the ganache container** starting with `/opt`. You can choose any name except those that match a seed name from `ganache_seeds` as the bootstrapping process needs a fresh copy of the database to initialize properly.  
      If you already initialized your environment you can also use a path to any of the [available ganache seeds](#available-ganache-seeds) (eg `/opt/base`) and the test data will be loaded.

7.  Run the [setup-database-seed](./bin/setup-database-seed) script to automatically copy all database seeds to your `GANACHE_VOLUME` folder

    ```bash
    ./bin/setup-database-seed --all
    ```

8.  Run the [setup-local-env](./bin/setup-local-env) to bootstrap your environment

    ```bash
    ./bin/setup-local-env
    ```

9.  To start the development server for the [Potion Dapp](./apps/potion-dapp/README.md) you can issue this command.
    ```bash
    yarn dev potion-dapp
    ```
    This will make the Vite development server available on `localhost:5173`

### Recording

If you prefer to see a video to help you with the setup you can look at the [setup cast](./examples/setup.cast) with [asciinema](https://github.com/asciinema/asciinema) or directly online
[![asciicast](https://asciinema.org/a/k9I4Y02g5EKp8OGUd9pJvK2g2.svg)](https://asciinema.org/a/k9I4Y02g5EKp8OGUd9pJvK2g2)

### Common issues

- `Operation timeout` - Check the environment variables for `GANACHE_VOLUME` and `DATABASE_PATH` are configured properly. Refer to [Using ganache databases](./README.md#using-ganache-databases)

- `ENOENT: no such file or directory, open 'potion-protocol/apps/subgraph/subgraph.yaml'` - Check the environment variables for `VITE_ENDPOINT_PROVIDER` and `VITE_ALCHEMY_KEY` (or `VITE_INFURA_KEY`) are configured properly. Refer to [Customization](./README.md#customization)

- `Cannot read properties of undefined (reading 'dataSources')'` - Check the environment variables for `VITE_ENDPOINT_PROVIDER` and `VITE_ALCHEMY_KEY` (or `VITE_INFURA_KEY`) are configured properly. Refer to [Customization](./README.md#customization)
