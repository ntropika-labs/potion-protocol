# UI Library template

_Vue 3 + Typescript + Vite_

This template scaffolds a basic UI library to start developing with Vue 3 and Typescript in Vite.
The template uses Vue 3 `<script setup>` SFCs ([script setup docs](https://vuejs.org/api/sfc-script-setup.html)).

## Commands

- `yarn dev` : Start the application in development mode
- `yarn build` : Build the library and create the bundle in `dist` folder
- `yarn storybook` : Run Storybook on `localhost:6006`
- `yarn test-unit` : Run unit tests using Vitest
- `yarn cypress` : Run compent testing with cypress

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).
