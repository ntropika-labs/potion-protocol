<script lang="ts">
import { defineComponent, onMounted, ref, useSlots, watch } from "vue";
import { BaseButton, TabComponent } from "../../index";

interface TabNavigationInfo {
  label: string;
  visited: boolean;
  isValid: boolean;
  component: typeof TabComponent;
  //htmlElement: Element;
}

export default defineComponent({
  name: "TabNavigationComponent",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
export interface Props {
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
const tabItems = ref<Array<TabNavigationInfo>>([]);

const internalSlots = useSlots();
const setupTabs = () => {
  console.log(internalSlots);
  const navItems: Array<TabNavigationInfo> = [];
  if (internalSlots && internalSlots.default) {
    const slots = internalSlots.default() || [];

    slots.forEach((component: any, i: number) => {
      if (component.type.name === "TabComponent") {
        navItems.push({
          label: component?.props.title,
          component: component,
          visited: false,
          isValid: component?.props.isValid,
        });
      }
    });

    tabItems.value = navItems;
  }
};

const setCurrentIndex = (index: number) => {
  currentIndex.value = Math.max(Math.min(index, tabItems.value.length - 1), 0);
};

const navigateToTab = (index: number) => {
  if (props.hasNavigation) {
    setCurrentIndex(index);
  } else {
    emit("navigateTab", index);
  }
};

const updateTabNavigationItems = () => {
  if (currentIndex.value > -1 && currentIndex.value < tabItems.value.length) {
    console.log(
      "navigating to tab",
      "current index: ",
      currentIndex.value,
      props.defaultIndex
    );

    tabItems.value.forEach((tab, index) => {
      tab.visited = currentIndex.value >= index;
      tab.isValid =
        tab.component.props.isValid || tab.component.props["is-valid"];

      console.log(JSON.stringify(tab.component));
    });
  }
};

onMounted(() => {
  setupTabs();
  console.log(tabItems.value, props.defaultIndex, currentIndex.value);
});

watch(
  () => props.defaultIndex,
  (value) => {
    setCurrentIndex(value);
    updateTabNavigationItems();
  },
  { immediate: true }
);
</script>
<template>
  <!-- Start tab navigation -->
  <BaseCard>
    <ul class="inline-flex items-center justify-evenly gap-4 mx-auto pt-2 pb-6">
      <li
        v-for="(step, index) in tabItems"
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
  <div class="overflow-hidden mt-6">
    <template v-for="(step, index) in tabItems">
      <component
        :is="step.component"
        v-if="index === currentIndex"
        :key="index"
      ></component>
    </template>
  </div>
  <!-- End tabs content -->
  <!-- Start button navigation -->
  <div v-if="props.hasNavigation" class="flex justify-between p-4">
    <BaseButton
      :label="currentIndex === 0 ? 'Cancel' : 'Back'"
      palette="transparent"
      @click="navigateToTab(currentIndex - 1)"
    >
      <template v-if="currentIndex > 0" #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <BaseButton
      :label="currentIndex < tabItems.length - 1 ? 'Next' : 'Complete'"
      palette="secondary"
      @click="navigateToTab(currentIndex + 1)"
    >
      <template #post-icon>
        <i class="i-ph-caret-right"></i>
      </template>
    </BaseButton>
  </div>
  <!-- End button navigation -->
</template>
