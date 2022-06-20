<template>
  <div
    class="max-w-full p-1.5 flex-inline text-center flex-wrap justify-center rounded text-white font-medium !leading-none font-sans overflow-hidden text-ellipsis items-center uppercase transition"
    :class="[
      {
        'bg-transparent border border-white/10': props.isEmpty,
        'bg-white/10': props.color === 'base',
        'bg-secondary-500': props.color === 'secondary',
        'bg-primary-500': props.color === 'primary',
      },
      sizeClass,
    ]"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseTag",
});

type LabelSize = "sm" | "md" | "lg" | "xl";
type Color = "primary" | "secondary" | "base";
// prettier-ignore
const labelSizeMap: Map<LabelSize, string> = new Map([
  ["sm", "text-xs"],
  ["md", "text-sm"],
  ["lg", "text-base"],
  ["xl", "text-lg"],
]);
</script>
<script lang="ts" setup>
import { computed } from "vue";

export interface Props {
  isEmpty?: boolean;
  size?: LabelSize;
  color?: Color;
}
const props = withDefaults(defineProps<Props>(), {
  isEmpty: false,
  size: "sm",
  color: "base",
});

const sizeClass = computed(() => labelSizeMap.get(props.size));
</script>
