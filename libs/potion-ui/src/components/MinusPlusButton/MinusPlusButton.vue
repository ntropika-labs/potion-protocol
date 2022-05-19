<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MinusPlusButton",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
export interface Props {
  direction?: "increase" | "decrease";
  enabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  direction: "increase",
  enabled: true,
});

const emit = defineEmits(["click"]);

const iconClass = computed(() =>
  props.direction === "increase" ? "i-ph-plus" : "i-ph-minus"
);
</script>

<template>
  <button
    class="flex items-center p-1 rounded-md bg-white bg-opacity-10 transition-colors text-xs text-white leading-none cursor-pointer outline-none disabled:opacity-50 not-disabled:(hover:bg-primary-500 focus:outline-none)"
    :disabled="!props.enabled"
    @click="emit('click')"
  >
    <i class="h-4 inline-block" :class="iconClass"></i>
  </button>
</template>
