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

type LocalDeployments =
  | "localhost"
  | "localhost.hedging"
  | "localhost.multivault"
  | "localhost.goerli";
type GanacheDeployments = "ganache";
type KovanDeployments = "kovan";
type GoerliDeployments = "goerli";
type MainnetDeployments = "mainnet";

const getTokenList = (
  networkName:
    | LocalDeployments
    | GanacheDeployments
    | KovanDeployments
    | GoerliDeployments
    | MainnetDeployments
): Token[] => {
  if (/localhost/.test(networkName)) {
    return localhost.tokens;
  }
  if (/ganache/.test(networkName)) {
    return ganache.tokens;
  }
  if (/kovan/.test(networkName)) {
    return kovan.tokens;
  }
  if (/goerli/.test(networkName)) {
    return goerli.tokens;
  }
  if (/mainnet/.test(networkName)) {
    return mainnet.tokens;
  }
  throw new Error("Unsupported network");
};

export { kovan, ganache, mainnet, getTokenList };
