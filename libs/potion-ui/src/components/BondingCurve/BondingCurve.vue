<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BondingCurve",
});
</script>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { range as _range } from "lodash-es";
import bb, { spline } from "billboard.js";
import { useI18n } from "vue-i18n";
import "billboard.js/dist/theme/insight.min.css";
import type { EmergingCurvePoints } from "dapp-types";

export interface Props {
  bondingCurve: number[];
  emergingCurves?: EmergingCurvePoints[];
  unloadKeys?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  bondingCurve: () => [],
  emergingCurves: () => [],
  unloadKeys: () => [],
});

const { t } = useI18n();

const roundValue = (value: number) => (value * 100).toFixed(2);

const axis: bb.Axis = {
  x: {
    label: t("bonding_curve_x_axis"),
    tick: {
      values: _range(0, 101, 10),
      format: (n: number) => `${n}%`,
    },
  },
  y: {
    label: t("bonding_curve_y_axis"),
    tick: {
      format: (n: number) => `${roundValue(n)}%`,
    },
  },
};

const chart = ref<bb.Chart | null>(null);
const chartReady = ref(false);
const chartContainer = ref<HTMLDivElement | null>(null);
const bondingCurveChart = ref<HTMLDivElement | null>(null);

const chartHeight = computed(() => chartContainer?.value?.clientHeight ?? 0);

const chartData = computed(() => {
  const json = new Map<string, number[]>([
    ["bondingCurve", props.bondingCurve],
  ]);
  const colors = new Map<string, string>([
    ["bondingCurve", "var(--primary-500)"],
  ]);
  const names = new Map<string, string>([["bondingCurve", "Bonding Curve"]]);

  const unloadKeys = new Set(props.unloadKeys);

  props.emergingCurves.forEach((curve) => {
    if (curve?.data?.length > 0) {
      json.set(curve.symbol, curve.data);
      names.set(curve.symbol, curve.symbol.toUpperCase());
    } else {
      unloadKeys.add(curve.symbol);
    }
  });

  return {
    type: spline(),
    json: Object.fromEntries(json),
    colors: Object.fromEntries(colors),
    names: Object.fromEntries(names),
    unload: Array.from(unloadKeys).map((v) => v.toUpperCase()),
  };
});

const createChart = () => {
  chart.value = bb.generate({
    axis,
    bindto: bondingCurveChart.value,
    data: chartData.value,
    point: {
      show: false,
    },
    size: { height: chartHeight.value },
    padding: {
      right: 50,
    },
    spline: {
      interpolation: {
        type: "monotone-x",
      },
    },
  });
  chartReady.value = true;
};

const updateChart = () => {
  if (chartReady.value) {
    chartReady.value = false;
    chart.value?.load({
      ...chartData.value,
      done: () => {
        chart.value?.load(chartData.value);
        chartReady.value = true;
      },
    });
  }
};

onMounted(() => nextTick(createChart));
watch(chartData, () => nextTick(updateChart));
</script>

<template>
  <div class="flex flex-col text-white">
    <div class="w-full text-sm">{{ t("bonding_curve_title") }}</div>
    <div ref="chartContainer" test-chart-container class="h-[32rem]">
      <div ref="bondingCurveChart" test-billboard-chart></div>
    </div>
  </div>
</template>

<style>
.bb-line {
  @apply stroke-dash-7;
}

.bb-line-bondingCurve {
  @apply stroke-dash-0;
}

.bb-tooltip {
  @apply border-separate empty-cells-visible font-size-xs border-white/10 bg-deepBlack-800/70;
}

.bb-tooltip th {
  @apply border-bottom border-white/10 py-1 px-2;
}

.bb-tooltip td {
  @apply py-1 px-3 bg-deepBlack-800/70;
}

.bb line,
.bb path {
  @apply stroke-white/30;
}

.bb-axis text,
.bb-legend text {
  @apply text-white fill-current;
}
</style>
