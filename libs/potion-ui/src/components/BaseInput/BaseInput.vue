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
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false,
  min: 1,
  max: 999999999999999,
  step: 1,
});

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
    test-base-input
    type="number"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :value="props.modelValue"
    :readonly="props.readonly"
    :disabled="props.disabled"
    @input="handleInput"
    @keydown="handleKeydown"
  />
</template>
