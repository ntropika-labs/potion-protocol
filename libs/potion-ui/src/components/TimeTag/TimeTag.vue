<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TimeTag",
});

type LabelSize = "sm" | "md" | "lg" | "xl";
// prettier-ignore
const labelSizeMap: Map<LabelSize, string> = new Map([
  ["sm", "text-xs"],
  ["md", "text-sm"],
  ["lg", "text-base"],
  ["xl", "text-lg"],
]);
</script>

<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";

import { getTimeDifference } from "../../helpers";
import { BaseTag } from "../..";

export interface Props {
  title: string;
  timeFrom: string;
  timeTo: string;
  timeColorClass?: string;
  size?: LabelSize;
  asDifference?: boolean;
  humanReadable?: boolean;
  fromTimestamps?: boolean;
  absoluteValue?: boolean;
  horizontal?: boolean;
  isLoading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
  timeColorClass: "text-accent-500",
  asDifference: true,
  humanReadable: true,
  fromTimestamps: true,
  absoluteValue: false,
  horizontal: false,
  isLoading: false,
});
const sizeClass = computed(() => labelSizeMap.get(props.size));

const timeDifference = computed(() => {
  let fromTime = null;
  let toTime = null;

  console.log(props.timeFrom, props.timeTo);

  if (props.fromTimestamps) {
    const fromTimestamp = parseInt(props.timeFrom);
    const toTimestamp = parseInt(props.timeTo);
    if (
      fromTimestamp !== 0 &&
      toTimestamp !== 0 &&
      Number.isSafeInteger(fromTimestamp) &&
      Number.isSafeInteger(toTimestamp)
    ) {
      fromTime = dayjs.unix(parseInt(props.timeFrom));
      toTime = dayjs.unix(parseInt(props.timeTo));
    }
  } else {
    fromTime = dayjs(props.timeFrom);
    toTime = dayjs(props.timeTo);
  }

  if (
    fromTime &&
    toTime &&
    fromTime.isValid() &&
    toTime.isValid() &&
    (props.absoluteValue || (!props.absoluteValue && fromTime.isBefore(toTime))) // enable absolute values or require a valid diff
  ) {
    return getTimeDifference(fromTime, toTime);
  }

  return "-";
});
</script>
<template>
  <div
    :class="
      props.horizontal === true ? 'flex items-center gap-4 !children:m-0' : ''
    "
  >
    <h5 class="mb-2 font-medium capitalize" :class="sizeClass">
      {{ props.title }}
    </h5>
    <BaseTag :size="props.size" :is-loading="props.isLoading">
      <span :class="timeColorClass">{{ timeDifference }}</span>
    </BaseTag>
  </div>
</template>
