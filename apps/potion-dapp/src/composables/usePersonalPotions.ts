import {
  useGetUserPotionsQuery,
  useGetActivePotionsQuery,
  useGetExpiredPotionsQuery,
} from "subgraph-queries/generated/urql";
import { ref, computed, unref, watch } from "vue";

import type { Ref } from "vue";
import type { PersonalPotionCardFragment } from "subgraph-queries/generated/operations";

const getPersonalPotionsIds = (potions: Ref<PersonalPotionCardFragment[]>) =>
  [""].concat(potions.value.map(({ id }) => id));

export const usePersonalPotions = (
  address: string | Ref<string>,
  timestamp: string | Ref<string> | number | Ref<number>,
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
    expiry: unref(timestamp).toString(),
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
