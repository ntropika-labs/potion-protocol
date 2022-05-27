<script lang="ts" setup>
import { JumboHeader, CardGrid, PoolTemplateCard } from "potion-ui";
import { SrcsetEnum } from "dapp-types";
import { useI18n } from "vue-i18n";
import { getTokenList } from "potion-tokenlist";
import { useRouter } from "vue-router";
import BaseButton from "../../../../libs/potion-ui/src/components/BaseButton/BaseButton.vue";

const { t } = useI18n();
const router = useRouter();

const fakePoolCreator = {
  label: "0xd34d...b33f",
  link: "#",
  //icon: "https://mocked.com/placeholder.png",
};

const tokens = getTokenList("ganache");

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const navigateToCustomPoolCreation = () => router.push("/custom-pool-creation");
const onTemplateIdNavigation = (templateId: string) => {
  console.log("navigate to template id", templateId);
};

const onLoadMore = () => {
  console.log("loading more");
};
</script>
<template>
  <JumboHeader
    :title="t('create_pool_jumbo_title')"
    :subtitle="t('create_pool_jumbo_subtitle')"
    :cta-label="t('create_pool')"
    :icon-srcset="jumboIconSrcset"
    class="mb-16"
    @click="navigateToCustomPoolCreation"
  >
    <div class="pt-2 pb-4">
      <a href="#" class="text-primary-500 uppercase text-sm">learn more</a>
    </div>
  </JumboHeader>
  <CardGrid
    :title="t('most_cloned_title')"
    :subtitle="t('most_cloned_subtitle')"
  >
    <template v-for="index in 11" :key="index">
      <PoolTemplateCard
        :tokens="
          tokens.slice(0, 1 + Math.round(Math.random() * tokens.length - 1))
        "
        :creator="fakePoolCreator"
        total-size="59328552333"
        total-pnl="67"
        currency-symbol="USDC"
        :times-cloned="index.toString()"
        :template-id="index.toString()"
        :pnl-trend="index % 2 == 0 ? 'up' : 'down'"
        @navigate-template="onTemplateIdNavigation"
      >
      </PoolTemplateCard>
    </template>
    <template #grid-footer>
      <BaseButton
        palette="secondary-o"
        :label="t('show_more')"
        @click="onLoadMore"
      ></BaseButton>
    </template>
  </CardGrid>
</template>
