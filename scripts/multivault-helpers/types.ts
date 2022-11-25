// subgraph.yaml format
interface DataSource {
  kind: string;
  name: string;
  network: string;
  source: {
    address: string;
    abi: string;
    startBlock: number;
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

interface ContractSource {
  address: string;
  blockNumber: number;
}

// JSON file containing all the vault stacks format
interface VaultSource {
  contracts: {
    InvestmentVault: ContractSource;
    PotionBuyAction: ContractSource;
    RoundsInputVault: ContractSource;
    RoundsOutputVault: ContractSource;
    [key: string]: ContractSource;
  };
}

export { SubgraphManifest, VaultSource };
