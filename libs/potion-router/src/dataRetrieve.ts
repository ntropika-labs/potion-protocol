import { useGetPoolsFromCriteriaQuery } from 'subgraph-queries/generated/urql';
import type { IPoolUntyped } from './types';

const getPoolsFromCriteria = async (underlyingAddress: string, minDuration: string, minStrike: string) => {
  const { data } = await useGetPoolsFromCriteriaQuery({
    variables: {
      underlyingAddress,
      minDuration,
      minStrike,
    },
  });
  const poolsMap = new Map<string, IPoolUntyped>();
  data?.value?.criterias?.forEach((criteria) => {
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
              id: template?.curve?.id ?? '',
              a: template?.curve?.a ?? '',
              b: template?.curve?.b ?? '',
              c: template?.curve?.c ?? '',
              d: template?.curve?.d ?? '',
              maxUtil: template?.curve?.maxUtil ?? '',

            },
            underlyingAddress,
          });
        });
      });
    });
  });
  return Array.from(poolsMap.values());
}

export {
  getPoolsFromCriteria
}
