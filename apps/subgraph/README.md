# demo-subgraph

This is a demo subgraph with simple mappings for an ERC20 token; it also has some simple unit tests made with [matchstick](https://github.com/LimeChain/matchstick).

## Requirements

- `yarn`
- `docker`
- `jq`
- `postgre`

## Preparing the subgraph

In `package.json` there are some commands (`prepare-local`, `prepare-rinkeby`, `prepare-mainnet`) to prepare the `subgraph.yaml` file according to your environment: remember to run it before building

## Build a subgraph

Remember to run the `codegen` before `build`

## Unit test

Remember to run the `codegen` before `unit-test`
