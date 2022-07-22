<template>
  <BaseCard
    test-input-number
    :color="props.color"
    :full-height="false"
    :class="{
      'focus-within:(ring-primary-500) last-children:focus-within:(bg-primary-500)':
        inputIsValid,
      '!ring-error last-children:(bg-error)': !inputIsValid,
    }"
  >
    <label class="p-3">
      <p class="font-sans font-medium text-sm text-white capitalize">
        {{ props.title }}
      </p>
      <div class="flex justify-between mt-4">
        <BaseTag>{{ props.unit }}</BaseTag>
        <BaseInput
          class="selection:(bg-accent-500 !text-deepBlack-900) text-white bg-transparent focus:(outline-none) px-2 font-serif text-xl font-bold grow"
          type="number"
          :readonly="props.readonly"
          :disabled="props.disabled"
          :model-value="props.modelValue"
          :min="props.min"
          :max="props.max"
          @update:model-value="handleInput"
        ></BaseInput>
        <button @click="emits('update:modelValue', handleSetMax())">
          <BaseTag class="transition hover:bg-primary-500" :is-empty="true"
            >MAX</BaseTag
          >
        </button>
      </div>
    </label>

    <CardFooter class="text-white">
      <slot name="footerDescription">
        <p class="capitalize">{{ footerText }}</p>
      </slot>
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
import { computed, watch } from "vue";
import type { CardColor } from "../../types";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import BaseInput from "../BaseInput/BaseInput.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
export interface Props {
  color?: CardColor;
  title?: string;
  unit?: string;
  step?: number;
  min: number;
  max: number;
  disabled?: boolean;
  readonly?: boolean;
  modelValue: number;
  footerDescription?: string;
  footerValue?: string;
  maxDecimals?: number;
  useUnit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  color: "glass",
  title: "",
  unit: "USDC",
  step: 0.1,
  min: 1,
  max: 100,
  disabled: false,
  modelValue: 1,
  footerDescription: "Balance",
  maxDecimals: 6,
  footerValue: "",
  useUnit: true,
});

const emits = defineEmits(["update:modelValue", "validInput"]);

const handleSetMax = () => props.max;

const handleInput = (value: number) => emits("update:modelValue", value);

const decimalCount = (num: number) => {
  // Convert to String
  const numStr = String(num);
  // String Contains Decimal
  if (numStr.includes(".")) {
    return numStr.split(".")[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
};

const inputIsValid = computed(() => {
  if (
    typeof props.modelValue !== "number" ||
    Number.isNaN(props.modelValue) ||
    props.modelValue < props.min ||
    props.modelValue > props.max ||
    decimalCount(props.modelValue) > props.maxDecimals
  ) {
    return false;
  }
  return true;
});
emits("validInput", inputIsValid.value);

watch(inputIsValid, () => {
  emits("validInput", inputIsValid.value);
});
const unit = computed(() => {
  if (props.useUnit) {
    return props.unit;
  } else return "";
});
const footerText = computed(() => {
  if (inputIsValid.value && props.footerValue === "") {
    return `${props.footerDescription}: ${currencyFormatter(
      props.max,
      unit.value
    )}`;
  } else if (inputIsValid.value && props.footerValue !== "") {
    return `${props.footerDescription}: ${props.footerValue}`;
  } else {
    if (decimalCount(props.modelValue) > props.maxDecimals) {
      return `The max number of decimals is ${props.maxDecimals}`;
    } else {
      return `Please, enter a valid value - Your ${
        props.footerDescription
      } is ${currencyFormatter(
        props.max,
        unit.value
      )} - Minimum is ${currencyFormatter(props.min, unit.value)}.`;
    }
  }
});

defineExpose({
  inputIsValid,
  footerText,
});
</script>
