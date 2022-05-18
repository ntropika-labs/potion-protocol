<template>
  <BaseCard
    :full-height="false"
    :class="{
      'focus-within:(ring-primary-500) focus-within:children:last:(bg-primary-500)':
        inputIsValid,
      '!ring-error children:last:(bg-error)': !inputIsValid,
    }"
  >
    <label class="p-3">
      <p class="font-sans font-medium text-sm text-white">
        {{ props.title }}
      </p>
      <div class="flex justify-between mt-4">
        <BaseTag>{{ props.unit }}</BaseTag>
        <input
          class="selection:(bg-accent-500 !text-deepBlack-900) text-white bg-transparent focus:(outline-none) w-full px-2 font-serif text-xl font-bold"
          type="number"
          :value="props.modelValue"
          @input="emits('update:modelValue', ($event.target as HTMLInputElement).value)"
          @keydown="handleKeydown($event)"
        />
        <button @click="emits('update:modelValue', handleSetMax())">
          <BaseTag :is-empty="true">MAX</BaseTag>
        </button>
      </div>
    </label>

    <CardFooter class="text-white">
      <p>{{ footerText }}</p>
    </CardFooter>
  </BaseCard>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InputNumber",
});
</script>
<script lang="ts" setup>
import { computed } from "vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
export interface Props {
  title?: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  disabled?: boolean;
  modelValue: number;
  footerDescription?: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: "",
  unit: "USDC",
  step: 0.1,
  min: 1,
  max: 100,
  disabled: false,
  modelValue: 1,
  footerDescription: "Balance",
});

const emits = defineEmits(["update:modelValue"]);

const handleSetMax = () => {
  return props.max;
};
const handleKeydown = (event: KeyboardEvent) => {
  if ([",", "-", "+", "e"].includes(event.key)) {
    event.preventDefault();
  }
};

const inputIsValid = computed(() => {
  if (
    props.modelValue < props.min ||
    props.modelValue > props.max ||
    typeof props.modelValue !== "number" ||
    isNaN(props.modelValue)
  ) {
    return false;
  }
  return true;
});

const footerText = computed(() => {
  if (inputIsValid.value) {
    return `${props.footerDescription} ${props.max} ${props.unit}`;
  } else {
    return `Please, enter a valid value - Your balance is ${props.max} ${props.unit} - Minimum is ${props.min} ${props.unit}.`;
  }
});

defineExpose({
  inputIsValid,
  footerText,
});
</script>
<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
