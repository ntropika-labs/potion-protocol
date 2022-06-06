import { ref, computed, watch, unref } from "vue";
import { useGetPoolRecordsByPoolQuery } from "subgraph-queries/generated/urql";
import type { Ref } from "vue";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

const usePoolOtokens = (pool: string | Ref<string>) => {
  const poolOtokens = ref<PoolRecordOtokenInfoFragment[]>([]);

  const alreadyLoadedIds = computed(() =>
    [""].concat(poolOtokens.value.map(({ id }) => id))
  );

  const { data, fetching } = useGetPoolRecordsByPoolQuery({
    variables: computed(() => ({
      pool: unref(pool),
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
  });

  watch(data, () => {
    poolOtokens.value = poolOtokens.value.concat(
      data?.value?.poolRecords ?? []
    );
  });

  return {
    poolOtokens,
    fetching,
  };
};

export { usePoolOtokens };
