# Potion DApp

This project contains the DApp of the Potion Protocol developed with Vue 3 in Vite.

Before getting started please be sure to have installed the [Requirements](#requirements).

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Requirements

- [NodeJS](https://nodejs.org/en/download/) (v16)

- [Yarn](https://yarnpkg.com/getting-started/install)

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Spin up Docker, Compile and Hot-Reload for Development

```sh
yarn local-dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Type-Check, Compile and Minify for Production with mocked `web3-onboard`

```sh
yarn build-test
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
yarn build-test
yarn test-e2e # or `yarn test-e2e-ci` for headless testing
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

### NX custom commands

Execution can be customized by passing the `redeploy` flag:

- [DEFAULT] When `true` will instruct docker to always deploy a fresh environment (even if one is already available)
- When `false` an existing environment will be used if any.
  **WARNING: currently the script has no way of detecting an healthy enviroment and will only check for running containers**

#### `local-dev`

```bash
EG:
yarn nx run potion-dapp:local-dev [redeploy=(true/false)]
```

Used to spin up the development environment.

- Start `docker-compose` containers
- Start `vite` dev server by running `yarn nx run potion-dapp:dev`

_The command runs in **foreground**_

#### `local-dev-test`

```bash
EG:
yarn nx run potion-dapp:local-dev-test [redeploy=(true/false)]
```

Used to spin up the development environment with mocked Onboard.

- Start `docker-compose` containers
- Start `vite` dev server **with mocked Onboard** by running `yarn nx run potion-dapp:dev-test`

_The command runs in **foreground**_

#### `local-dev-test-e2e`

```bash
EG:
yarn nx run potion-dapp:local-dev-test-e2e [redeploy=(true/false)]
```

Used as a utility command to run in parallel the dev server and Cypress client

- Start `vite` dev server **with mocked Onboard** by running `yarn nx run potion-dapp:dev-test`
- start `cypress` client by running `yarn nx run potion-dapp:test-e2e-dev`

_The command runs in **foreground**, command needs to be terminated manually_

#### `local-test-e2e`

```bash
EG:
yarn nx run potion-dapp:local-test-e2e
```

- Start `docker-compose` containers
- Run `yarn nx run potion-dapp:local-dev-test-e2e` to spin up the dev server and cypress client simultaneously

_The command runs in **foreground**, command needs to be terminated manually_
