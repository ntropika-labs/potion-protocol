<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseCard",
});
</script>
<script lang="ts" setup>
import { computed } from "vue";
export interface Props {
  direction?: "row" | "column";
  color?:
    | "glass"
    | "neutral"
    | "no-bg"
    | "secondary-radial"
    | "primary-radial-inactive"
    | "primary-radial"
    | "clean";
  fullHeight?: boolean;
  roundSize?: "none" | "small" | "default";
}
const props = withDefaults(defineProps<Props>(), {
  direction: "column",
  color: "glass",
  fullHeight: true,
  roundSize: "default",
});

const directionToClass = {
  column: "flex-col",
  row: "flex-row",
};

const roundedToClass = {
  none: "",
  small: "rounded-xl",
  default: "rounded-3xl",
};

const colorToClass = {
  glass: "bg-radial-glass blurred ring-white/10 ring-1",
  neutral: "bg-radial-neutral",
  "no-bg": "ring-white/10 ring",
  "secondary-radial": "bg-radial-secondary",
  "primary-radial-inactive": "bg-radial-primary-inactive",
  "primary-radial": "bg-radial-primary",
  clean: "bg-transparent",
};

const directionClass = computed(() => directionToClass[props.direction]);
const colorClass = computed(() => colorToClass[props.color]);
const roundedClass = computed(() => roundedToClass[props.roundSize]);
</script>

<template>
  <div
    class="flex"
    :class="[
      directionClass,
      colorClass,
      roundedClass,
      fullHeight ? 'h-full' : '',
    ]"
  >
    <slot />
  </div>
</template>
