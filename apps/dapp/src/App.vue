<template>
  <component :is="layout">
    <router-view />
  </component>
</template>
<script lang="ts" setup>
import { $computed } from "vue/macros";
import { useRoute } from "vue-router";
const route = useRoute();
let layout = $computed(() => {
  return route.meta.layout;
});
</script>
