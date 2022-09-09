import {
  ref,
  computed,
  watch,
  unref,
  isRef,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { BigNumber } from "ethers";
import { parseUnits } from "@ethersproject/units";

import { useOracleContract } from "./useOracleContract";

import type { MaybeRef } from "@vueuse/core";

export function useVaultOperatorCalculations(
  assetAddress: MaybeRef<string | null>,
  strikePercentage: MaybeRef<number | null>,
  principalPercentage: MaybeRef<number | null>,
  totalAssets: MaybeRef<number>
) {
  const { polledPrice, startPolling, stopPolling } = useOracleContract();
  const oraclePrice = computed(() => parseFloat(polledPrice?.value ?? 0));
  const oraclePriceUpdated = ref<{
    oldPrice: string | undefined;
    newPrice: string | undefined;
  }>({
    oldPrice: undefined,
    newPrice: undefined,
  });

  const strikePrice = computed(() => {
    const sp = unref(strikePercentage);
    return sp === null ? 0 : oraclePrice.value * (sp / 100);
  });

  const orderSize = computed(() => {
    const pp = unref(principalPercentage);
    return pp === null
      ? 0
      : (pp / 100) * unref(totalAssets) * strikePrice.value;
  });

  const numberOfOtokensToBuyBN = computed(() => {
    const pp = unref(principalPercentage);
    const ta = unref(totalAssets);
    if (pp !== null && ta > 0) {
      const ppBN = parseUnits(pp.toString(), 18);
      const taBN = parseUnits(ta.toString(), 18);
      const dBN = parseUnits("100", 18);
      // otokens are in 8 digits, we need to remove some digits here by dividing by 10^10
      return ppBN
        .mul(taBN)
        .div(dBN)
        .div(10 ** 10);
    }
    return BigNumber.from(0);
  });

  const addOraclePolling = (address: string | null) => {
    stopPolling();
    if (address) {
      startPolling(address);
    }
  };

  if (isRef(assetAddress)) {
    watch(assetAddress, (address) => addOraclePolling(address));
  }

  watch(
    polledPrice,
    (newPrice: string | undefined, oldPrice: string | undefined) => {
      oraclePriceUpdated.value = { oldPrice, newPrice };
    }
  );

  onMounted(() => addOraclePolling(unref(assetAddress)));
  onBeforeUnmount(stopPolling);

  return {
    oraclePrice,
    oraclePriceUpdated,
    strikePrice,
    orderSize,
    numberOfOtokensToBuyBN,
  };
}
