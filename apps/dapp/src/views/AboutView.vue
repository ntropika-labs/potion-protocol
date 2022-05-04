<template>
  <input v-model="search" />
</template>

<script lang="ts" setup>
import { ref } from "vue";
const search = ref("");
</script>
