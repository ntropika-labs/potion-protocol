// @unocss-include

import type { Story } from "@storybook/vue3";
import BaseButton from "./BaseButton.vue";
import { ButtonSize, ButtonPalette } from "../../types";

import { action } from "@storybook/addon-actions";
import { userEvent, within } from "@storybook/testing-library";

export default {
  component: BaseButton,
  excludeStories: /.*Data$/,
  title: "Potion UI/BaseButton",
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
  template: '<BaseButton v-bind="args" />',
});

export const Extended = () => ({
  components: { BaseButton },
  template: `
    <div class="grid grid-cols-5 gap-8">
      <div>
        <BaseButton label="button" palette="primary" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="primary-o" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary-o"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary-o" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary-o" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="primary-o" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="secondary" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="secondary-o" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary-o"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary-o" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary-o" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="secondary-o" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="accent" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="accent-o" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent-o"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent-o" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent-o" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="accent-o" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="tertiary" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="tertiary"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="tertiary" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="tertiary" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="tertiary" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="white" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>

      <div>
        <BaseButton label="button" palette="white-o" size="lg"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white-o"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white-o" size="sm"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white-o" size="xs"></BaseButton>
      </div><div>
        <BaseButton label="button" palette="white-o" size="icon"><template #pre-icon>👍</template></BaseButton>
      </div>
    </div>
  `,
});

export const PrimaryOutline = Template.bind({});
PrimaryOutline.args = {
  palette: ButtonPalette["primary-o"],
  size: ButtonSize.md,
  label: "Button",
};

export const WithContent = () => ({
  components: { BaseButton },
  template: "<BaseButton><template #pre-icon>👍</template></BaseButton>",
  label: "Button",
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
WithContent.play = ({ args, canvasElement }: any) => {
  const canvas = within(canvasElement);

  userEvent.click(canvas.getByRole("button"));
};
