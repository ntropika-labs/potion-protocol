<template>
  <JumboHeader
    :title="t('create_potion_jumbo_title')"
    :subtitle="t('create_potion_jumbo_subtitle')"
    :cta-label="t('create_potion')"
    :icon-srcset="jumboIconSrcset"
    @click="customPotionOpened = !customPotionOpened"
  >
  </JumboHeader>
  <BaseCard class="gap-4">
    <div class="w-full xl:w-1/3"></div>
    <div class="w-full xl:w-2/3"></div>
  </BaseCard>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { JumboHeader } from "potion-ui";
// import { useOnboard } from "@onboard-composable";
import { ref } from "vue";
import { BaseCard } from "potion-ui";
const { t } = useI18n();
// const { connectedWallet } = useOnboard();
const customPotionOpened = ref(false);

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);
</script>
