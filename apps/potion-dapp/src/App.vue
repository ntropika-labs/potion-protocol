<template>
  <button
    class="p-1 bg-green-700 rounded-full text-white font-bold"
    @click="connectWallet()"
  >
    Onboard Connection
  </button>
  <p>User collateral balance</p>
  <p v-if="loading">loading...</p>
  <p v-else>{{ userCollateralBalance }}</p>
  <button
    class="bg-blue-500 p-4 rounded-full"
    @click="fetchUserCollateralBalance()"
  >
    Fetch User Balance
  </button>
  <p>User allowance for Potion Liquidity Pool Contract</p>
  <p>{{ userAllowance }}</p>
  <button
    class="bg-blue-500 p-4 rounded-full"
    @click="fetchUserCollateralAllowance()"
  >
    Fetch User Allowance
  </button>
  <div>
    <input v-model="amount" type="number" class="border border-1" />
    <button
      class="bg-blue-500 p-4 rounded-full"
      @click="approveForPotionLiquidityPool(amount)"
    >
      Add Allowance
    </button>
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
import { ref } from "vue";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { contractsAddresses } from "@/helpers/contracts";
import { useOnboard } from "@/composables/useOnboard";
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
const amount = ref(0);
const route = useRoute();
let layout = $computed(() => {
  return route.meta.layout;
});
const { connectedChain, connectedWallet, connectWallet } = useOnboard();
const {
  loading,
  userCollateralBalance,
  fetchUserCollateralBalance,
  userAllowance,
  fetchUserCollateralAllowance,
  approveForPotionLiquidityPool,
} = useCollateralToken();
</script>
