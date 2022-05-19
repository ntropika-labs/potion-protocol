// @unocss-include

import type { Story, Args } from "@storybook/vue3";
import { ref } from "vue";
import MinusPlusInput from "./MinusPlusInput.vue";

export default {
  component: MinusPlusInput,
  excludeStories: /.*Data$/,
  title: "Potion UI/Minus Plus/Input",
};

const Template: Story<typeof MinusPlusInput> = (args: Args) => ({
  components: { MinusPlusInput },
  setup() {
    const value = ref(args.initialValue);
    return { args, value };
  },
  template: `
    <MinusPlusInput
      class="border border-white border-opacity-10 rounded-md max-w-[20rem]"
      v-model="value"
      :min="args.min"
      :max="args.max"
      :step="args.step"
      :label="args.label"
    />`,
});

export const Default = Template.bind({});
Default.args = {
  initialValue: 0,
  min: 0,
  max: 100,
  step: 1,
  label: "Label",
};
