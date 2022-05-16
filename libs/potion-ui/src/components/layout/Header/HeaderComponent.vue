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
        class="lg:hidden"
        @click="toggleMobileMenu"
      >
        Menu
      </BaseButton>

      <slot name="routes"></slot>
    </div>
    <transition name="fade">
      <section
        v-if="mobileMenuOpen"
        class="lg:hidden fixed inset-0 flex flex-col items-start p-4 gap-6 bg-light z-40"
      >
        <section class="flex w-full items-center justify-between">
          <span class="uppercase text-sm">Menu</span>
          <BaseButton
            size="icon"
            label=""
            mode="button"
            color="transparent"
            @click="toggleMobileMenu"
          >
            Close
          </BaseButton>
        </section>

        <slot name="routes"></slot>
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
