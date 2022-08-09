<script lang="ts" setup>
import { JumboHeader, CardGrid, PoolTemplateCard, BaseButton } from "potion-ui";
import InnerNav from "@/components/InnerNav.vue";
import { SrcsetEnum } from "dapp-types";
import { useI18n } from "vue-i18n";
import { useTokenList } from "@/composables/useTokenList";
import { useRouter, useRoute } from "vue-router";
import { ref, watch, computed } from "vue";
import {
  useMostPopularTemplatesQuery,
  useLoadMoreTemplatesByPnlQuery,
  useLoadMoreTemplatesBySizeQuery,
  useLoadMoreTemplatesByNumberQuery,
} from "subgraph-queries/generated/urql";
import { useOnboard } from "@onboard-composable";
import type {
  TemplateCardDataFragment,
  TokenInfoFragment,
} from "subgraph-queries/generated/operations";

type DiscoverCategories = "bySize" | "byNumber" | "byPnl";

interface TemplateStore {
  templates: TemplateCardDataFragment[];
  canLoadMore: boolean;
}

interface TemplateCriteria {
  criteria: {
    underlyingAsset: TokenInfoFragment;
  };
}

const { connectedWallet } = useOnboard();
// Base query params
const params = {
  size: "0",
  minClones: "1",
  minPnl: "0",
  num: 8,
};

// We store the templates in a map of categories
const stateMap = ref(
  new Map<DiscoverCategories, TemplateStore>([
    ["bySize", { templates: [], canLoadMore: false }],
    ["byNumber", { templates: [], canLoadMore: false }],
    ["byPnl", { templates: [], canLoadMore: false }],
  ])
);

const getTemplates = (key: DiscoverCategories) =>
  stateMap.value.get(key)?.templates ?? new Array<TemplateCardDataFragment>();

const updateState = (
  templates: TemplateCardDataFragment[] | readonly TemplateCardDataFragment[],
  key: DiscoverCategories
) => {
  stateMap.value.set(key, {
    templates: getTemplates(key).concat(templates),
    canLoadMore: templates.length === params.num,
  });
};

const getTemplatesIds = (templates: TemplateCardDataFragment[]) =>
  templates.map((template) => template.id);

// Base query, it will fetch all categories in a single HTTP request
const { data: popularTemplates } = useMostPopularTemplatesQuery({
  variables: params,
});

// Load more

// Params
const loadMoreBySizeVariables = computed(() => {
  const templates = getTemplates("bySize");
  const ids = templates.length > 0 ? getTemplatesIds(templates) : [""];
  return {
    size: params.size,
    num: params.num,
    alreadyLoadedIds: ids,
  };
});

const loadMoreByNumberVariables = computed(() => {
  const templates = getTemplates("byNumber");
  const ids = templates.length > 0 ? getTemplatesIds(templates) : [""];
  return {
    minClones: params.minClones,
    num: params.num,
    alreadyLoadedIds: ids,
  };
});

const loadMoreByPnlVariables = computed(() => {
  const templates = getTemplates("byPnl");
  const ids = templates.length > 0 ? getTemplatesIds(templates) : [""];
  return {
    minPnl: params.minPnl,
    num: params.num,
    alreadyLoadedIds: ids,
  };
});

// Queries
const { executeQuery: loadTemplatesBySize } = useLoadMoreTemplatesBySizeQuery({
  pause: true,
  variables: loadMoreBySizeVariables,
});

const { executeQuery: loadTemplatesByNumber } =
  useLoadMoreTemplatesByNumberQuery({
    pause: true,
    variables: loadMoreByNumberVariables,
  });

const { executeQuery: loadTemplatesByPnl } = useLoadMoreTemplatesByPnlQuery({
  pause: true,
  variables: loadMoreByPnlVariables,
});

// We store the queries in a map of categories to access them more easily and safely
type DiscoverCategoryQuery =
  | typeof loadTemplatesBySize
  | typeof loadTemplatesByNumber
  | typeof loadTemplatesByPnl;

