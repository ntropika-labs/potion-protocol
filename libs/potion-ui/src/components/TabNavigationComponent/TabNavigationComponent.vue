<script lang="ts">
import { defineComponent, ref, watch, type ComputedRef } from "vue";
import { BaseButton } from "../../index";

interface TabNavigationInfo {
  title: string;
  subtitle: string;
  visited?: boolean;
  isValid: ComputedRef<boolean> | boolean;
  cta?: {
    externalUrl: boolean;
    label: string;
    url: string;
  };
}

export default defineComponent({
  name: "TabNavigationComponent",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
export interface Props {
  title: string;
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
  (e: "quitTabs"): void;
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
    <div class="flex justify-between items-center pt-4 px-6 pb-2">
      <h4 class="uppercase text-dwhite-400 text-lg">{{ props.title }}</h4>
      <BaseButton
        palette="flat"
        size="icon"
        label=""
        @click="() => emit('quitTabs')"
      >
        <template #post-icon>
          <i class="i-ph-x"></i>
        </template>
      </BaseButton>
    </div>
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
          :label="step.title"
          palette="flat"
          class="text-dwhite-300 uppercase rounded-none mx-auto !disabled:opacity-100 w-52"
          @click="navigateToTab(index)"
        >
          <template v-if="step.isValid" #post-icon>
            <i class="i-ph-check-circle-bold text-green-400 ml-2"></i>
          </template>
        </BaseButton>
      </li>
    </ul>
    <p class="text-center text-lg mb-2">{{ tabs[currentIndex].subtitle }}</p>
    <template v-if="tabs[currentIndex].cta">
      <router-link
        v-if="!tabs[currentIndex].cta?.externalUrl"
        :to="tabs[currentIndex].cta?.url"
        class="text-center text-sm text-secondary-500 uppercase mb-4"
        >{{ tabs[currentIndex].cta?.label }}</router-link
      >
      <a
        v-if="tabs[currentIndex].cta?.externalUrl"
        :href="tabs[currentIndex].cta?.url"
        class="text-center text-sm text-secondary-500 uppercase mb-4"
        >{{ tabs[currentIndex].cta?.label }}</a
      >
    </template>
  </BaseCard>
  <!-- End tab navigation -->
  <!-- Start tabs content -->
  <div v-if="$slots.default" class="mt-6">
    <template v-for="(step, index) in $slots.default()" :key="index">
      <KeepAlive>
        <component :is="step" v-if="index === currentIndex"></component>
      </KeepAlive>
    </template>
  </div>
  <!-- End tabs content -->
</template>
