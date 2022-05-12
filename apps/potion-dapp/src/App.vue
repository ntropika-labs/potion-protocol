<template>
  <router-link to="/about">About Page</router-link>
  <ConnectWalletButton
    :label="connectButtonLabel"
    :avatar="image"
    :connected="connectedWallet ? true : false"
    :image-loading="avatarLoadStatus"
    @connect-wallet="connectWallet"
    @disconnect-wallet="disconnectConnectedWallet"
  />
  <div class="flex flex-col gap-2 mt-10">
    <p>User collateral balance</p>
    <p v-if="loading">loading...</p>
    <p v-else>{{ userCollateralBalance }}</p>
    <BaseButton
      label="Fetch User Balance"
      class="bg-blue-500 p-4 rounded-full"
      @click="fetchUserCollateralBalance()"
    />

    <p>User allowance for Potion Liquidity Pool Contract</p>
    <p>{{ userAllowance }}</p>
    <BaseButton
      label="Fetch User Allowance"
      class="bg-blue-500 p-4 rounded-full"
      @click="fetchUserCollateralAllowance()"
    />
    <div>
      <input
        v-model="amount"
        type="number"
        class="border border-1 block rounded-lg p-1"
      />
      <BaseButton
        label="Add Allowance
"
        class="bg-blue-500 p-4 rounded-full"
        @click="approveForPotionLiquidityPool(amount)"
      />
    </div>
  </div>

  <p>Connected Wallet:</p>
  <pre>{{ connectedWallet?.accounts }}</pre>
  <p>Connected Chain</p>
  <pre>{{ connectedChain?.id }}</pre>
  <p>Contracts Addresses</p>
  <pre>{{ contractsAddresses }}</pre>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script lang="ts" setup>
import { ConnectWalletButton, BaseButton } from "potion-ui";
import { ref, computed } from "vue";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { contractsAddresses } from "@/helpers/contracts";
import { useOnboard } from "@/composables/useOnboard";
import { useRoute } from "vue-router";
import { useEnsAvatar } from "./composables/useEnsAvatar";
const amount = ref(0);
const route = useRoute();
const layout = computed(() => {
  return route.meta.layout;
});
const {
  connectedChain,
  connectedWallet,
  connectWallet,
  disconnectConnectedWallet,
} = useOnboard();
const connectButtonLabel = computed(() => {
  if (connectedWallet && connectedWallet.value?.accounts[0].ens) {
    return connectedWallet.value.accounts[0].ens.name;
  }
  if (connectedWallet && connectedWallet.value?.accounts[0].address) {
    return connectedWallet.value.accounts[0].address;
  }
  return "Connect Wallet";
});

const { image, status } = useEnsAvatar(connectButtonLabel);
const avatarLoadStatus = computed(() => {
  if (status.value === "RUNNING") {
    return true;
  }
  return false;
});
const {
  loading,
  userCollateralBalance,
  fetchUserCollateralBalance,
  userAllowance,
  fetchUserCollateralAllowance,
  approveForPotionLiquidityPool,
} = useCollateralToken();
</script>
