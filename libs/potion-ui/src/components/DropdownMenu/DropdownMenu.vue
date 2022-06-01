<script lang="ts" setup>
import { ref } from "vue";
import type { MenuItem } from "dapp-types";

export interface Props {
  title: string;
  items: MenuItem[];
  itemsSelectedStatus: Map<string, boolean>;
}

const props = defineProps<Props>();
const open = ref(false);

const emits = defineEmits<{
  (e: "item-selected", name: string): void;
}>();

const toggle = () => (open.value = !open.value);
const hasStatus = (name: string) => props.itemsSelectedStatus.has(name);
</script>

<template>
  <div class="relative inline-block text-white">
    <div
      class="inline-flex items-center px-4 p-1.5 bg-deep-black-700 rounded-full cursor-pointer hover:bg-gradient-to-r hover:from-primary-500 hover:to-primary-400"
      @click="toggle"
    >
      <div class="pr-3 text-xs">{{ title }}</div>
      <span
        class="h-3 i-ph-caret-up"
        :class="open ? 'i-ph-caret-up' : 'i-ph-caret-down'"
      ></span>
    </div>
    <div
      v-if="open"
      class="absolute w-full top-full left-0 flex flex-col bg-deep-black-800 z-50 mt-1 rounded-lg overflow-hidden"
    >
      <span
        v-for="item in items"
        :key="item.name"
        class="modal-item flex text-xs py-1 px-4 cursor-pointer hover:bg-primary-500 bg-opacity-10"
        :class="{
          'text-opacity-30':
            hasStatus(item.name) && !itemsSelectedStatus.get(item.name),
        }"
        @click="emits('item-selected', item.name)"
      >
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
