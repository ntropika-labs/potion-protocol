import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";

const injected = injectedModule();
const walletConnect = walletConnectModule();
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

export const onboardOptions = {
  accountCenter: {
    desktop: {
      enabled: true,
    },
  },
  wallets: [walletConnect, injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`,
    },
    {
      id: "0x7a69",
      token: "ETH",
      label: "Local Node",
      rpcUrl: "http://localhost:8545",
    },
  ],
  appMetadata: {
    name: "Dapp",
    icon: "<svg><svg/>",
    description: "Demo app for Eth Dev Monorepo",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
    ],
  },
};
