import { ref, unref, computed, isRef, watch, onMounted } from "vue";
import { useGetPoolsFromUserQuery } from "subgraph-queries/generated/urql";
import { getTokenFromAddress, isValidAddress } from "@/helpers";

import type { MaybeRef } from "@vueuse/core";
import type { Token } from "dapp-types";
import type { GetPoolsFromUserQuery } from "subgraph-queries/generated/operations";

type SubgraphPools = GetPoolsFromUserQuery["pools"];

export function usePersonalPools(address: MaybeRef<string>) {
  const pools = ref<SubgraphPools>([]);
  const poolTokens = ref<Map<string, Token[]>>(new Map());
  const totalPools = computed(() => pools.value.length);
  const totalLiquidity = computed(() =>
    pools.value.reduce((acc, pool) => acc + parseFloat(pool.size), 0)
  );
  const averagePnl = computed(() => {
    const pnl = pools.value.reduce(
      (acc, pool) => acc + parseFloat(pool.pnlPercentage),
      0
    );
    return pnl > 0 ? pnl / unref(totalPools) : 0;
  });

  const alreadyFetchedIds = computed<string[]>(() =>
    [""].concat(pools.value.map(({ id }) => id))
  );

  const validAddress = computed(() => isValidAddress(unref(address)));

  const variables = computed(() => {
    return {
      lp: unref(address),
      ids: unref(alreadyFetchedIds),
    };
  });

  const pause = computed(() => unref(address) === "");

  const { data, executeQuery } = useGetPoolsFromUserQuery({
    variables,
    pause,
  });

  const loadPools = async () => {
    if (unref(validAddress)) {
      pools.value = [];
      poolTokens.value.clear();
      await executeQuery();
    }
  };

  const appendPools = () => {
    pools.value = pools.value.concat(data.value?.pools ?? []);
    data.value?.pools?.forEach(({ id, template }) => {
      const tokenAddresses =
        template?.criteriaSet?.criterias?.map(
          ({ criteria }) => criteria.underlyingAsset.address
        ) ?? [];
      poolTokens.value.set(id, tokenAddresses.map(getTokenFromAddress));
    });
  };

  const getTokens = (address: string) => poolTokens.value.get(address) ?? [];

  onMounted(appendPools);
  watch(data, appendPools);

  if (isRef(address)) {
    watch(address, loadPools);
  }

  return {
    pools,
    loadMorePools: executeQuery,
    getTokens,
    totalPools,
    averagePnl,
    totalLiquidity,
  };
}
