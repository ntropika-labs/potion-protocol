//@unocss-include
//
import type { Args, Story } from "@storybook/vue3";
import { SrcsetEnum } from "dapp-types";

import PictureSet from "../PictureSet/PictureSet.vue";
import JumboHeader from "./JumboHeader.vue";

const defaultIconSet = new Map([
  [SrcsetEnum["AVIF"], "/icons/atom.avif"],
  [SrcsetEnum["WEBP"], "/icons/atom.webp"],
  [SrcsetEnum["PNG"], "/icons/atom.png"],
]);
export default {
  title: "Potion UI/JumboHeader",
  component: JumboHeader,
  subcomponents: { PictureSet },
  argTypes: {
    title: {
      name: "Title",
      control: "text",
    },
    subtitle: {
      name: "Subtitle",
      control: "text",
    },
    ctaLabel: {
      name: "Call to action label",
      control: "text",
    },
    iconSrcset: {
      name: "Icon Src set",
      control: "object",
    },
    defaultSlot: {
      name: "Default slot content",
      control: "html",
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { JumboHeader, PictureSet },
  setup() {
    return { args };
  },
  template: `<div class="w-full h-[300px] text-dwhite-400"><JumboHeader v-bind="args" ><template v-if="${
    "defaultSlot" in args
  }" v-slot>${args.defaultSlot}</template></JumboHeader></div>`,
});

export const Overview = Template.bind({});
Overview.args = {
  title: "Jumbo title",
  subtitle: "Jumbo subtitle",
  defaultSlot:
    "<div class='max-w-[80%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem obcaecati illum dolor maxime iure accusantium quas eos debitis, quae laborum, aperiam sunt repellendus consequuntur cupiditate voluptas earum iusto placeat quis.</div>",
  iconSrcset: defaultIconSet,
};
