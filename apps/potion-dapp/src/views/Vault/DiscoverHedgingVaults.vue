<script setup lang="ts">
import { onMounted, ref, unref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { JumboHeader, CardGrid, VaultCard } from "potion-ui";
import { SrcsetEnum } from "dapp-types";

import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";

import { multiVaultAddresses } from "@/helpers/hedgingVaultContracts";

import type { Token } from "dapp-types";

interface VaultData {
  address: string;
  asset: Token;
  size: number;
  hedgingRate: number;
  strikePercentage: number;
}

const { t } = useI18n();
const router = useRouter();

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const vaultData = ref<VaultData[]>([]);

onMounted(async () => {
  const promises = multiVaultAddresses.map(
    async ({ vault, potionBuyAction }) => {
      const { strikePercentage, getStrategyInfo } = usePotionBuyActionContract(
        potionBuyAction,
        false
      );
      const { principalPercentages, getPrincipalPercentages } =
        useInvestmentVaultContract(vault, false);
      const { tokenAsset, totalAssets, fetchVaultData } = useErc4626Contract(
        vault,
        false
      );
      await Promise.all([
        getStrategyInfo(),
        getPrincipalPercentages(),
        fetchVaultData(),
      ]);
      return {
        address: vault,
        asset: unref(tokenAsset),
        size: unref(totalAssets),
        hedgingRate: unref(principalPercentages)[0],
        strikePercentage: unref(strikePercentage),
      };
    }
  );
  vaultData.value = await Promise.all(promises);
});

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
      v-for="vault in vaultData"
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
