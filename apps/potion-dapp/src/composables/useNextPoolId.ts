import { useGetLatestPoolIdQuery } from "subgraph-queries/generated/urql";
import { computed, unref } from "vue";
import type { Ref, ComputedRef } from "vue";

export function useNextPoolId(lp: Ref<string> | ComputedRef<string>) {
  const variables = computed(() => {
    return {
      lp: unref(lp),
    };
  });
  const { data: userPools } = useGetLatestPoolIdQuery({
    variables,
  });

  const poolId = computed(() => {
    const id = userPools?.value?.pools?.[0]?.poolId;
    return id ? 1 + parseInt(id) : 0;
  });

  return {
    poolId,
  };
}
