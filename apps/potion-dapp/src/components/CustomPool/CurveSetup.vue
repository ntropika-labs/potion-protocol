<template>
  <div>
    <div>CurveSetup</div>
    <input
      type="number"
      :value="props.modelValue.a"
      @input="handleUpdate('a', ($event.target as HTMLInputElement).value)"
    />
    <input
      type="number"
      :value="props.modelValue.b"
      @input="handleUpdate('b', ($event.target as HTMLInputElement).value)"
    />
    <input
      type="number"
      :value="props.modelValue.c"
      @input="handleUpdate('c', ($event.target as HTMLInputElement).value)"
    />
    <input
      type="number"
      :value="props.modelValue.d"
      @input="handleUpdate('d', ($event.target as HTMLInputElement).value)"
    />
    <input
      type="number"
      :value="props.modelValue.maxUtil"
      @input="handleUpdate('maxUtil', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>
<script lang="ts" setup>
interface Props {
  modelValue: {
    a: number;
    b: number;
    c: number;
    d: number;
    maxUtil: number;
  };
}
const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);
const handleUpdate = (param: string, value: string) => {
  const newValue = {
    ...props.modelValue,
    [param]: parseFloat(value),
  };
  emits("update:modelValue", newValue);
};
</script>
