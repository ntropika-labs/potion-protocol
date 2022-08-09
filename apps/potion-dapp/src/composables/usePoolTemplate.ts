import { computed, unref } from "vue";
import { useGetTemplateQuery } from "subgraph-queries/generated/urql";
import { getTokenFromAddress } from "@/helpers/tokens";

import type { ComputedRef, Ref } from "vue";
import type { Criteria } from "dapp-types";

export function usePoolTemplate(id: Ref<string> | ComputedRef<string>) {
  const variables = computed(() => ({
    id: unref(id),
  }));

  const { data } = useGetTemplateQuery({ variables });

  const template = computed(() => data?.value?.template);
  const curve = computed(() => template?.value?.curve);
  const criteriaSet = computed(() => template?.value?.criteriaSet);
  const criterias = computed<Criteria[]>(
    () =>
      criteriaSet?.value?.criterias?.map(({ criteria }) => ({
        token: getTokenFromAddress(criteria.underlyingAsset.address),
        maxStrike: parseInt(criteria.maxStrikePercent),
        maxDuration: parseInt(criteria.maxDurationInDays),
      })) ?? []
  );

  return { template, curve, criteriaSet, criterias };
}
