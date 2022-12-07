# Multivault Helpers

This workspace contains a couple of helper scripts used to provide [subgraph-hv](../../apps/subgraph-hv) and [potion-dapp](../../apps/potion-dapp) with the required files to run a Hedging Vault multivault deployment.

## Commands

- `prepare-manifest`: generates the required files to deploy `subgraph-hv` on the `localhost` network.
- `prepare-manifest-mumbai`: generates the required files to deploy `subgraph-hv` on the `mumbai` testnet.
- `prepare-dapp`: generates the required files to run the `potion-dapp` on the `localhost` network.
- `prepare-dapp-mumbai`: generates the required files to run the `potion-dapp` on the `mumbai` testnet.


## Supported networks

Currently, the multivault-helpers scripts support the following networks:

- `localhost`: a local network that can be used for testing and development.
- `mumbai` (polygon testnet): a testnet provided by Polygon that can be used for testing and development.

Each of the `prepare-manifest` and `prepare-dapp` scripts has a corresponding version for each supported network (e.g., `prepare-manifest` and `prepare-manifest-mumbai`). 
Use the appropriate version of the script depending on the network you want to use.
