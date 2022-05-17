<template>
  <div
    class="flex flex-col items-center justify-center w-full px-8 py-4 rounded-b-3xl bg-radial-glass border-white border-opacity-5 border-t"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "CardFooter",
});
</script>
