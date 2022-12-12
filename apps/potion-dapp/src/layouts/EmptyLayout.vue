<template>
  <div
    class="min-h-screen py-5 font-sans text-dwhite-300 bg-gradient-to-br from-deepBlue to-deepBlack-900 font-medium w-[calc(100vw_-_15px)]"
  >
    <div class="container mx-auto mt-24 px-6 md:px-12">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  component: {
    name: "EmptyLayout",
  },
});
</script>
