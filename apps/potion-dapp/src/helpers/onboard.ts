import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

import { alchemyKey, ethereumNetwork } from "./";

import type { Chain } from "@web3-onboard/common";

const injected = injectedModule();
const walletConnect = walletConnectModule();
const chains: Chain[] = [];
switch (ethereumNetwork) {
  case "localhost":
    chains.push({
      id: "0x7a69",
      token: "ETH",
      label: "Local Node",
      rpcUrl: "http://localhost:8545",
    });
    break;
  case "kovan":
    chains.push({
      id: "0x2a",
      token: "ETH",
      label: "Kovan Testnet",
      rpcUrl: `https://eth-kovan.alchemyapi.io/v2/${alchemyKey}`,
    });
    break;
  case "mainnet":
    chains.push({
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
    });
    break;
  default:
    throw new Error(`Unknown ethereum network: ${ethereumNetwork}`);
}
export const onboardOptions = {
  accountCenter: {
    desktop: {
      enabled: false,
    },
    mobile: {
      enabled: false,
    },
  },
  wallets: [walletConnect, injected],
  chains: chains,
  appMetadata: {
    name: "Potion Protocol",
    icon: "<svg><svg/>",
    description: "Potion Protocol frontend application",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "Frame", url: "https://frame.sh" },
    ],
  },
};

export const mockWeb3Onboard: MockWeb3Onboard = {
  state() {
    return this;
  },
  disconnectWallet() {
    if (this.wallets.length > 0) {
      console.info("remove wallet");
    }
  },
  connectWallet() {
    if (this.wallets.length === 0) {
      console.info("add wallet");
    }
  },
  chains: [
    {
      namespace: "evm",
      id: "0x7a69",
      rpcUrl: "http://localhost:8545",
      label: "Test Node",
      token: "ETH",
      color: "#f5f5f5",
      icon: "<svg><svg/>",
    },
  ],
  walletModules: [],
  wallets: [
    {
      label: "Metamask",
      icon: "<svg><svg/>",
      provider: {},
      accounts: [
        {
          address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          ens: null,
          balance: {
            eth: 10000,
          },
        },
      ],
      chains: [
        {
          id: "0x7a69",
          namespace: "evm",
        },
      ],
    },
  ],
  accountCenter: {
    enabled: false,
    position: "topRight",
    expanded: false,
  },
};
export interface MockAccountState {
  address: string;
  ens: null;
  balance: {
    eth: number;
  };
}
export interface MockChainState {
  id: string;
  namespace: "evm" | undefined;
}

export interface MockWalletState {
  label: string;
  icon: string;
  provider: unknown;
  accounts: MockAccountState[];
  chains: MockChainState[];
}
export interface MockWeb3Onboard {
  state(): this;
  disconnectWallet(): void;
  connectWallet(): void;
  chains: Chain[];
  walletModules: [];
  wallets: MockWalletState[];
  accountCenter: {
    enabled: boolean;
    position: string;
    expanded: boolean;
  };
}
