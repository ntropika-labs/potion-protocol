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
    withdrawable: {
      name: "Withdrawable",
      control: {
        type: "boolean",
      },
    },
    expiry: {
      name: "Expiration timestamp",
      control: {
        type: "number",
      },
    },
    strikePrice: {
      name: "Strike price",
      control: {
        type: "text",
      },
    },
    currentPayout: {
      name: "Current Payout",
      control: {
        type: "text",
      },
    },
    quantity: {
      name: "Quantity",
      control: {
        type: "number",
      },
    },
  },
};
const defArgs = {
  token: token,
  withdrawable: true,
  expiry: "1659385444",
  strikePrice: "1000000",
  currentPayout: "34",
  quantity: "38",
  etherscan: {
    url: "#",
    label: "0xd34db33f",
  },
};
const Template: Story = (args: Args) => ({
  components: { PotionCard },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><PotionCard v-bind="args" ></PotionCard></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
