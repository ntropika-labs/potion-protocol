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
  const canLoadMoreExpiredPotions = ref<boolean>(true);
  const canLoadMoreActivePotions = ref<boolean>(true);

  const expiredIds = computed(() => getPersonalPotionsIds(expiredPotions));
  const activeIds = computed(() => getPersonalPotionsIds(activePotions));
  const allIds = computed(() => [...expiredIds.value, ...activeIds.value]);

  const variables = computed(() => ({
    buyerAddress: unref(address),
    expiry: unref(timestamp),
    alreadyLoadedIds: allIds.value,
  }));

  const { data: userPotions, executeQuery: getUserPotionsQuery } =
    useGetUserPotionsQuery({
      variables,
      pause: true,
    });

  const {
    data: newActivePotions,
    executeQuery: executeGetMoreActivePotionsQuery,
  } = useGetActivePotionsQuery({
    variables,
    pause: true,
  });

  const {
    data: newExpiredPotions,
    executeQuery: executeGetMoreExpiredPotionsQuery,
  } = useGetExpiredPotionsQuery({
    variables,
    pause: true,
  });

  const loadMoreActive = async () => {
    await executeGetMoreActivePotionsQuery();
    activePotions.value = activePotions.value.concat(
      newActivePotions?.value?.buyerRecords ?? []
    );
  };

  const loadMoreExpired = async () => {
    await executeGetMoreExpiredPotionsQuery();
    expiredPotions.value = expiredPotions.value.concat(
      newExpiredPotions?.value?.buyerRecords ?? []
    );
  };

  watch(pauseQuery, async () => {
    if (!pauseQuery.value) {
      await getUserPotionsQuery();
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
