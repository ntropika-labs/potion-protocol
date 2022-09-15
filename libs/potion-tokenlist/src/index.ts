import kovan from "./kovan.json";
import ganache from "./ganache.json";
import mainnet from "./mainnet.json";
import goerli from "./goerli.json";
import localhost from "./localhost.json";

export interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
}

const getTokenList = (
  networkName:
    | "localhost"
    | "localhost.hedging"
    | "localhost.goerli"
    | "ganache"
    | "kovan"
    | "goerli"
    | "mainnet"
): Token[] => {
  switch (networkName) {
    case "localhost":
    case "localhost.hedging":
    case "localhost.goerli":
      return localhost.tokens;
    case "ganache":
      return ganache.tokens;
    case "kovan":
      return kovan.tokens;
    case "goerli":
      return goerli.tokens;
    case "mainnet":
      return mainnet.tokens;
    default:
      throw new Error("Unsupported network");
  }
};

export { kovan, ganache, mainnet, getTokenList };
