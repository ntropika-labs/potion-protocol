// @unocss-include

import type { Story } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";

import BaseInput from "./BaseInput.vue";
import { InputType } from "../../types";

export default {
  component: BaseInput,
  excludeStories: /.*Data$/,
  title: "Default Ui/Input",
  argTypes: {
    // Actions
    onHoverInput: { action: "hover" },
    onFocusInput: { action: "focusin" },
    onFocusoutInput: { action: "focusout" },
    onInput: { action: "input" },
    onUpdateValue: { action: "update:modelValue" },
    onUpdateIsValid: { action: "update:valid" },
    // Configurable options
    modelValue: {
      name: "Input text",
      defaultValue: "",
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
    inputType: {
      name: "Type",
      control: {
        type: "select",
      },
      options: Object.keys(InputType),
      defaultValue: InputType.text,
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
  components: { BaseInput },
  setup() {
    return { args, ...actionsData };
  },
  template: '<BaseInput v-bind="args" />',
});

export const Text = Template.bind({});
Text.args = {
  inputType: InputType.text,
  name: "input",
};

export const Email = Template.bind({});
Email.args = {
  inputType: InputType.email,
  name: "input",
};

export const Invalid = Template.bind({});
Email.args = {
  inputType: InputType.email,
  name: "input",
  value: "invalid@email.tld",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Text.play = async ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("textbox"));
  await userEvent.type(canvas.getByRole("textbox"), "my text value");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Email.play = async ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("textbox"));
  await userEvent.type(canvas.getByRole("textbox"), "valid@email.test");
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Invalid.play = async ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("textbox"));
  await userEvent.type(canvas.getByRole("textbox"), "invalid@email.tld");
};
