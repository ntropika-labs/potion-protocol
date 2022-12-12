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

const tabs = [
  {
    title: "Tab 1",
    subtitle: "first tab subtitle",
    isValid: false,
    cta: {
      externalUrl: false,
      label: "example url",
      url: "#",
    },
    enabled: true,
  },
  {
    title: "Tab 2",
    subtitle: "this tab is disabled",
    isValid: false,
    cta: {
      externalUrl: false,
      label: "example url",
      url: "#",
    },
    enabled: false,
  },
  {
    title: "Tab 3",
    subtitle: "this tab is valid",
    isValid: true,
    cta: {
      externalUrl: false,
      label: "example url",
      url: "#",
    },
    enabled: true,
  },
];
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
Overview.args = { tabs };

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
CreatePoolTabs.args = { tabs };
