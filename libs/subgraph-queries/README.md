# Graphql Codegen

This library is used to generate useful javascript/typescript bindings to interact with a graphql endpoint.

## Usage

- Put some `.graphql` files containing graphql queries into the `queries` folder
- Ensure that there is a `GRAPHQL_ENDPOINT` variable in the `.env` file (both a local one or the root one will work fine) pointing to the correct endpoint
- Run `yarn codegen graphql-codegen`
- If there weren't any errors there should be a `generated` folder with all the bindings; if there were errors have fun debugging them

## Lint and format

Lint and format are configured to work only with the source files, generated files shouldn't be included in both.
Prettier supports out of the box graphql files, eslint on the other hand needs a specific plugin to work, because the eslint configuration is completely different from the one of other projects (only graphql) it doesn't extend the root one.
For more info on eslint for graphql look at [graphql-eslint](https://github.com/B2o5T/graphql-eslint/) and [graphql-config](https://graphql-config.com/).

## Generated files

Currently the generator is configured to generate the following files in the `generated` folder:

- ### `schema.json`

  Contains the schema introspection

- ### `schema.ts`

  Contains the typescript type definition of every graphql entity

- ### `operations.ts`

  Contains the typescript type definition of every query

- ### `urql.ts`
  Contains the urql composables functions for Vue
