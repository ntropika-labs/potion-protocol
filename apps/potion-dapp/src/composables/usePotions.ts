import {
  useGetUserPotionsQuery,
  useGetActivePotionsQuery,
  useGetExpiredPotionsQuery,
  useGetMostPurchasedPotionsQuery,
  useGetMostCollateralizedPotionsQuery,
  useGetMostPopularPotionsQuery,
} from "subgraph-queries/generated/urql";
import { ref, computed, unref, onMounted, watch } from "vue";
import type { Ref } from "vue";
import type {
  PersonalPotionCardFragment,
  PotionCardFragment,
} from "subgraph-queries/generated/operations";

const getPersonalPotionsIds = (potions: Ref<PersonalPotionCardFragment[]>) =>
  [""].concat(potions.value.map(({ id }) => id));

const usePersonalPotions = (
  address: string | Ref<string>,
  timestamp: string | Ref<string>,
  pauseQuery: Ref<boolean>
) => {
  const expiredPotions = ref<PersonalPotionCardFragment[]>([]);
  const activePotions = ref<PersonalPotionCardFragment[]>([]);
  const canLoadMoreExpiredPotions = ref<boolean>(false);
  const canLoadMoreActivePotions = ref<boolean>(false);

  const expiredIds = computed(() => getPersonalPotionsIds(expiredPotions));
  const activeIds = computed(() => getPersonalPotionsIds(activePotions));
  const allIds = computed(() => [...expiredIds.value, ...activeIds.value]);

  const potionsPerQuery = 8;

  const variables = computed(() => ({
    buyerAddress: unref(address),
    expiry: unref(timestamp),
    alreadyLoadedIds: allIds.value,
    first: potionsPerQuery,
  }));

  const {
    data: userPotions,
    executeQuery: getUserPotionsQuery,
    fetching: loadingUserPotions,
  } = useGetUserPotionsQuery({
    variables,
    pause: true,
  });

  const {
    data: newActivePotions,
    executeQuery: executeGetMoreActivePotionsQuery,
    fetching: loadingActivePotions,
  } = useGetActivePotionsQuery({
    variables,
    pause: true,
  });

  const {
    data: newExpiredPotions,
    executeQuery: executeGetMoreExpiredPotionsQuery,
    fetching: loadingExpiredPotions,
  } = useGetExpiredPotionsQuery({
    variables,
    pause: true,
  });

  const loadMoreActive = async () => {
    await executeGetMoreActivePotionsQuery();
    canLoadMoreExpiredPotions.value =
      newActivePotions?.value?.buyerRecords?.length === potionsPerQuery;
    activePotions.value = activePotions.value.concat(
      newActivePotions?.value?.buyerRecords ?? []
    );
  };

  const loadMoreExpired = async () => {
    await executeGetMoreExpiredPotionsQuery();
    canLoadMoreExpiredPotions.value =
      newExpiredPotions?.value?.buyerRecords?.length === potionsPerQuery;
    expiredPotions.value = expiredPotions.value.concat(
      newExpiredPotions?.value?.buyerRecords ?? []
    );
  };

  watch(pauseQuery, async () => {
    if (!pauseQuery.value) {
      await getUserPotionsQuery();
      canLoadMoreExpiredPotions.value =
        userPotions?.value?.expired?.length === potionsPerQuery;
      canLoadMoreActivePotions.value =
        userPotions?.value?.active?.length === potionsPerQuery;
      activePotions.value = activePotions.value.concat(
        userPotions?.value?.active ?? []
      );
      expiredPotions.value = expiredPotions.value.concat(
        userPotions?.value?.expired ?? []
      );
    }
  });

  return {
    activePotions,
    expiredPotions,
    canLoadMoreActivePotions,
    canLoadMoreExpiredPotions,
    loadMoreActive,
    loadMoreExpired,
    loadingActivePotions,
    loadingExpiredPotions,
    loadingUserPotions,
  };
};

const usePotions = (
  underlyings: string[] | Ref<string[]>,
  timestamp: string | Ref<string>
) => {
  const mostCollateralized = ref<PotionCardFragment[]>([]);
  const mostPurchased = ref<PotionCardFragment[]>([]);

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

  const variables = computed(() => ({
    addresses: unref(underlyings),
    expiry: unref(timestamp),
    alreadyLoadedIds: allIds.value,
  }));

  const { data: mostPopular, executeQuery: mostPopularQuery } =
    useGetMostPopularPotionsQuery({
      variables,
      pause: true,
    });

  const {
    data: newMostCollateralized,
    executeQuery: executeGetMoreMostCollateralizedQuery,
  } = useGetMostCollateralizedPotionsQuery({
    variables,
    pause: true,
  });

  const {
    data: newMostPurchased,
    executeQuery: executeGetMoreMostPurchasedQuery,
  } = useGetMostPurchasedPotionsQuery({
    variables,
    pause: true,
  });

  const loadMoreMostCollateralized = async () => {
    await executeGetMoreMostCollateralizedQuery();
    mostCollateralized.value = mostCollateralized.value.concat(
      newMostCollateralized?.value?.otokens ?? []
    );
  };

  const loadMoreMostPurchased = async () => {
    await executeGetMoreMostPurchasedQuery();
    mostPurchased.value = mostPurchased.value.concat(
      newMostPurchased?.value?.otokens ?? []
    );
  };

  onMounted(async () => {
    await mostPopularQuery();
    mostCollateralized.value = mostCollateralized.value.concat(
      mostPopular?.value?.collateralized ?? []
    );
    mostPurchased.value = mostPurchased.value.concat(
      mostPopular?.value?.purchased ?? []
    );
  });

  return {
    mostCollateralized,
    mostPurchased,
    loadMoreMostCollateralized,
    loadMoreMostPurchased,
  };
};

export { usePotions, usePersonalPotions };
