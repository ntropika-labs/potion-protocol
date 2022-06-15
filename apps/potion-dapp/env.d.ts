/// <reference types="vite/client" />
/// <reference types="vite-plugin-comlink/client" />
// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }
interface ImportMetaEnv {
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_ETHEREUM_NETWORK: "localhost" | "ganache" | "kovan" | "mainnet";
  readonly VITE_SUBGRAPH_ADDRESS: string;
  readonly VITE_ENDPOINT_PROVIDER: string;
  readonly VITE_INFURA_KEY: string;
  readonly VITE_DEVELOPMENT_MNEMONIC: string;
  readonly VITE_DEVELOPMENT_ADDRESS: string;
  readonly VITE_BLOCKNATIVE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
