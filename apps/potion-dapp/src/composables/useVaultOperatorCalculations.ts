import { computed, ref, watch, unref, isRef } from "vue";
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
  const pollingTimer = ref<NodeJS.Timer | null>(null);
  const oraclePrice = ref(0);
  const { getPrice } = useOracleContract();

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

  const fetchPrice = async (address: string | null) => {
    if (address !== null) {
      const price = await getPrice(address);
      oraclePrice.value = parseFloat(price);
    }
  };

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

  if (isRef(assetAddress)) {
    watch(assetAddress, async (address) => await fetchPrice(address));
  }

  const togglePricePolling = (state?: boolean) => {
    const isPolling = Boolean(pollingTimer.value);
    const isToggle = state === undefined;
    // If the polling is already set to the desired state then return
    if (!isToggle && isPolling === state) return;

    const enablePolling = !isPolling && (isToggle || state);

    if (enablePolling) {
      pollingTimer.value = setInterval(
        () => fetchPrice(unref(assetAddress)),
        15000
      );
    } else if (pollingTimer.value) {
      clearInterval(pollingTimer.value);
      pollingTimer.value = null;
    }
  };

  return {
    oraclePrice,
    strikePrice,
    orderSize,
    numberOfOtokensToBuyBN,
    togglePricePolling,
  };
}
