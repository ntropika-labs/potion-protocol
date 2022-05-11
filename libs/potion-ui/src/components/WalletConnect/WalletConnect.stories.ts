// @unocss-include

import { action } from "@storybook/addon-actions";
import type { Args, Story } from "@storybook/vue3";
import WalletConnect from "./WalletConnect.vue";

export default {
  component: WalletConnect,
  excludeStories: /.*Data$/,
  title: "Potion UI/WalletConnect",
  argTypes: {
    // Actions
    // onDisconnect: { action: "disconnect" },
    // onConnect: { action: "connect" },
    // onClickOutside: { action: "clickOutside" },
    // Configurable options
    isConnected: {
      name: "Is connected",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    isConnecting: {
      name: "Is connecting",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    ensOrAddress: {
      name: "Ens or Address",
      control: {
        type: "text",
      },
      defaultValue: "0xd3adb33f",
    },
    ethBalance: {
      name: "ETH Balance",
      control: {
        type: "number",
      },
      defaultValue: 9530.583,
    },
    avatarUrl: {
      name: "Avatar url",
      control: {
        type: "text",
      },
      defaultValue: "/logo.svg",
    },
    showConnectButton: {
      name: "Show connect button",
      control: {
        type: "boolean",
      },
      defaultValue: true,
    },
    hasAdditionalInfo: {
      name: "Has additional info",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
  },
  // Check if the component is emitting the correct HTML events
  parameters: {
    actions: {
      handles: ["connect", "disconnect", "clickOutside"],
    },
  },
};

export const actionsData = {
  onConnect: action("connect"),
  onDisconnect: action("disconnect"),
  onClickOutside: action("clickOutside"),
};

const Template: Story = (args) => ({
  components: { WalletConnect },
  setup() {
    return { args, ...actionsData };
  },
  template: `<WalletConnect v-bind="args"></WalletConnect>`,
});

export const Overview = Template.bind({});

export const DropdownMenu = (args: Args) => ({
  components: { WalletConnect },
  setup() {
    return { args, ...actionsData };
  },
  template: `
  <WalletConnect v-bind="args">
    <p>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque quaerat quo autem nobis dolorum qui sunt neque sequi nam deleniti sit minus, iusto ut eveniet, est ab vel fugiat error.
    </p>
  </WalletConnect>
  `,
});
