<script lang="ts" setup>
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    isActive?: boolean;
  }>(),
  {
    isActive: false,
  }
);

const emit = defineEmits<{
  (e: "click"): void;
}>();

const borderColor = computed(() =>
  props.isActive ? "border-primary-500" : "border-white/10"
);
</script>

<template>
  <div
    test-tab-item
    class="cursor-pointer pb-2 border-b-2 text-center uppercase transition"
    :class="borderColor"
    @click="emit('click')"
  >
    <slot></slot>
  </div>
</template>
