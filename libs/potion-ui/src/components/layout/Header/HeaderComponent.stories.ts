// @unocss-include

import type { Args, Story } from "@storybook/vue3";
import HeaderComponent from "./HeaderComponent.vue";
import ConnectWalletButton from "../../ConnectWalletButton/ConnectWalletButton.vue";
import LogoutIcon from "../../icons/LogoutIcon.vue";

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
      <div class="flex justify-self-end gap-8">
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
      </div>
      
    </template>
  </HeaderComponent>`,
});

export const Header = Template.bind({});

const PotionTemplate: Story = (args: Args) => ({
  components: { HeaderComponent, ConnectWalletButton, LogoutIcon },
  setup() {
    return { args };
  },
  template: `<HeaderComponent>
<template #logo><a href="/">
<img
  src="/logo.svg"
  class="h-4 mb-auto mt-0"
  title="Potion"
  alt="Potion"
/>
</a></template>
  <template #routes>
      <div class="flex space-x-6">
        <a
          href=""
          class="text-dwhite-300 p-2 transition uppercase text-sm"
          >Buy Potion</a
        ><a
        href=""
        class="text-dwhite-300 p-2 transition uppercase text-sm"
        >Discover Pools</a
      >
      </div>
      <div class="flex justify-center">
        <ConnectWalletButton
          :connected="true"
          label="d3adb33f"
          :image-loading="false"
        ></ConnectWalletButton>
      </div>
  </template>
</HeaderComponent>`,
});

export const PotionHeader = PotionTemplate.bind({});
