<template>
  <JumboHeader
    :title="t('create_potion_jumbo_title')"
    :subtitle="t('create_potion_jumbo_subtitle')"
    :cta-label="t('create_potion')"
    :icon-srcset="jumboIconSrcset"
  >
  </JumboHeader>
  <router-link to="/about">About Page</router-link>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { JumboHeader } from "potion-ui";

const { t } = useI18n();

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);
</script>
