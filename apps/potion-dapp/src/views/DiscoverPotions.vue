<template>
  <JumboHeader
    test-discover-potions-header
    :title="t('create_potion_title')"
    :subtitle="t('create_potion_subtitle')"
    :cta-label="t('create_potion')"
    :icon-srcset="jumboIconSrcset"
    @click="navigateToPotionCreation"
  >
  </JumboHeader>
  <PotionNav />
  <BaseCard class="p-4 mt-10">
    <h1 class="uppercase text-secondary-500 text-xs">
      {{ t("most_purchased") }}
    </h1>
    <p class="mt-3">{{ t("most_purchased_description") }}</p>
    <div
      test-most-purchased-grid
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6"
    >
      <PotionCard
        v-for="ptn in mostPurchased"
        :key="ptn.id"
        :token="
          getTokenFromAddress(
            ptn.underlyingAsset.address,
            parseInt(ptn.underlyingAsset.decimals)
          )
        "
        :otoken-address="ptn.tokenAddress"
        :strike-price="ptn.strikePrice"
        :expiration="ptn.expiry"
      >
        <router-link
          test-card-navigate-button
          :to="`/potions/${ptn.tokenAddress}`"
          class="rounded-full bg-dwhite-300 py-3 px-4 leading-none text-deepBlack-900 uppercase transition hover:( ring-1 ring-secondary-500 )"
        >
          {{ t("show") }}</router-link
        >
      </PotionCard>
    </div>
    <BaseButton
      v-if="canLoadMorePurchased"
      :inline="true"
      test-load-more
      class="self-center mt-5"
      :label="t('load_more')"
      @click="loadMoreMostPurchased"
    >
    </BaseButton>
  </BaseCard>
  <BaseCard class="p-4 mt-10">
    <h1 class="uppercase text-secondary-500 text-xs">
      {{ t("most_collateralized") }}
    </h1>
    <p class="mt-3">{{ t("most_collateralized_description") }}</p>
    <div
      test-most-collateralized-grid
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6"
    >
      <PotionCard
        v-for="ptn in mostCollateralized"
        :key="ptn.id"
        :token="
          getTokenFromAddress(
            ptn.underlyingAsset.address,
            parseInt(ptn.underlyingAsset.decimals)
          )
        "
        :otoken-address="ptn.tokenAddress"
        :strike-price="ptn.strikePrice"
        :expiration="ptn.expiry"
      >
        <router-link
          :to="`/potions/${ptn.tokenAddress}`"
          class="rounded-full bg-dwhite-300 py-3 px-4 leading-none text-deepBlack-900 uppercase transition hover:( ring-1 ring-secondary-500 )"
        >
          {{ t("show") }}</router-link
        >
      </PotionCard>
    </div>
    <BaseButton
      v-if="canLoadMoreCollateralized"
      test-load-more
      :label="t('load_more')"
      class="self-center mt-5"
      @click="loadMoreMostCollateralized"
    >
    </BaseButton>
  </BaseCard>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { SrcsetEnum } from "dapp-types";
import { PotionCard, BaseCard, BaseButton, JumboHeader } from "potion-ui";

import { usePotions } from "@/composables/usePotions";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { usePoolsLiquidity } from "@/composables/useProtocolLiquidity";

import PotionNav from "@/components/InnerNav/PotionNav.vue";

import { getTokenFromAddress } from "@/helpers/tokens";

const { t } = useI18n();
const router = useRouter();
const { blockTimestamp, getBlock } = useEthersProvider();
const { underlyingsWithLiquidity } = usePoolsLiquidity();

const {
  canLoadMoreCollateralized,
  canLoadMorePurchased,
  mostPurchased,
  mostCollateralized,
  loadMoreMostPurchased,
  loadMoreMostCollateralized,
} = usePotions(underlyingsWithLiquidity, blockTimestamp);

const navigateToPotionCreation = () => router.push("custom-potion-creation");

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);

onMounted(() => getBlock("latest"));
</script>
