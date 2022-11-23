<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CountdownElement",
});
</script>
<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from "vue";
import countdown from "countdown";

export interface Props {
  label: string;
  endDate: number;
  startDate: number;
  direction?: "row" | "column";
  expirationMessage?: string;
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
  direction: "row",
  expirationMessage: "",
});
const timespan: Ref<any> = ref(
  countdown(props.endDate, props.startDate, unitsShown)
);

const update = (t = 0) => {
  timespan.value = countdown(props.startDate + t, props.endDate, unitsShown);

  requestAnimationFrame(update);
};

onMounted(() => {
  update(0);
});

const daysString = computed(() =>
  timespan.value.days.toString().padStart(2, "0")
);
const hoursString = computed(() =>
  timespan.value.hours.toString().padStart(2, "0")
);
const minutesString = computed(() =>
  timespan.value.minutes.toString().padStart(2, "0")
);
const secondsString = computed(() =>
  timespan.value.seconds.toString().padStart(2, "0")
);
</script>
<template>
  <div
    class="flex gap-4 text-dwhite-300 items-end"
    :class="[direction === 'row' ? 'flex-row' : 'flex-col']"
    test-countdown-element
  >
    <span v-if="timespan.value > 0" class="text-sm" test-label>{{
      label
    }}</span>
    <span v-else class="text-xl font-semibold">
      {{ expirationMessage }}
    </span>
    <div
      v-if="timespan.value > 0"
      class="flex flex-row font-mono font-semibold text-2xl leading-none"
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
        <span test-countdown-day>{{ daysString }}d</span>
        <span>:</span>
      </template>
      <template v-if="timespan.hours">
        <span test-countdown-hour>{{ hoursString }}h</span>
        <span>:</span>
      </template>
      <span test-countdown-minute>{{ minutesString }}m</span>
      <span>:</span>
      <span test-countdown-second>{{ secondsString }}s</span>
    </div>
  </div>
</template>
