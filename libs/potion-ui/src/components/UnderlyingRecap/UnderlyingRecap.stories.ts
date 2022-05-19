// @unocss-include

import type { Story, Args } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import UnderlyingRecap from "./UnderlyingRecap.vue";
import type { Token } from "potion-tokenlist";

const tokenList = getTokenList("ganache");

const tokenToUnderlying = (token: Token, strike: number, duration: number) => ({
  address: token.address,
  symbol: token.symbol,
  image: token.logoURI,
  name: token.name,
  selected: false,
  strike,
  duration,
});

export default {
  component: UnderlyingRecap,
  excludeStories: /.*Data$/,
  title: "Potion UI/Underlying Recap",
  argTypes: {
    strike: {
      control: {
        type: "range",
        min: 0,
        max: 200,
        step: 1,
      },
    },
    duration: {
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
  components: { UnderlyingRecap },
  setup() {
    return {
      underlyings: args.tokens.map((t: Token) =>
        tokenToUnderlying(t, args.strike, args.duration)
      ),
    };
  },
  template: '<UnderlyingRecap :underlyings="underlyings" />',
});

export const Empty = Template.bind({});
Empty.args = {
  tokens: [],
  strike: 100,
  duration: 30,
};

export const OneToken = Template.bind({});
OneToken.args = {
  tokens: tokenList.slice(0, 1),
  strike: 100,
  duration: 30,
};

export const MultipleTokens = Template.bind({});
MultipleTokens.args = {
  tokens: tokenList,
  strike: 100,
  duration: 30,
};
