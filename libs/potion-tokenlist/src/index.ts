import ganache from "./ganache.json";
import goerli from "./goerli.json";
import kovan from "./kovan.json";
import localhost from "./localhost.json";
import mainnet from "./mainnet.json";
import mumbai from "./mumbai.json";

export interface Token {
  name: string;
  symbol: string;
  address: string;
  logoURI: string;
}

type GanacheDeployments = "ganache";
type GoerliDeployments = "goerli";
type KovanDeployments = "kovan";
type LocalDeployments =
  | "localhost"
  | "localhost.hedging"
  | "localhost.multivault"
  | "localhost.goerli";
type MainnetDeployments = "mainnet";
type MumbaiDeployments = "mumbai" | "ply-mumbai.testcomp";

const getTokenList = (
  networkName:
    | GanacheDeployments
    | GoerliDeployments
    | KovanDeployments
    | LocalDeployments
    | MainnetDeployments
    | MumbaiDeployments
): Token[] => {
  if (/ganache/.test(networkName)) {
    return ganache.tokens;
  }
  if (/goerli/.test(networkName)) {
    return goerli.tokens;
  }
  if (/kovan/.test(networkName)) {
    return kovan.tokens;
  }
  if (/localhost/.test(networkName)) {
    return localhost.tokens;
  }
  if (/mainnet/.test(networkName)) {
    return mainnet.tokens;
  }
  if (/mumbai/.test(networkName)) {
    return mumbai.tokens;
  }
  throw new Error("Unsupported network");
};

export { kovan, ganache, mainnet, getTokenList };
