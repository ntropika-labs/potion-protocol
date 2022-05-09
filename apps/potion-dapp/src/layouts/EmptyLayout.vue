<template>
  <div class="bg-dark-900">
    <slot />
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
