<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MinusPlusInput",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import BaseInput from "../BaseInput/BaseInput.vue";
import MinusPlusButton from "../MinusPlusButton/MinusPlusButton.vue";

export interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  readonly: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "update:isValid", value: boolean): void;
}>();

const isValid = (value: number) => value >= props.min && value <= props.max;
const precision = computed(() => {
  const [digits, decimals] = props.step.toString().split(".");
  return decimals?.length ?? 0;
});
const toPrecision = (value: number) =>
  parseFloat(value.toFixed(precision.value));

const canDecrease = computed(() => isValid(props.modelValue - props.step));
const canIncrease = computed(() => isValid(props.modelValue + props.step));

const handleInput = (value: number) => {
  emit("update:modelValue", value);
  emit("update:isValid", isValid(value));
};

const decrease = () => {
  if (canDecrease.value) {
    emit("update:modelValue", toPrecision(props.modelValue - props.step));
  }
};

const increase = () => {
  if (canIncrease.value) {
    emit("update:modelValue", toPrecision(props.modelValue + props.step));
  }
};

defineExpose({
  canDecrease,
  canIncrease,
});
</script>

<template>
  <div class="p-3 flex items-center gap-2 text-white">
    <div class="flex items-center px-2 py-1 rounded-md bg-white bg-opacity-10">
      <label class="text-xs text-white leading-none">{{ props.label }}</label>
    </div>
    <BaseInput
      test-unit="input"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :model-value="props.modelValue"
      :readonly="props.readonly"
      :disabled="props.disabled"
      class="w-full leading-none bg-transparent text-lg font-semibold block border-none text-right p-0 outline-none focus:(outline-none border-none ring-0)"
      @update:model-value="handleInput"
    ></BaseInput>
    <MinusPlusButton
      v-if="!props.readonly"
      test-unit="decrease-button"
      direction="decrease"
      :enabled="canDecrease"
      @click="decrease"
    />
    <MinusPlusButton
      v-if="!props.readonly"
      test-unit="increase-button"
      direction="increase"
      :enabled="canIncrease"
      @click="increase"
    />
  </div>
</template>
