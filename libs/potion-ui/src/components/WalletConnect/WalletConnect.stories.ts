// @unocss-include

import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/vue3";
import WalletConnect from "./WalletConnect.vue";

export default {
  component: WalletConnect,
  excludeStories: /.*Data$/,
  title: "Potion UI/WalletConnect",
  argTypes: {
    // Actions
    onDisconnect: { action: "disconnect" },
    onConnect: { action: "connect" },
    onClickOutside: { action: "clickOutside" },
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
      defaultValue: "",
    },
    shortAddress: {
      name: "Short Address",
      control: {
        type: "text",
      },
      defaultValue: "",
    },
    ethBalance: {
      name: "ETH Balance",
      control: {
        type: "number",
      },
      defaultValue: 0,
    },
    avatarUrl: {
      name: "Avatar url",
      control: {
        type: "file",
        accept: ".png,.svg,.jpg",
      },
      defaultValue: "",
    },
    fallbackImage: {
      name: "Fallback image",
      control: {
        type: "file",
        accept: ".png,.svg,.jpg",
      },
      defaultValue: "",
    },
    showEnsInfo: {
      name: "Show ENS info",
      control: {
        type: "boolean",
      },
      defaultValue: true,
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

export const Empty = Template.bind({});
