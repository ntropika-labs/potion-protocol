//@unocss-include

import type { Args, Story } from "@storybook/vue3";
import CardNewItem from "./CardNewItem.vue";

export default {
  title: "Potion UI/Cards/NewItem",
  component: CardNewItem,
  argTypes: {
    label: {
      name: "label",
      control: {
        type: "text",
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { CardNewItem },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><CardNewItem v-bind="args" ></CardNewItem></div>`,
});

export const CardWithPlus = Template.bind({});
CardWithPlus.args = { label: "Add new Item" };
