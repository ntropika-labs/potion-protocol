<template>
  <div
    class="max-w-full p-1.5 flex-inline text-center flex-wrap justify-center rounded text-xs text-white font-semibold !leading-none font-sans overflow-hidden text-ellipsis items-center"
    :class="{
      'bg-transparent, border border-white/10': props.isEmpty,
      'bg-white/10': !props.isEmpty,
    }"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseTag",
});
</script>
<script lang="ts" setup>
export interface Props {
  isEmpty?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isEmpty: false,
});
</script>
