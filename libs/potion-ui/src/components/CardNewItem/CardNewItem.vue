<template>
  <BaseCard color="secondary-radial" class="w-full relative min-h-[330px]">
    <button
      class="cursor-pointer absolute w-full h-full flex items-center justify-center z-2"
      @click="$emit('click')"
    >
      <span class="i-ph-plus-fill h-30 w-30 bg-white"></span>
    </button>
    <div class="flex items-end justify-center w-full h-full">
      <span class="block py-8 font-semibold uppercase text-white">
        {{ props.label }}
      </span>
    </div>
  </BaseCard>
</template>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
export interface Props {
  label: string;
}
const props = defineProps<Props>();
defineEmits(["click"]);
</script>
