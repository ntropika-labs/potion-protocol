<template>
  <InputWrapper
    test-input-number
    :color="props.color"
    :decimals="decimals"
    :footer-description="props.footerDescription"
    :footer-value="props.footerValue"
    :is-input-valid="inputIsValid"
    :max="props.max"
    :max-decimals="props.maxDecimals"
    :min="props.min"
    :readonly="props.readonly"
    :show-balance="props.showBalance"
    :subtitle="props.subtitle"
    :title="props.title"
    :unit="unit"
    :value="props.modelValue"
  >
    <BaseTag>{{ props.unit }}</BaseTag>
    <BaseInput
      class="text-white bg-transparent focus:(outline-none) px-2 font-serif text-xl font-bold grow"
      type="number"
      :class="
        props.readonly ? '' : 'selection:(bg-accent-500 !text-deepBlack-900)'
      "
      :readonly="props.readonly"
      :disabled="props.disabled"
      :model-value="props.modelValue"
      :min="props.min"
      :max="props.max"
      @update:model-value="handleInput"
    ></BaseInput>
    <button
      v-if="props.showMax"
      @click="emits('update:modelValue', handleSetMax())"
    >
      <BaseTag class="transition hover:bg-primary-500" :is-empty="true"
        >MAX</BaseTag
      >
    </button>
  </InputWrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InputNumber",
});
</script>

<script lang="ts" setup>
import InputWrapper from "../InputWrapper/InputWrapper.vue";
import { computed, watch } from "vue";
import type { CardColor } from "../../types";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseInput from "../BaseInput/BaseInput.vue";

export interface Props {
  color?: CardColor;
  title?: string;
  subtitle?: string;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  readonly?: boolean;
  modelValue: number;
  footerDescription?: string;
  footerValue?: string;
  maxDecimals?: number;
  showMax?: boolean;
  showBalance?: boolean;
  useUnit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  color: "glass",
  title: "",
  subtitle: "",
  unit: "USDC",
  step: 0.1,
  min: 1,
  max: 100,
  disabled: false,
  modelValue: 1,
  footerDescription: "Balance",
  maxDecimals: 6,
  footerValue: "",
  showMax: true,
  showBalance: true,
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

const decimals = computed(() => decimalCount(props.modelValue));

const inputIsValid = computed(() => {
  if (
    typeof props.modelValue !== "number" ||
    Number.isNaN(props.modelValue) ||
    props.modelValue < props.min ||
    props.modelValue > props.max ||
    decimals.value > props.maxDecimals
  ) {
    return false;
  }
  return true;
});
emits("validInput", inputIsValid.value);

watch(inputIsValid, () => {
  emits("validInput", inputIsValid.value);
});

defineExpose({
  inputIsValid,
});
</script>
