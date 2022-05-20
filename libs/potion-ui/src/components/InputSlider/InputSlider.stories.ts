// @unocss-include

import type { Story } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";

import InputSlider from "./InputSlider.vue";

export default {
  component: InputSlider,
  excludeStories: /.*Data$/,
  title: "Potion Ui/InputSlider",
  argTypes: {
    // Actions
    onHoverInput: { action: "hover" },
    onFocusInput: { action: "focusin" },
    onFocusoutInput: { action: "focusout" },
    onInput: { action: "input" },
    onUpdateValue: { action: "update:modelValue" },
    onUpdateIsValid: { action: "update:valid" },
    // Configurable options
    symbol: {
      name: "Symbol",
      contrl: "text",
      defaultValue: "%",
    },
    modelValue: {
      name: "Input value",
      contrl: "text",
      defaultValue: "2",
    },
    min: {
      name: "Minimum value",
      contrl: "text",
      defaultValue: "1",
    },
    max: {
      name: "Maximum value",
      contrl: "text",
      defaultValue: "100",
    },
    step: {
      name: "Step value",
      contrl: "text",
      defaultValue: "1",
    },
  },
  // Check if the component is emitting the correct HTML events
  parameters: {
    actions: {
      handles: [
        "mouseover",
        "focusin",
        "focusout",
        "input",
        "update:modelValue",
        "update:valid",
      ],
    },
  },
};

export const actionsData = {
  onInputHover: action("hover-input"),
  onInputFocus: action("focusin-input"),
  onInputFocusout: action("focusout-input"),
};

const Template: Story = (args) => ({
  components: { InputSlider },
  setup() {
    return { args, ...actionsData };
  },
  template: '<InputSlider v-bind="args" />',
});

export const Overview = Template.bind({});
