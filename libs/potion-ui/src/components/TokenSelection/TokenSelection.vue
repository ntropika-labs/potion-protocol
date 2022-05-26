<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TokenSelection",
});
</script>

<script lang="ts" setup>
import TokenCard from "../TokenCard/TokenCard.vue";
import type { SelectableToken } from "dapp-types";

export interface Props {
  tokens: SelectableToken[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "token-selected", address: string): void;
}>();
</script>

<template>
  <div test-token-selection-grid class="grid gap-6">
    <TokenCard
      v-for="(token, index) in props.tokens"
      :key="token.address"
      :test="`token-card-${index}`"
      :symbol="token.symbol"
      :name="token.name"
      :address="token.address"
      :image="token.image"
      :selected="token.selected"
      @token-selected="emit('token-selected', token.address)"
    />
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, 4.45rem);
}
</style>
