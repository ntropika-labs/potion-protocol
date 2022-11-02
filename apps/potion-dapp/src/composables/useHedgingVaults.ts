import { useGetHedgingVaultsQuery } from "subgraph-queries-hv/generated/urql";
import type { GetHedgingVaultsQuery } from "subgraph-queries-hv/generated/operations";
import { computed } from "vue";

import type { Token } from "dapp-types";
import { formatUnits } from "@ethersproject/units";

interface VaultData {
  address: string;
  asset: Token;
  shareToken: Token;
  size: string;
  hedgingRate: string;
  strikePercentage: string;
}

type HedgingVaultFragment = GetHedgingVaultsQuery["hedgingVaults"][0];

const fragmentToData = (fragment: HedgingVaultFragment): VaultData => ({
  address: fragment.id,
  asset: {
    address: fragment.asset.id,
    name: fragment.asset.name,
    symbol: fragment.asset.symbol,
    decimals: parseInt(fragment.asset.decimals),
  },
  shareToken: {
    address: fragment.shareToken.id,
    name: fragment.shareToken.name,
    symbol: fragment.shareToken.symbol,
    decimals: parseInt(fragment.shareToken.decimals),
  },
  size: fragment.totalAssets,
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
