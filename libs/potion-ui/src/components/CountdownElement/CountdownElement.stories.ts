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
    endTimestampSeconds: {
      name: "End date timestamp in seconds",
      control: {
        type: "number",
      },
    },
    startTimestampSeconds: {
      name: "Start date timestamp in seconds",
      control: {
        type: "number",
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

const startDate = new Date();
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + 1);

const defArgs = {
  label: "Current Round ends in",
  endTimestampSeconds: endDate.getTime() / 1000,
  startTimestampSeconds: startDate.getTime() / 1000,
  expirationMessage: "expired",
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
