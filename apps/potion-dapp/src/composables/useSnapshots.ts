import {
  useGetSnapshotsByTemplateQuery,
  useGetSnapshotsByPoolQuery,
} from "subgraph-queries/generated/urql";
import { computed, ref, watch } from "vue";
import type { SnapshotDataFragment } from "subgraph-queries/generated/operations";

const snapshotFragmentToChartData = (snapshot: SnapshotDataFragment) => {
  const size = parseFloat(snapshot.size);
  const locked = parseFloat(snapshot.locked);
  const timestamp = parseInt(snapshot.timestamp);
  const actionAmount = parseFloat(snapshot.actionAmount);
  const actionType = parseInt(snapshot.actionType);
  const absPnL = parseFloat(snapshot.pnlTotal);
  const pnl = parseFloat(snapshot?.templatePnlPercentage ?? "0");
  const liquidity = parseFloat(snapshot?.templateSize ?? "0");
  const utilization = 100 * parseFloat(snapshot?.templateUtilization ?? "0");
  return {
    size,
    locked,
    timestamp,
    actionAmount,
    actionType,
    absPnL,
    pnl,
    liquidity,
    utilization,
  };
};

const useSnapshots = () => {
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
  const { snapshots, alreadyLoadedIds, chartData } = useSnapshots();

  const { data, fetching } = useGetSnapshotsByPoolQuery({
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
  };
};

const useTemplateSnapshots = (templateAddress: string) => {
  const { snapshots, alreadyLoadedIds, chartData } = useSnapshots();

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
