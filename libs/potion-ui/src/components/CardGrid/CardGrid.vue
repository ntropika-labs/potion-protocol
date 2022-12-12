<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CardGrid",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";

export interface Props {
  title: string;
  subtitle: string;
}

const props = defineProps<Props>();
</script>
<template>
  <BaseCard class="p-8">
    <h4
      class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-xs font-medium"
    >
      {{ props.subtitle }}
    </h4>
    <h3 class="my-3 font-semibold text-lg">{{ props.title }}</h3>
    <div
      class="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-4"
    >
      <slot></slot>
    </div>
    <slot name="grid-footer"></slot>
  </BaseCard>
</template>
