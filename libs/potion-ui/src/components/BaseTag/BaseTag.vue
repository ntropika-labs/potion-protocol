<template>
  <div
    class="max-w-full p-1.5 flex-inline text-center flex-wrap justify-center rounded text-white font-semibold !leading-none font-sans overflow-hidden text-ellipsis items-center"
    :class="[
      {
        'bg-transparent border border-white/10': props.isEmpty,
        'bg-white/10': !props.isEmpty,
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
}
const props = withDefaults(defineProps<Props>(), {
  isEmpty: false,
  size: "sm",
});

const sizeClass = computed(() => labelSizeMap.get(props.size));
</script>
