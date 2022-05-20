// @unocss-include

import type { Story, Args } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import CriteriasRecap from "./CriteriasRecap.vue";

import type { Token } from "potion-tokenlist";

const tokenList = getTokenList("ganache");

const tokenToCriteria = (
  token: Token,
  maxStrike: number,
  maxDuration: number
) => ({
  token: {
    address: token.address,
    symbol: token.symbol,
    image: token.logoURI,
    name: token.name,
  },
  maxStrike,
  maxDuration,
});

export default {
  component: CriteriasRecap,
  excludeStories: /.*Data$/,
  title: "Potion UI/Criterias Recap",
  argTypes: {
    maxStrike: {
      control: {
        type: "range",
        min: 0,
        max: 200,
        step: 1,
      },
    },
    maxDuration: {
      control: {
        type: "range",
        min: 0,
        max: 365,
        step: 1,
      },
    },
    tokens: {
      table: {
        disable: true,
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { CriteriasRecap },
  setup() {
    return {
      criterias: args.tokens.map((t: Token) =>
        tokenToCriteria(t, args.maxStrike, args.maxDuration)
      ),
    };
  },
  template: '<CriteriasRecap :criterias="criterias" />',
});

export const Empty = Template.bind({});
Empty.args = {
  tokens: [],
  maxStrike: 100,
  maxDuration: 30,
};

export const OneToken = Template.bind({});
OneToken.args = {
  tokens: tokenList.slice(0, 1),
  maxStrike: 100,
  maxDuration: 30,
};

export const MultipleTokens = Template.bind({});
MultipleTokens.args = {
  tokens: tokenList,
  maxStrike: 100,
  maxDuration: 30,
};
