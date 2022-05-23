<template>
  <div
    class="min-h-screen px-6 py-5 md:px-12 font-sans text-dwhite-300 bg-gradient-to-br from-deepBlue to-deepBlack-900 font-medium w-screen overflow-x-hidden"
  >
    <MainHeader></MainHeader>
    <div class="container mx-auto mt-24">
      <slot />
    </div>
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
