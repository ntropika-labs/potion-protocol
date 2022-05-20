<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CustomCurveParams",
});
</script>

<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
import MinusPlusInput from "../MinusPlusInput/MinusPlusInput.vue";

export interface Props {
  a: number;
  b: number;
  c: number;
  d: number;
  maxUtil: number;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:a", value: number): void;
  (e: "update:b", value: number): void;
  (e: "update:c", value: number): void;
  (e: "update:d", value: number): void;
  (e: "update:maxUtil", value: number): void;
}>();
</script>

<template>
  <BaseCard>
    <MinusPlusInput
      class="border-b border-white/10"
      :min="0"
      :max="5"
      :step="0.1"
      label="a"
      :model-value="props.a"
      @update:model-value="(value) => emits('update:a', value)"
    />
    <MinusPlusInput
      class="border-b border-white/10"
      :min="0"
      :max="5"
      :step="0.1"
      label="b"
      :model-value="props.b"
      @update:model-value="(value) => emits('update:b', value)"
    />
    <MinusPlusInput
      class="border-b border-white/10"
      :min="0"
      :max="5"
      :step="0.1"
      label="c"
      :model-value="props.c"
      @update:model-value="(value) => emits('update:c', value)"
    />
    <MinusPlusInput
      class="border-b border-white/10"
      :min="0"
      :max="5"
      :step="0.1"
      label="d"
      :model-value="props.d"
      @update:model-value="(value) => emits('update:d', value)"
    />
    <MinusPlusInput
      :min="0"
      :max="1"
      :step="0.1"
      label="maxUtil"
      :model-value="props.maxUtil"
      @update:model-value="(value) => emits('update:maxUtil', value)"
    />
  </BaseCard>
</template>
