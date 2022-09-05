import { computed, ref, watch, type Ref } from "vue";
import { parseUnits } from "@ethersproject/units";

import { useOracleContract } from "./useOracleContract";
import { BigNumber } from "ethers";

export function useVaultOperatorCalculations(
  assetAddress: Ref<string | null>,
  strikePercentage: Ref<number | null>,
  principalPercentage: Ref<number | null>,
  totalAssets: Ref<number>
) {
  const pollingTimer = ref<any>(null);
  const oraclePrice = ref(0);
  const { getPrice } = useOracleContract();

  const strikePrice = computed(() => {
    if (strikePercentage.value === null) return 0;

    return oraclePrice.value * (strikePercentage.value / 100);
  });

  const orderSize = computed(() => {
    if (principalPercentage.value === null) return 0;

    return (
      (principalPercentage.value / 100) * totalAssets.value * strikePrice.value
    );
  });

  const fetchPrice = async (address: string | null) => {
    if (!address) return;

    const price = await getPrice(address);

    oraclePrice.value = parseFloat(price);
  };

  const numberOfOtokensToBuyBN = computed(() => {
    if (principalPercentage.value === null) return BigNumber.from(0);

    const ppBN = parseUnits(principalPercentage.value.toString(), 18);
    const taBN = parseUnits(totalAssets.value.toString(), 18);
    const dBN = parseUnits("100", 18);
    const noBN = ppBN.mul(taBN).div(dBN);
    // otokens are in 8 digits, we need to remove some digits here by dividing by 10^10
    return noBN.div(10 ** 10);
  });

  watch(assetAddress, async (address) => await fetchPrice(address));

  const togglePricePolling = (state?: boolean) => {
    const isPolling = Boolean(pollingTimer.value);
    const isToggle = state === undefined;
    // If the polling is already set to the desired state then return
    if (!isToggle && isPolling === state) return;

    const enablePolling = !isPolling && (isToggle || state);

    if (enablePolling) {
      pollingTimer.value = setInterval(
        () => fetchPrice(assetAddress.value),
        15000
      );
    } else {
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
