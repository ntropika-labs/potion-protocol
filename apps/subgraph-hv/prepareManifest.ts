import yaml from "js-yaml";
import { readFileSync, writeFileSync } from "fs";

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

interface VaultSource {
  InvestmentVault: string;
  PotionBuyAction: string;
  RoundsInputVault: string;
  RoundsOutputVault: string;
  [key: string]: string;
}

const templateManifest = yaml.load(
  readFileSync("./subgraph.template.yaml", "utf8")
) as SubgraphManifest;
const sources = JSON.parse(
  readFileSync("./vaults.json", "utf8")
) as VaultSource[];

const manifestSources = sources.map((source, index) => {
  return templateManifest.dataSources.map((manifestSource) => {
    const address = source[manifestSource.name];
    const name = `${manifestSource.name}${index}`;
    return {
      ...manifestSource,
      name,
      network: "mainnet",
      source: {
        address,
        abi: manifestSource.source.abi,
      },
    };
  });
});

const outputManifest = {
  ...templateManifest,
  dataSources: manifestSources.flat(),
};

writeFileSync("./subgraph.yaml", yaml.dump(outputManifest, { noRefs: true }));
