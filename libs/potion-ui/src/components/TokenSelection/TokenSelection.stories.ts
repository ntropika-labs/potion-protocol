// @unocss-include

import { getTokenList } from "potion-tokenlist";

import TokenSelection from "./TokenSelection.vue";

const tokenList = getTokenList("ganache");
const tokens = tokenList.map((token) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
  selected: false,
}));

export default {
  component: TokenSelection,
  excludeStories: /.*Data$/,
  title: "Potion UI/Token Selection",
};

export const Overview = () => ({
  components: { TokenSelection },
  setup() {
    return { tokens };
  },
  template: `<TokenSelection :tokens="tokens" />`,
});
