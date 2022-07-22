import { getPoolsFromCriterias } from "potion-router";
import { currencyFormatter } from "potion-ui";
import { computed, isRef, ref, toRaw, unref } from "vue";

import { worker } from "@/web-worker";
import { watchDebounced } from "@vueuse/core";

import type { DepthRouterReturn } from "potion-router";
import type { Ref } from "vue";
import type { Criteria, MaybeNumberRef } from "dapp-types";
import type { ChartCriteriaPool, IPoolUntyped } from "potion-router/src/types";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";
export const useDepthRouter = (
  criterias: Ref<Criteria[]> | Criteria[],
  orderSize: MaybeNumberRef,
  strikePriceUSDC: MaybeNumberRef,
  gas: MaybeNumberRef,
  ethPrice: MaybeNumberRef
) => {
  const { maxCounterparties } = usePotionLiquidityPoolContract();
  const poolSets = ref<ChartCriteriaPool[]>();
  const poolsUntyped = computed(() => {
    const pools: IPoolUntyped[] = [];
    poolSets.value?.forEach((poolSet) => {
      poolSet.pools.forEach((pool) => pools.push(toRaw(pool)));
    });
    return pools;
  });
  const marketSize = computed(() => {
    return poolsUntyped.value.reduce((sum, pool) => {
      return sum + parseFloat(pool.unlocked);
    }, 0);
  });
  const maxNumberOfPotions = computed(() => {
    if (
      isRef(strikePriceUSDC) &&
      strikePriceUSDC.value &&
      strikePriceUSDC.value > 0
    ) {
      return parseFloat((marketSize.value / unref(strikePriceUSDC)).toFixed(8));
    }
    return 0;
  });

  const routerResult = ref<DepthRouterReturn | null>(null);

  const numberOfTransactions = computed(() =>
    Math.ceil(
      routerResult.value?.counterparties.length ?? 0 / maxCounterparties
    )
  );
  const routerParams = computed(() => {
    return {
      pools: toRaw(unref(poolsUntyped)),
      orderSize: unref(orderSize) ?? 0,
      strikePriceUSDC: unref(strikePriceUSDC) ?? 0,
      gas: unref(gas) ?? 0,
      ethPrice: unref(ethPrice) ?? 0,
    };
  });
  const routerRunning = ref(false);
  const runRouter = async () => {
    const rawCriterias = toRaw(unref(criterias));
    poolSets.value = await getPoolsFromCriterias(rawCriterias);
    const { pools, orderSize, strikePriceUSDC, gas, ethPrice } =
      unref(routerParams);
    if (
      pools.length > 0 &&
      orderSize > 0 &&
      strikePriceUSDC > 0 &&
      ethPrice > 0
    ) {
      console.info("Router is running with: ", {
        orderSize,
        strikePriceUSDC,
        gas,
        ethPrice,
      });
      routerRunning.value = true;
      routerResult.value = await worker.runDepthRouter(
        pools,
        orderSize,
        strikePriceUSDC,
        gas,
        ethPrice
      );
      routerRunning.value = false;
    }
  };
  const formattedMarketSize = computed(() => {
    if (marketSize.value > 0) {
      return currencyFormatter(marketSize.value, "USDC");
    }
    return currencyFormatter(0, "USDC");
  });
  const formattedPremium = computed(() => {
    if (routerResult.value && routerResult.value.premium) {
      return currencyFormatter(routerResult.value.premium, "USDC");
    }
    return currencyFormatter(0, "USDC");
  });

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
      { debounce: 1000 }
    );
  }

  return {
    poolSets,
    poolsUntyped,
    routerResult,
    marketSize,
    maxNumberOfPotions,
    formattedPremium,
    formattedMarketSize,
    routerRunning,
    runRouter,
    numberOfTransactions,
  };
};
