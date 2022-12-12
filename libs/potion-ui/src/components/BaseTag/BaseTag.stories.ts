import type { Args, Story } from "@storybook/vue3";
import BaseTag from "./BaseTag.vue";

export default {
  title: "Potion UI/BaseTag",
  component: BaseTag,
  argTypes: {
    title: {
      name: "title",
      control: {
        type: "text",
      },
    },
    isEmpty: {
      name: "isEmpty",
      control: {
        type: "boolean",
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { BaseTag },
  setup() {
    return { args };
  },
  template: `<BaseTag v-bind="args" >USDC</BaseTag>`,
});

export const Base = Template.bind({});
