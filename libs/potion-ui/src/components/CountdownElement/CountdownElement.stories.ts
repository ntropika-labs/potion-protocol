import type { Args, Story } from "@storybook/vue3";
import CountdownElement from "./CountdownElement.vue";

export default {
  title: "Potion UI/CountdownElement",
  component: CountdownElement,
  argTypes: {
    label: {
      name: "Label",
      control: {
        type: "string",
      },
    },
    endDate: {
      name: "End date",
      control: {
        type: "date",
      },
    },
    startDate: {
      name: "Start date",
      control: {
        type: "date",
      },
    },
    direction: {
      name: "direction",
      control: {
        type: "select",
        options: ["row", "column"],
      },
    },
  },
};

const date = new Date();
date.setDate(date.getDate() + 1);

const defArgs = {
  label: "Current Round ends in",
  endDate: date,
};

const Template: Story = (args: Args) => ({
  components: { CountdownElement },
  setup() {
    return { args };
  },
  template: `<CountdownElement v-bind="args" ></CountdownElement>`,
});

export const Countdown = Template.bind({});
Countdown.args = { ...defArgs };
