<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CountdownElement",
});
</script>
<script lang="ts" setup>
import { onMounted, ref, type Ref } from "vue";
import countdown from "countdown";

export interface Props {
  label: string;
  endDate: Date;
  startDate?: Date;
  direction?: "row" | "column";
}

const unitsShown =
  countdown.YEARS |
  countdown.MONTHS |
  countdown.WEEKS |
  countdown.DAYS |
  countdown.HOURS |
  countdown.MINUTES |
  countdown.SECONDS;

const props = withDefaults(defineProps<Props>(), {
  startDate: undefined,
  direction: "row",
});
const timespan: Ref<any> = ref(
  countdown(props.endDate, props.startDate, unitsShown)
);

const update = () => {
  timespan.value = countdown(props.endDate, props.startDate, unitsShown, 6, 0);

  requestAnimationFrame(update);
};

onMounted(() => {
  update();
});
</script>
<template>
  <div
    class="flex gap-4 text-dwhite-300 items-end"
    :class="[direction === 'row' ? 'flex-row' : 'flex-col']"
  >
    <span class="text-sm" test-label>{{ label }}</span>
    <div
      class="flex flex-row font-semibold text-2xl leading-none"
      test-countdown
    >
      <template v-if="timespan.years">
        <span test-countdown-year>{{ timespan.years }}Y</span>
        <span>:</span>
      </template>
      <template v-if="timespan.months">
        <span test-countdown-month>{{ timespan.months }}M</span>
        <span>:</span>
      </template>
      <template v-if="timespan.days">
        <span test-countdown-day>{{ timespan.days }}d</span>
        <span>:</span>
      </template>
      <template v-if="timespan.hours">
        <span test-countdown-hour>{{ timespan.hours }}h</span>
        <span>:</span>
      </template>
      <span test-countdown-minute>{{ timespan.minutes }}m</span>
      <span>:</span>
      <span test-countdown-second>{{ timespan.seconds }}s</span>
    </div>
  </div>
</template>
