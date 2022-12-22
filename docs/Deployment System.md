# Deployment System

# The Problem

Currently there are some issues with our deployment standard in the way we specify deployment configurations and networks, and also in the way we export this deployments in JSON files. We need a better standard that allows us to:

- Specify separately the deployment config and the network. i.e.:
    - independent:goerli
    - hedging:localhost
    - mainnet
- Export these deployments to separate JSON files where the network and the config is clear
- Aggregate all JSON files into a single `deployments.json` JSON file where sets of addresses can be fetched by deployment config
- Export this JSON file in the `src/index.ts` file
- Add another set of JSON files for external addresses (Uniswap, Opyn, token addresses)
- Make it possible for the deployment system to generate one of this external addresses JSON (this way when we deploy custom tokens we can generate its associated JSON file)
- All the JSON files should be incremental, in the sense that if it does not exist, they will be created with the generated addresses. If they exist, and the deployed contract exists in the JSON, it will be updated. Otherwise it will be added to the JSON
- When verifying a contract, a new Hardhat task is run and the traces of this task are intertwined with the traces from the original script. Try to find a way of running the verification in a better way
- Add support for resumable deployments: if a deployment fails mid-way it would be great to be able to resume it
- Add support for post-verification of contracts: right now the contracts are verified as they are deployed. It would be great to be able to verify them as a separate step

# Proposal

## Deployment Types

The deployment type will be a string defining the type of deployment to perform:

- *Provider*: **internal**, **ganache**, **hardhat** or **remote**
    - The **internal** value indicates that we are using the in-memory **hardhat** blockchain provider. This provider cannot be accessed in the network
    - The **ganache** and **hardhat** networks shall be accessed in 0.0.0.0:8545
- *Network*: **develop, goerli, mainnet,** etc…
    - The **develop** value is only valid for the **internal, ganache** and **hardhat** provider and indicates that we are using the default network for that provider
- *Config*: this is a free name that indicates the type of deployment in itself. However some predefined values are desired:
    - **test:** indicates a testing environment where test will be run. If needed, we could specify unit-test, e2e-test, component-test

This would yield deployment names like:

- **ganache.develop.hedging**: local ganache without forking for the hedging vault
- **ganache.goerli.onlycore:** local ganache with Goerli forking where only the Potion core protocol is deployed
- **internal.default.unittest**: internal hardhat network for unit testing

## Deployment Results

In all configurations the contracts will be deployed to the selected network through the selected provider. The resulting address must be exported in order for the rest of the components to be able to access them. This JSON files will be generated inside a folder in the **deployments** folder inside each contracts workspace. The folder will be named as the **provider**, so we would have a structure like this:

```bash
contracts/deployment/
 ->  remote/
 ->  ganache/
 ->  hardhat/
```

### Format

```json
{
  "timestamp": 1662477222,
  "provider" : "ganache"
  "network": "goerli",
  "config" : "hedging"
  "contracts": {
    "PotionBuyAction": {
      "address": "0x8C993aD2806F38Cae4d58631cDb9cd89D99cbBe3",
      "blockNumber": 7541791
    },
    "InvestmentVault": {
      "address": "0x7488e98ac657e57DBAf9906b6E6303f4D9Ef6974",
      "blockNumber": 7541801
    },
    "HedgingVaultOperatorHelper": {
      "address": "0x646486d149528B55285aDB62869151cc6698Eec7",
      "blockNumber": 7541812
    }
  },
  "dependencies" : {
    "USDC": {
      "address": "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7",
    },
    "PotionLiquidityPool": {
      "address": "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
    }
  }
}
```

### Description

- *timestamp:* The timestamp when the deployment finished
- *provider:* The provider used for the deployment, same as in the configuration values
- *network*: The network where the contracts where deployed, same as in the configuration values
- *config:* The name of the config used for the deployment
- *contracts*: An object containing the deployed contracts information by the name of the contract. The format of this contract object is
    - *address*: The address of the deployed contract
    - *blockNumber:* The block in which the contract was deployed. Used for indexing purposes with subgraph. Only available for the deployed contracts and not the dependencies
- *dependencies*: An object containing the contracts that are dependencies of the deployed contracts. It contains the address of the dependency contract

### Remote Export

All these JSON files must be exported in the `src/index.ts` file of each contracts workspace. This file will have the following format:

