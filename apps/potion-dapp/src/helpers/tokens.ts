import { useTokenList } from "@/composables/useTokenList";

import type { OptionToken, Token } from "dapp-types";

const getTokenFromAddress = (address: string): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol };
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
