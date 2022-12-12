<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomCurveParams",
});
</script>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { reactive, computed } from "vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import MinusPlusInput from "../MinusPlusInput/MinusPlusInput.vue";

export interface Props {
  a: number;
  b: number;
  c: number;
  d: number;
  maxUtil: number;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  disabled: false,
});

const emits = defineEmits<{
  (e: "update:a", value: number): void;
  (e: "update:b", value: number): void;
  (e: "update:c", value: number): void;
  (e: "update:d", value: number): void;
  (e: "update:maxUtil", value: number): void;
}>();

const validParams = reactive({
  a: true,
  b: true,
  c: true,
  d: true,
  maxUtil: true,
});

const isValid = computed(
  () =>
    validParams.a &&
    validParams.b &&
    validParams.c &&
    validParams.d &&
    validParams.maxUtil
);

const { t } = useI18n();
const wrongParamsMessage = t("wrong_bonding_curve_params");

const validCardClasses = computed(() => (isValid.value ? "" : "!ring-error"));
const borderColor = computed(() =>
  isValid.value ? "border-white/10" : "border-error"
);
</script>

<template>
  <BaseCard
    class="overflow-hidden"
    :class="validCardClasses"
    :full-height="false"
  >
    <MinusPlusInput
      class="border-b"
      :class="borderColor"
      :min="0"
      :max="10"
      :step="0.01"
      label="a"
      :model-value="props.a"
      :readonly="props.readonly"
      :disabled="props.disabled"
      @update:model-value="(value) => emits('update:a', value)"
      @update:is-valid="(v) => (validParams.a = v)"
    />
    <MinusPlusInput
      class="border-b"
      :class="borderColor"
      :min="0"
      :max="20"
      :step="0.01"
      label="b"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :model-value="props.b"
      @update:model-value="(value) => emits('update:b', value)"
      @update:is-valid="(v) => (validParams.b = v)"
    />
    <MinusPlusInput
      class="border-b"
      :class="borderColor"
      :min="0"
      :max="1000"
      :step="0.1"
      label="c"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :model-value="props.c"
      @update:model-value="(value) => emits('update:c', value)"
      @update:is-valid="(v) => (validParams.c = v)"
    />
    <MinusPlusInput
      class="border-b"
      :class="borderColor"
      :min="0"
      :max="20"
      :step="0.01"
      label="d"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :model-value="props.d"
      @update:model-value="(value) => emits('update:d', value)"
      @update:is-valid="(v) => (validParams.d = v)"
    />
    <MinusPlusInput
      :min="0"
      :max="1"
      :step="0.1"
      label="maxUtil"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :model-value="props.maxUtil"
      @update:model-value="(value) => emits('update:maxUtil', value)"
      @update:is-valid="(v) => (validParams.maxUtil = v)"
    />
    <div v-if="!isValid" class="p-3 flex items-center text-white bg-error">
      {{ wrongParamsMessage }}
    </div>
  </BaseCard>
</template>
