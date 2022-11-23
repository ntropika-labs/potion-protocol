<template>
  <BaseCard
    test-input-wrapper
    :color="props.color"
    :full-height="false"
    :class="{
      'focus-within:(ring-primary-500) last-children:focus-within:(bg-primary-500)':
        !props.readonly && props.isInputValid,
      '!ring-error last-children:(bg-error)': !props.isInputValid,
    }"
  >
    <label class="p-3">
      <p
        test-input-wrapper-title
        class="font-sans font-medium text-sm text-white capitalize"
      >
        {{ props.title }}
      </p>
      <p
        v-if="props.subtitle"
        test-input-wrapper-subtitle
        class="font-sans font-medium text-xs text-white/60"
      >
        {{ props.subtitle }}
      </p>
      <div test-input-wrapper-slot class="flex justify-between mt-4">
        <slot></slot>
      </div>
    </label>

    <CardFooter test-input-wrapper-footer class="text-white">
      <slot name="footerDescription">
        <p class="capitalize">{{ footerText }}</p>
      </slot>
    </CardFooter>
  </BaseCard>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InputWrapper",
});
</script>

<script lang="ts" setup>
import { currencyFormatter } from "../../helpers";
import { computed } from "vue";
import type { CardColor } from "../../types";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";

export interface Props {
  color?: CardColor;
  decimals?: number;
  footerDescription?: string;
  footerValue?: string;
  isInputValid?: boolean;
  max: number;
  maxDecimals?: number;
  min: number;
  readonly?: boolean;
  showBalance?: boolean;
  subtitle?: string;
  title?: string;
  unit?: string;
  value: number;
}

const props = withDefaults(defineProps<Props>(), {
  color: "glass",
  decimals: 0,
  footerDescription: "Balance",
  footerValue: "",
  isInputValid: true,
  max: 100,
  maxDecimals: 6,
  min: 1,
  showBalance: true,
  subtitle: "",
  title: "",
  unit: "USDC",
  value: 1,
});

const footerText = computed(() => {
  if (props.showBalance) {
    if (props.isInputValid && props.footerValue === "") {
      return `${props.footerDescription}: ${currencyFormatter(
        props.max,
        props.unit
      )}`;
    } else if (props.isInputValid && props.footerValue !== "") {
      return `${props.footerDescription}: ${props.footerValue}`;
    } else {
      if (props.decimals > props.maxDecimals) {
        return `The max number of decimals is ${props.maxDecimals}`;
      } else {
        return `Please, enter a valid value - Your ${
          props.footerDescription
        } is ${currencyFormatter(
          props.max,
          props.unit
        )} - Minimum is ${currencyFormatter(props.min, props.unit)}.`;
      }
    }
  }
  return props.footerDescription;
});
</script>
