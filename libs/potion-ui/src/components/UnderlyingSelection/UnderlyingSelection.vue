<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "UnderlyingSelection",
});
</script>

<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
import UnderlyingCard from "../UnderlyingCard/UnderlyingCard.vue";
import type { Underlying } from "../../types";

export interface Props {
  underlyings: Underlying[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "underlying-selected", address: string): void;
}>();
</script>

<template>
  <BaseCard class="p-6">
    <div test-underlying-selection-grid class="grid gap-6">
      <UnderlyingCard
        v-for="underlying in props.underlyings"
        :key="underlying.address"
        :symbol="underlying.symbol"
        :name="underlying.name"
        :address="underlying.address"
        :image="underlying.image"
        :active="underlying.selected"
        @underlying-selected="emit('underlying-selected', underlying.address)"
      />
    </div>
  </BaseCard>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, 4.45rem);
}
</style>
