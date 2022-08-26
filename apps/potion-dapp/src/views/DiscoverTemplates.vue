<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import { JumboHeader, CardGrid, PoolTemplateCard, BaseButton } from "potion-ui";
import { SrcsetEnum } from "dapp-types";

import PoolNav from "@/components/InnerNav/PoolNav.vue";

import { useTemplates } from "@/composables/useTemplates";
import { useTokenList } from "@/composables/useTokenList";

import { contractsAddresses } from "@/helpers/contracts";

const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const {
  bySize,
  byNumber,
  byPnl,
  canLoadMoreBySize,
  canLoadMoreByNumber,
  canLoadMoreByPnl,
  loadMoreBySize,
  loadMoreByNumber,
  loadMoreByPnl,
  getTokens,
} = useTemplates();

const getCreator = (address: string) => ({
  label: address,
  link: "",
});

const { t } = useI18n();

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const router = useRouter();
const navigateToCustomPoolCreation = () => router.push("/custom-pool-creation");
const onTemplateIdNavigation = (id: string) => {
  router.push({ name: "pool-template", params: { id } });
};
</script>

<template>
  <JumboHeader
    test-discover-templates-header
    :title="t('create_pool_title')"
    :subtitle="t('create_pool_subtitle')"
    :cta-label="t('create_pool')"
    :icon-srcset="jumboIconSrcset"
    @click="navigateToCustomPoolCreation"
  >
    <div class="pt-2 pb-4">
      <a href="#" class="text-primary-500 uppercase text-sm">{{
        t("learn_more")
      }}</a>
    </div>
  </JumboHeader>
  <PoolNav></PoolNav>
  <div class="grid gap-8 mt-10">
    <CardGrid
      test-most-cloned-grid
      :title="t('most_cloned_templates_title')"
      :subtitle="t('most_cloned_templates_subtitle')"
    >
      <PoolTemplateCard
        v-for="(template, index) in bySize"
        :key="`by-size-${index}`"
        :tokens="getTokens(template.id)"
        :creator="getCreator(template.creator)"
        :total-size="template.size"
        :total-pnl="template.pnlPercentage"
        :currency-symbol="collateral.symbol"
        :times-cloned="template.numPools"
        :template-id="template.id"
        @navigate-template="onTemplateIdNavigation"
      >
      </PoolTemplateCard>
      <template v-if="canLoadMoreBySize" #grid-footer>
        <div class="flex justify-center my-4">
          <BaseButton
            test-load-more
            palette="secondary-o"
            :label="t('show_more')"
            @click="loadMoreBySize"
          ></BaseButton>
        </div>
      </template>
    </CardGrid>
    <CardGrid
      test-largest-templates-grid
      :title="t('largest_templates_title')"
      :subtitle="t('largest_templates_subtitle')"
    >
      <PoolTemplateCard
        v-for="(template, index) in byNumber"
        :key="`by-number-${index}`"
        :tokens="getTokens(template.id)"
        :creator="getCreator(template.creator)"
        :total-size="template.size"
        :total-pnl="template.pnlPercentage"
        :currency-symbol="collateral.symbol"
        :times-cloned="template.numPools"
        :template-id="template.id"
        @navigate-template="onTemplateIdNavigation"
      >
      </PoolTemplateCard>
      <template v-if="canLoadMoreByNumber" #grid-footer>
        <div class="flex justify-center my-4">
          <BaseButton
            test-load-more
            palette="secondary-o"
            :label="t('show_more')"
            @click="loadMoreByNumber"
          ></BaseButton>
        </div>
      </template>
    </CardGrid>
    <CardGrid
      test-top-gainers-grid
      :title="t('top_gainers_templates_title')"
      :subtitle="t('top_gainers_templates_subtitle')"
    >
      <PoolTemplateCard
        v-for="(template, index) in byPnl"
        :key="`by-pnl-${index}`"
        :tokens="getTokens(template.id)"
        :creator="getCreator(template.creator)"
        :total-size="template.size"
        :total-pnl="template.pnlPercentage"
        :currency-symbol="collateral.symbol"
        :times-cloned="template.numPools"
        :template-id="template.id"
        @navigate-template="onTemplateIdNavigation"
      >
      </PoolTemplateCard>
      <template v-if="canLoadMoreByPnl" #grid-footer>
        <div class="flex justify-center my-4">
          <BaseButton
            test-load-more
            palette="secondary-o"
            :label="t('show_more')"
            @click="loadMoreByPnl"
          ></BaseButton>
        </div>
      </template>
    </CardGrid>
  </div>
</template>
