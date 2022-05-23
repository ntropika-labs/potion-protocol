// @unocss-include

import type { Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import { SelectedTokenWrapper } from "./SelectedTokenWrapper.vue";
import { TokenIcon, InputSlider } from "potion-ui";
import { ref } from "vue";

const tokenList = getTokenList("ganache");

export default {
  component: SelectedTokenWrapper,
  excludeStories: /.*Data$/,
  title: "Potion UI/Selection Wrapper",
  argTypes: {
    token: {
      control: "object",
      defaultValue: tokenList[0],
    },
    priceInfo: {
      loading: ref(true),
      price: ref(0),
      formattedPrice: ref("US$10"),
      success: ref(false),
    },
  },
};

const Template: Story = (args) => ({
  components: { SelectedTokenWrapper, TokenIcon, InputSlider },
  setup() {
    return { args };
  },
  template: '<SelectedTokenWrapper v-bind="args"></SelectedTokenWrapper>',
});

export const Overview = Template.bind({});
