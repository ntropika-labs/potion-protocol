import type { Args, Story } from "@storybook/vue3";
import { ref } from "vue";
import InlineMenu from "./InlineMenu.vue";

export default {
  title: "Potion UI/Menu/Inline",
  component: InlineMenu,
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
  components: { InlineMenu },
  setup() {
    const selected = ref("foo");
    const toggle = (key: string) => (selected.value = key);
    return {
      title: args.title,
      items: [
        { name: "foo", label: "Foo" },
        { name: "bar", label: "Bar" },
        { name: "baz", label: "Baz" },
        { name: "qux", label: "Qux" },
      ],
      selected,
      toggle,
    };
  },
  template: `<InlineMenu :title="title" :items="items" :selected-item="selected" @item-selected="toggle"></InlineMenu>`,
});

export const Base = Template.bind({});
Base.args = {
  title: "Lorem ipsum",
};
