/// <reference types="vite/client" />
// declare module "*.vue" {
//   import type { DefineComponent } from "vue";
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }
interface ImportMetaEnv {
  readonly VITE_ALCHEMY_KEY: string;
  readonly VITE_ETHEREUM_NETWORK: "mainnet";
  readonly VITE_INFURA_KEY: string;
  readonly VITE_ORACLE_ADDRESS: string;
  readonly VITE_RUNTIME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
