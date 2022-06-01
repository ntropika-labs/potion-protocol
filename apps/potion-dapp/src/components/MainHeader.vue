<template>
  <HeaderComponent :current-route-name="route?.name?.toString()">
    <template #logo
      ><router-link :to="{ name: 'home' }">
        <img
          :src="logoImg"
          class="h-6 w-auto mb-auto mt-0"
          title="Potion"
          alt="Potion"
        /> </router-link
    ></template>
    <template #routes>
      <div class="flex flex-col md:flex-row gap-6">
        <router-link
          v-for="r in routes"
          :key="r.name"
          active-class="shadow-md rounded-md bg-gradient-to-r from-primary-500 to-primary-400 text-dwhite-400"
          :to="{ name: r.name }"
          class="p-2 transition uppercase text-base font-sans"
          >{{ r.label }}</router-link
        >
      </div>
      <div class="flex justify-center">
        <ConnectWalletButton
          :label="connectButtonLabel"
          :avatar="image"
          :connected="connectedWallet ? true : false"
          :image-loading="avatarLoadStatus"
          @connect-wallet="connectWallet"
          @disconnect-wallet="disconnectConnectedWallet"
        />
      </div>
    </template>
  </HeaderComponent>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainHeader",
});
</script>
<script lang="ts" setup>
import { computed } from "vue";

import { HeaderComponent, ConnectWalletButton } from "potion-ui";

import { useOnboard } from "@onboard-composable";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useEnsAvatar } from "@/composables/useEnsAvatar";
import logoImg from "@/assets/logo-dark.svg";

const { t } = useI18n();
const route = useRoute();
const { connectedWallet, connectWallet, disconnectConnectedWallet } =
  useOnboard();

const routes = [
  {
    name: "home",
    label: "Buy Potion",
  },
  {
    name: "discover-templates",
    label: "Pool Liquidity",
  },
];
const connectButtonLabel = computed(() => {
  if (connectedWallet && connectedWallet.value?.accounts[0].ens) {
    return connectedWallet.value.accounts[0].ens.name;
  }
  if (connectedWallet && connectedWallet.value?.accounts[0].address) {
    return connectedWallet.value.accounts[0].address;
  }
  return t("connect_wallet");
});

const { image, status } = useEnsAvatar(connectButtonLabel);
const avatarLoadStatus = computed(() => {
  if (status.value === "RUNNING") {
    return true;
  }
  return false;
});
</script>
