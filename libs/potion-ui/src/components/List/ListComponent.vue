<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ListComponent",
});
</script>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { InputType } from "../../types";
import type { ListElement } from "../../types";
import BaseInput from "../Input/BaseInput.vue";
import BaseCheckbox from "../Checkbox/BaseCheckbox.vue";
import BaseButton from "../Button/BaseButton.vue";

export interface Props {
  modelValue: Array<ListElement>;
  isLoading?: boolean;
  hasMoreInfo: boolean;
  hasMassSelection?: boolean;
  hasPagination?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  hasMoreInfo: false,
  hasMassSelection: false,
  hasPagination: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "update:select", item: ListElement): void;
}>();
const searchFilter = ref("");
const selectedItems = ref<Array<string | number>>([]);
const expandedItems = ref<Array<string | number>>([]);

const onSearch = (value: string | number) => {
  console.log(value);
  searchFilter.value = "" + value;
};

const onSelectItem = (item: ListElement) => {
  const index = expandedItems.value.indexOf(item.id);
  if (index === -1) {
    selectedItems.value.push(item.id);
  } else {
    selectedItems.value.splice(index, 1);
  }

  emit("update:select", item);
};

const onClickMoreInfo = (item: ListElement) => {
  const index = expandedItems.value.indexOf(item.id);
  if (index === -1) {
    expandedItems.value.push(item.id);
  } else {
    expandedItems.value.splice(index, 1);
  }

  console.log(expandedItems);
};

const filteredItems = computed(() => {
  if (!searchFilter.value) return props.modelValue || [];

  return props.modelValue.filter((el) => el.label.includes(searchFilter.value));
});
const isEmpty = computed(() => filteredItems.value.length === 0);
</script>
<template>
  <div class="rounded border-gray-500 border">
    <div class="py-2 px-4">
      <BaseInput
        :input-type="InputType.text"
        :model-value="searchFilter"
        :is-disabled="isLoading"
        placeholder="Search.."
        @update:model-value="onSearch"
      />
    </div>
    <template v-if="isLoading">
      <div class="p-5 text-center flex flex-col justify-center space-y-4">
        <svg
          class="mx-auto animate-spin h-8 w-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="text-sm uppercase text-gray-400">Loading...</span>
      </div>
    </template>
    <template v-else-if="isEmpty">
      <div class="p-5 m-4 bg-light text-center">
        <div class="text-xl text-gray-500 mb-2">There is no item</div>
        <div class="text-sm text-gray-400">
          Search for some or do some action
        </div>
      </div>
    </template>
    <template v-else>
      <ul class="divide-y p-2">
        <template v-for="item in filteredItems" :key="item.id">
          <li class="">
            <div class="p-2 flex items-center justify-between">
              <span v-if="props.hasMassSelection"
                ><BaseCheckbox
                  label=""
                  :is-inline="true"
                  :model-value="selectedItems.includes(item.id)"
                  @update:model-value="onSelectItem(item)"
              /></span>
              <span class="truncate">{{ item.label }}</span>
              <BaseButton
                v-if="props.hasMoreInfo"
                label=""
                palette="transparent"
                size="icon"
                @click="onClickMoreInfo(item)"
              >
                +
              </BaseButton>
            </div>
            <div
              class="mx-2 p-2 bg-light"
              :class="{ hidden: !expandedItems.includes(item.id) }"
            >
              <slot name="item" v-bind="item"></slot>
            </div>
          </li>
        </template>
      </ul>
      <div v-if="props.hasPagination" class="flex flex-row">pagination</div>
    </template>
  </div>
</template>
