# Electron Wrapper

This branch contains the source code to develop an [Electron](https://electronjs.org/) app that can be used as a generic wrapper around existing DApps.  
The project is a fork of [Vite Electron Builder](https://github.com/cawa-93/vite-electron-builder) which has been configured to work in our monorepo environment.

**The implementation is still a work in progress and should not be intended for production.**

## Requirements

The following binaries are required to run the project

- [NodeJS](https://nodejs.org/en/download/) (v16)

  - To install and manage Node we suggest to use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)

- [Yarn](https://yarnpkg.com/getting-started/install)

- [Docker](https://docs.docker.com/engine/install/)

- [Docker Compose](https://docs.docker.com/compose/install/)

You can run the `bin/check-dependencies` script to check if everything is installed correctly

## Quick Start

_Please refer to [Setup instructions](./setup_instructions.md) in the `main` branch for detailed setup instructions._
**Configuration requirements are dictated from the underlying app we want to wrap with Electron**.

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

## Project structure

Forked from [Vite Electron Builder](https://github.com/cawa-93/vite-electron-builder)

Starting with the project structure proposed by the template, we can adapt ours by simply extending it with a new folder inside `apps` (called `electron-wrapper` in this example)

```bash
root_folder
|____ apps
| |____ electron-wrapper
| |____ potion-dapp
|____ libs
...
```

This new folder is organised as follows:

```bash
electron-wrapper
|____ scripts
|____ main
| |____ dist
| |____ src
| |____ vite.config.js
| |____ tsconfig.json
|____ preload
| |____ dist
| |____ src
| |____ vite.config.js
| |____ tsconfig.json
|____ render
|	|____ dist # updated by Vue apps build process
|____ package.json
|____ env.d.ts # only handles VITE_DEV_SERVER_URL for development
...
```

The entire source code of the project is divided into three modules (packages) that are each bundled independently:

- `render`: The render folder is empty on purpose and is automatically populated during build phases. It has been adapted from the original template to host compiled code from underlying apps.

- `preload`: Acts as an intermediate bridge between the *renderer* process and the API exposed by electron and Node.js. Runs in an *isolated browser context*, but has direct access to the full Node.js functionality. See [Checklist: Security Recommendations](https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content).

- `main`: Electron **[main script](https://www.electronjs.org/docs/tutorial/quick-start#create-the-main-script-file)**. This is the main process that powers the application. It manages creating and handling the spawned `BrowserWindow`, setting and enforcing secure permissions and request handlers. Can be configured to also do: logging, reporting statistics and health status among others.

### Underlying apps configuration

This branch features some changes to the apps we want to wrap with Electron. This is mainly due to some requirements for the Electron environment.
To be able to run Vue applications inside the electron context we need a way to toggle specific features of our application based on the runtime context we are building for.

To enable such behaviour we are introducing a new environment variable `VITE_RUNTIME` aimed at enabling such features, used in combination with an npm script:

```bash
// apps/price-source-benchmark/package.json
"build-electron": "NODE_ENV=production MODE=production VITE_RUNTIME=electron vite build",
```

```ts
// apps/price-source-benchmark/env.d.ts
interface ImportMetaEnv {
	...
	readonly VITE_RUNTIME: string;
}
```

The changes we need affects the `router` and our `vite.config.js` configuration.

The changes to the `router` are required because Electron only supports the hash navigation and since we are not relying on it in the browser context we would need to toggle it at build time.

```ts
// apps/price-source-benchmark/src/router.ts
const router = createRouter({
	history:
    import.meta.env.VITE_RUNTIME === "electron"
      ? createWebHashHistory()
      : createWebHistory(import.meta.env.BASE_URL),
...
```

The changes to the `vite.config.js` file are required to instruct Electron on how to resolve import paths.

**We are also taking advantage of it to set the build target destination directly to `electron-wrapper/render/dist`, this should be addressed at a higher level instead of building to another workspace**

```ts
// apps/price-source-benchmark/vite.config.ts
const VITE_RUNTIME = process.env.VITE_RUNTIME;
const electron = VITE_RUNTIME === "electron";

// https://vitejs.dev/config/
export default defineConfig({
	base: electron ? "" : undefined, // empty path is equal to relative, otherwise set it to undefined to keep the default
  root: electron ? __dirname : undefined, // dirname when electron, otherwise set it to undefined to keep the default
	...
	build: {
    outDir: electron
      ? path.resolve(__dirname, "../electron-wrapper/render/dist")
      : undefined, // path to electron-wrapper project when using electron, otherwise set it to undefined to keep the default
    emptyOutDir: electron ? true : undefined, // empty dist folder when using electron, otherwise set it to undefined to keep the default
    assetsDir: electron ? "." : undefined, // relative path when electron, otherwise set it to undefined to keep the default
		rollupOptions: {
			...
			input: electron ? join(__dirname, "index.html") : undefined,
		}
		...
	},
	...
	server: {
    fs: {
      strict: electron ? true : undefined,
      allow: electron
        ? undefined
        : [searchForWorkspaceRoot(process.cwd()), "../../libs"],
    },
  },
}

```

## Building

This is the relevant section from `package.json` containing the build command:

```json
// apps/electron-wrapper/package.json
...
"compile": "cross-env MODE=production yarn build && electron-builder build --config .electron-builder.config.js",
```

**Change the `VITE_ETHEREUM_NETWORK` in your main `.env` to the network you're going to use in production before issuing any ofthe commands.**

The `compile` script is responsible for bundling the whole application but **requires the `render/dist` folder to be updated manually before issuing the command.**

`apps/electron-wrapper/project.json` contains a basic example for how to build the `price-source-benchmark` relying on Nx for orchestration:

```bash
yarn nx run electron-wrapper:build-price-benchmark
```

The process consists of the following steps:

1. The underlying Vue app is built in _electron mode_ with a custom npm script: `yarn nx run price-source-benchmark:build-electron`.  
   Once finished the resulting files are copied to `apps/electron-wrapper/render/dist` .
2. The `electron-wrapper` builds each sub-project (`main` and `preload` ) individually into their own `dist` folder.
3. Once all files are compiled, it bundles everything together using

   ```
   electron-builder build --config .electron-builder.config.js
   ```

   The `.electron-builder.config.js` file lists all config options for the different platforms we are targeting and also how to handle the files we want to bundle

## Known limitations

- Watch script currently is not fully implemented. It could be moved to the root folder to be able to orchestrate all workspaces and reload the whole app on changes.

- Building the app should also be addressed at an higher level instead of relying on `package.json` for each app.

- Currently only WalletConnect is supported. Electron is not planning to support web extensions, thus Metamask won't be supported.

- _The Electron app when bundled for production has issues in resolving assets such as images_.  
  Possible causes are:

  - incorrect configuration of the `assetsDir` option inside `vite-config.js` for the underlying app (eg: `apps/potion-dapp`). This is probably the case since assets are resolving as `file:///icons/potion-big.avif` which is an absolute path in the context of Electron
  - Some assets may need to be placed inside a special folder `apps/electron-wrapper/buildResources` to load correctly.

- Using NodeJs dependencies with `preload` may not work properly due to the changes in the project structure and build commands
