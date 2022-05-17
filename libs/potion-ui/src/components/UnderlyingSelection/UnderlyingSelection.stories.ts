// @unocss-include

import { getTokenList } from "potion-tokenlist";

import UnderlyingSelection from "./UnderlyingSelection.vue";

const tokenList = getTokenList("ganache");
const underlyings = tokenList.map((token) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
  active: false,
}));

export default {
  component: UnderlyingSelection,
  excludeStories: /.*Data$/,
  title: "Potion UI/Underlying Selection",
};

export const Overview = () => ({
  components: { UnderlyingSelection },
  setup() {
    return { underlyings };
  },
  template: `<UnderlyingSelection :underlyings="underlyings" />`,
});
