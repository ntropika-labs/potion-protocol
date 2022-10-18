import yaml from "js-yaml";
import yargs from "yargs";
import { readFile, writeFile } from "fs/promises";

// subgraph.yaml format
interface DataSource {
  kind: string;
  name: string;
  network: string;
  source: {
    address: string;
    abi: string;
  };
  mapping: {
    kind: string;
    apiVersion: number;
    language: string;
    entities: string[];
    abis: {
      name: string;
      file: string;
    };
    eventHandlers: {
      event: string;
      handler: string;
    }[];
    file: string;
  };
}

interface SubgraphManifest {
  specVersion: number;
  schema: {
    file: string;
  };
  dataSources: DataSource[];
}

// JSON file containing all the vault stacks format
interface VaultSource {
  InvestmentVault: string;
  PotionBuyAction: string;
  RoundsInputVault: string;
  RoundsOutputVault: string;
  [key: string]: string;
}

async function main() {
  // yargs config
  const args = await yargs
    .option("network", {
      alias: "n",
      description: "subgraph network",
      default: "mainnet",
      choices: ["mainnet", "goerli"],
    })
    .option("vaults", {
      alias: "v",
      description: "path to a JSON file with all the vaults stacks inside",
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
  const sources = JSON.parse(
    await readFile(args.vaults, "utf8")
  ) as VaultSource[];

  // for every stack declared in the stacks file prepare entries
  const manifestSources = sources.map((source, index) => {
    // prepare the data source for every contract
    return templateManifest.dataSources.map((manifestSource) => {
      const address = source[manifestSource.name];
      const name = `${manifestSource.name}${index}`;
      return {
        ...manifestSource,
        name,
        network: args.network,
        source: {
          address,
          abi: manifestSource.source.abi,
        },
      };
    });
  });

  // prepare the manifest to write replacing the dataSources of the template
  const outputManifest = {
    ...templateManifest,
    dataSources: manifestSources.flat(),
  };

  await writeFile(
    "./subgraph.yaml",
    yaml.dump(outputManifest, { noRefs: true })
  );
}
main();
