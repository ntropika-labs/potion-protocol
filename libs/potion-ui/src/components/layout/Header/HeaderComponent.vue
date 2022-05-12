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

      <transition name="fade">
        <section
          v-if="mobileMenuOpen"
          class="lg:hidden fixed inset-0 flex flex-col items-start p-4 gap-6 bg-light"
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

      <section class="justify-self-end hidden lg:flex items-center gap-12">
        <slot name="routes"></slot>
      </section>
    </div>
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
import { useRoute } from "vue-router";
import BaseButton from "../../BaseButton/BaseButton.vue";

const currentRoute = useRoute();
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
  () => currentRoute?.name || undefined,
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
