<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TabComponent",
});
</script>
<script lang="ts" setup>
export interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  isValid?: boolean;
}

withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  icon: undefined,
  isValid: false,
});
</script>
<template>
  <div>
    <slot />
  </div>
</template>
