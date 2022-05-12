<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseInput",
});
</script>
<script lang="ts" setup>
export interface Props {
  modelValue: string | number;
  inputName?: string;
  label?: string;
  placeholder?: string;
  inputType: string;
  isInline?: boolean;
  isRequired?: boolean;
  isReadonly?: boolean;
  isDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isInline: false,
  inputName: undefined,
  label: undefined,
  placeholder: undefined,
  isReadonly: false,
  isRequired: false,
  isDisabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "update:isValid"): void;
}>();
</script>
<template>
  <div class="flex" :class="[{ 'flex-col': !props.isInline }]">
    <label v-if="props.label" :for="inputName">{{ props.label }}</label>
    <input
      class="border border-gray-200 w-full text-base leading-[1rem] bg-transparent font-poppins font-semibold focus:(outline-none) rounded-lg px-2 py-1"
      :value="props.modelValue"
      :name="props.inputName"
      :type="props.inputType"
      :disabled="props.isDisabled"
      :readonly="props.isReadonly"
      :placeholder="props.placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
