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
}
const props = withDefaults(defineProps<Props>(), {
  size: "md",
  timeColorClass: "text-accent-500",
  asDifference: true,
  humanReadable: true,
  fromTimestamps: true,
  absoluteValue: false,
  horizontal: false,
});
const sizeClass = computed(() => labelSizeMap.get(props.size));

const timeDifference = computed(() => {
  const fromT = props.fromTimestamps
    ? dayjs.unix(parseInt(props.timeFrom))
    : dayjs(props.timeFrom);
  const toT = props.fromTimestamps
    ? dayjs.unix(parseInt(props.timeTo))
    : dayjs(props.timeTo);

  if (
    !fromT.isValid() ||
    !toT.isValid() ||
    (!props.absoluteValue && toT.isBefore(fromT))
  ) {
    return "-";
  }

  return getTimeDifference(fromT, toT);
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
    <BaseTag :size="props.size">
      <span :class="timeColorClass">{{ timeDifference }}</span>
    </BaseTag>
  </div>
</template>
