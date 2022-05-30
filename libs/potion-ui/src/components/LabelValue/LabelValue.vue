<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LabelValue",
});

type TextAlignment = "center" | "left" | "right";
type TextSize = "sm" | "md" | "lg" | "xl";
type ValueTrend = "up" | "down";
type ValueType = "raw" | "number" | "timestamp" | "date";
</script>
<script lang="ts" setup>
import { computed } from "vue";
import { shortDigitFormatter, dateFormatter } from "../../helpers";

export interface Props {
  alignment?: TextAlignment;
  valueColorClass?: string;
  title: string;
  value: string;
  valueType?: ValueType;
  size?: TextSize;
  symbol?: string;
  trend?: ValueTrend;
}

const props = withDefaults(defineProps<Props>(), {
  alignment: "left",
  valueColorClass: "",
  symbol: "",
  trend: undefined,
  size: "md",
  valueType: "number",
});

// prettier-ignore
const labelAlignmentMap: Map<TextAlignment, string> = new Map([
  ["left",    "text-left"],
  ["center",  "text-center"],
  ["right",   "text-right"]
]);

// prettier-ignore
const labelSizeMap: Map<TextSize, string> = new Map([
  ["sm", "text-xs"],
  ["md", "text-sm"],
  ["lg", "text-base"],
  ["xl", "text-lg"],
]);

// prettier-ignore
const valueAlignmentMap: Map<TextAlignment, string> = new Map([
  ["left",    "justify-start"],
  ["center",  "justify-center"],
  ["right",   "justify-end"]
]);

// prettier-ignore
const valueSizeMap: Map<TextSize, string> = new Map([
  ["sm", "text-sm"],
  ["md", "text-base"],
  ["lg", "text-lg"],
  ["xl", "text-xl"],
]);

const labelAlignment = computed(() => labelAlignmentMap.get(props.alignment));
const labelSize = computed(() => labelSizeMap.get(props.size));
const valueAlignment = computed(() => valueAlignmentMap.get(props.alignment));
const valueSize = computed(() => valueSizeMap.get(props.size));
const formattedValue = computed(() => {
  switch (props.valueType) {
    case "number":
      return shortDigitFormatter(parseFloat(props.value));
    case "timestamp":
      return dateFormatter(props.value, true);
    case "date":
      return dateFormatter(props.value, false);
    case "raw":
    default:
      return props.value;
  }
});
</script>
<template>
  <div>
    <h6
      class="capitalize font-medium mb-2"
      :class="[labelAlignment, labelSize]"
    >
      {{ props.title }}
    </h6>
    <div class="flex flex-wrap items-center space-x-1" :class="valueAlignment">
      <div class="font-bold font-bitter" :class="[valueSize, valueColorClass]">
        <span>{{ formattedValue }}</span>
        <span v-if="props.symbol" class="ml-1"> {{ props.symbol }}</span>
      </div>
    </div>
  </div>
</template>
