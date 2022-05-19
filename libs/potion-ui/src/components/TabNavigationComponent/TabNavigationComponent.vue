<script lang="ts">
import { defineComponent, ref, watch, type ComputedRef } from "vue";
import { BaseButton } from "../../index";

interface TabNavigationInfo {
  label: string;
  visited?: boolean;
  isValid: ComputedRef<boolean>;
}

export default defineComponent({
  name: "TabNavigationComponent",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
export interface Props {
  tabs: Array<TabNavigationInfo>;
  defaultIndex?: number;
  vertical?: boolean;
  hasNavigation?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultIndex: 0,
  vertical: true,
  hasNavigation: false,
});

const emit = defineEmits<{
  (e: "navigateTab", index: number): void;
}>();

const currentIndex = ref<number>(props.defaultIndex);

const setCurrentIndex = (index: number) => {
  //currentIndex.value = Math.max(Math.min(index, tabItems.value.length - 1), 0);
  currentIndex.value = Math.max(index, 0);
};

const navigateToTab = (index: number) => {
  if (props.hasNavigation) {
    setCurrentIndex(index);
  } else {
    emit("navigateTab", index);
  }
};

watch(
  () => props.defaultIndex,
  (value) => {
    setCurrentIndex(value);
    //updateTabNavigationItems();
  },
  { immediate: true }
);
</script>
<template>
  <!-- Start tab navigation -->
  <BaseCard>
    <ul
      class="flex flex-wrap items-center justify-center lg:justify-evenly gap-4 mx-auto pt-2 pb-6"
    >
      <li
        v-for="(step, index) in tabs"
        :key="index"
        class="text-center relative before:(content-none flex absolute bottom-0 left-[50%] w-full h-[2px] translate-x-[-50%])"
        :class="[
          currentIndex === index
            ? 'before:bg-primary-500'
            : 'before:bg-dwhite-400 before:bg-opacity-20',
        ]"
      >
        <!-- :disabled="currentIndex < index && !step.isValid" -->
        <BaseButton
          :label="step.label"
          palette="flat"
          class="text-dwhite-300 rounded-none mx-auto !disabled:opacity-100 w-52"
          @click="navigateToTab(index)"
        >
          <template v-if="step.isValid" #post-icon>
            <i class="i-ph-check-circle-bold text-green-400 ml-2"></i>
          </template>
        </BaseButton>
      </li>
    </ul>
  </BaseCard>
  <!-- End tab navigation -->
  <!-- Start tabs content -->
  <div v-if="$slots.default" class="overflow-hidden mt-6">
    <template v-for="(step, index) in $slots.default()" :key="index">
      <KeepAlive>
        <component :is="step" v-if="index === currentIndex"></component>
      </KeepAlive>
    </template>
  </div>
  <!-- End tabs content -->
</template>
