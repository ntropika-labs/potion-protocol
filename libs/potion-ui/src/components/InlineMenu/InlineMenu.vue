<script lang="ts" setup>
import type { MenuItem } from "dapp-types";
export interface Props {
  items: MenuItem[];
  selectedItem: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "item-selected", name: string): void;
}>();
</script>

<template>
  <div
    class="inline-flex items-center bg-white rounded-lg bg-opacity-10 text-white"
  >
    <div
      v-for="item in props.items"
      :key="item.name"
      class="px-7 h-full py-1.5 text-center text-xs cursor-pointer"
      :class="{
        'rounded-lg bg-gradient-to-r from-primary-500 to-primary-400':
          item.name === props.selectedItem,
      }"
      @click="emits('item-selected', item.name)"
    >
      {{ item.label }}
    </div>
  </div>
</template>
