<template>
  <div class="h-screen w-full overflow-y-auto overflow-x-hidden">
    <div class="container mx-auto mt-24">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  component: {
    name: "BaseLayout",
  },
});
</script>
