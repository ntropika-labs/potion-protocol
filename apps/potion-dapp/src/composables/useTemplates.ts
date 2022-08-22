import { ref, computed, onMounted } from "vue";
import { watchOnce } from "@vueuse/core";

import {
  useMostPopularTemplatesQuery,
  useLoadMoreTemplatesByPnlQuery,
  useLoadMoreTemplatesBySizeQuery,
  useLoadMoreTemplatesByNumberQuery,
} from "subgraph-queries/generated/urql";
import { getTokenFromAddress } from "@/helpers";

import type { Ref } from "vue";

import type { TemplateCardDataFragment } from "subgraph-queries/generated/operations";
import type { Token } from "dapp-types";

type Templates = readonly TemplateCardDataFragment[];

export function useTemplates(
  params = {
    size: "0",
    minClones: "1",
    minPnl: "0",
    num: 8,
  }
) {
  const bySize = ref<Templates>([]);
  const byNumber = ref<Templates>([]);
  const byPnl = ref<Templates>([]);

  const canLoadMoreBySize = ref(false);
  const canLoadMoreByNumber = ref(false);
  const canLoadMoreByPnl = ref(false);

  const alreadyLoadedBySizeIds = computed(() =>
    [""].concat(bySize.value.map((t) => t.id))
  );
  const alreadyLoadedByNumberIds = computed(() =>
    [""].concat(byNumber.value.map((t) => t.id))
  );
  const alreadyLoadedByPnlIds = computed(() =>
    [""].concat(byPnl.value.map((t) => t.id))
  );

  const tokens = ref<Map<string, Token[]>>(new Map());

  // Query params
  const loadMoreBySizeVariables = computed(() => {
    return {
      size: params.size,
      num: params.num,
      alreadyLoadedIds: alreadyLoadedBySizeIds.value,
    };
  });

  const loadMoreByNumberVariables = computed(() => {
    return {
      minClones: params.minClones,
      num: params.num,
      alreadyLoadedIds: alreadyLoadedByNumberIds.value,
    };
  });

  const loadMoreByPnlVariables = computed(() => {
    return {
      minPnl: params.minPnl,
      num: params.num,
      alreadyLoadedIds: alreadyLoadedByPnlIds.value,
    };
  });

  // Queries
  const { data: popularTemplates } = useMostPopularTemplatesQuery({
    variables: params,
  });

  const { executeQuery: executeQueryBySize } = useLoadMoreTemplatesBySizeQuery({
    pause: true,
    variables: loadMoreBySizeVariables,
  });

  const { executeQuery: executeQueryByNumber } =
    useLoadMoreTemplatesByNumberQuery({
      pause: true,
      variables: loadMoreByNumberVariables,
    });

  const { executeQuery: executeQueryByPnl } = useLoadMoreTemplatesByPnlQuery({
    pause: true,
    variables: loadMoreByPnlVariables,
  });

  // Template tokens
  const storeTokens = (templates: Templates) => {
    templates.forEach(({ id, criteriaSet }) => {
      const tokensAddresses =
        criteriaSet?.criterias?.map(
          ({ criteria }) => criteria.underlyingAsset.address
        ) ?? [];
      tokens.value.set(id, tokensAddresses.map(getTokenFromAddress));
    });
  };

  const getTokens = (id: string) => tokens.value.get(id) ?? [];

  // Load more
  const storeNewTemplates = (
    oldTemplates: Ref<Templates>,
    newTemplates: Templates | undefined,
    canLoadMore: Ref<boolean>
  ) => {
    if (newTemplates) {
      oldTemplates.value = oldTemplates.value.concat(newTemplates);
      canLoadMore.value = newTemplates.length === params.num;
      storeTokens(newTemplates);
    } else {
      canLoadMore.value = false;
    }
  };

  const loadMoreBySize = async () => {
    const { data } = await executeQueryBySize();
    storeNewTemplates(bySize, data?.value?.templates, canLoadMoreBySize);
  };

  const loadMoreByNumber = async () => {
    const { data } = await executeQueryByNumber();
    storeNewTemplates(byNumber, data?.value?.templates, canLoadMoreByNumber);
  };

  const loadMoreByPnl = async () => {
    const { data } = await executeQueryByPnl();
    storeNewTemplates(byPnl, data?.value?.templates, canLoadMoreByPnl);
  };

  // initialize the categories from popularTemplates

  const loadPopularTemplates = () => {
    storeNewTemplates(
      bySize,
      popularTemplates?.value?.bySize,
      canLoadMoreBySize
    );
    storeNewTemplates(
      byNumber,
      popularTemplates?.value?.byNumber,
      canLoadMoreByNumber
    );
    storeNewTemplates(byPnl, popularTemplates?.value?.byPnl, canLoadMoreByPnl);
  };

  onMounted(loadPopularTemplates);
  watchOnce(popularTemplates, loadPopularTemplates);

  return {
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
  };
}
