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

export const Overview = (args: Args) => ({
  components: { Tooltip },
  setup() {
    return { message: args.message };
  },
  template: `
    <div class="grid gap-3 grid-cols-4 items-center align-center">
      <span class="text-white">Thin</span>
      <span class="text-white">Light</span>
      <span class="text-white">Regular</span>
      <span class="text-white">Bold</span>
      <Tooltip :message="message" class="text-white" icon-weight="thin" />
      <Tooltip :message="message" class="text-white" icon-weight="light" />
      <Tooltip :message="message" class="text-white" icon-weight="regular" />
      <Tooltip :message="message" class="text-white" icon-weight="bold" />
      <Tooltip :message="message" class="text-secondary-500" icon-weight="thin" />
      <Tooltip :message="message" class="text-secondary-500" icon-weight="light" />
      <Tooltip :message="message" class="text-secondary-500" icon-weight="regular" />
      <Tooltip :message="message" class="text-secondary-500" icon-weight="bold" />
      <Tooltip :message="message" class="text-accent-500" icon-weight="thin" />
      <Tooltip :message="message" class="text-accent-500" icon-weight="light" />
      <Tooltip :message="message" class="text-accent-500" icon-weight="regular" />
      <Tooltip :message="message" class="text-accent-500" icon-weight="bold" />
      <Tooltip :message="message" class="text-tertiary-500" icon-weight="thin" />
      <Tooltip :message="message" class="text-tertiary-500" icon-weight="light" />
      <Tooltip :message="message" class="text-tertiary-500" icon-weight="regular" />
      <Tooltip :message="message" class="text-tertiary-500" icon-weight="bold" />
    </div>`,
});

Overview.args = {
  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const Template: Story = (args: Args) => ({
  components: { Tooltip },
  setup() {
    return {
      label: args.label,
      message: args.message,
      weight: args.iconWeight,
    };
  },
  template: `
    <div class="flex gap-[1ch] text-white items-center">
      <span>{{ label }}</span>
      <Tooltip :message="message" :icon-weight="weight" />
    </div>`,
});

export const TextAndTooltip = Template.bind({});
TextAndTooltip.args = {
  label: "Lorem ipsum dolor sit amet",
  message: "consectetur adipiscing elit.",
  iconWeight: "regular",
};
