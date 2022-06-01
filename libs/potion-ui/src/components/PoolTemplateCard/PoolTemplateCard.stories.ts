//@unocss-include
//
import type { Args, Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import BaseCard from "../BaseCard/BaseCard.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import LabelValue from "../LabelValue/LabelValue.vue";
import TokenIcon from "../TokenIcon/TokenIcon.vue";
import PoolTemplateCard from "./PoolTemplateCard.vue";

const tokenList = getTokenList("ganache");
const tokens = tokenList.map((token) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
  selected: false,
}));

export default {
  title: "Potion UI/Cards/PoolTemplateCard",
  component: PoolTemplateCard,
  subcomponents: { BaseCard, LabelValue, BaseTag, TokenIcon },
  argTypes: {
    creator: {
      name: "Owner of the template",
      control: {
        type: "object",
      },
    },
    totalSize: {
      name: "Total size",
      control: {
        type: "text",
      },
    },
    currencySymbol: {
      name: "Currency symbol",
      control: {
        type: "text",
      },
    },
    timesCloned: {
      name: "Times cloned",
      control: {
        type: "text",
      },
    },
    totalPnl: {
      name: "Total PNL",
      control: {
        type: "text",
      },
    },
  },
};
const defArgs = {
  tokens: tokens,
  creator: { label: "0xd34d...b33f", link: "/" },
  totalSize: "5195838333",
  currencySymbol: "USDC",
  timesCloned: "4",
  totalPnl: "49",
};
const Template: Story = (args: Args) => ({
  components: { PoolTemplateCard },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><PoolTemplateCard v-bind="args" ></PoolTemplateCard></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
