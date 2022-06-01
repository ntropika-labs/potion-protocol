import type { Args, Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import PoolCard from "./PoolCard.vue";

const tokenList = getTokenList("ganache");
const tokens = tokenList.map((token) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
}));

export default {
  title: "Potion UI/Cards/PoolCard",
  component: PoolCard,
  argTypes: {
    active: {
      name: "active",
      control: {
        type: "boolean",
      },
    },
    size: {
      name: "size",
      control: {
        type: "text",
      },
    },
    utilization: {
      name: "utilization",
      control: {
        type: "text",
      },
    },
    pnl: {
      name: "pnl",
      control: {
        type: "text",
      },
    },
  },
};
const defArgs = {
  tokens: tokens,
  active: false,
  size: "1000000",
  utilization: "34",
  pnl: "38.59",
};
const Template: Story = (args: Args) => ({
  components: { PoolCard },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><PoolCard v-bind="args" ></PoolCard></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
