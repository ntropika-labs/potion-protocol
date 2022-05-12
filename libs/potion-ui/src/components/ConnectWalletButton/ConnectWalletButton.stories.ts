// @unocss-include
import type { Args, Story } from "@storybook/vue3";
import ConnectWalletButton from "./ConnectWalletButton.vue";
import { action } from "@storybook/addon-actions";

export default {
  component: ConnectWalletButton,
  excludeStories: /.*Data$/,
  title: "Potion UI/ConnectWalletButton",
  argTypes: {
    // Actions
    onConnect: { action: "connectWallet" },
    onDisconnect: { action: "disconnectWallet" },
    //Configurable options
    label: {
      name: "Label",
      control: {
        required: true,
      },
      defaultValue: "Connect Wallet",
    },
    connected: {
      name: "Is connected",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    imageLoading: {
      name: "Is image loading",
      control: {
        type: "boolean",
      },
      defaultValue: false,
    },
    // slot: {
    // name: "Content",
    // control: { // required: true, // },
    // },
    // Check if thecomponent is emitting the correct HTML events
    parameters: {
      actions: {
        handles: ["connectWallet-button", "disconnectWallet-button"],
      },
    },
  },
};

export const actionsData = {
  onConnect: action("connectWallet-button"),
  onDisconnect: action("disconnectWallet-button"),
};

const Template: Story = (args: Args) => ({
  components: { ConnectWalletButton },
  setup() {
    return { args, ...actionsData };
  },
  template: '<ConnectWalletButton v-bind="args" />',
});

export const Overview = Template.bind({});
