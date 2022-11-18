import { useGetHedgingVaultsQuery } from "subgraph-queries-hv/generated/urql";
import type { GetHedgingVaultsQuery } from "subgraph-queries-hv/generated/operations";
import { computed } from "vue";

import type { Token } from "dapp-types";
import { formatUnits } from "@ethersproject/units";

interface VaultData {
  address: string;
  underlying: Token;
  shareToken: Token;
  size: string;
  hedgingRate: string;
  strikePercentage: string;
}

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
  size: fragment.totalShares,
  hedgingRate: formatUnits(fragment?.action?.hedgingRate ?? "0", 6),
  strikePercentage: formatUnits(fragment.action?.strikePercentage ?? "0", 6),
});

const useHedgingVaults = () => {
  const { data, fetching, error } = useGetHedgingVaultsQuery({
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  });

  const vaults = computed(
    () => data.value?.hedgingVaults?.map(fragmentToData) ?? []
  );

  return {
    vaults,
    error,
    loading: fetching,
  };
};

export { useHedgingVaults };
