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
    address: {
      name: "Vault Address",
      control: {
        type: "string",
      },
    },
    strike: {
      name: "Strike Percent",
      control: {
        type: "number",
      },
    },
    maxPremium: {
      name: "Max Premium",
      control: {
        type: "number",
      },
    },
    cycleDurationSecs: {
      name: "Cycle duration in seconds",
      control: {
        type: "number",
      },
    },
    strategy: {
      name: "Strategy",
      options: ["PROTECTIVE_PUT", "STRADDLE"],
      control: {
        type: "select",
      },
    },
  },
};

const defArgs = {
  address: "0x1234",
  asset: token,
  strike: 50,
  maxPremium: 10,
  cycleDurationSecs: 86400,
  strategy: "PROTECTIVE_PUT",
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
