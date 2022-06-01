// @unocss-include

import { getTokenList } from "potion-tokenlist";

import UnderlyingList from "./UnderlyingList.vue";

const tokenList = getTokenList("ganache");
const assets = tokenList.map((token, index) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
  id: index,
  isPut: false,
  duration: 1 + Math.ceil(Math.random() * 364),
  strike: 1 + Math.ceil(Math.random() * 199),
}));

const priceMap = assets.reduce(
  (map, asset) => map.set(asset.address, Math.random() * 1000),
  new Map()
);
const stableCoinCollateral = "USDC";

export default {
  component: UnderlyingList,
  excludeStories: /.*Data$/,
  title: "Potion UI/Underlying List",
};

export const Overview = () => ({
  components: { UnderlyingList },
  setup() {
    return { assets, priceMap, stableCoinCollateral };
  },
  template: `<div class="w-full max-w-256 text-dwhite-400"><UnderlyingList :assets-flat="assets" :price-map="priceMap" :stable-coin-collateral="stableCoinCollateral" /></div>`,
});
