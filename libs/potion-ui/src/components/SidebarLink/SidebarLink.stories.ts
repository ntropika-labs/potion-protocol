import type { Args, Story } from "@storybook/vue3";
import { SrcsetEnum } from "dapp-types";

import SidebarLink from "./SidebarLink.vue";

export default {
  title: "Potion UI/SidebarLink",
  component: SidebarLink,
  argTypes: {
    title: {
      name: "title",
      control: {
        type: "text",
      },
    },
    selected: {
      name: "selected",
      control: {
        type: "boolean",
      },
    },
    iconSrcSet: {
      name: "icon",
      control: "object",
    },
  },
};

const defaultIconSet = new Map([
  [SrcsetEnum["AVIF"], "/icons/atom.avif"],
  [SrcsetEnum["WEBP"], "/icons/atom.webp"],
  [SrcsetEnum["PNG"], "/icons/atom.png"],
]);

const defArgs = {
  title: "Amazing SidebarLink",
  selected: false,
  iconSrcSet: defaultIconSet,
};
const Template: Story = (args: Args) => ({
  components: { SidebarLink },
  setup() {
    return { args };
  },
  template: `<div class="h-[400px] w-full"><SidebarLink v-bind="args" ></SidebarLink></div>`,
});

export const Overview = Template.bind({});
Overview.args = { ...defArgs };
