<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseInput",
});
</script>

<script lang="ts" setup>
export interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  emit("update:modelValue", value);
};

const handleKeydown = (event: KeyboardEvent) => {
  if ([",", "-", "+", "e"].includes(event.key)) {
    event.preventDefault();
  }
};
</script>

<template>
  <input
    type="number"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :value="props.modelValue"
    @input="handleInput"
    @keydown="handleKeydown"
  />
</template>
