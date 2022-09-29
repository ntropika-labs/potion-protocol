<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useOnboard } from "@onboard-composable";
import InnerNav from "@/components/InnerNav/InnerNav.vue";

const { t } = useI18n();
const route = useRoute();
const { connectedWallet } = useOnboard();

const routes = computed(() => [
  {
    name: "discover-templates",
    label: t("discover_templates"),
    enabled: true,
  },
  {
    name: "liquidity-provider",
    label: t("my_pools"),
    enabled: connectedWallet.value?.accounts[0].address ? true : false,
    params: {
      lp:
        connectedWallet.value?.accounts[0].address.toLowerCase() ?? "not-valid",
    },
  },
]);
</script>

<template>
  <InnerNav
    class="mt-10"
    :current-route="route.name"
    :routes="routes"
  ></InnerNav>
</template>
