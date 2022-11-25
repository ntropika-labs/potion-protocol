import yaml from "js-yaml";
import yargs from "yargs";
import { readFile, writeFile } from "fs/promises";

import { canAccess } from "./utils";
import type { SubgraphManifest, VaultSource } from "./types";

async function main() {
  // yargs config
  const args = await yargs
    .option("network", {
      alias: "n",
      description: "subgraph network",
      default: "mainnet",
      choices: ["mainnet", "goerli", "mumbai"],
    })
    .option("vaults", {
      alias: "v",
      description:
        "path to a JSON file with an array of paths to deployment configurations",
      default: "./vaults.json",
    })
    .option("template", {
      alias: "t",
      description: "path a YAML file to use as the starting template",
      default: "./subgraph.template.yaml",
    })
    .help()
    .alias("help", "h").argv;

  // read the template and vault stacks files
  const templateManifest = yaml.load(
    await readFile(args.template, "utf8")
  ) as SubgraphManifest;
  const sources = JSON.parse(await readFile(args.vaults, "utf8")) as string[];

  // keep only the paths that the user can read
  const accessibleSources = sources.filter(canAccess);

  // for every stack declared in the stacks file prepare entries
  const manifestSources = accessibleSources.map(async (path, index) => {
    // load the JSON file
    const source = JSON.parse(await readFile(path, "utf8")) as VaultSource;
    // prepare the data source for every contract
    return templateManifest.dataSources.map((manifestSource) => {
      const contractInfo = source.contracts[manifestSource.name];
      const name =
        index === 0 ? manifestSource.name : `${manifestSource.name}${index}`;
      return {
        ...manifestSource,
        name,
        network: args.network,
        source: {
          address: contractInfo.address,
          startBlock: contractInfo.blockNumber,
          abi: manifestSource.source.abi,
        },
      };
    });
  });

  // prepare the manifest to write replacing the dataSources of the template
  const outputManifest = {
    ...templateManifest,
    dataSources: (await Promise.all(manifestSources)).flat(),
  };

  await writeFile(
    "../../apps/subgraph-hv/subgraph.yaml",
    yaml.dump(outputManifest, { noRefs: true })
  );
}
main();
