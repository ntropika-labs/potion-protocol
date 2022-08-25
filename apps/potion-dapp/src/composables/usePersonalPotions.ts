import {
  useGetUserPotionsQuery,
  useGetActivePotionsQuery,
  useGetExpiredPotionsQuery,
} from "subgraph-queries/generated/urql";
import { ref, computed, unref, watch, onMounted } from "vue";

import type { Ref } from "vue";
import type { MaybeRef } from "@vueuse/core";
import type { PersonalPotionCardFragment } from "subgraph-queries/generated/operations";

const getPersonalPotionsIds = (potions: Ref<PersonalPotionCardFragment[]>) =>
  [""].concat(potions.value.map(({ id }) => id));

export const usePersonalPotions = (
  address: MaybeRef<string>,
  timestamp: MaybeRef<string | number>,
  timestampLoading: Ref<boolean>
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
    pause: timestampLoading,
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

  const storePotions = (
    potions: Ref<PersonalPotionCardFragment[]>,
    newPotions: readonly PersonalPotionCardFragment[],
    canLoadMore: Ref<boolean>
  ) => {
    potions.value = potions.value.concat(newPotions);
    canLoadMore.value = newPotions.length === potionsPerQuery;
  };

  const loadMoreActive = async () => {
    await executeGetMoreActivePotionsQuery();
    storePotions(
      activePotions,
      newActivePotions?.value?.buyerRecords ?? [],
      canLoadMoreActivePotions
    );
  };

  const loadMoreExpired = async () => {
    await executeGetMoreExpiredPotionsQuery();
    storePotions(
      expiredPotions,
      newExpiredPotions?.value?.buyerRecords ?? [],
      canLoadMoreExpiredPotions
    );
  };

  const appendPotions = () => {
    storePotions(
      activePotions,
      userPotions?.value?.active ?? [],
      canLoadMoreActivePotions
    );

    storePotions(
      expiredPotions,
      userPotions?.value?.expired ?? [],
      canLoadMoreExpiredPotions
    );
  };

  onMounted(() => {
    if (!timestampLoading.value) {
      appendPotions();
    }
  });

  watch(timestampLoading, async () => {
    if (!timestampLoading.value) {
      await getUserPotionsQuery();
      appendPotions();
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
