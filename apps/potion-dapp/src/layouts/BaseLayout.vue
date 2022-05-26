<template>
  <div
    class="min-h-screen py-5 font-sans text-dwhite-300 bg-gradient-to-br from-deepBlue to-deepBlack-900 font-medium w-[calc(100vw_-_15px)]"
  >
    <div class="container mx-auto px-6 md:px-12">
      <MainHeader></MainHeader>
    </div>

    <div class="container mx-auto mt-24 px-6 md:px-12">
      <slot />
    </div>
    <div
      id="toast-wrap"
      v-auto-animate
      class="absolute fixed top-0 right-0 z-20 flex flex-col items-end justify-start px-10 pt-10 gap-5"
    ></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseLayout",
});
</script>
<script lang="ts" setup>
import MainHeader from "../components/MainHeader.vue";
</script>
<style scoped>
.basic {
  background: linear-gradient(
    113.69deg,
    var(--deep-blue) 23.72%,
    var(--deep-black-900) 81.45%
  );
}
</style>
