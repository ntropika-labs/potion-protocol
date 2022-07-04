# Potion Protocol

Amazing risk management protocol!

# TODO

# contracts/core

Some tests for the core contracts have been currently modified because of an issue between `ethers.js` and `hardhat` where the revert reason emitted
by `hardhat` is not understood by `ethers.js`. The `hardhat` team is working on a fix but as of version 2.9.3 the fix is not yet available. The affected
files are:

- [CurvePricing.test.js](./contracts/core/test/CurvePricing.test.ts)
- [PotionLiquidityPool.Upgrades.test.js](./contracts/core/test/PotionLiquidityPool.Upgrades.test.ts)

# Using ganache databases

The ganache container is configured to use databases from a volume, this is used to store our previous interactions and/or restore known states for tests/debugging.

## Setting up ganache databases
- created a folder that will be used as a named volume (it is higly recommended to set up it outside the monorepo to avoid permissions issues with tools)
- put the path (relative or absolute will both work) inside the `.env` file into the `GANACHE_VOLUME` variable
- put into the `DATABASE_PATH` variable the path (from inside the container) to the database that you want to use

## Creating/restoring databases
- copy the databases in the `ganache_seeds` to the volume folder (there is a `prepare-seeds` script into the `bin` folder that will copy the databases in the correct place using your `.env` file)
- it is possible to copy entire folders to "create" a new database (eg, copy the `base` database to `develop`)
- if you are using the `base` database ensure that `CHAIN_TIME` is set to **2021-01-01 09:00:00+00:00**

If you want to generate a new database from scratch instead, run the `create-local-env` script.

An example of a working configuration can be

### `.env`
> ... other variables
> GANACHE_VOLUME="/opt/docker-data/potion-protocol/ganache"
> DATABASE_PATH="/opt/base"
> CHAIN_TIME="2021-01-01 09:00:00+00:00"
> ... other variables

### `/opt/docker-data/potion-protocol/ganache`
> base
> develop
> e2e-create-pool
> e2e-show-pool
> ... other databases

## Ganache and block time
**IMPORTANT**: Ganache by default uses the host local time to determine the timestamp of the next block, this can cause issues with expirations not working because the time turned back or create inconsistency in the charts.
To avoid this issue on the CI the `base` database has been created with the date **2020-01-01 00:00:00+00:00** but because the deployment script fast forwards one year you should start the blockchain locally from **2021-01-01 09:00:00+00:00**.
Every time that you do a fast forward remember to update your starting time to reflect it, otherwise next time that you restart the containers you will incur into a time mismatch.
