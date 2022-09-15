import { computed, ref, watch, onMounted, isRef } from "vue";
import {
  useGetSnapshotsByTemplateQuery,
  useGetSnapshotsByPoolQuery,
} from "subgraph-queries/generated/urql";
import { deepUnref } from "@/helpers/vue";

import type {
  SnapshotDataFragment,
  GetSnapshotsByPoolQuery,
  GetSnapshotsByTemplateQuery,
} from "subgraph-queries/generated/operations";
import type { PerformanceData } from "dapp-types";
import type { ComputedRef } from "vue";
import type { MaybeRef } from "@vueuse/core";
import type { AnyVariables, UseQueryResponse } from "@urql/vue";

const getFloat = (value: null | undefined | string) =>
  value ? parseFloat(value) : 0;

const useSnapshots = (
  identifier: MaybeRef<string>,
  snapshotFragmentToChartData: (
    snapshot: SnapshotDataFragment
  ) => PerformanceData,
  urqlComposable: (
    alreadyLoadedIds: ComputedRef<string[]>
  ) =>
    | UseQueryResponse<GetSnapshotsByPoolQuery, AnyVariables>
    | UseQueryResponse<GetSnapshotsByTemplateQuery, AnyVariables>
) => {
  const snapshots = ref<SnapshotDataFragment[]>([]);
  const alreadyLoadedIds = computed(() =>
    [""].concat(snapshots.value.map(({ id }) => id))
  );
  const chartData = computed(() =>
    snapshots.value.map(snapshotFragmentToChartData)
  );

  const { data, fetching, executeQuery } = urqlComposable(alreadyLoadedIds);

  const appendSnapshots = () => {
    const newSnapshots = data?.value?.poolSnapshots ?? [];
    snapshots.value = snapshots.value.concat(newSnapshots);
  };

  const loadSnapshots = async () => {
    if (deepUnref(identifier)) {
      snapshots.value = [];
      await executeQuery();
    }
  };

  if (isRef(identifier)) {
    watch(identifier, loadSnapshots);
  }

  onMounted(appendSnapshots);
  watch(data, appendSnapshots);

  return {
    data,
    fetching,
    executeQuery,
    chartData,
    snapshots,
    alreadyLoadedIds,
  };
};

const usePoolSnapshots = (currentPool: MaybeRef<string>) => {
  const snapshotFragmentToChartData = (snapshot: SnapshotDataFragment) => ({
    timestamp: parseInt(snapshot.timestamp),
    pnl: getFloat(snapshot.pnlPercentage),
    liquidity: getFloat(snapshot.size),
    utilization: 100 * getFloat(snapshot.utilization),
  });

  const urqlComposable = (alreadyLoadedIds: ComputedRef<string[]>) =>
    useGetSnapshotsByPoolQuery({
      variables: computed(() => ({
        currentPool: deepUnref(currentPool),
        alreadyLoadedIds: deepUnref(alreadyLoadedIds),
      })),
    });

  const { snapshots, chartData, fetching, executeQuery } = useSnapshots(
    currentPool,
    snapshotFragmentToChartData,
    urqlComposable
  );

  return {
    chartData,
    snapshots,
    fetching,
    executeQuery,
  };
};

const useTemplateSnapshots = (templateAddress: MaybeRef<string>) => {
  const snapshotFragmentToChartData = (snapshot: SnapshotDataFragment) => ({
    timestamp: parseInt(snapshot.timestamp),
    pnl: getFloat(snapshot.templatePnlPercentage),
    liquidity: getFloat(snapshot.templateSize),
    utilization: 100 * getFloat(snapshot.templateUtilization),
  });

  const urqlComposable = (alreadyLoadedIds: ComputedRef<string[]>) =>
    useGetSnapshotsByTemplateQuery({
      variables: computed(() => ({
        templateAddress: deepUnref(templateAddress),
        alreadyLoadedIds: deepUnref(alreadyLoadedIds),
      })),
    });

  const { snapshots, chartData, fetching, executeQuery } = useSnapshots(
    templateAddress,
    snapshotFragmentToChartData,
    urqlComposable
  );

  return {
    chartData,
    snapshots,
    fetching,
    executeQuery,
  };
};

export { usePoolSnapshots, useTemplateSnapshots };
