<template>
  <button
    class="p-1 bg-green-700 rounded-full text-white font-bold"
    @click="connectWallet()"
  >
    Onboard Connection
  </button>
  <p>Connected Wallet:</p>
  <!-- <pre>{{ onboard.onboardState.value.wallets }}</pre> -->
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
import { contractsAddresses } from "@/helpers/contracts";
import { useOnboard } from "@/composables/useOnboard";
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
const route = useRoute();
let layout = $computed(() => {
  return route.meta.layout;
});
const { connectedChain, connectedWallet, connectWallet } = useOnboard();
</script>
