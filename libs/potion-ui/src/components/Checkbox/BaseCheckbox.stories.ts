// @unocss-include

import type { Story } from "@storybook/vue3";
import BaseCheckbox from "./BaseCheckbox.vue";

import { action } from "@storybook/addon-actions";

export default {
  component: BaseCheckbox,
  excludeStories: /.*Data$/,
  title: "Default Ui/Checkbox",
  argTypes: {
    // Actions
    onHoverInput: { action: "hover" },
    onFocusInput: { action: "focusin" },
    onFocusoutInput: { action: "focusout" },
    onUpdateValue: { action: "update:modelValue" },
    onUpdateIsValid: { action: "update:valid" },
    // Configurable options
    modelValue: {
      name: "Checked",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    isInline: {
      name: "Is inline",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    isDisabled: {
      name: "Is disabled",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    isReadonly: {
      name: "Is Read only",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    label: {
      name: "Label",
      control: {
        required: true,
      },
      defaultValue: "Label",
    },
  },
  // Check if the component is emitting the correct HTML events
  parameters: {
    actions: {
      handles: [
        "mouseover",
        "focusin",
        "focusout",
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
  components: { BaseCheckbox },
  setup() {
    return { args, ...actionsData };
  },
  template: '<base-checkbox v-bind="args" />',
});

export const Unchecked = Template.bind({});
Unchecked.args = {
  name: "input",
  vModel: false,
};

export const Checked = Template.bind({});
Checked.args = {
  name: "input",
  vModel: true,
};
