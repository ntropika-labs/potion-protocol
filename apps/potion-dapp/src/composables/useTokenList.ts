import { getTokenList } from "potion-tokenlist";

console.log(import.meta.env.VITE_ETHEREUM_NETWORK);
const tokenList = getTokenList(import.meta.env.VITE_ETHEREUM_NETWORK);

const useTokenList = (address: string) => {
  const token = tokenList.find((token) => token.address === address);

  const name = token?.name ?? "";
  const symbol = token?.symbol ?? "";
  const image = token?.logoURI ?? "";

  return {
    name,
    symbol,
    image,
  };
};

export { tokenList, useTokenList };
