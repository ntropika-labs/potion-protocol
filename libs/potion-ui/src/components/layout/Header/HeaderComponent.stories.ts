// @unocss-include

import type { Args, Story } from "@storybook/vue3";
import HeaderComponent from "./HeaderComponent.vue";

export default {
  component: HeaderComponent,
  excludeStories: /.*Data$/,
  title: "Potion UI/HeaderComponent",
  argTypes: {},
};

const Template: Story = (args: Args) => ({
  components: { HeaderComponent },
  setup() {
    return { args };
  },
  template: `<HeaderComponent>
    <template #logo>
      <a href="/">
        <img
          src="/logo.svg"
          class="h-4 mb-auto mt-0"
          title="Potion"
          alt="Potion"
        />
      </a>
    </template>
    <template #routes>
      <a
        class="uppercase text-xl text-white-300"
        href="/"
      >
        Home
      </a>
      <a
      class="uppercase text-xl text-white-300"
      href="/"
      >
        About
      </a>
    </template>
  </HeaderComponent>`,
});

export const Header = Template.bind({});
