<script lang="ts" setup>
import { get as _get } from "lodash-es";
import { ref, watch, computed } from "vue";
import {
  useMostPopularTemplatesQuery,
  useLoadMoreTemplatesByPnlQuery,
  useLoadMoreTemplatesBySizeQuery,
  useLoadMoreTemplatesByNumberQuery,
} from "subgraph-queries/generated/urql";
import type { MostPopularTemplatesQuery } from "subgraph-queries/generated/operations";

// Types for the queries
type DiscoverCategories = "bySize" | "byNumber" | "byPnl";
type TemplateData =
  | MostPopularTemplatesQuery["bySize"]
  | MostPopularTemplatesQuery["byNumber"]
  | MostPopularTemplatesQuery["byPnl"];

interface TemplateStore {
  templates: TemplateData[];
  canLoadMore: boolean;
}

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

const getTemplates = (key: DiscoverCategories) => {
  const templates = _get(stateMap.value.get(key), "templates", []);
  return templates as unknown as TemplateData[];
};

const updateState = (templates: TemplateData[], key: DiscoverCategories) => {
  stateMap.value.set(key, {
    templates: getTemplates(key).concat(templates),
    canLoadMore: templates.length === params.num,
  });
};

const getTemplatesIds = (templates: TemplateData[]) =>
  templates.map((template) => _get(template, "id", ""));

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
    const templates = _get(data.value, "templates", []);
    updateState(templates as unknown as TemplateData[], key);
  }
};

// Populate the state with the initial templates
watch(popularTemplates, () => {
  for (const key of stateMap.value.keys()) {
    const templates = _get(popularTemplates.value, key, []);
    updateState(templates as unknown as TemplateData[], key);
  }
});
</script>

<template>
  <h1 class="text-white">Discover Pools</h1>
  <router-link to="/custom-pool-creation">Custom Pool</router-link>
  <template
    v-for="[key, { templates, canLoadMore }] in stateMap.entries()"
    :key="key"
  >
    <h2>{{ key }}</h2>
    <pre>{{ getTemplatesIds(templates) }}</pre>
    <button v-if="canLoadMore" @click="loadMore(key)">Load more</button>
  </template>
</template>
