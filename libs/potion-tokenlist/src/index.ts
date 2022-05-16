import kovan from "./kovan.json";
import ganache from "./ganache.json";
import mainnet from "./mainnet.json";

const getTokenList = (networkName: "ganache" | "kovan" | "mainnet") => {
  switch (networkName) {
    case "ganache":
      return ganache.tokens;
    case "kovan":
      return kovan.tokens;
    case "mainnet":
      return mainnet.tokens;
    default:
      throw new Error("Unsupported network");
  }
};

export { kovan, ganache, mainnet, getTokenList };
