<template>
  <header ref="headerContainer" class="w-full">
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <section class="flex-none mb-2">
        <slot name="logo"></slot>
      </section>

      <BaseButton
        size="icon"
        label=""
        color="transparent"
        class="md:hidden"
        @click="toggleMobileMenu"
      >
        <template #pre-icon>
          <i class="i-ph-list-duotone"></i>
        </template>
      </BaseButton>

      <div class="hidden md:flex flex-1 justify-between items-center">
        <!-- empty span for symmetric spacing -->
        <span class="w-12"></span>
        <slot name="routes"></slot>
      </div>
    </div>
    <transition name="fade">
      <section
        v-if="mobileMenuOpen"
        class="md:hidden fixed inset-0 flex flex-col items-start p-6 gap-6 bg-gradient-to-br from-deep-blue-500 to-deep-black-900 z-40"
      >
        <section class="flex w-full items-center justify-between p-2">
          <span class="uppercase text-sm text-dwhite-400">Menu</span>
          <BaseButton
            size="icon"
            label=""
            mode="button"
            color="transparent"
            @click="toggleMobileMenu"
          >
            <template #pre-icon>
              <i class="i-ph-x"></i>
            </template>
          </BaseButton>
        </section>

        <div class="flex flex-col">
          <slot name="routes"></slot>
        </div>
      </section>
    </transition>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HeaderComponent",
});
</script>

<script lang="ts" setup>
import { ref, watch } from "vue";
import BaseButton from "../../BaseButton/BaseButton.vue";

export interface Props {
  currentRouteName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentRouteName: undefined,
});

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  toggleBodyOverflow(!mobileMenuOpen.value);
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleBodyOverflow = (isHidden: boolean) => {
  if (isHidden) {
    document.getElementsByTagName("body")[0].classList.add("overflow-hidden");
  } else {
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-hidden");
  }
};

watch(
  () => props.currentRouteName || undefined,
  () => {
    toggleBodyOverflow(false);
    mobileMenuOpen.value = false;
  }
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0%;
}
</style>
