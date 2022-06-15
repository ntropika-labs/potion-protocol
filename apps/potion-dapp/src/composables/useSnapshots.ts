import {
  useGetSnapshotsByTemplateQuery,
  useGetSnapshotsByPoolQuery,
} from "subgraph-queries/generated/urql";
import { computed, ref, watch } from "vue";
import type { SnapshotDataFragment } from "subgraph-queries/generated/operations";
import type { PerformanceData } from "dapp-types";

const getFloat = (value: null | undefined | string) =>
  value ? parseFloat(value) : 0;

const useSnapshots = (
  snapshotFragmentToChartData: (
    snapshot: SnapshotDataFragment
  ) => PerformanceData
) => {
  const snapshots = ref<SnapshotDataFragment[]>([]);
  const alreadyLoadedIds = computed(() =>
    [""].concat(snapshots.value.map(({ id }) => id))
  );
  const chartData = computed(() =>
    snapshots.value.map(snapshotFragmentToChartData)
  );

  return {
    chartData,
    snapshots,
    alreadyLoadedIds,
  };
};

const usePoolSnapshots = (currentPool: string) => {
  const snapshotFragmentToChartData = (snapshot: SnapshotDataFragment) => ({
    timestamp: parseInt(snapshot.timestamp),
    pnl: getFloat(snapshot.pnlPercentage),
    liquidity: getFloat(snapshot.size),
    utilization: 100 * getFloat(snapshot.utilization),
  });

  const { snapshots, alreadyLoadedIds, chartData } = useSnapshots(
    snapshotFragmentToChartData
  );

  const { data, fetching, executeQuery } = useGetSnapshotsByPoolQuery({
    variables: computed(() => ({
      currentPool,
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
  });

  watch(data, () => {
    snapshots.value = snapshots.value.concat(data?.value?.poolSnapshots ?? []);
  });

  return {
    chartData,
    snapshots,
    fetching,
    executeQuery,
  };
};

const useTemplateSnapshots = (templateAddress: string) => {
  const snapshotFragmentToChartData = (snapshot: SnapshotDataFragment) => ({
    timestamp: parseInt(snapshot.timestamp),
    pnl: getFloat(snapshot.templatePnlPercentage),
    liquidity: getFloat(snapshot.templateSize),
    utilization: 100 * getFloat(snapshot.templateUtilization),
  });

  const { snapshots, alreadyLoadedIds, chartData } = useSnapshots(
    snapshotFragmentToChartData
  );

  const { data, fetching } = useGetSnapshotsByTemplateQuery({
    variables: computed(() => ({
      templateAddress,
      alreadyLoadedIds: alreadyLoadedIds.value,
    })),
  });

  watch(data, () => {
    snapshots.value = snapshots.value.concat(data?.value?.poolSnapshots ?? []);
  });

  return {
    chartData,
    snapshots,
    fetching,
  };
};

export { usePoolSnapshots, useTemplateSnapshots };
