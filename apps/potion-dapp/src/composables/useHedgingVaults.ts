import { useGetHedgingVaultsQuery } from "subgraph-queries-hv/generated/urql";
import type { GetHedgingVaultsQuery } from "subgraph-queries-hv/generated/operations";
import { computed, ref, type Ref } from "vue";

import { formatUnits } from "@ethersproject/units";
import type { RoundsFragment, VaultData } from "@/types";

type HedgingVaultFragment = GetHedgingVaultsQuery["hedgingVaults"][0];

const fragmentToData = (fragment: HedgingVaultFragment): VaultData => ({
  address: fragment.id,
  underlying: {
    address: fragment.underlying.id,
    name: fragment.underlying.name,
    symbol: fragment.underlying.symbol,
    decimals: parseInt(fragment.underlying.decimals),
  },
  shareToken: {
    address: fragment.shareToken.id,
    name: fragment.shareToken.name,
    symbol: fragment.shareToken.symbol,
    decimals: parseInt(fragment.shareToken.decimals),
  },
  action: {
    maxPremium: formatUnits(fragment?.action?.maxPremiumPercentage ?? "0", 6),
    cycleDurationInSecs: formatUnits(
      fragment.action?.cycleDurationSecs ?? "0",
      0
    ),
  },
  rounds: (fragment?.rounds ?? []) as unknown as RoundsFragment[],
  size: fragment.totalShares,
  hedgingRate: formatUnits(fragment?.action?.hedgingRate ?? "0", 6),
  strikePercentage: formatUnits(fragment.action?.strikePercentage ?? "0", 6),
});

const useHedgingVaults = (investor: Ref<string>) => {
  const vaults: Ref<Array<VaultData>> = ref([]);
  const variables = computed(() => ({
    investor: investor.value,
  }));

  const { fetching, error, executeQuery } = useGetHedgingVaultsQuery({
    variables,
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  });

  async function loadVaults() {
    const { data } = await executeQuery();
    const loadedVaults = data.value?.hedgingVaults?.map(fragmentToData) ?? [];
    vaults.value = loadedVaults;

    return loadedVaults;
  }

  return {
    vaults,
    error,
    loading: fetching,
    loadVaults,
  };
};

export { useHedgingVaults };
