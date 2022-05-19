//@unocss-include
//
import type { Args, Story } from "@storybook/vue3";
import CardFooter from "../CardFooter/CardFooter.vue";
import BaseCard from "./BaseCard.vue";

export default {
  title: "Potion UI/BaseCard",
  component: BaseCard,
  subcomponents: { CardFooter },
  argTypes: {
    color: {
      name: "color",
      control: {
        type: "radio",
        options: [
          "glass",
          "neutral",
          "no-bg",
          "secondary-radial",
          "primary-radial-inactive",
          "primary-radial",
          "clean",
        ],
      },
    },
    fullHeight: {
      name: "fullHeight",
      control: {
        type: "boolean",
      },
    },
    roundSize: {
      name: "roundSize",
      control: {
        type: "radio",
        options: ["none", "small", "default"],
      },
    },
    direction: {
      name: "direction",
      control: {
        options: ["row", "column"],
        type: "radio",
      },
    },
  },
};
const defArgs = { roundSize: "default", direction: "column", fullHeight: true };
const Template: Story = (args: Args) => ({
  components: { BaseCard },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><BaseCard v-bind="args" ></BaseCard></div>`,
});
const TemplateFooter: Story = (args: Args) => ({
  components: { BaseCard, CardFooter },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><BaseCard v-bind="args" class="justify-end" ><CardFooter class="text-dwhite-300">This is a footer</CardFooter></BaseCard></div>`,
});

export const CardWithFooter = TemplateFooter.bind({});
CardWithFooter.args = { color: "glass", ...defArgs };
export const Glass = Template.bind({});
Glass.args = { color: "glass", ...defArgs };

export const SecondaryRadial = Template.bind({});
SecondaryRadial.args = { color: "secondary-radial", ...defArgs };

export const PrimaryRadial = Template.bind({});
PrimaryRadial.args = { color: "primary-radial", ...defArgs };

export const PrimaryRadialInactive = Template.bind({});
PrimaryRadialInactive.args = { color: "primary-radial-inactive", ...defArgs };

export const NoBg = Template.bind({});
NoBg.args = { color: "no-bg", ...defArgs };

export const Neutral = Template.bind({});
Neutral.args = { color: "neutral", ...defArgs };

export const Clean = Template.bind({});
Clean.args = { color: "clean", ...defArgs };
