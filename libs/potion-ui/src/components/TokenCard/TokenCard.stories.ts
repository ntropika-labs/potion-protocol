// @unocss-include

import type { Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import TokenCard from "./TokenCard.vue";

const tokenList = getTokenList("ganache");
const defaultToken = tokenList[0];

export default {
  component: TokenCard,
  excludeStories: /.*Data$/,
  title: "Potion UI/Token Card",
  argTypes: {
    // Configurable options
    address: {
      name: "Address",
      control: "select",
      options: tokenList.map((t) => t.address),
    },
    name: {
      name: "Name",
      control: "select",
      options: tokenList.map((t) => t.name),
    },
    image: {
      name: "Image",
      control: "select",
      options: tokenList.map((t) => t.logoURI),
    },
    symbol: {
      name: "Symbol",
      control: "select",
      options: tokenList.map((t) => t.symbol),
    },
    active: {
      name: "Active",
      control: "boolean",
    },
    onClick: {
      action: "token-selected",
    },
  },
};

const Template: Story = (args) => ({
  components: { TokenCard },
  setup() {
    return { args };
  },
  template: '<TokenCard v-bind="args" />',
});

export const Overview = () => ({
  components: { TokenCard },
  setup() {
    return {
      tokenList: tokenList.map((t, i) => ({ ...t, active: i % 2 === 0 })),
    };
  },
  template: `
    <div class="flex gap-8">
      <TokenCard v-for="token in tokenList" :key="token.address" :address="token.address" :name="token.name" :image="token.logoURI" :symbol="token.symbol" :active="token.active" />
    </div>
  `,
});

export const interactable = Template.bind({});
interactable.args = {
  address: defaultToken.address,
  name: defaultToken.name,
  image: defaultToken.logoURI,
  symbol: defaultToken.symbol,
  active: false,
};
