import { computed, unref, type Ref } from "vue";
import { BigNumber } from "ethers";
import { parseUnits } from "@ethersproject/units";

import type { MaybeRef } from "@vueuse/core";

export function useVaultOperatorCalculations(
  oraclePrice: Ref<number>,
  strikePercentage: MaybeRef<number | null>,
  principalPercentage: MaybeRef<number | null>,
  totalAssets: MaybeRef<number>
) {
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

  return {
    strikePrice,
    orderSize,
    numberOfOtokensToBuyBN,
  };
}
