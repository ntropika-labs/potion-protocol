import type { Args, Story } from "@storybook/vue3";
import LabelValue from "./LabelValue.vue";

export default {
  title: "Potion UI/LabelValue",
  component: LabelValue,
  argTypes: {
    alignment: {
      name: "Text alignment",
      control: "select",
      options: ["left", "center", "right"],
    },
    title: {
      name: "Title",
      control: "text",
    },
    value: {
      name: "Value",
      control: "text",
    },
    valueType: {
      name: "Type of value",
      control: "select",
      options: ["raw", "number", "timestamp", "date"],
    },
    size: {
      name: "Text size",
      control: "select",
      options: ["sm", "md", "lg"],
    },
    symbol: {
      name: "Symbol",
      control: "text",
    },
    valueColorClass: {
      name: "Color of value",
      control: "text",
    },
    trend: {
      name: "Trend of value",
      control: "select",
      options: ["up", "down"],
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { LabelValue },
  setup() {
    return { args };
  },
  template: `<div class="text-dwhite-400"><LabelValue v-bind="args"></LabelValue></div>`,
});

export const Overview = Template.bind({});
Overview.args = {
  alignment: "left",
  title: "Assets",
  value: "90",
  valueType: "number",
  size: "md",
  symbol: "%",
  valueColorClass: "text-accent-400",
  trend: "up",
};
