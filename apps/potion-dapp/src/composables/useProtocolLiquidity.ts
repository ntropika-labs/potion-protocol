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

const useUnderlyingLiquidity = (underlyingAddress: MaybeStringRef) => {
  const maxStrike = ref(0);
  const alreadyLoadedIds = ref<string[]>([""]);
  const isPaused = computed(() => {
    return unref(underlyingAddress) === "" || unref(underlyingAddress) === null
      ? true
      : false;
  });
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
    data?.value?.criterias.forEach(({ criteriaSets, maxStrikePercent }) => {
      const templates =
        criteriaSets?.reduce(
          (acc, { criteriaSet }) =>
            acc.concat(criteriaSet?.templates ?? new Array<TemplateId>()),
          new Array<TemplateId>()
        ) ?? [];
      if (templates.length > 0) {
        maxStrike.value = Math.max(maxStrike.value, parseInt(maxStrikePercent));
      }
    });
    alreadyLoadedIds.value = alreadyLoadedIds.value.concat(
      data?.value?.criterias.map(({ id }) => id) ?? []
    );
  });

  return {
    maxStrike,
  };
};

const useStrikeLiquidity = (
  underlyingAddress: MaybeStringRef,
  strikeRelative: MaybeNumberRef
) => {
  const { blockTimestamp, getBlock } = useEthersProvider();
  const maxDuration = ref(0);
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
    data?.value?.criterias.forEach(({ criteriaSets, maxDurationInDays }) => {
      const templates =
        criteriaSets?.reduce(
          (acc, { criteriaSet }) =>
            acc.concat(criteriaSet?.templates ?? new Array<TemplateId>()),
          new Array<TemplateId>()
        ) ?? [];
      if (templates.length > 0) {
        maxDuration.value = Math.max(
          maxDuration.value,
          parseInt(maxDurationInDays)
        );
      }
    });
    alreadyLoadedIds.value = alreadyLoadedIds.value.concat(
      data?.value?.criterias.map(({ id }) => id) ?? []
    );
  });
  const maxDurationInDays = computed(() => {
    return offsetToDate(blockTimestamp.value, maxDuration.value);
  });

  return {
    maxDuration,
    maxDurationInDays,
  };
};

export { usePoolsLiquidity, useUnderlyingLiquidity, useStrikeLiquidity };
