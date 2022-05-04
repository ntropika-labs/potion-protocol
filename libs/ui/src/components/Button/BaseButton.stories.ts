// @unocss-include

import type { Story } from "@storybook/vue3";
import BaseButton from "./BaseButton.vue";
import { ButtonSize, ButtonPalette } from "../../types";

import { action } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";

export default {
  component: BaseButton,
  excludeStories: /.*Data$/,
  title: "Default Ui/BaseButton",
  argTypes: {
    // Actions
    onHoverButton: { action: "hover" },
    onClickButton: { action: "clicked" },
    // Configurable options
    disabled: {
      name: "Is disabled",
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
      defaultValue: "Button",
    },
    // slot: {
    //   name: "Content",
    //   control: {
    //     required: true,
    //   },
    // },
    size: {
      name: "Size",
      control: {
        type: "select",
      },
      options: Object.keys(ButtonSize),
      defaultValue: "medium",
    },
    palette: {
      name: "Palette",
      control: {
        type: "select",
      },
      options: Object.keys(ButtonPalette),
      defaultValue: "primary",
    },
  },
  // Check if the component is emitting the correct HTML events
  parameters: {
    actions: {
      handles: ["mouseover", "click .btn"],
    },
  },
};

export const actionsData = {
  onButtonHover: action("hover-button"),
  onButtonClick: action("click-button"),
};

const Template: Story = (args) => ({
  components: { BaseButton },
  setup() {
    return { args, ...actionsData };
  },
  template: '<base-button v-bind="args" />',
});

export const Extended = () => ({
  components: { BaseButton },
  template: `
    <div class="grid grid-cols-4 gap-8">
      <div>
        <base-button label="button" palette="primary" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="primary"></base-button>
      </div><div>
        <base-button label="button" palette="primary" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="primary" size="icon" label="">👍</base-button>
      </div><div>
        <base-button label="button" palette="primary-o" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="primary-o"></base-button>
      </div><div>
        <base-button label="button" palette="primary-o" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="primary-o" size="icon" label="">👍</base-button>
      </div><div>
        <base-button label="button" palette="secondary" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="secondary"></base-button>
      </div><div>
        <base-button label="button" palette="secondary" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="secondary" size="icon" label="">👍</base-button>
      </div><div>
        <base-button label="button" palette="secondary-o" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="secondary-o"></base-button>
      </div><div>
        <base-button label="button" palette="secondary-o" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="secondary-o" size="icon" label="">👍</base-button>
      </div><div>
        <base-button label="button" palette="opaque" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="opaque"></base-button>
      </div><div>
        <base-button label="button" palette="opaque" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="opaque" size="icon" label="">👍</base-button>
      </div><div>
        <base-button label="button" palette="transparent" size="large"></base-button>
      </div><div>
        <base-button label="button" palette="transparent"></base-button>
      </div><div>
        <base-button label="button" palette="transparent" size="small"></base-button>
      </div><div>
        <base-button label="button" palette="transparent" size="icon" label="">👍</base-button>
      </div>
    </div>
  `,
});

export const Primary = Template.bind({});
Primary.args = {
  palette: ButtonPalette.primary,
  size: ButtonSize.medium,
  label: "Button",
};

export const PrimaryOutline = Template.bind({});
PrimaryOutline.args = {
  palette: ButtonPalette["primary-o"],
  size: ButtonSize.medium,
  label: "Button",
};

export const Secondary = Template.bind({});
Secondary.args = {
  palette: ButtonPalette.secondary,
  size: ButtonSize.medium,
  label: "Button",
};

export const SecondaryOutline = Template.bind({});
SecondaryOutline.args = {
  palette: ButtonPalette["secondary-o"],
  size: ButtonSize.medium,
  label: "Button",
};

export const Opaque = Template.bind({});
Opaque.args = {
  palette: ButtonPalette.opaque,
  size: ButtonSize.medium,
  label: "Button",
};

export const Transparent = Template.bind({});
Transparent.args = {
  palette: ButtonPalette.transparent,
  size: ButtonSize.medium,
  label: "Button",
};

export const WithContent = () => ({
  components: { BaseButton },
  template: "<base-button>👍</base-button>",
  label: "Button",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
WithContent.play = async ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button"));
};
