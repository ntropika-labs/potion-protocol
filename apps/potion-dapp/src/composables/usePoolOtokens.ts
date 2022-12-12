import { useGetPoolRecordsByPoolQuery } from "subgraph-queries/generated/urql";
import { computed, onMounted, ref, unref, watch } from "vue";

import { useEthersProvider } from "./useEthersProvider";
import { usePotionLiquidityPoolContract } from "./usePotionLiquidityPoolContract";

import type { Token } from "dapp-types";

import type { Ref, ComputedRef } from "vue";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

const usePoolOtokens = (
  pool: string | Ref<string>,
  poolId: Ref<number> | ComputedRef<number>,
  poolLp: Ref<string> | ComputedRef<string>
) => {
  const payoutMap = ref<Map<string, number>>(new Map());
  const poolOtokens = ref<PoolRecordOtokenInfoFragment[]>([]);

  const { getOutstandingSettlements } = usePotionLiquidityPoolContract();
  const { blockTimestamp, getBlock } = useEthersProvider();

  onMounted(async () => {
    await getBlock("latest");
  });

  const alreadyLoadedIds = computed(() =>
    [""].concat(poolOtokens.value.map(({ id }) => id))
  );

  const { data, fetching } = useGetPoolRecordsByPoolQuery({
    variables: computed(() => ({
      pool: unref(pool),
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
  });

  const activeOtokens = computed(() =>
    poolOtokens.value.filter(
      ({ otoken }) => parseInt(otoken.expiry) > blockTimestamp.value
    )
  );
  const expiredOtokens = computed(() =>
    poolOtokens.value.filter(
      ({ otoken }) => parseInt(otoken.expiry) <= blockTimestamp.value
    )
  );

  const assetsWithOtokens = computed(() => {
    const tokens = new Set<Token>();

    activeOtokens.value.forEach((poolRecord) => {
      tokens.add({
        name: poolRecord.otoken.underlyingAsset.name,
        symbol: poolRecord.otoken.underlyingAsset.symbol,
        address: poolRecord.otoken.underlyingAsset.address,
      });
    });
    expiredOtokens.value.forEach((poolRecord) => {
      tokens.add({
        name: poolRecord.otoken.underlyingAsset.name,
        symbol: poolRecord.otoken.underlyingAsset.symbol,
        address: poolRecord.otoken.underlyingAsset.address,
      });
    });

    return Array.from(tokens);
  });

  watch(data, async () => {
    const newLoadedIds =
      data?.value?.poolRecords?.map(({ otoken }) => otoken.id) ?? [];
    if (newLoadedIds.length > 0) {
      payoutMap.value = await getOutstandingSettlements(newLoadedIds, {
        lp: unref(poolLp),
        poolId: unref(poolId),
      });
    }
    poolOtokens.value = poolOtokens.value.concat(
      data?.value?.poolRecords ?? []
    );
  });

  return {
    activeOtokens,
    assetsWithOtokens,
    expiredOtokens,
    poolOtokens,
    payoutMap,
    fetching,
  };
};

export { usePoolOtokens };
