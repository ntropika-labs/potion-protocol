<script setup lang="ts">
import BaseInput from "./components/Input/BaseInput.vue";
import { InputType } from "./types";
</script>

<template>
  <BaseInput :input-type="InputType.text" model-value=""></BaseInput>
</template>
