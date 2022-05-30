<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { createChart } from "lightweight-charts";
import {
  rangeRight as _rangeRight,
  findLast as _findLast,
  sortBy as _sortBy,
  reverse as _reverse,
  uniqBy as _uniqBy,
} from "lodash-es";

import dayjs from "dayjs";
import type {
  ChartOptions,
  IChartApi,
  ISeriesApi,
  SingleValueData,
  UTCTimestamp,
  DeepPartial,
} from "lightweight-charts";

export type PerformanceData = {
  timestamp: number;
  liquidity: number;
  utilization: number;
  pnl: number;
};

export type TimeMode = "week" | "month" | "year" | "all";
export type NamedTimestamp =
  | "now"
  | "today"
  | "endOfDay"
  | "previousWeek"
  | "previousMonth"
  | "previousYear"
  | "firstPoint";

export interface Props {
  performanceData: PerformanceData[];
  todayTimestamp: number;
  mode: TimeMode;
  intraday: boolean;
  visibility: {
    liquidity: boolean;
    utilization: boolean;
    pnl: boolean;
  };
}

type AreaSeries = ISeriesApi<"Area">;
type HistogramSeries = ISeriesApi<"Histogram">;
type LineSeries = ISeriesApi<"Line">;

const props = withDefaults(defineProps<Props>(), {
  performanceData: () => [],
  todayTimestamp: 0,
  mode: "week",
  intraday: false,
  visibility: () => ({
    liquidity: true,
    utilization: true,
    pnl: true,
  }),
});

function _lastUniqBy<T>(arr: T[], key: string) {
  return _reverse(_uniqBy(_reverse(arr), key));
}

const createResponsiveChart = (
  container: HTMLElement,
  options: DeepPartial<ChartOptions>
) => {
  const chart = createChart(container, options);
  useResizeObserver(container, (entries) => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    chart.applyOptions({ width });
    chart.timeScale().fitContent();
  });
  return chart;
};

const chart = ref<IChartApi>();
const domChartRef = ref<HTMLElement>();
const liquidity = ref<AreaSeries>();
const utilization = ref<LineSeries>();
const pnl = ref<HistogramSeries>();

const dayjsNow = computed(() => dayjs.unix(props.todayTimestamp));
const today = computed(() => dayjsNow.value.startOf("day"));
const timestamps = computed(
  () =>
    new Map<NamedTimestamp, number>([
      ["now", dayjsNow.value.unix()],
      ["today", today.value.unix()],
      ["endOfDay", today.value.endOf("day").unix()],
      ["previousWeek", today.value.subtract(1, "week").unix()],
      ["previousMonth", today.value.subtract(1, "month").unix()],
      ["previousYear", today.value.subtract(1, "year").unix()],
      [
        "firstPoint",
        Math.min(...props.performanceData.map((d) => d.timestamp)),
      ],
    ])
);

const fromTimestamp = computed(
  () =>
    new Map<TimeMode, number>([
      ["all", timestamps.value.get("firstPoint") ?? 0],
      ["week", timestamps.value.get("previousWeek") ?? 0],
      ["month", timestamps.value.get("previousMonth") ?? 0],
      ["year", timestamps.value.get("previousYear") ?? 0],
    ])
);

const datasetTotalYears = computed(() => {
  const endOfDay = timestamps.value.get("endOfDay") ?? 0;
  const firstPoint = timestamps.value.get("firstPoint") ?? 0;
  const difference = dayjs
    .unix(endOfDay)
    .diff(dayjs.unix(firstPoint), "year", true);
  return Math.ceil(difference);
});

const tickData = computed(
  () =>
    new Map<TimeMode, { steps: number; unit: "hour" | "day" }>([
      ["week", { steps: 7 * 24, unit: "hour" }],
      ["month", { steps: 30, unit: "day" }],
      ["year", { steps: 365, unit: "day" }],
      ["all", { steps: datasetTotalYears.value * 365, unit: "day" }],
    ])
);

const tickFills = computed(() => {
  const { steps, unit } = tickData.value.get(props.mode) ?? {
    steps: 0,
    unit: "day",
  };
  const ticksTimestamps = _rangeRight(steps).map((v) =>
    today.value.subtract(v, unit).unix()
  );
  let lastValidPoint = {
    timestamp: ticksTimestamps[0],
    liquidity: 0,
    utilization: 0,
    pnl: 0,
  };
  return ticksTimestamps.map((timestamp) => {
    const nearestPoint = _findLast(
      props.performanceData,
      (d) => d.timestamp <= timestamp
    );
    if (nearestPoint) {
      lastValidPoint = {
        timestamp,
        liquidity: nearestPoint.liquidity,
        utilization: nearestPoint.utilization,
        pnl: nearestPoint.pnl,
      };
    }
    return lastValidPoint;
  });
});

