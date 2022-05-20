// @unocss-include

import type { Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import { UnderlyingSelectionWrapper } from "./SelectedUnderlyingWrapper.vue";
import { TokenIcon } from "potion-ui";

const tokenList = getTokenList("ganache");
const defaultName = tokenList[0].symbol;
const defaultLogo = tokenList[0].logoURI;

export default {
  component: UnderlyingSelectionWrapper,
  excludeStories: /.*Data$/,
  title: "Potion UI/Selection Wrapper",
  argTypes: {
    assetSymbol: {
      name: "Asset Symbol",
      control: "select",
      options: tokenList.map((t) => t.symbol),
      defaultValue: defaultName,
    },
    assetImage: {
      name: "Asset Image",
      control: "select",
      options: tokenList.map((t) => t.logoURI),
      defaultValue: defaultLogo,
    },
  },
};

const Template: Story = (args) => ({
  components: { UnderlyingSelectionWrapper, TokenIcon },
  setup() {
    return { args };
  },
  template:
    '<UnderlyingSelectionWrapper v-bind="args"></UnderlyingSelectionWrapper>',
});

export const Overview = Template.bind({});
