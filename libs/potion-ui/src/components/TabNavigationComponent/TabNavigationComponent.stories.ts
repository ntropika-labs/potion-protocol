// @unocss-include

import type { Args, Story } from "@storybook/vue3";
import TabNavigationComponent from "./TabNavigationComponent.vue";
import TabComponent from "../TabComponent/TabComponent.vue";

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
  },
};

const Template: Story = (args: Args) => ({
  components: { TabNavigationComponent, TabComponent },
  setup() {
    return { args };
  },
  template: `<TabNavigationComponent v-bind='args'>
    <TabComponent title='1'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">1</div></TabComponent>
    <TabComponent title='2'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">2</div></TabComponent>
    <TabComponent title='3'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">3</div></TabComponent>
    <TabComponent title='4'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">4</div></TabComponent>
  </TabNavigationComponent>`,
});

export const Overview = Template.bind({});

const CreatePoolTemplate: Story = (args: Args) => ({
  components: { TabNavigationComponent, TabComponent },
  setup() {
    return { args };
  },
  template: `<TabNavigationComponent v-bind='args'>
    <TabComponent title='Pool Setup'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">1</div></TabComponent>
    <TabComponent title='Curve Setting'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">2</div></TabComponent>
    <TabComponent title='Review & Creation'><div class="bg-light/10 py-12 text-center text-dwhite-400 text-3xl font-bold">3</div></TabComponent>
  </TabNavigationComponent>`,
});

export const CreatePoolTabs = CreatePoolTemplate.bind({});
