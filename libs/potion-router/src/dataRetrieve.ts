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
  data?.criterias?.forEach((criteria) => {
    criteria?.criteriaSets?.forEach((criteriaSet) => {
      criteriaSet?.criteriaSet?.templates?.forEach((template) => {
        template?.pools?.forEach((pool) => {
          poolsMap.set(pool.id, {
            id: pool.id,
            isPut: criteria.isPut,
            locked: pool.locked,
            lp: pool.lp,
            maxDurationInDays: criteria.maxDurationInDays,
            maxStrikePercent: criteria.maxStrikePercent,
            poolId: pool.poolId,
            poolOrderSize: "0",
            size: pool.size,
            strikeAddress: criteria.strikeAsset.address,
            unlocked: pool.unlocked,
            utilization: pool.utilization,
            curve: {
              id: template?.curve?.id ?? "",
              a: template?.curve?.a ?? "",
              b: template?.curve?.b ?? "",
              c: template?.curve?.c ?? "",
              d: template?.curve?.d ?? "",
              maxUtil: template?.curve?.maxUtil ?? "",
            },
            underlyingAddress,
          });
        });
      });
    });
  });
  const pools = Array.from(poolsMap.values());
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
