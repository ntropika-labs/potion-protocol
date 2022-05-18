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
    <p>{{ t("user_balance") }}</p>
    <p>{{ userCollateralBalance }}</p>
    <BaseButton
      label="Fetch User Balance"
      class="bg-blue-500 p-4 rounded-full"
      @click="fetchUserCollateralBalance()"
    />

    <p>{{ t("user_allowance") }}</p>
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

  <p>{{ t("connected_wallet") }}</p>
  <pre>{{ connectedWallet?.accounts }}</pre>
  <p>{{ t("connected_chain") }}</p>
  <pre>{{ connectedChain?.id }}</pre>
  <p>{{ t("contracts_addresses") }}</p>
  <pre>{{ contractsAddresses }}</pre>
</template>
<script lang="ts" setup>
import { ConnectWalletButton, BaseButton } from "potion-ui";
import { ref, computed } from "vue";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { contractsAddresses } from "@/helpers/contracts";
import { useOnboard } from "@/composables/useOnboard";
import { useI18n } from "vue-i18n";
import { useEnsAvatar } from "@/composables/useEnsAvatar";

const { t } = useI18n();
const amount = ref(0);

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
  return t("connect_wallet");
});

const { image, status } = useEnsAvatar(connectButtonLabel);
const avatarLoadStatus = computed(() => {
  if (status.value === "RUNNING") {
    return true;
  }
  return false;
});
const {
  userCollateralBalance,
  fetchUserCollateralBalance,
  userAllowance,
  fetchUserCollateralAllowance,
  approveForPotionLiquidityPool,
} = useCollateralToken();
</script>
