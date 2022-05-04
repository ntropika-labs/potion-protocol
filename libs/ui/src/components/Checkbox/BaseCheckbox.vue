<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseCheckbox",
});
</script>
<script lang="ts" setup>
export interface Props {
  modelValue: boolean;
  isInline?: boolean;
  name?: string;
  label?: string;
  isReadonly?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isInline: false,
  name: undefined,
  label: undefined,
  isReadonly: false,
  isRequired: false,
  isDisabled: false,
});

const onChange = (ev: Event) => {
  console.log((ev.target as HTMLInputElement).value);
  emit("update:modelValue", false);
};

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:isValid"): void;
}>();
</script>
<template>
  <div class="flex" :class="[{ 'flex-col': !props.isInline }]">
    <label v-if="props.label" :for="props.name">{{ props.label }}</label>
    <input
      :checked="props.modelValue"
      :name="props.name"
      type="checkbox"
      :disabled="props.isDisabled"
      :readonly="props.isReadonly"
      @change="onChange"
    />
  </div>
</template>
