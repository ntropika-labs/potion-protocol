<template>
  <JumboHeader
    :title="t('create_potion_title')"
    :subtitle="t('create_potion_subtitle')"
    :cta-label="t('create_potion')"
    :icon-srcset="jumboIconSrcset"
    @click="navigateToPotionCreation"
  >
  </JumboHeader>
  <InnerNav v-bind="innerNavProps" class="mt-10" />
</template>
<script lang="ts" setup>
import InnerNav from "@/components/InnerNav.vue";
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { JumboHeader } from "potion-ui";
import { useRouter, useRoute } from "vue-router";
import { computed } from "vue";
import { useOnboard } from "@onboard-composable";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { connectedWallet } = useOnboard();

const navigateToPotionCreation = () => router.push("custom-potion-creation");

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);

const innerNavProps = computed(() => {
  return {
    currentRoute: route.name,
    routes: [
      {
        name: "discover-potions",
        label: "Discover Potions",
        enabled: true,
        params: {},
      },
      {
        name: "buyer",
        label: "My Potions",
        enabled: connectedWallet.value?.accounts[0].address ? true : false,
        params: {
          address:
            connectedWallet.value?.accounts[0].address.toLowerCase() ??
            "not-valid",
        },
      },
    ],
  };
});
</script>
