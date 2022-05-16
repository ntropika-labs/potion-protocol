import { getTokenList } from "potion-tokenlist";
import { computed } from "vue";

const tokenList = getTokenList(import.meta.env.VITE_ETHEREUM_NETWORK);

const useTokenList = (address: string) => {
  const token = tokenList.find((token) => token.address === address);

  const name = computed(() => token?.name);
  const symbol = computed(() => token?.symbol);
  const image = computed(() => token?.logoURI);

  return {
    name,
    symbol,
    image,
  };
};

export { useTokenList };
