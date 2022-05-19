<template>
  <BaseCard>
    <ul
      class="flex flex-wrap items-center justify-center lg:justify-evenly gap-4 mx-auto pt-2 pb-6"
    >
      <li
        v-for="tab in props.tabs"
        :key="tab.componentName"
        class="text-center relative before:(content-none flex absolute bottom-0 left-[50%] w-full h-[2px] translate-x-[-50%])"
        :class="
          tab.componentName === props.modelValue
            ? 'before:bg-primary-500'
            : 'before:bg-dwhite-400 before:bg-opacity-20'
        "
      >
        <BaseButton
          :key="tab.componentName"
          palette="flat"
          :label="tab.title"
          @click="emits('update:modelValue', tab.componentName)"
        >
          <template #post-icon>
            <i
              v-if="tab.isValid"
              name="post-icon"
              class="i-ph-check-circle-bold text-green-400 ml-2"
            ></i>

            <i v-else class="i-ph-check-circle-bold text-white/10 ml-2"></i>
          </template>
        </BaseButton>
      </li>
    </ul>
  </BaseCard>
</template>
<script lang="ts" setup>
// import {computed} from "vue"
import type { ComputedRef } from "vue";
import { BaseCard, BaseButton } from "potion-ui";
interface TabItem {
  title: string;
  subtitle: string;
  isValid: ComputedRef<boolean> | boolean;
  componentName: string;
}
interface Props {
  tabs: TabItem[];
  modelValue: string;
}
const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);
</script>