```tsx
import goerliHedging from  "remote.goerli.hedging.json"
import mainnetOnlycore from  "remote.mainnet.onlycore.json"
...

export const Deployments = { 
    "goerli.hedging": goerliHedging,
    "mainnet.onlycore": mainnetOnlycore
}
...
```

It basically exports a *Deployments* object that contains all the exported JSONs indexed by the deployment name. This file will only include deployments where **provider** is **remote.** The **internal, ganache** and **hardhat** JSONs will **NOT** be exported in this file.

### Local Export

There will be a second file called `src/local.ts` that will **NOT** be commited to the repo, in which all the configuration for *provider *****equal to **ganache** and **hardhat** will be exported. The format of this file will be the same as the previous one except that it will contain the **ganache** and **hardhat** providers deployments:

```bash
import ganacheGoerliHedging from  "ganache.goerli.hedging.json"
import hardhatDevelopOnlycore from  "hardhat.develop.onlycore.json"
...

export const Deployments = { 
    "ganache.goerli.hedging": ganacheGoerliHedging,
    "hardhat.develop.onlycore": hardhatDevelopOnlycore
}
...
```

### Seeded DB Export

A file named `src/db-seeds.ts` will contain all the jsons that have `db-seed` in the config name. These are used with the Seeded DB system that snapshots the blockchain for later reuse. This is the file that will be used for E2E tests, for example. The format is the same as the other 2 files:

```bash
import ganacheGoerliDbseede2e from  "ganache.goerli.db-seed-e2e.json"
import ganacheDevelopDbseedsetup from  "ganache.develop.db-seed-setup.json"
...

export const Deployments = { 
    "ganache.goerli.db-seed-e2e": ganacheGoerliDbseede2e,
    "ganache.develop.db-seed-setup": ganacheDevelopDbseedsetup
}
...
```

This file will only contain **ganache** deployments that use **db-seed** in the configuration name. This file will be committed to the repository for use in the CI system.

The **internal** provider will **NOT** be included on any of the files as it is not necessary.

## Remove Typechain Export

The `export * as Typechain from "../typechain";` from the `index.ts` must be removed and added to the `package.json`

# Contracts Specific Improvements

## Deployment Helpers

Currently there are some deployment helpers in the contracts workspaces:

- `scripts/utils` with functions that help deploy and export the contracts to the JSON files
- `hardhat.helpers.ts` with helpers to provide configurations for the different providers and networks
- `utils/run-ganache.ts` to run ganache locally with default network or forking from a remote

They need to be refactored to a library as they will be the base for the new deployment system. The contracts workspace should have a very simple way of deploying contracts without bothering on whether a config needs exporting or not.

## Export and Verify Options

Currently the configuration on whether to export and/or verify contracts is given manually on each contract deploy, with the default being to export and verify the contract.

The deployment system should define whether to export and/or verify based on the deployment type:

- If *provider* is **internal** do NOT export the values, export in all other cases
- If *provider* is **internal, ganache** or **hardhat,** do NOT verify the contracts. Verify in all other cases
- The specific *config* can also modify this values. For example, it could be that when using *remote.goerli.quicktest* we don’t want to verify the contracts, or even export. The system should allow for this customizations

## Resumable Deployments

When a deployment is ongoing and it fails, it is almost impossible to resume it and continue from where it left. It would be great to have a system that would allow to resume a deployment and finish it. This is a big task but it would be good to do a quick research on the available options.

## Post-Verification of Contracts

Sometimes the verification of a contract fails, or we’ve decided not to verify a contract for some reason. We need a way of verifying a contract after-the-fact. The system is almost ready for it, but it needs some tweaking. The way a contract is verified is by calling a hardhat task call **verify** that needs the fully qualified name of a contract. This looks like:

- *contracts/common/SomeNiceContract.sol:SomeNiceContract*

It’d be great to just pass the name of the contract and that the system composes the fully qualified name and verifies the contract. The verification would need the remote network, the deployed contract address and the contract name:

```bash
$ yarn nx run @potion-protocol/core:verify-contract --network goerli \
PotionLiquidityPool 0x9889DfADE1d68488590DF17bbA882914535a8F92 
```

The challenge comes from the fact that **nx** does not allow us to pass parameters. We also need to investigate how to get the fully qualified name from the name contract.