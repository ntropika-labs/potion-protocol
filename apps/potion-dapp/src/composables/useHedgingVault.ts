import { computed, onMounted, ref, unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { useGetHedgingVaultQuery } from "subgraph-queries-hv/generated/urql";

import type { GetHedgingVaultQuery } from "subgraph-queries-hv/generated/operations";
import type { MaybeRef } from "@vueuse/core";
import type { RoundsFragment } from "@/types";

type HedgingVaultFragment = GetHedgingVaultQuery["hedgingVault"];

const secsToDays = (secs: string) =>
  Math.floor(parseInt(secs) / (3600 * 24)).toString();

const queryResultToVault = (result: HedgingVaultFragment) => ({
  address: result?.id ?? "",
  admin: result?.admin ?? "",
  operator: result?.operator ?? "",
  underlying: {
    address: result?.underlying.id ?? "",
    name: result?.underlying.name ?? "",
    symbol: result?.underlying.symbol ?? "",
    decimals: parseInt(result?.underlying.decimals ?? "0"),
  },
  shareToken: {
    address: result?.shareToken.id ?? "",
    name: result?.shareToken.name ?? "",
    symbol: result?.shareToken.symbol ?? "",
    decimals: parseInt(result?.shareToken.decimals ?? "0"),
  },
  totalShares: formatUnits(result?.totalShares ?? "0"),
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
  currentRound: result?.currentRound ?? "0",
  rounds: (result?.rounds ?? []) as unknown as RoundsFragment,
  lastUnderlyingToShareRate: parseFloat(
    formatUnits(result?.lastUnderlyingToShareRate ?? "0")
  ),
  lastShareToUnderlyingRate: parseFloat(
    formatUnits(result?.lastShareToUnderlyingRate ?? "0")
  ),
  lastTotalUnderlyingsAtRoundEnd: parseFloat(
    formatUnits(
      result?.rounds?.[result?.rounds?.length - 2]
        ?.totalUnderlyingsAtRoundEnd ?? "0",
      18
    )
  ),
});

const useHedgingVault = (
  vault: MaybeRef<string>,
  investor: MaybeRef<string>
) => {
  const hedgingVault = ref(queryResultToVault(null));
  const variables = computed(() => ({
    vault: unref(vault),
    investor: unref(investor),
  }));

  const { fetching, error, executeQuery } = useGetHedgingVaultQuery({
    variables,
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  });

  async function loadVault() {
    const { data } = await executeQuery();
    hedgingVault.value = queryResultToVault(data.value?.hedgingVault ?? null);
  }

  onMounted(loadVault);

  return {
    vault: hedgingVault,
    loading: fetching,
    error,
    loadVault,
  };
};

export { useHedgingVault };
