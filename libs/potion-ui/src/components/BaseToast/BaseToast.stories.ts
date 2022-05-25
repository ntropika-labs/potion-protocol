//@unocss-include
//
import type { Args, Story } from "@storybook/vue3";
import PictureSet from "../PictureSet/PictureSet.vue";
import BaseToast from "./BaseToast.vue";
import { SrcsetEnum } from "dapp-types";

const defaultIconSet = new Map([
  [SrcsetEnum["AVIF"], "/icons/atom.avif"],
  [SrcsetEnum["WEBP"], "/icons/atom.webp"],
  [SrcsetEnum["PNG"], "/icons/atom.png"],
]);
export default {
  title: "Potion UI/BaseToast",
  component: BaseToast,
  subcomponents: { PictureSet },
  argTypes: {
    title: {
      name: "Title",
      control: {
        type: "text",
      },
    },
    body: {
      name: "Body",
      control: {
        type: "text",
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { BaseToast, PictureSet },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-[300px]"><BaseToast v-bind="args" ></BaseToast></div>`,
});

console.log(defaultIconSet);

export const Overview = Template.bind({});
Overview.args = {
  title: "Toast title",
  body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem obcaecati illum dolor maxime iure accusantium quas eos debitis, quae laborum, aperiam sunt repellendus consequuntur cupiditate voluptas earum iusto placeat quis.",
  srcsetMap: defaultIconSet,
};
