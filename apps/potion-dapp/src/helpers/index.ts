export { onboardOptions } from "./onboard";
export const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
export const ethereumNetwork = import.meta.env.VITE_ETHEREUM_NETWORK;

export const rpcUrl =
  ethereumNetwork === "localhost"
    ? "http://localhost:8545"
    : `https://eth-${ethereumNetwork}.alchemyapi.io/v2/${alchemyKey}`;
export const webSocketUrl =
  ethereumNetwork === "localhost"
    ? "ws://localhost:8545"
    : `wss://eth-${ethereumNetwork}.alchemyapi.io/v2/${alchemyKey}`;
