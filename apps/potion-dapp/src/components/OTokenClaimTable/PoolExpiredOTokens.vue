<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PoolExpiredOTokens",
});
</script>

<script lang="ts" setup>
import { PutOptionsTable } from "potion-ui";

export interface Props {
  dataset: Array<Array<{ [key: string]: any }>>;
}

const props = withDefaults(defineProps<Props>(), {
  dataset: () => [],
});

const headings = [
  "Asset",
  "Exp. Date",
  "Premium",
  "Strike Price",
  "Reclaimable",
  "P&L",
  "Action",
];

const emits = defineEmits<{
  (e: "claim-otoken", index: number): void;
}>();

const onButtonPressed = (index: number, cellIndex: number) => {
  const row = props.dataset[index];
  if (row[cellIndex].claimable) {
    emits("claim-otoken", index);
  }
};
</script>
<template>
  <div class="border border-white border-opacity-10 rounded-3xl">
    <PutOptionsTable
      :headings="headings"
      :dataset="dataset"
      @button-pressed="onButtonPressed"
    />
  </div>
</template>
