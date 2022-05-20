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
        <BaseInput
          class="selection:(bg-accent-500 !text-deepBlack-900) text-white bg-transparent focus:(outline-none) w-full px-2 font-serif text-xl font-bold"
          type="number"
          :model-value="props.modelValue"
          @update:model-value="handleInput"
        ></BaseInput>
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
import { currencyFormatter } from "../../helpers";
import { computed } from "vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import BaseInput from "../BaseInput/BaseInput.vue";
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

const handleSetMax = () => props.max;

const handleInput = (value: number) => emits("update:modelValue", value);

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
    return `${props.footerDescription} ${currencyFormatter(
      props.max,
      props.unit
    )}`;
  } else {
    return `Please, enter a valid value - Your ${
      props.footerDescription
    } is ${currencyFormatter(
      props.max,
      props.unit
    )} - Minimum is ${currencyFormatter(props.min, props.unit)}.`;
  }
});

defineExpose({
  inputIsValid,
  footerText,
});
</script>
