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
import "billboard.js/dist/theme/insight.min.css";
import type { BondingCurve, EmergingCurve, BillboardAxis } from "../../types";

export interface Props {
  bondingCurve: BondingCurve;
  emergingCurves?: EmergingCurve[];
  unloadKeys?: string[];
  axis?: {
    x: BillboardAxis;
    y: BillboardAxis;
  };
}

const props = withDefaults(defineProps<Props>(), {
  bondingCurve: () => [],
  emergingCurves: () => [],
  unloadKeys: () => [],
  axis: () => ({
    x: {
      label: {
        text: "Utilization",
      },
      tick: {
        values: _range(0, 1, 0.1),
        format: (n) => `${n}%`,
      },
    },
    y: {
      label: {
        text: "Premium",
      },
      tick: {
        format: (n) => `${n}%`,
      },
    },
  }),
});

const roundvalue = (value: number) => parseFloat(value.toFixed(2));

const chart = ref<bb.Chart | null>(null);
const chartReady = ref(false);
const chartContainer = ref<HTMLDivElement | null>(null);
const bondingCurveChart = ref<HTMLDivElement | null>(null);

const chartHeight = computed(() => chartContainer?.value?.clientHeight ?? 0);

const chartData = computed(() => {
  const json = new Map<string, BondingCurve>([
    ["bondingCurve", props.bondingCurve.map(roundvalue)],
  ]);
  const colors = new Map<string, string>([
    ["bondingCurve", "var(--primary-500)"],
  ]);
  const names = new Map<string, string>([["bondingCurve", "Bonding Curve"]]);

  const unload = props.unloadKeys.map((v) => v.toUpperCase());

  props.emergingCurves.forEach((curve) => {
    if (curve?.data?.length > 0) {
      json.set(
        curve.underlyingSymbol,
        curve.data.map((n) => roundvalue(n * 100))
      );
      names.set(curve.underlyingSymbol, curve.underlyingSymbol.toUpperCase());
    } else {
      unload.push(curve.underlyingSymbol);
    }
  });

  return {
    type: spline(),
    json: Object.fromEntries(json),
    colors: Object.fromEntries(colors),
    names: Object.fromEntries(names),
    unload: unload,
  };
});

const createChart = () => {
  chart.value = bb.generate({
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
    chart.value?.load(chartData.value);
  }
};

watch(chartData, updateChart);

onMounted(() => nextTick(createChart));
</script>

<template>
  <div class="flex flex-col text-white">
    <div class="w-full text-sm">Premium Bonding Curve</div>
    <div ref="chartContainer" class="h-[32rem]">
      <div ref="bondingCurveChart"></div>
    </div>
  </div>
</template>

<style>
.bb-line {
  stroke-dasharray: 7 8 !important;
}

.bb-line-bondingCurve {
  stroke-dasharray: none !important;
}

.bb-tooltip {
  border-collapse: separate;
  border-spacing: 0;
  empty-cells: show;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(36, 32, 56, 0.7);
  text-align: left;
  font-size: 0.75rem;
}

.bb-tooltip th {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  text-align: left;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

.bb-tooltip td {
  padding: 0.25rem 0.75rem;
  background-color: rgba(36, 32, 56, 0.7);
}

.bb-axis-y text,
.bb-axis-x text,
.bb-legend text {
  @apply text-white fill-current;
}
</style>
