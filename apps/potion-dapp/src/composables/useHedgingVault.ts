import { computed, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useGetHedgingVaultQuery } from "subgraph-queries-hv/generated/urql";

import type { GetHedgingVaultQuery } from "subgraph-queries-hv/generated/operations";
import type { MaybeRef } from "@vueuse/core";

type HedgingVaultFragment = GetHedgingVaultQuery["hedgingVault"];

const secsToDays = (secs: string) =>
  Math.floor(parseInt(secs) / (3600 * 24)).toString();

const queryResultToVault = (result: HedgingVaultFragment) => ({
  address: result?.id ?? "",
  asset: {
    address: result?.asset.id ?? "",
    name: result?.asset.name ?? "",
    symbol: result?.asset.symbol ?? "",
    decimals: parseInt(result?.asset.decimals ?? "0"),
  },
  shareToken: {
    address: result?.shareToken.id ?? "",
    name: result?.shareToken.name ?? "",
    symbol: result?.shareToken.symbol ?? "",
    decimals: parseInt(result?.shareToken.decimals ?? "0"),
  },
  totalAssets: result?.totalAssets ?? "0",
  hedgingRate: formatUnits(result?.action?.hedgingRate ?? "0", 6),
  strikePercentage: formatUnits(result?.action?.strikePercentage ?? "0", 6),
  cycleDurationSecs: secsToDays(result?.action?.cycleDurationSecs ?? "0"),
  maxPremiumPercentage: formatUnits(
    result?.action?.maxPremiumPercentage ?? "0",
    6
  ),
  swapSlippage: formatUnits(result?.action?.swapSlippage ?? "0", 6),
  premiumSlippage: formatUnits(result?.action?.premiumSlippage ?? "0", 6),
  nextCycleTimestamp: result?.action?.nextCycleStartTimestamp ?? "0",
});

const useHedgingVault = (
  vault: MaybeRef<string>,
  investor: MaybeRef<string>
) => {
  const variables = computed(() => ({
    vault: unref(vault),
    investor: unref(investor),
  }));

  const { data, fetching, error } = useGetHedgingVaultQuery({
    variables,
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  });

  const hedgingVault = computed(() =>
    queryResultToVault(data.value?.hedgingVault ?? null)
  );

  return {
    vault: hedgingVault,
    loading: fetching,
    error,
  };
};

export { useHedgingVault };
