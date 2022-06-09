import {
  useGetMaxStrikeForUnderlyingQuery,
  useGetMaxDurationForStrikeQuery,
  usePoolsWithLiquidityQuery,
} from "subgraph-queries/generated/urql";
import type { CriteriaSetsWithLiquidityFragment } from "subgraph-queries/generated/operations";
import { computed, ref, watch } from "vue";

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

const useUnderlyingLiquidity = (underlying: string) => {
  const maxStrike = ref(0);
  const alreadyLoadedIds = ref<string[]>([""]);

  const { data } = useGetMaxStrikeForUnderlyingQuery({
    variables: computed(() => ({
      underlying,
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
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

const useStrikeLiquidity = (underlying: string, strike: string) => {
  const maxDuration = ref(0);
  const alreadyLoadedIds = ref<string[]>([""]);

  const { data } = useGetMaxDurationForStrikeQuery({
    variables: computed(() => ({
      underlying,
      strike,
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
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

  return {
    maxDuration,
  };
};

export { usePoolsLiquidity, useUnderlyingLiquidity, useStrikeLiquidity };
