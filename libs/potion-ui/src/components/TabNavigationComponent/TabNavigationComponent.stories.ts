// @unocss-include

import type { Args, Story } from "@storybook/vue3";
import TabNavigationComponent from "./TabNavigationComponent.vue";

export default {
  component: TabNavigationComponent,
  excludeStories: /.*Data$/,
  title: "Potion UI/TabNavigation",
  argTypes: {
    defaultIndex: {
      name: "Default active tab index",
      control: {
        type: "number",
      },
      defaultValue: 0,
    },
    hasNavigation: {
      name: "Show navigation buttons",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    tabs: {
      name: "Tabs",
      control: {
        type: "object",
      },
      defaultValue: {},
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { TabNavigationComponent },
  setup() {
    return { args };
  },
  template: `<TabNavigationComponent v-bind='args'>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">1</div>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">2</div>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">3</div>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">4</div>
  </TabNavigationComponent>`,
});

export const Overview = Template.bind({});

const CreatePoolTemplate: Story = (args: Args) => ({
  components: { TabNavigationComponent },
  setup() {
    return { args };
  },
  template: `<TabNavigationComponent v-bind='args'>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">1</div>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">2</div>
    <div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">3</div>
  </TabNavigationComponent>`,
});

export const CreatePoolTabs = CreatePoolTemplate.bind({});
