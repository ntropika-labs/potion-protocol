import {
  useGetMaxDurationForStrikeQuery,
  useGetMaxStrikeForUnderlyingQuery,
  usePoolsWithLiquidityQuery,
} from "subgraph-queries/generated/urql";
import { computed, ref, unref, watch } from "vue";

import { useEthersProvider } from "@/composables/useEthersProvider";
import { offsetToDate } from "@/helpers/days";

import type { MaybeStringRef, MaybeNumberRef } from "dapp-types";
import type { CriteriaSetsWithLiquidityFragment } from "subgraph-queries/generated/operations";

type TemplateId = CriteriaSetsWithLiquidityFragment["criteriaSet"]["templates"];

const usePoolsLiquidity = () => {
  const underlyingsWithLiquiditySet = ref<Set<string>>(new Set<string>());
  const underlyingsWithLiquidity = computed(() =>
    Array.from(underlyingsWithLiquiditySet.value)
  );
  const alreadyLoadedIds = ref<string[]>([""]);

  const { data } = usePoolsWithLiquidityQuery({
    variables: computed(() => ({
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
  });

  watch(data, () => {
    data?.value?.pools.forEach(({ template }) => {
      template?.criteriaSet?.criterias.forEach(({ criteria }) => {
        const address = criteria?.underlyingAsset?.address ?? "";
        underlyingsWithLiquiditySet.value.add(address);
      });
    });
    alreadyLoadedIds.value = alreadyLoadedIds.value.concat(
      data?.value?.pools.map(({ id }) => id) ?? []
    );
  });

  return {
    underlyingsWithLiquidity,
  };
};

const useUnderlyingLiquidity = (underlyingAddressParam: MaybeStringRef) => {
  const alreadyLoadedStrikes = ref(new Map<string, number>());

  const underlyingAddress = computed(() => unref(underlyingAddressParam) ?? "");
  const maxStrike = computed(
    () => alreadyLoadedStrikes.value.get(unref(underlyingAddress)) ?? 0
  );
  const alreadyLoadedIds = ref<string[]>([""]);
  const isPaused = computed(() => unref(underlyingAddress) === "");
  const { data, executeQuery } = useGetMaxStrikeForUnderlyingQuery({
    variables: computed(() => ({
      underlying: unref(underlyingAddress),
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
    pause: true,
  });

  watch(isPaused, () => {
    if (isPaused.value === false) {
      executeQuery();
    }
  });

  watch(data, () => {
    let maxLoadedStrike = 0;
    data?.value?.criterias?.forEach(({ criteriaSets, maxStrikePercent }) => {
      const templates =
        criteriaSets?.reduce(
          (acc, { criteriaSet }) =>
            acc.concat(criteriaSet?.templates ?? new Array<TemplateId>()),
          new Array<TemplateId>()
        ) ?? [];
      if (templates.length > 0) {
        maxLoadedStrike = Math.max(maxLoadedStrike, parseInt(maxStrikePercent));
      }
    });
    alreadyLoadedIds.value = alreadyLoadedIds.value.concat(
      data?.value?.criterias?.map(({ id }) => id) ?? []
    );
    alreadyLoadedStrikes.value.set(
      unref(underlyingAddress),
      Math.max(maxStrike.value, maxLoadedStrike)
    );
  });

  return {
    maxStrike,
    executeQuery,
  };
};

const useStrikeLiquidity = (
  underlyingAddressParam: MaybeStringRef,
  strikeRelative: MaybeNumberRef
) => {
  const alreadyLoadedDurations = ref(new Map<string, number>());
  const underlyingAddress = computed(() => unref(underlyingAddressParam) ?? "");
  const { blockTimestamp, getBlock } = useEthersProvider();
  const maxDuration = computed(
    () => alreadyLoadedDurations.value.get(unref(underlyingAddress)) ?? 0
  );
  const alreadyLoadedIds = ref<string[]>([""]);
  const isPaused = computed(() => {
    return unref(underlyingAddress) === "" ||
      unref(underlyingAddress) === null ||
      unref(strikeRelative) === 0 ||
      unref(strikeRelative) === null
      ? true
      : false;
  });
  const { data, executeQuery } = useGetMaxDurationForStrikeQuery({
    variables: computed(() => ({
      underlying: unref(underlyingAddress) ?? "",
      strike: (unref(strikeRelative) ?? 0).toString(),
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
    pause: true,
  });
  watch(isPaused, async () => {
    if (isPaused.value === false) {
      await getBlock("latest");
      executeQuery();
    }
  });
  watch(data, () => {
    let maxLoadedDuration = 0;
    data?.value?.criterias?.forEach(({ criteriaSets, maxDurationInDays }) => {
      const templates =
        criteriaSets?.reduce(
          (acc, { criteriaSet }) =>
            acc.concat(criteriaSet?.templates ?? new Array<TemplateId>()),
          new Array<TemplateId>()
        ) ?? [];
      if (templates.length > 0) {
        maxLoadedDuration = Math.max(
          maxLoadedDuration,
          parseInt(maxDurationInDays)
        );
      }
    });
    alreadyLoadedIds.value = alreadyLoadedIds.value.concat(
      data?.value?.criterias?.map(({ id }) => id) ?? []
    );
    alreadyLoadedDurations.value.set(
      unref(underlyingAddress),
      Math.max(maxDuration.value, maxLoadedDuration)
    );
  });
  const maxDurationInDays = computed(() => {
    return offsetToDate(blockTimestamp.value, maxDuration.value);
  });

  return {
    maxDuration,
    maxDurationInDays,
    executeQuery,
  };
};

export { usePoolsLiquidity, useUnderlyingLiquidity, useStrikeLiquidity };
