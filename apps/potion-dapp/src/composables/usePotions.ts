import {
  useGetMostPurchasedPotionsQuery,
  useGetMostCollateralizedPotionsQuery,
  useGetMostPopularPotionsQuery,
} from "subgraph-queries/generated/urql";
import { ref, computed, onMounted, isRef, watch } from "vue";
import { deepUnref } from "@/helpers/vue";

import type { MaybeRef } from "@vueuse/core";
import type { PotionCardFragment } from "subgraph-queries/generated/operations";

export const usePotions = (
  underlyings: MaybeRef<string[]>,
  timestamp: MaybeRef<string | number>,
  limit: MaybeRef<number> = 8
) => {
  const mostCollateralized = ref<PotionCardFragment[]>([]);
  const mostPurchased = ref<PotionCardFragment[]>([]);
  const canLoadMoreCollateralized = ref(true);
  const canLoadMorePurchased = ref(true);

  const mostCollateralizedIds = computed(() =>
    [""].concat(mostCollateralized.value.map(({ id }) => id))
  );
  const mostPurchasedIds = computed(() =>
    [""].concat(mostPurchased.value.map(({ id }) => id))
  );
  const allIds = computed(() => [
    ...mostCollateralizedIds.value,
    ...mostPurchasedIds.value,
  ]);

  const mostCollateralizedVariables = computed(() => ({
    addresses: deepUnref(underlyings),
    expiry: deepUnref(timestamp).toString(),
    limit: deepUnref(limit),
    alreadyLoadedIds: mostCollateralizedIds.value,
  }));

  const mostPurchasedVariables = computed(() => ({
    addresses: deepUnref(underlyings),
    expiry: deepUnref(timestamp).toString(),
    limit: deepUnref(limit),
    alreadyLoadedIds: mostPurchasedIds.value,
  }));

  const mostPopularVariables = computed(() => ({
    addresses: deepUnref(underlyings),
    expiry: deepUnref(timestamp).toString(),
    limit: deepUnref(limit),
    alreadyLoadedIds: allIds.value,
  }));

  const { data: mostPopular, executeQuery: mostPopularQuery } =
    useGetMostPopularPotionsQuery({
      variables: mostPopularVariables,
      pause: true,
    });

  const {
    data: newMostCollateralized,
    executeQuery: executeGetMoreMostCollateralizedQuery,
  } = useGetMostCollateralizedPotionsQuery({
    variables: mostCollateralizedVariables,
    pause: true,
  });

  const {
    data: newMostPurchased,
    executeQuery: executeGetMoreMostPurchasedQuery,
  } = useGetMostPurchasedPotionsQuery({
    variables: mostPurchasedVariables,
    pause: true,
  });

  const loadMostPopular = async () => {
    await mostPopularQuery();

    mostCollateralized.value = mostCollateralized.value.concat(
      mostPopular?.value?.collateralized ?? []
    );
    mostPurchased.value = mostPurchased.value.concat(
      mostPopular?.value?.purchased ?? []
    );

    canLoadMoreCollateralized.value =
      mostPopular?.value?.collateralized?.length === limit ?? false;
    canLoadMorePurchased.value =
      mostPopular?.value?.purchased?.length === limit ?? false;
  };

  const loadMoreMostCollateralized = async () => {
    await executeGetMoreMostCollateralizedQuery();

    mostCollateralized.value = mostCollateralized.value.concat(
      newMostCollateralized?.value?.otokens ?? []
    );

    canLoadMoreCollateralized.value =
      newMostCollateralized?.value?.otokens?.length === limit ?? false;
  };

  const loadMoreMostPurchased = async () => {
    await executeGetMoreMostPurchasedQuery();

    mostPurchased.value = mostPurchased.value.concat(
      newMostPurchased?.value?.otokens ?? []
    );

    canLoadMorePurchased.value =
      newMostPurchased?.value?.otokens?.length === limit ?? false;
  };

  const cleanLoad = async () => {
    if (deepUnref(timestamp) > 0) {
      mostCollateralized.value = [];
      mostPurchased.value = [];
      await loadMostPopular();
    }
  };

  onMounted(cleanLoad);

  if (isRef(timestamp)) {
    watch(timestamp, cleanLoad);
  }

  return {
    canLoadMoreCollateralized,
    canLoadMorePurchased,
    mostCollateralized,
    mostPurchased,
    loadMoreMostCollateralized,
    loadMoreMostPurchased,
  };
};
