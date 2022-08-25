import { computed, unref } from "vue";
import { useGetPoolByIdQuery } from "subgraph-queries/generated/urql";
import { getTokenFromAddress } from "@/helpers/tokens";

import type { ComputedRef, Ref } from "vue";

import type { Criteria } from "dapp-types";

export function usePool(id: Ref<string> | ComputedRef<string>) {
  const variables = computed(() => ({
    id: unref(id),
  }));

  const pause = computed(() => id.value === "");

  const { data, error, fetching } = useGetPoolByIdQuery({ variables, pause });

  const pool = computed(() => data?.value?.pool ?? null);
  const template = computed(() => pool?.value?.template ?? null);

  const curve = computed(() => template?.value?.curve ?? null);
  const criteriaSet = computed(() => template?.value?.criteriaSet);
  const criterias = computed<Criteria[]>(
    () =>
      criteriaSet?.value?.criterias?.map(({ criteria }) => ({
        token: getTokenFromAddress(criteria.underlyingAsset.address),
        maxStrike: parseInt(criteria.maxStrikePercent),
        maxDuration: parseInt(criteria.maxDurationInDays),
      })) ?? []
  );

  return {
    error,
    fetching,
    pool,
    curve,
    criterias,
  };
}
