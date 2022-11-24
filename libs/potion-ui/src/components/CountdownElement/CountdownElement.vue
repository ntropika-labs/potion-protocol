<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import { duration } from "dayjs";
import type { Duration } from "dayjs/plugin/duration";

dayjs.extend(duration);

export default defineComponent({
  name: "CountdownElement",
});
</script>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

export interface Props {
  label: string;
  startTimestampSeconds: number;
  endTimestampSeconds: number;
  direction?: "row" | "column";
  expirationMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "row",
  expirationMessage: "",
});

const initialized = ref(false);
const timespan = ref<Duration>(
  dayjs.duration(
    props.endTimestampSeconds - props.startTimestampSeconds,
    "seconds"
  )
);
const countdownIsRunning = computed(() => timespan.value.asMilliseconds() > 0);

const timeoutRef = ref<any>();

const update = () => {
  if (initialized.value) {
    timespan.value = timespan.value.subtract(1000);

    if (!countdownIsRunning.value && timeoutRef.value) {
      clearTimeout(timeoutRef.value);
    }
  } else if (
    0 != props.startTimestampSeconds &&
    0 != props.endTimestampSeconds
  ) {
    timespan.value = dayjs.duration(
      props.endTimestampSeconds - props.startTimestampSeconds,
      "seconds"
    );
    initialized.value = true;
  }
};

onMounted(() => {
  timeoutRef.value = setInterval(update, 1000);
});

onUnmounted(() => {
  if (timeoutRef.value) clearTimeout(timeoutRef.value);
});

const daysString = computed(() =>
  timespan.value.days().toString().padStart(2, "0")
);
const hoursString = computed(() =>
  timespan.value.hours().toString().padStart(2, "0")
);
const minutesString = computed(() =>
  timespan.value.minutes().toString().padStart(2, "0")
);
const secondsString = computed(() =>
  timespan.value.seconds().toString().padStart(2, "0")
);
</script>
<template>
  <div
    class="flex gap-4 text-dwhite-300 items-end"
    :class="[direction === 'row' ? 'flex-row' : 'flex-col']"
    test-countdown-element
  >
    <span v-if="countdownIsRunning" class="text-sm" test-label>{{
      label
    }}</span>
    <span v-else class="text-xl font-semibold" test-countdown-expiration>
      {{ expirationMessage }}
    </span>
    <div
      v-if="countdownIsRunning"
      class="flex flex-row font-mono font-semibold text-2xl leading-none"
      test-countdown
    >
      <template v-if="timespan.years()">
        <span test-countdown-year>{{ timespan.years() }}Y</span>
        <span>:</span>
      </template>
      <template v-if="timespan.months()">
        <span test-countdown-month>{{ timespan.months() }}M</span>
        <span>:</span>
      </template>
      <template v-if="timespan.days()">
        <span test-countdown-day>{{ daysString }}d</span>
        <span>:</span>
      </template>
      <template v-if="timespan.hours()">
        <span test-countdown-hour>{{ hoursString }}h</span>
        <span>:</span>
      </template>
      <span test-countdown-minute>{{ minutesString }}m</span>
      <span>:</span>
      <span test-countdown-second>{{ secondsString }}s</span>
    </div>
  </div>
</template>
