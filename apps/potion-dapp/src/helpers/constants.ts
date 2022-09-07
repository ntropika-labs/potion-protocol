export const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
export const ethereumNetwork = import.meta.env.VITE_ETHEREUM_NETWORK;
export const rpcUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? "http://localhost:8545"
    : `https://eth-${ethereumNetwork}.alchemyapi.io/v2/${alchemyKey}`;
export const webSocketUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? "ws://localhost:8545"
    : `wss://eth-${ethereumNetwork}.alchemyapi.io/v2/${alchemyKey}`;
export const etherscanUrl =
  ethereumNetwork === "mainnet"
    ? "https://etherscan.io"
    : `https://${ethereumNetwork}.etherscan.io`;

export const uniswapRpcUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`
    : `https://eth-${ethereumNetwork}.alchemyapi.io/v2/${alchemyKey}`;
