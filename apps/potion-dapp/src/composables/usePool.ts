import { computed, unref } from "vue";
import { useGetPoolByIdQuery } from "subgraph-queries/generated/urql";

import type { ComputedRef, Ref } from "vue";

export function usePool(id: Ref<string> | ComputedRef<string>) {
  const variables = computed(() => ({
    id: unref(id),
  }));

  const pause = computed(() => id.value === "");

  const { data, error, fetching } = useGetPoolByIdQuery({ variables, pause });

  const pool = computed(() => data?.value?.pool ?? null);
  const template = computed(() => pool?.value?.template ?? null);

  return {
    data,
    error,
    fetching,
    pool,
    template,
  };
}
