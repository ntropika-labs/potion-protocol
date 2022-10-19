import type { Args, Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import VaultCard from "./VaultCard.vue";

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
  title: "Potion UI/Cards/VaultCard",
  component: VaultCard,
  argTypes: {
    hedgingRate: {
      name: "Hedging Rate",
      control: {
        type: "number",
      },
    },
    strike: {
      name: "Strike Percent",
      control: {
        type: "number",
      },
    },
    size: {
      name: "Size of the Vault",
      control: {
        type: "number",
      },
    },
    currency: {
      name: "Currency",
      options: ["USDC"],
      control: {
        type: "select",
      },
    },
  },
};

const defArgs = {
  asset: token,
  hedgingRate: 10,
  strike: 50,
  size: 5000,
  currency: "USDC",
};

const Template: Story = (args: Args) => ({
  components: { VaultCard },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><VaultCard v-bind="args" ></VaultCard></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
