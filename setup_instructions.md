# Potion Protocol Setup

This file contains two main sections describing how to setup the project for local development and how to deploy the project on a test network.

## Local development

1.  The following binaries are required to run the project:

    1. [NodeJS](https://nodejs.org/en/download/) (v16)

       - To install and manage Node we suggest to use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)

    2. [Yarn](https://yarnpkg.com/getting-started/install)

    3. [Docker](https://docs.docker.com/engine/install/)

    4. [Docker Compose](https://docs.docker.com/compose/install/)

    If one of the binaries is already available on your system, you can skip that step; only pay attention to the versions (eg: the project is not compatible with Node versions prior to 16).

2.  Clone the repository in the `./potion-protocol` folder  
    `git clone https://github.com/ntropika-labs/potion-protocol.git potion-protocol`

3.  Move to the repository folder on your system  
    `cd potion-protocol`

4.  Copy the example [environment file](./.env.example) to a new env file  
    `cp .env.example .env`

5.  In order for the application to run properly, you must define the following set of variables in the new [environment file](./.env)

    ```bash
    # example .env file

    ...
    VITE_BLOCKNATIVE_API_KEY="your BlockNative API key"
    VITE_ENDPOINT_PROVIDER="alchemy"
    VITE_ALCHEMY_KEY="your Alchemy API key"
    VITE_INFURA_KEY=""
    GANACHE_VOLUME="../data/ganache"
    DATABASE_PATH="/opt/base"
    ...

    ```

    - `VITE_BLOCKNATIVE_API_KEY` - This API key is required to fetch gas prices. A default key is generated on sign up and is available in your dashboard.

    - `VITE_ENDPOINT_PROVIDER` - Choose one between `infura` or `alchemy`. This variable informs the DApp on what provider to use to fetch on-chain activity

    - `VITE_ALCHEMY_KEY` or `VITE_INFURA_KEY` - The variable to customize depends on the one chosen for the provider.

      - If you have `VITE_ENDPOINT_PROVIDER="alchemy"`, you want to customize the `VITE_ALCHEMY_KEY` variable
      - If you have `VITE_ENDPOINT_PROVIDER="infura"`, you want to customize the `VITE_INFURA_KEY` variable

    - `GANACHE_VOLUME` - A relative or absolute path on the host machine to mount into the `ganache` container using [bind mounts](https://docs.docker.com/storage/bind-mounts/). The folder will be managed by Docker and should be reserved for this purpose.  
      The volume will mount the contents of the `GANACHE_VOLUME` folder at the `/opt` path. Any database will be available from inside the container as `/opt/{folder name}` where `{folder name}` is the name of the folder.

    - `DATABASE_PATH` - An absolute path **inside the ganache container** starting with `/opt`. You can choose any name except those that match a seed name from `ganache_seeds` as the bootstrapping process needs a fresh copy of the database to initialize properly.  
      If you already initialized your environment you can also use a path to any of the [available ganache seeds](#available-ganache-seeds) (eg `/opt/base`) and the test data will be loaded.

6.  Once you have configured your environment you can run `yarn` to install all dependencies

    ```bash
    yarn install
    ```

7.  Run the [prepare-seeds](./bin/prepare-seeds) script to automatically copy all database seeds to your `GANACHE_VOLUME` folder

    ```bash
    sudo ./bin/prepare-seeds
    ```

8.  Run the [create-local-env](./bin/create-local-env) to bootstrap your environment

    ```bash
    ./bin/create-local-env
    ```

9.  To start the development server for the [Potion Dapp](./apps/potion-dapp/README.md) you can issue this command.
    ```bash
    yarn dev potion-dapp
    ```
    This will make the Vite development server available on `localhost:3000`

### Common issues

- `Operation timeout` - Check the environment variables for `GANACHE_VOLUME` and `DATABASE_PATH` are configured properly. Refer to [Using ganache databases](./README.md#using-ganache-databases)

- `ENOENT: no such file or directory, open 'potion-protocol/apps/subgraph/subgraph.yaml'` - Check the environment variables for `VITE_ENDPOINT_PROVIDER` and `VITE_ALCHEMY_KEY` (or `VITE_INFURA_KEY`) are configured properly. Refer to [Customization](./README.md#customization)

- `Cannot read properties of undefined (reading 'dataSources')'` - Check the environment variables for `VITE_ENDPOINT_PROVIDER` and `VITE_ALCHEMY_KEY` (or `VITE_INFURA_KEY`) are configured properly. Refer to [Customization](./README.md#customization)

## Deploy to test network
