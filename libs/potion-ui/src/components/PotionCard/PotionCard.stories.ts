import type { Args, Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import PotionCard from "./PotionCard.vue";

const tokenList = getTokenList("ganache");
const token = tokenList
  .map((token) => ({
    address: token.address,
    symbol: token.symbol,
    image: token.logoURI,
    name: token.name,
  }))
  .pop();

export default {
  title: "Potion UI/Cards/PotionCard",
  component: PotionCard,
  argTypes: {
    expiration: {
      name: "Expiration timestamp",
      control: {
        type: "text",
      },
    },
    strikePrice: {
      name: "Strike price",
      control: {
        type: "text",
      },
    },
    otokenAddress: {
      name: "OToken address",
      control: {
        type: "text",
      },
    },
  },
};
const defArgs = {
  token: token,
  expiry: "1659385444",
  strikePrice: "2348",
  otokenAddress: "0x0000000000000000000000000000000000000000",
};
const Template: Story = (args: Args) => ({
  components: { PotionCard },
  setup() {
    return { args };
  },
  template: `<div class="w-[300px]"><PotionCard v-bind="args" ></PotionCard></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
