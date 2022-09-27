/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUBGRAPH_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