const queryMap = new Map<DiscoverCategories, DiscoverCategoryQuery>([
  ["bySize", loadTemplatesBySize],
  ["byNumber", loadTemplatesByNumber],
  ["byPnl", loadTemplatesByPnl],
]);

// Execute the correct query and update the state with the new templates
const loadMore = async (key: DiscoverCategories) => {
  const executeQuery = queryMap.get(key);
  if (executeQuery) {
    const { data } = await executeQuery();
    const templates =
      data.value?.templates ?? new Array<TemplateCardDataFragment>();
    updateState(templates, key);
  }
};

// Populate the state with the initial templates
watch(popularTemplates, () => {
  for (const key of stateMap.value.keys()) {
    const templates =
      popularTemplates.value?.[key] ?? new Array<TemplateCardDataFragment>();
    updateState(templates, key);
  }
});

// Tokens helpers
const getTokens = (criterias: readonly TemplateCriteria[]) =>
  criterias.map(({ criteria }) => {
    const address = criteria.underlyingAsset.address;
    const { name, symbol, image } = useTokenList(address);
    return { address, name, symbol, image };
  });

const getCreator = (address: string) => ({
  label: address,
  link: "",
});

// Images and translations
const { t } = useI18n();

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const categoryTexts = new Map<
  DiscoverCategories,
  { title: string; subtitle: string }
>([
  [
    "bySize",
    {
      title: t("most_cloned_templates_title"),
      subtitle: t("most_cloned_templates_subtitle"),
    },
  ],
  [
    "byNumber",
    {
      title: t("largest_templates_title"),
      subtitle: t("largest_templates_subtitle"),
    },
  ],
  [
    "byPnl",
    {
      title: t("top_gainers_templates_title"),
      subtitle: t("top_gainers_templates_subtitle"),
    },
  ],
]);

// Navigation to other pages
const route = useRoute();
const router = useRouter();
const navigateToCustomPoolCreation = () => router.push("/custom-pool-creation");
const onTemplateIdNavigation = (id: string) => {
  router.push({ name: "pool-template", params: { id } });
};

const innerNavProps = computed(() => {
  return {
    currentRoute: route.name,
    routes: [
      {
        name: "discover-templates",
        label: "Discover Templates",
        enabled: true,
        params: {},
      },
      {
        name: "liquidity-provider",
        label: "My Pools",
        enabled: connectedWallet.value?.accounts[0].address ? true : false,
        params: {
          lp:
            connectedWallet.value?.accounts[0].address.toLowerCase() ??
            "not-valid",
        },
      },
    ],
  };
});
</script>

<template>
  <JumboHeader
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
  <InnerNav class="mt-10" v-bind="innerNavProps" />
  <div class="grid gap-8 mt-10">
    <CardGrid
      v-for="[key, { templates, canLoadMore }] in stateMap.entries()"
      :key="key"
      :title="categoryTexts.get(key)?.title || ''"
      :subtitle="categoryTexts.get(key)?.subtitle || ''"
    >
      <PoolTemplateCard
        v-for="(template, index) in templates"
        :key="`${key}-${index}`"
        :tokens="getTokens(template?.criteriaSet?.criterias ?? [])"
        :creator="getCreator(template.creator)"
        :total-size="template.size"
        :total-pnl="template.pnlPercentage"
        currency-symbol="USDC"
        :times-cloned="template.numPools"
        :template-id="template.id"
        @navigate-template="onTemplateIdNavigation"
      >
      </PoolTemplateCard>
      <template v-if="canLoadMore" #grid-footer>
        <div class="flex justify-center my-4">
          <BaseButton
            palette="secondary-o"
            :label="t('show_more')"
            @click="loadMore(key)"
          ></BaseButton>
        </div>
      </template>
    </CardGrid>
  </div>
</template>
