<script lang="ts" setup>
import {
  BaseCard,
  PerformanceChart,
  DropdownMenu,
  InlineMenu,
} from "potion-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import type { PerformanceData, TimeMode, MenuItem } from "dapp-types";

interface Props {
  performanceData: PerformanceData[];
  todayTimestamp: number;
}

const props = withDefaults(defineProps<Props>(), {
  performanceData: () => [],
  todayTimestamp: Date.now(),
});

const intraday = ref(false);
const selectedInterval = ref<TimeMode>("week");

const visibility = ref(
  new Map<string, boolean>([
    ["liquidity", true],
    ["utilization", true],
    ["pnl", true],
  ])
);

const { t } = useI18n();

const datasets: MenuItem[] = [
  {
    label: t("total_liquidity"),
    name: "liquidity",
  },
  {
    label: t("utilization"),
    name: "utilization",
  },
  {
    label: t("profit_and_loss"),
    name: "pnl",
  },
];

const intervals: MenuItem[] = [
  {
    label: t("last_week"),
    name: "week",
  },
  {
    label: t("last_month"),
    name: "month",
  },
  {
    label: t("last_year"),
    name: "year",
  },
  {
    label: t("all"),
    name: "all",
  },
];

const isTimeMode = (key: string): key is TimeMode =>
  ["week", "month", "year", "all"].includes(key);

const selectInterval = (interval: string) => {
  if (isTimeMode(interval)) {
    selectedInterval.value = interval;
  }
};
const toggleDataset = (key: string) =>
  visibility.value.set(key, !visibility.value.get(key));
</script>

<template>
  <BaseCard class="p-6 gap-6">
    <div class="flex justify-between">
      <DropdownMenu
        :title="t('enable_or_disable')"
        :items="datasets"
        :items-selected-status="visibility"
        @item-selected="toggleDataset"
      />
      <InlineMenu
        :items="intervals"
        :selected-item="selectedInterval"
        @item-selected="selectInterval"
      ></InlineMenu>
    </div>

    <PerformanceChart
      :performance-data="props.performanceData"
      :today-timestamp="props.todayTimestamp"
      :visibility="visibility"
      :mode="selectedInterval"
      :intraday="intraday"
    />
  </BaseCard>
</template>
