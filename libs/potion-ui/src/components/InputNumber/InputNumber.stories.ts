import type { Args, Story } from "@storybook/vue3";
import InputNumber from "./InputNumber.vue";

export default {
  title: "Potion UI/InputNumber",
  component: InputNumber,
  argTypes: {
    title: {
      name: "title",
      control: {
        type: "text",
      },
    },
    unit: {
      name: "unit",
      control: {
        type: "text",
      },
    },
  },
};

const defaultArgs = { title: "Amazing InputNumber", unit: "USDC" };

const Template: Story = (args: Args) => ({
  components: { InputNumber },
  setup() {
    return { args };
  },
  template: `<div class=" w-[300px]"><InputNumber v-bind="args" ></InputNumber></div>`,
});

export const BaseInput = Template.bind({});
BaseInput.args = { ...defaultArgs };
