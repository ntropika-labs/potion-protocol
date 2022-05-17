// @unocss-include

import type { Story } from "@storybook/vue3";
import { getTokenList } from "potion-tokenlist";

import TokenIcon from "./TokenIcon.vue";

const tokenList = getTokenList("ganache");
const defaultName = tokenList[0].name;
const defaultLogo = tokenList[0].logoURI;

export default {
  component: TokenIcon,
  excludeStories: /.*Data$/,
  title: "Potion UI/Token Icon",
  argTypes: {
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
    size: {
      name: "Size",
      control: "select",
      options: ["sm", "base", "md", "lg", "xl", "2xl"],
    },
  },
};

const Template: Story = (args) => ({
  components: { TokenIcon },
  setup() {
    return { args };
  },
  template: '<TokenIcon v-bind="args" />',
});

export const Overview = () => ({
  components: { TokenIcon },
  template: `
    <div class="flex items-center gap-8">
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="sm" />
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="base" />
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="md" />
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="lg" />
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="xl" />
      <TokenIcon name="${defaultName}" image="${defaultLogo}" size="2xl" />
    </div>
  `,
});

export const interactable = Template.bind({});
interactable.args = {
  name: defaultName,
  image: defaultLogo,
  size: "md",
};
