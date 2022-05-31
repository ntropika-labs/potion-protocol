import { $fetch } from "ohmyfetch";
import { useGetPoolsFromCriteriaQuery } from "subgraph-queries/generated/urql";
import { computed, onMounted, ref, watch } from "vue";

import type { Criteria } from "dapp-types";
import type { IPoolUntyped, ChartCriteriaPool } from "./types";
import type { Ref } from "vue";
const query = (
  underlyingAddress: string,
  minDuration: string,
  minStrike: string
) => {
  return `query {
    criterias(
      where: {
        underlyingAsset: "${underlyingAddress}"
        maxDurationInDays_gte: ${minDuration}
        maxStrikePercent_gte: ${minStrike}
      }
    ) {
      isPut
      maxStrikePercent
      maxDurationInDays
      strikeAsset {
        address
      }
      criteriaSets {
        criteriaSet {
          templates {
            curve {
              id
              a
              b
              c
              d
              maxUtil
            }
            pools(first: 1000, orderBy: averageCost, orderDirection: asc) {
              id
              size
              locked
              unlocked
              utilization
              lp
              poolId
            }
          }
        }
      }
    }
  }
  `;
};
const useGetRouterData = (criteria: Ref<Criteria>) => {
  const underlyingAddress = computed(() => {
    return criteria.value.token.address;
  });
  const queryVariables = computed(() => {
    return {
      underlyingAddress: underlyingAddress.value,
      minDuration: criteria.value.maxDuration.toString(),
      minStrike: criteria.value.maxStrike.toString(),
    };
  });
  const { data, executeQuery } = useGetPoolsFromCriteriaQuery({
    variables: queryVariables,
  });
  const poolsMap = ref(new Map<string, IPoolUntyped>());
  const pools = computed(() => {
    return Array.from(poolsMap.value.values());
  });
  const setPoolMapValues = () => {
    data?.value?.criterias?.forEach((criteria) => {
      criteria?.criteriaSets?.forEach((criteriaSet) => {
        criteriaSet?.criteriaSet?.templates?.forEach((template) => {
          template?.pools?.forEach((pool) => {
            poolsMap.value.set(pool.id, {
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
              underlyingAddress: underlyingAddress.value,
            });
          });
        });
      });
    });
  };

  onMounted(async () => {
    await executeQuery();
    setPoolMapValues();
  });
  watch(criteria, async () => {
    await executeQuery();
    setPoolMapValues();
  });
  return {
    underlyingAddress,
    queryVariables,
    poolsMap,
    pools,
    setPoolMapValues,
    executeQuery,
  };
};

const fetchPoolsFromCriteria = async (
  criteria: Criteria
): Promise<ChartCriteriaPool> => {
  const underlyingAddress = criteria.token.address;

  const data = await $fetch(
    "http://localhost:8000/subgraphs/name/potion-subgraph",
    {
      method: "POST",
      body: {
        query: query(
          underlyingAddress,
          criteria.maxDuration.toString(),
          criteria.maxStrike.toString()
        ),
      },
    }
  );
  const poolsMap = new Map<string, IPoolUntyped>();
  data.data?.criterias?.forEach((criteria: any) => {
    criteria?.criteriaSets?.forEach((criteriaSet: any) => {
      criteriaSet?.criteriaSet?.templates?.forEach((template: any) => {
        template?.pools?.forEach((pool: any) => {
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
const fetchPoolsFromCriterias = async (
  criterias: Criteria[]
): Promise<ChartCriteriaPool[]> =>
  await Promise.all(criterias.map(fetchPoolsFromCriteria));

const getPoolsFromCriteria = async (
  criteria: Criteria
): Promise<ChartCriteriaPool> => {
  const underlyingAddress = criteria.token.address;
  const { data } = await useGetPoolsFromCriteriaQuery({
    variables: {
      underlyingAddress,
      minDuration: criteria.maxDuration.toString(),
      minStrike: criteria.maxStrike.toString(),
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

export {
  getPoolsFromCriteria,
  getPoolsFromCriterias,
  useGetRouterData,
  fetchPoolsFromCriteria,
  fetchPoolsFromCriterias,
};
