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
  <BaseCard class="p-4 mt-10">
    <h1 class="uppercase text-secondary-500 text-xs">
      {{ t("most_purchased") }}
    </h1>
    <p class="mt-3">{{ t("most_purchased_description") }}</p>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6"
    >
      <PotionCard
        v-for="ptn in loadedMostPurchasedPotions"
        :key="ptn.id"
        :token="
          underlyingToToken(
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
          >{{ t("show") }}</router-link
        >
      </PotionCard>
    </div>
    <BaseButton
      v-if="canLoadMoreMostPurchasedPotions"
      :inline="true"
      class="self-center mt-5"
      :label="t('load_more')"
      @click="mostPurchasedPotionsQuery()"
    >
    </BaseButton>
  </BaseCard>
  <BaseCard class="p-4 mt-10">
    <h1 class="uppercase text-secondary-500 text-xs">
      {{ t("most_collateralized") }}
    </h1>
    <p class="mt-3">{{ t("most_collateralized_description") }}</p>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6"
    >
      <PotionCard
        v-for="ptn in loadedMostPurchasedPotions"
        :key="ptn.id"
        :token="
          underlyingToToken(
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
          >{{ t("show") }}</router-link
        ></PotionCard
      >
    </div>
    <BaseButton
      v-if="canLoadMoreMostCollateralizedPotions"
      :label="t('load_more')"
      class="self-center mt-5"
      @click="mostCollateralizedPotionsQuery()"
    >
    </BaseButton>
  </BaseCard>
</template>
<script lang="ts" setup>
import InnerNav from "@/components/InnerNav.vue";
import type { Token } from "dapp-types";
import { PotionCard, BaseCard, BaseButton } from "potion-ui";
import {
  useGetMostPurchasedPotionsQuery,
  useGetMostCollateralizedPotionsQuery,
} from "subgraph-queries/generated/urql";
import { useI18n } from "vue-i18n";
import { SrcsetEnum } from "dapp-types";
import { JumboHeader } from "potion-ui";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useOnboard } from "@onboard-composable";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { usePoolsLiquidity } from "@/composables/useProtocolLiquidity";
import { useTokenList } from "@/composables/useTokenList";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { connectedWallet } = useOnboard();
const { blockTimestamp, getBlock } = useEthersProvider();
const { underlyingsWithLiquidity } = usePoolsLiquidity();

const navigateToPotionCreation = () => router.push("custom-potion-creation");

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/potion-big.avif"],
  [SrcsetEnum.PNG, "/icons/potion-big.png"],
  [SrcsetEnum.WEBP, "/icons/potion-big.webp"],
]);

const underlyingToToken = (address: string, decimals = 18): Token => {
  const { name, symbol, image } = useTokenList(address);
  return {
    address,
    decimals,
    name,
    symbol,
    image,
  };
};

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
interface Otoken {
  id: string;
  tokenAddress: string;
  underlyingAsset: {
    id: string;
    symbol: string;
    name: string;
    address: string;
    decimals: string;
  };
  expiry: string;
  strikePrice: string;
}
const defaultLimit = 8;

const loadedMostPurchasedPotions = ref<Otoken[]>([]);
const loadedMostCollateralizedPotions = ref<Otoken[]>([]);
const canLoadMoreMostPurchasedPotions = computed(() => {
  if (
    loadedMostPurchasedPotions.value.length >= 8 &&
    loadedMostPurchasedPotions.value.length % 8 === 0
  ) {
    return true;
  }
  return false;
});
const canLoadMoreMostCollateralizedPotions = computed(() => {
  if (
    loadedMostCollateralizedPotions.value.length >= 8 &&
    loadedMostCollateralizedPotions.value.length % 8 === 0
  ) {
    return true;
  }
  return false;
});
const mostPurchasedPotionsParams = computed(() => {
  return {
    expiry: blockTimestamp.value.toString(),
    addresses: underlyingsWithLiquidity.value,
    alreadyLoadedIds:
      loadedMostPurchasedPotions.value.length > 0
        ? loadedMostPurchasedPotions.value.map((otoken) => otoken.id)
        : [""],
    limit: defaultLimit,
  };
});
const mostCollateralizedPotionsParams = computed(() => {
  return {
    expiry: blockTimestamp.value.toString(),
    addresses: underlyingsWithLiquidity.value,
    alreadyLoadedIds:
      loadedMostCollateralizedPotions.value.length > 0
        ? loadedMostCollateralizedPotions.value.map((otoken) => otoken.id)
        : [""],
    limit: defaultLimit,
  };
});
const { data: mostPurchasedPotions, executeQuery: mostPurchasedPotionsQuery } =
  useGetMostPurchasedPotionsQuery({
    variables: mostPurchasedPotionsParams,
    pause: true,
  });
const {
  data: mostCollateralizedPotions,
  executeQuery: mostCollateralizedPotionsQuery,
} = useGetMostCollateralizedPotionsQuery({
  variables: mostCollateralizedPotionsParams,
  pause: true,
});

onMounted(async () => {
  await getBlock("latest");
  mostPurchasedPotionsQuery();
  mostCollateralizedPotionsQuery();
});

watch(mostPurchasedPotions, () => {
  if (
    mostPurchasedPotions.value &&
    mostPurchasedPotions.value.otokens.length > 0
  ) {
    loadedMostPurchasedPotions.value.push(
      ...mostPurchasedPotions.value.otokens
    );
  }
});

watch(mostCollateralizedPotions, () => {
  if (
    mostCollateralizedPotions.value &&
    mostCollateralizedPotions.value.otokens.length > 0
  ) {
    loadedMostCollateralizedPotions.value.push(
      ...mostCollateralizedPotions.value.otokens
    );
  }
});
</script>
