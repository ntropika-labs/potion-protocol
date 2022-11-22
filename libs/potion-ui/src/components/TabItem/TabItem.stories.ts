// @unocss-include

import TabItem from "./TabItem.vue";
import type { Args, Story } from "@storybook/vue3";

export default {
  component: TabItem,
  excludeStories: /.*Data$/,
  title: "Potion UI/TabItem",
  argTypes: {
    text: {
      name: "text",
      control: {
        type: "text",
      },
    },
    isActive: {
      name: "isActive",
      control: {
        type: "boolean",
      },
    },
  },
};

export const Overview = (args: Args) => ({
  components: { TabItem },
  setup() {
    return { text: args.text };
  },
  template: `
    <div class="text-white grid gap-y-3 gap-x-6 grid-cols-2 items-center align-center w-2/3 mw-1200px">
      <span>Active</span>
      <span>Not Active</span>
      <TabItem :is-active="true">{{text}}</TabItem>
      <TabItem :is-active="false">{{text}}</TabItem>
    </div>`,
});

Overview.args = {
  text: "Lorem ipsum dolor sit amet",
};

const Template: Story = (args: Args) => ({
  components: { TabItem },
  setup() {
    return {
      text: args.text,
      isActive: args.isActive,
    };
  },
  template: `
    <div class="flex text-white items-center w-300px">
      <TabItem :is-active="isActive">{{text}}</TabItem>
    </div>`,
});

export const Interactable = Template.bind({});
Interactable.args = {
  text: "Lorem ipsum dolor sit amet",
  isActive: true,
};
