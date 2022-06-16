<template>
  <JumboHeader
    :title="t('create_potion_title')"
    :subtitle="t('create_potion_subtitle')"
    :cta-label="t('create_potion')"
    :icon-srcset="jumboIconSrcset"
    @click="navigateToPotionCreation"
  >
  </JumboHeader>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { JumboHeader } from "potion-ui";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const navigateToPotionCreation = () => router.push("custom-potion-creation");

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);
</script>
