import { getPoolsFromCriterias } from "potion-router";
import { computed, isRef, ref, toRaw, unref } from "vue";

import { worker } from "@/web-worker";
import { watchDebounced } from "@vueuse/core";

import type { DepthRouterReturn } from "potion-router";
import type { Ref } from "vue";
import type { Criteria, MaybeNumberRef } from "dapp-types";
import type { ChartCriteriaPool, IPoolUntyped } from "potion-router/src/types";
export const useDepthRouter = (
  criterias: Ref<Criteria[]> | Criteria[],
  orderSize: MaybeNumberRef,
  strikePriceUSDC: MaybeNumberRef,
  gas: MaybeNumberRef,
  ethPrice: MaybeNumberRef
) => {
  const poolSets = ref<ChartCriteriaPool[]>();
  const poolsUntyped = computed(() => {
    const pools: IPoolUntyped[] = [];
    poolSets.value?.forEach((poolSet) => {
      poolSet.pools.forEach((pool) => pools.push(toRaw(pool)));
    });
    return pools;
  });
  const routerResult = ref<DepthRouterReturn | null>(null);
  const routerParams = computed(() => {
    return {
      pools: toRaw(unref(poolsUntyped)),
      orderSize: unref(orderSize) ?? 0,
      strikePriceUSDC: unref(strikePriceUSDC) ?? 0,
      gas: unref(gas) ?? 0,
      ethPrice: unref(ethPrice) ?? 0,
    };
  });
  const runRouter = async () => {
    const rawCriterias = toRaw(unref(criterias));
    poolSets.value = await getPoolsFromCriterias(rawCriterias);
    const { pools, orderSize, strikePriceUSDC, gas, ethPrice } =
      unref(routerParams);
    if (pools.length > 0) {
      console.log("run router");
      routerResult.value = await worker.runDepthRouter(
        pools,
        orderSize,
        strikePriceUSDC,
        gas,
        ethPrice
      );
    }
  };

  if (
    isRef(criterias) &&
    isRef(orderSize) &&
    isRef(strikePriceUSDC) &&
    isRef(gas) &&
    isRef(ethPrice)
  ) {
    watchDebounced(
      [criterias, orderSize, strikePriceUSDC, gas, ethPrice],
      () => {
        runRouter();
      },
      { debounce: 2000 }
    );
  }

  return {
    poolSets,
    routerResult,
    runRouter,
  };
};
