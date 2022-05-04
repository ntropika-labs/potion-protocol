<template>
  <header
    ref="headerContainer"
    class="py-4 md:py-3 fixed z-0 inset-x-0 bg-dark border-bottom transition-all"
  >
    <div
      class="w-full lg:max-w-[48rem] xl:max-w-[64rem] mx-auto flex items-center justify-between px-6"
    >
      <section class="flex-none mb-2">
        <router-link to="/">
          <img
            :src="logoImage"
            class="h-4 mb-auto mt-0"
            title="Potion"
            alt="Potion"
          />
        </router-link>
      </section>

      <BaseButton
        size="icon"
        label=""
        color="transparent"
        @click="toggleMobileMenu"
      >
        Menu
      </BaseButton>

      <transition name="fade">
        <section
          v-if="mobileMenuOpen"
          class="lg:hidden fixed top-0 left-0 w-screen h-screen z-1000 flex flex-col items-start p-4 gap-6 background-container"
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

          <router-link
            v-for="(route, index) in props.routes"
            :key="`route-${index}`"
            class="uppercase text-xl"
            :class="
              route.path === currentRoute.path ? activeClasses : inactiveClasses
            "
            :to="route"
          >
            {{ route.label }}
          </router-link>
          <a
            v-for="(route, index) in props.externalRoutes"
            :key="`external-route-${index}`"
            :href="route.path"
            target="_blank"
            class="uppercase text-xl text-gray-300 inline-flex items-center"
          >
            {{ route.label }} <icon-ph-arrow-square-out class="ml-1" />
          </a>

          <BaseButton
            v-for="(action, index) in props.actions"
            :key="`action-${index}`"
            size="icon"
            label=""
            mode="button"
            color="transparent"
          >
            Close
          </BaseButton>
        </section>
      </transition>

      <section class="justify-self-end hidden lg:flex items-center gap-12">
        <router-link
          v-for="(route, index) in props.routes"
          :key="`m-route-${index}`"
          class="uppercase text-sm font-semibold"
          :class="
            route.path === (currentRoute && currentRoute.path)
              ? activeClasses
              : inactiveClasses
          "
          :to="route"
        >
          {{ route.label }}
        </router-link>
        <a
          v-for="(route, index) in props.externalRoutes"
          :key="`m-external-route-${index}`"
          :href="route.path"
          target="_blank"
          class="uppercase text-xl text-gray-300 inline-flex items-center"
        >
          {{ route.label }}
        </a>

        <BaseButton
          v-for="(action, index) in props.actions"
          :key="`m-action-${index}`"
          size="icon"
          label=""
          mode="button"
          color="transparent"
        >
          Close
        </BaseButton>
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

import logoImage from "./../../../assets/logo.png";

export interface Props {
  routes?: Array<{ label: string; path: string }>;
  externalRoutes?: Array<{ label: string; path: string }>;
  actions?: Array<{ name: string; label: string }>;
}

const props = withDefaults(defineProps<Props>(), {
  routes: () => [],
  externalRoutes: undefined,
  actions: undefined,
});

const currentRoute = useRoute();
console.log("current route", currentRoute);
const activeClasses = `font-bold text-white`;
const inactiveClasses = `text-gray-300`;
let mobileMenuOpen = ref(false);

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
