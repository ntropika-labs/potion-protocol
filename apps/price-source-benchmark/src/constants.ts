const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
const infuraKey = import.meta.env.VITE_INFURA_KEY;

const alchemyRpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`;
const infuraRpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`;
const ankrRpcUrl = "https://rpc.ankr.com/eth";

export { alchemyRpcUrl, infuraRpcUrl, ankrRpcUrl };