const chartDataset = computed<{
  liquidity: SingleValueData[];
  utilization: SingleValueData[];
  pnl: SingleValueData[];
}>(() => {
  const result = {
    liquidity: [] as SingleValueData[],
    utilization: [] as SingleValueData[],
    pnl: [] as SingleValueData[],
  };
  const start = fromTimestamp.value.get(props.mode) ?? 0;
  const end = timestamps.value.get("endOfDay") ?? 0;
  const dataset = _sortBy(
    props.performanceData.concat(tickFills.value),
    "timestamp"
  )
    .map((point) => ({
      ...point,
      timestamp: getChartTime(point.timestamp),
    }))
    .filter((point) => point.timestamp >= start && point.timestamp < end);
  _lastUniqBy(dataset, "timestamp").forEach((point) => {
    result.liquidity.push({ time: point.timestamp, value: point.liquidity });
    result.utilization.push({
      time: point.timestamp,
      value: point.utilization,
    });
    result.pnl.push({ time: point.timestamp, value: point.pnl });
  });
  return result;
});

const createComponentChart = () => {
  if (domChartRef.value) {
    chart.value = createResponsiveChart(domChartRef.value, {
      height: 500,
      timeScale: {
        timeVisible: props.mode === "week" || props.intraday,
      },
      leftPriceScale: {
        visible: true,
      },
      layout: {
        textColor: "#fff",
        backgroundColor: "transparent",
      },
      crosshair: {
        vertLine: {
          color: "rgba(114, 76, 249, .3)",
        },
        horzLine: {
          color: "rgba(114, 76, 249, .3)",
        },
      },
      grid: {
        vertLines: {
          color: "transparent",
        },
        horzLines: {
          color: "rgba(255, 255, 255, .1)",
        },
      },
    });
    utilization.value = chart.value.addLineSeries({
      priceFormat: {
        type: "custom",
        minMove: 0.01,
        formatter: (p: number) => `${p.toFixed(2)}%`,
      },
      title: "utilization",
      color: "rgba(250, 25, 139, .7)",
    });
    liquidity.value = chart.value.addAreaSeries({
      priceScaleId: "left",
      priceFormat: {
        type: "volume",
      },
      title: "liquidity",
      lineColor: "rgb(114, 76, 249)",
      topColor: "transparent",
      bottomColor: "rgba(114, 76, 249, .7)",
    });
    pnl.value = chart.value.addHistogramSeries({
      priceFormat: {
        type: "custom",
        minMove: 0.01,
        formatter: (p: number) => `${p.toFixed(2)}%`,
      },
      title: "pnl",
      color: "rgba(61, 220, 151, .6)",
    });
  }
};

const setDatasets = (
  newLiquidity: SingleValueData[],
  newUtilization: SingleValueData[],
  newPnl: SingleValueData[]
) => {
  liquidity.value?.setData(newLiquidity);
  utilization.value?.setData(newUtilization);
  pnl.value?.setData(newPnl);
};

const setVisibility = () => {
  liquidity.value?.applyOptions({
    visible: props.visibility.liquidity,
  });
  utilization.value?.applyOptions({
    visible: props.visibility.utilization,
  });
  pnl.value?.applyOptions({
    visible: props.visibility.pnl,
  });
  chart.value?.applyOptions({
    leftPriceScale: {
      visible: props.visibility.liquidity,
    },
    rightPriceScale: {
      visible: props.visibility.utilization || props.visibility.pnl,
    },
  });
};

const setTimescale = () => {
  const from = (fromTimestamp.value.get(props.mode) ?? 0) as UTCTimestamp;
  const to = (timestamps.value.get("endOfDay") ?? 0) as UTCTimestamp;
  chart.value?.timeScale()?.setVisibleRange({ from, to });
  chart.value?.applyOptions({
    timeScale: {
      timeVisible: props.mode === "week" || props.intraday,
    },
  });
};

const getChartTime = (timestamp: number): UTCTimestamp => {
  const unit = tickData.value.get(props.mode)?.unit ?? "day";
  return (
    props.intraday
      ? dayjs.unix(timestamp).startOf("second").unix()
      : dayjs.unix(timestamp).endOf(unit).unix()
  ) as UTCTimestamp;
};

const loadChartDatasets = () => {
  setDatasets(
    chartDataset.value.liquidity,
    chartDataset.value.utilization,
    chartDataset.value.pnl
  );
  setTimescale();
  setVisibility();
};

const reloadChartDatasets = () => {
  setDatasets([], [], []);
  loadChartDatasets();
};

onMounted(() => {
  nextTick(() => {
    createComponentChart();
    loadChartDatasets();
  });
});

watch(props.visibility, setVisibility, { deep: true });
watch([props.performanceData, props.mode, props.intraday], reloadChartDatasets);
</script>

<template>
  <div ref="domChartRef" class="mt-4"></div>
</template>
