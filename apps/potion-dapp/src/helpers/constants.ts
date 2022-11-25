export const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
export const ethereumNetwork = import.meta.env.VITE_ETHEREUM_NETWORK;

const getAlchemyUrl = (protocol: string, network = ethereumNetwork) => {
  if (network.match(/localhost/)) {
    return `${protocol}://localhost:8545`;
  }
  if (network.match(/mumbai/)) {
    return `${protocol}://polygon-mumbai.g.alchemy.com/v2/${alchemyKey}`;
  }
  return `${protocol}://eth-${network}.alchemyapi.io/v2/${alchemyKey}`;
};

const getEtherscanUrl = (network = ethereumNetwork) => {
  if (network.match(/mainnet/)) {
    return "https://etherscan.io";
  }
  if (network.match(/mumbai/)) {
    return "https://mumbai.polygonscan.com";
  }
  return `https://${ethereumNetwork}.etherscan.io`;
};

export const rpcUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? getAlchemyUrl("http")
    : getAlchemyUrl("https");
export const webSocketUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? getAlchemyUrl("ws")
    : getAlchemyUrl("wss");
export const etherscanUrl = getEtherscanUrl();

export const uniswapRpcUrl =
  ethereumNetwork.indexOf("localhost") === 0
    ? getAlchemyUrl("https", "mainnet")
    : getAlchemyUrl("https");
