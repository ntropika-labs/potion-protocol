// @unocss-include

import type { Story } from "@storybook/vue3";

import TokenIcon from "./TokenIcon.vue";

export default {
  component: TokenIcon,
  excludeStories: /.*Data$/,
  title: "Potion UI/Token Icon",
  argTypes: {
    // Configurable options
    name: {
      name: "Name",
    },
    image: {
      name: "Image",
    },
    size: {
      name: "Size",
      defaultValue: "md",
    },
  },
};

const Template: Story = (args) => ({
  components: { TokenIcon },
  setup() {
    return { args };
  },
  template: '<TokenIcon v-bind="args" />',
});

export const Overview = () => ({
  components: { TokenIcon },
  template: `
    <div class="grid grid-cols-6 gap-8">
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="sm" />
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="base" />
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="md" />
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="lg" />
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="xl" />
      <TokenIcon name="Wrapped Ether" image="https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png" size="2xl" />
    </div>
  `,
});

export const sm = Template.bind({});
export const base = Template.bind({});
export const md = Template.bind({});
export const lg = Template.bind({});
export const xl = Template.bind({});
export const xl2 = Template.bind({});

sm.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "sm",
};

base.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "base",
};

md.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "md",
};

lg.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "lg",
};

xl.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "xl",
};

xl2.args = {
  name: "Wrapped Ether",
  image:
    "https://tokens.1inch.io/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
  size: "2xl",
};
