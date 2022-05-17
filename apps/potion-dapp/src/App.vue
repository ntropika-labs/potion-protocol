<template>
  <div id="app" class="font-medium">
    <transition
      enter-active-class="transition-all"
      leave-active-class="transition-all"
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- <Spinner v-if="isLoading" /> -->
      <component :is="layout" class="font-poppins layout-container">
        <router-view />
      </component>
    </transition>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "App",
});
</script>
<script lang="ts" setup>
const route = useRoute();
let layout = computed(() => {
  return route.meta.layout;
});
</script>
