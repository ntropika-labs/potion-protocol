<script lang="ts">
import { computed, defineComponent } from "vue";
export default defineComponent({
  name: "TabNavigationComponent",
});
</script>
<script lang="ts" setup>
import { BaseButton, BaseCard } from "potion-ui";

export interface TabNavigationInfo {
  title: string;
  subtitle?: string;
  isValid: boolean;
  cta?: {
    externalUrl?: boolean;
    label: string;
    url: string;
  };
  enabled: boolean;
}
export interface Props {
  title?: string;
  tabs?: TabNavigationInfo[];
  defaultIndex?: number;
  inline?: boolean;
  showQuitTabs?: boolean;
  innerClasses?: string;
  contentClasses?: string;
}

/**
 * Note on reactivity
 *
 * See https://github.com/vuejs/core/issues/4903
 *
 * To be able to include steps dinamically using the default slot, each element must be a component of itself (pick one of your choice).
 * This is the only way to retain reactivity while rendering dynamic component
 * Working example:
 * <TabNavigationComponent {..props}>
 *  <MyStepComponent>
 *    first step - {{reactive}}
 *  </MyStepComponent>
 *  <MyStepComponent>
 *    second step
 *  </MyStepComponent>
 * </TabNavigationComponent>
 *
 * This doesnt work:
 * <TabNavigationComponent {..props}>
 *  <div>
 *    first step - {{reactive}} <- 'reactive' here wont be updated
 *  </div>
 *  <div>
 *    second step - {{reactive}}
 *  </div>
 * </TabNavigationComponent>
 * */
const props = withDefaults(defineProps<Props>(), {
  title: "",
  tabs: undefined,
  defaultIndex: 0,
  inline: false,
  showQuitTabs: false,
  innerClasses: "",
  contentClasses: "mt-6",
});

const emit = defineEmits<{
  (e: "navigateTab", index: number): void;
  (e: "quitTabs"): void;
}>();

const cardColor = computed(() => (props.tabs ? "glass" : "clean"));
</script>
<template>
  <!-- Start tab navigation -->
  <BaseCard :color="cardColor">
    <div class="flex justify-between items-center pt-4 px-6 pb-2">
      <h4 v-if="props.title" class="uppercase text-dwhite-400 text-lg">
        {{ props.title }}
      </h4>
      <BaseButton
        v-if="props.showQuitTabs"
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
    <template v-if="props.tabs">
      <ul
        class="flex flex-wrap items-center justify-center lg:justify-evenly gap-4 mx-auto pt-2 pb-6"
      >
        <li
          v-for="(step, index) in props.tabs"
          :key="index"
          class="text-center relative before:(content-none flex absolute bottom-0 left-[50%] w-full h-[2px] translate-x-[-50%])"
          :class="[
            props.defaultIndex === index
              ? 'before:bg-primary-500'
              : 'before:bg-dwhite-400 before:bg-opacity-20',
          ]"
        >
          <BaseButton
            :label="step.title"
            palette="flat"
            class="text-dwhite-300 uppercase rounded-none mx-auto w-52"
            :disabled="!step.enabled"
            @click="() => emit('navigateTab', index)"
          >
            <template v-if="step.isValid" #post-icon>
              <i class="i-ph-check-circle-bold text-green-400 ml-2"></i>
            </template>
          </BaseButton>
        </li>
      </ul>
      <p
        v-if="props.tabs[props.defaultIndex].subtitle"
        class="text-center text-lg mb-2"
      >
        {{ props.tabs[props.defaultIndex].subtitle }}
      </p>
      <template v-if="props.tabs[props.defaultIndex].cta">
        <router-link
          v-if="!props.tabs[props.defaultIndex].cta?.externalUrl"
          :to="props.tabs[props.defaultIndex].cta?.url"
          class="text-center text-sm text-secondary-500 uppercase mb-4"
          >{{ props.tabs[props.defaultIndex].cta?.label }}</router-link
        >
        <a
          v-if="props.tabs[props.defaultIndex].cta?.externalUrl"
          :href="props.tabs[props.defaultIndex].cta?.url"
          class="text-center text-sm text-secondary-500 uppercase mb-4"
          >{{ props.tabs[props.defaultIndex].cta?.label }}</a
        >
      </template>
    </template>
    <div v-else :class="props.innerClasses">
      <slot name="tabs-header"></slot>
      <div v-if="$slots.default && !props.tabs" :class="props.contentClasses">
        <template v-for="(step, index) in $slots.default()" :key="index">
          <KeepAlive>
            <component
              :is="step"
              v-if="index === props.defaultIndex"
            ></component>
          </KeepAlive>
        </template>
      </div>
    </div>
  </BaseCard>
  <!-- End tab navigation -->
  <!-- Start tabs content -->
  <div v-if="$slots.default && props.tabs" :class="props.contentClasses">
    <template v-for="(step, index) in $slots.default()" :key="index">
      <KeepAlive>
        <component :is="step" v-if="index === props.defaultIndex"></component>
      </KeepAlive>
    </template>
  </div>
  <!-- End tabs content -->
</template>
