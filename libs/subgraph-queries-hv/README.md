# Graphql Codegen

This library is used to generate useful javascript/typescript bindings to interact with a graphql endpoint.
Schema introspection and bindings generation are separated in 2 different commands, this way it is possible to write queries and generate bindings without requiring a deployed subgraph.

## Usage

### Schema introspection
- Ensure that there is a `VITE_SUBGRAPH_ADDRESS` variable in the `.env` file pointing to a deployment of the potion subgraph
- Run `yarn introspection`
- If there weren't any errors the `schema.json` should have been updated with an instrospection of the endpoint schema

### Writing queries
- Put some `.graphql` files containing graphql queries into the `queries` foldet
- Run `yarn codegen`
- If there weren't any errors there should be a `schema.ts`, `operations.ts` and `urql.ts` file in the `generated` folder with all the bindings and typings; if there were errors have fun debugging them

## Lint and format

Lint and format are configured to work only with the source files, generated files shouldn't be included in both.
Prettier supports out of the box graphql files, eslint instead needs a specific plugin to work, because the eslint configuration is completely different from the one of other projects (only graphql) it doesn't extend the root one.
For more info on eslint for graphql look at [graphql-eslint](https://github.com/B2o5T/graphql-eslint/) and [graphql-config](https://graphql-config.com/).

## Generated files

The generator is configured to generate the following files in the `generated` folder:

- ### `schema.json`

  Contains the schema introspection; this file is versionated and should be regenerated only if there were some changes in the potion subgraph

- ### `schema.ts`

  Contains the typescript type definition of every graphql entity

- ### `operations.ts`

  Contains the typescript type definition of every query

- ### `urql.ts`
  Contains the urql composables functions for Vue
