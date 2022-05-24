<script lang="ts">
import { defineComponent } from "vue";
defineComponent({
  name: "InputSlider",
});
</script>
<script lang="ts" setup>
import { computed, ref } from "vue";

export interface Props {
  symbol: string;
  modelValue: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 100,
  step: 1,
  modelValue: 1,
  disabled: false,
});

const inputElement = ref<Element>();
const sliderThumb = ref<Element>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
const valuePercentage = computed(() => {
  const currentValue = Math.min(
    props.max,
    Math.max(props.min, props.modelValue)
  );

  return ((currentValue - props.min) / (props.max - props.min)) * 100;
});

const thumbPosition = computed(() => {
  const inputWidth = (inputElement.value as HTMLElement)?.offsetWidth || 1;
  const thumbWidth = (sliderThumb.value as HTMLElement)?.offsetWidth || 1;

  return (
    ((props.modelValue - props.min) / (props.max - props.min)) *
    (inputWidth - thumbWidth)
  );
});

const onValueChange = (event: Event) => {
  const value = (event.target as HTMLInputElement)?.value;
  const numericValue = Number.parseInt(value);

  if (
    Number.isSafeInteger(numericValue) &&
    props.min <= numericValue &&
    props.max >= numericValue
  ) {
    emit("update:modelValue", numericValue);
  }
};
</script>
<template>
  <div class="relative w-full h-[4px] bg-dark/20">
    <input
      ref="inputElement"
      test-slider-input
      class="input-slider h-[4px] focus:outline-none appearance-none w-full bg-transparent z-2 absolute cursor-pointer disabled:opacity-40 rounded-full"
      type="range"
      :step="props.step"
      :value="props.modelValue"
      :min="props.min"
      :max="props.max"
      :disabled="disabled"
      @input="onValueChange"
    />

    <span
      ref="sliderThumb"
      test-slider-thumb
      class="select-none min-w-12 h-8 px-4 leading-8 text-dwhite-300 absolute z-1 text-center rounded-lg cursor-pointer bg-gradient-to-r from-primary-500 to-primary-400 shadow-md transform translate-y-[-50%] text-xs font-serif whitespace-nowrap"
      :class="[disabled ? 'opacity-80' : '']"
      :style="`left: ${thumbPosition}px`"
      >{{ props.modelValue }}{{ symbol }}</span
    >
    <div class="h-[4px] absolute w-full bg-white bg-opacity-10">
      <div
        test-slider-progress
        class="h-[4px] absolute bg-primary-500 shadow-md"
        :style="`width: ${valuePercentage}%`"
      ></div>
    </div>
  </div>
</template>
<style scoped>
.input-slider::-webkit-slider-thumb {
  width: 3rem;
  height: 2rem;
  border: transparent;
  padding: 0 1rem;
  background-color: transparent;
  appearance: none;
}

.input-slider::-moz-range-thumb {
  width: 3rem;
  height: 2rem;
  border: none;
  padding: 0 1rem;
  background-color: transparent;
  appearance: none;
}
</style>
