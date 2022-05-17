<template>
  <div
    class="text-sm font-semibold text-white font-sans flex flex-col justify-center w-full p-4 rounded-b-3xl bg-radial-glass border-t border-white/10"
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
