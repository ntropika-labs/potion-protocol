<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { JumboHeader, CardGrid, VaultCard } from "potion-ui";
import { SrcsetEnum } from "dapp-types";

import { useHedgingVaults } from "@/composables/useHedgingVaults";

const { t } = useI18n();
const router = useRouter();

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const { vaults } = useHedgingVaults();

const toVault = (id: string) => {
  router.push({ name: "hedging-vault", params: { id } });
};
</script>

<template>
  <JumboHeader
    :title="t('hedging_vault_title')"
    :subtitle="t('heding_vault_subtitle')"
    :cta-label="t('hedging_vault')"
    :icon-srcset="jumboIconSrcset"
  >
    <div class="pt-2 pb-4">
      <a href="#" class="text-primary-500 uppercase text-sm">{{
        t("learn_more")
      }}</a>
    </div>
  </JumboHeader>
  <CardGrid
    class="mt-10"
    :title="t('discover_hedging_vaults_title')"
    :subtitle="t('discover_hedging_vaults_subtitle')"
  >
    <VaultCard
      v-for="vault in vaults"
      :key="vault.address"
      :asset="vault.asset"
      :hedging-rate="vault.hedgingRate"
      :size="vault.size"
      :strike="vault.strikePercentage"
      @selected="toVault(vault.address)"
    >
    </VaultCard>
  </CardGrid>
</template>
