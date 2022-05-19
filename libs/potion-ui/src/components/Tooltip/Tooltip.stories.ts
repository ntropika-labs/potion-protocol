// @unocss-include

import type { Story, Args } from "@storybook/vue3";
import Tooltip from "./Tooltip.vue";

export default {
  component: Tooltip,
  excludeStories: /.*Data$/,
  title: "Potion UI/Tooltip",
  argTypes: {
    iconWeight: {
      control: {
        type: "select",
        options: ["thin", "light", "regular", "bold"],
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { Tooltip },
  setup() {
    return { args };
  },
  template: `<Tooltip v-bind="args" class="text-white" />`,
});

export const Default = Template.bind({});
Default.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  iconWeight: "regular",
};
