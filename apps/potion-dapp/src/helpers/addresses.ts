import { etherscanUrl } from "./constants";

const getEtherscanUrl = (address: string, type: "address" | "tx" = "address") =>
  `${etherscanUrl}/${type}/${address}`;
const isValidAddress = (value: string) => value.startsWith("0x");
const formatAddress = (address: string) => address.toLowerCase();

export { getEtherscanUrl, isValidAddress, formatAddress };
