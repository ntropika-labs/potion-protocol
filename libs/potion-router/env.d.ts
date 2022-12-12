interface ImportMetaEnv {
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_ETHEREUM_NETWORK: "localhost" | "ganache" | "kovan" | "mainnet";
  readonly VITE_SUBGRAPH_ADDRESS: string;
  readonly VITE_ENDPOINT_PROVIDER: string;
  readonly VITE_INFURA_KEY: string;
  readonly VITE_DEVELOPMENT_MNEMONIC: string;
  readonly VITE_DEVELOPMENT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
