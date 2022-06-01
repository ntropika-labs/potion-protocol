import type { Args, Story } from "@storybook/vue3";
import { ref } from "vue";
import DropdownMenu from "./DropdownMenu.vue";

export default {
  title: "Potion UI/Menu/Dropdown",
  component: DropdownMenu,
  argTypes: {
    title: {
      name: "title",
    },
    isEmpty: {
      name: "isEmpty",
      control: {
        type: "boolean",
      },
    },
  },
};

const Template: Story = (args: Args) => ({
  components: { DropdownMenu },
  setup() {
    const itemsSelectedStatus = ref(
      new Map([
        ["foo", true],
        ["bar", true],
        ["baz", true],
        ["qux", true],
      ])
    );
    const toggle = (key: string) =>
      itemsSelectedStatus.value.set(key, !itemsSelectedStatus.value.get(key));
    return {
      title: args.title,
      items: [
        { name: "foo", label: "Foo" },
        { name: "bar", label: "Bar" },
        { name: "baz", label: "Baz" },
        { name: "qux", label: "Qux" },
      ],
      itemsSelectedStatus,
      toggle,
    };
  },
  template: `<DropdownMenu :title="title" :items="items" :items-selected-status="itemsSelectedStatus" @item-selected="toggle"></DropdownMenu>`,
});

export const Base = Template.bind({});
Base.args = {
  title: "Lorem ipsum",
};
