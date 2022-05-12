// @unocss-include

import type { Story } from "@storybook/vue3";
import List from "./ListComponent.vue";

import { action } from "@storybook/addon-actions";
import BaseCheckbox from "../Checkbox/BaseCheckbox.vue";
import BaseInput from "../Input/BaseInput.vue";

export default {
  component: List,
  decorators: [() => ({ template: '<div class="m-8 flex"><story/></div>' })],
  excludeStories: /.*Data$/,
  title: "Default Ui/List",
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
      name: "Items",
      control: {
        type: "object",
      },
    },
    isLoading: {
      name: "Is loading",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    hasPagination: {
      name: "Is paginated",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    hasMassSelection: {
      name: "Has item selection",
      control: {
        type: "boolean",
      },
      defaultValue: false,
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
  subcomponents: [BaseCheckbox, BaseInput],
};

export const actionsData = {
  onInputHover: action("hover-input"),
  onInputFocus: action("focusin-input"),
  onInputFocusout: action("focusout-input"),
};

const Template: Story = (args) => ({
  components: { List },
  setup() {
    return { args, ...actionsData };
  },
  template: '<ListComponent v-bind="args" />',
});

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  modelValue: [],
};

export const Empty = Template.bind({});
Empty.args = {
  modelValue: [],
};

export const Default = Template.bind({});
Default.args = {
  modelValue: [
    {
      id: 1,
      label: "First",
    },
    {
      id: 2,
      label: "Second",
    },
    {
      id: 3,
      label: "Third",
    },
  ],
};

export const MassSelection = Template.bind({});
MassSelection.args = {
  hasMassSelection: true,
  modelValue: [
    {
      id: 1,
      label: "First",
      selected: true,
    },
    {
      id: 2,
      label: "Second",
    },
    {
      id: 3,
      label: "Third",
    },
  ],
};
