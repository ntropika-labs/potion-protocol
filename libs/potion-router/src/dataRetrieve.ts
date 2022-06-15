import { GetPoolsFromCriteriaDocument } from "subgraph-queries/generated/urql";

import { createClient } from "@urql/vue";

import type { Criteria } from "dapp-types";
import type { IPoolUntyped, ChartCriteriaPool } from "./types";
import type { GetPoolsFromCriteriaQuery } from "subgraph-queries/generated/operations";

const urqlRouterClient = createClient({
  requestPolicy: "network-only",
  url: import.meta.env.VITE_SUBGRAPH_ADDRESS,
});

const getPoolsFromCriteria = async (
  criteria: Criteria
): Promise<ChartCriteriaPool> => {
  const underlyingAddress = criteria.token.address;
  const result = await urqlRouterClient
    .query(GetPoolsFromCriteriaDocument, {
      underlyingAddress,
      minDuration: criteria.maxDuration.toString(),
      minStrike: criteria.maxStrike.toString(),
    })
    .toPromise();
  const data = result.data as GetPoolsFromCriteriaQuery;
  const poolsMap = new Map<string, IPoolUntyped>();
  data?.criterias?.forEach(
    ({
      criteriaSets,
      maxDurationInDays,
      maxStrikePercent,
      strikeAsset,
      isPut,
    }) => {
      criteriaSets?.forEach(({ criteriaSet }) => {
        criteriaSet?.templates?.forEach(({ pools, curve }) => {
          pools?.forEach((pool) => {
            poolsMap.set(pool.id, {
              ...pool,
              isPut,
              maxDurationInDays,
              maxStrikePercent,
              underlyingAddress,
              poolOrderSize: "0",
              strikeAddress: strikeAsset.address,
              unlocked: pool.unlocked,
              utilization: pool.utilization,
              curve: {
                id: curve?.id ?? "",
                a: curve?.a ?? "",
                b: curve?.b ?? "",
                c: curve?.c ?? "",
                d: curve?.d ?? "",
                maxUtil: curve?.maxUtil ?? "",
              },
            });
          });
        });
      });
    }
  );
  const pools = Array.from(poolsMap.values());
  console.log(pools);
  return {
    pools,
    symbol: criteria.token.symbol,
  };
};

const getPoolsFromCriterias = async (
  criterias: Criteria[]
): Promise<ChartCriteriaPool[]> =>
  await Promise.all(criterias.map(getPoolsFromCriteria));

export { getPoolsFromCriteria, getPoolsFromCriterias };
