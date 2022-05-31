//@unocss-include
//
import type { Args, Story } from "@storybook/vue3";
import PutOptionsTable from "./PutOptionsTable.vue";
import BaseButton from "../BaseButton/BaseButton.vue";

export default {
  title: "Potion UI/PutOptionsTable",
  component: PutOptionsTable,
  subcomponents: { BaseButton },
  argTypes: {},
};

const headings = ["Column1", "Column2", "Column3", "Column4"];
const dataset = [
  [
    { value: "Value1" },
    { value: 7 },
    { value: "Value3" },
    { button: true, color: "primary", label: "claim", claimable: true },
  ],
  [
    { value: "Value2" },
    { value: 14 },
    { value: "Value7" },
    { button: true, color: "primary", label: "claim", claimable: false },
  ],
  [
    { value: "Value2" },
    { value: 21 },
    { value: "Value8" },
    { button: true, color: "primary", label: "claim", claimable: false },
  ],
  [
    { value: "Value4" },
    { value: 28 },
    { value: "Value9" },
    { button: true, color: "primary", label: "claim", claimable: true },
  ],
];
const Template: Story = (args: Args) => ({
  components: { PutOptionsTable },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-full"><PutOptionsTable v-bind="args" ></PutOptionsTable></div>`,
});

export const Overview = Template.bind({});
Overview.args = { headings, dataset };
