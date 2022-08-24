import { useTokenList } from "@/composables/useTokenList";

import type { OptionToken, Token } from "dapp-types";

const getTokenFromAddress = (address: string, decimals = 18): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol, decimals };
};

const toOptionToken = (
  token: Token,
  duration: string,
  strike: string,
  id = "",
  isPut = false
): OptionToken => {
  return {
    id,
    isPut,
    duration,
    strike,
    ...token,
  };
};

export { getTokenFromAddress, toOptionToken };
