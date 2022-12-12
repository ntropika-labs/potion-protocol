<template>
  <HeaderComponent :current-route-name="route?.name?.toString()">
    <template #logo>
      <router-link :to="{ name: 'home' }">
        <img
          :src="logoImg"
          class="h-6 w-auto mb-auto mt-0"
          title="Potion"
          alt="Potion"
        />
      </router-link>
    </template>
    <template #routes>
      <div class="flex flex-col lg:flex-row gap-6">
        <router-link
          v-for="r in routes"
          :key="r.name"
          active-class="shadow-md rounded-md bg-gradient-to-r from-primary-500 to-primary-400 text-dwhite-400"
          :to="{ name: r.name }"
          class="p-2 transition uppercase text-base font-sans"
          :class="[
            {
              'shadow-md rounded-md bg-gradient-to-r from-primary-500 to-primary-400 text-dwhite-400':
                isActiveRoute(r.name),
            },
          ]"
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
import { defineComponent, onMounted } from "vue";

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
    name: "discover-potions",
    label: "Buy Potion",
  },
  {
    name: "discover-templates",
    label: "Pool Liquidity",
  },
  {
    name: "discover-hedging-vaults",
    label: "Hedging Vaults",
  },
  {
    name: "swap-tokens",
    label: "Swap",
  },
];

const activeRouteNameAliases = new Map([
  ["discover-potions", "discover-potions"],
  ["buyer", "discover-potions"],
  ["discover-templates", "discover-templates"],
  ["liquidity-provider", "discover-templates"],
  ["discover-hedging-vaults", "discover-hedging-vaults"],
]);

const isActiveRoute = (navRouteName: string) => {
  const currentRouteName = route.name as string;
  const aliasedActiveRouteName = activeRouteNameAliases.get(currentRouteName);

  return navRouteName == aliasedActiveRouteName;
};

const connectButtonLabel = computed(() => {
  const account = connectedWallet?.value?.accounts[0] ?? null;
  return account?.ens?.name ?? account?.address ?? t("connect_wallet");
});

const { image, status, getAvatarImageUrl } = useEnsAvatar(connectButtonLabel);
const avatarLoadStatus = computed(() => status.value === "RUNNING");

onMounted(getAvatarImageUrl);
</script>
