<script lang="ts">
import { computed, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "PutOptionsTable",
});
</script>
<script lang="ts" setup>
import type { OtokenDataset } from "dapp-types";
import BaseButton from "../BaseButton/BaseButton.vue";

export interface Props {
  headings: Array<string>;
  dataset: OtokenDataset;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const { t } = useI18n();

const emits = defineEmits<{
  (e: "button-pressed", index: number, cellIndex: number): void;
}>();

const isNotEmpty = computed(() => props.dataset.length > 0);

const onButtonPressed = (index: number, cellIndex: number) =>
  emits("button-pressed", index, cellIndex);
</script>

<template>
  <div class="overflow-x-auto">
    <table
      v-if="isNotEmpty"
      class="table-fixed w-full font-medium text-dwhite-400"
    >
      <thead
        class="text-sm"
        :class="isNotEmpty ? 'border-b-2 border-white border-opacity-10' : ''"
      >
        <th
          v-for="(label, index) in props.headings"
          :key="`heading-${index}`"
          class="font-medium py-3 text-right first:pl-4 px-2 last:pr-4 w-[120px] last:w-[150px]"
        >
          {{ label }}
        </th>
      </thead>
      <tbody v-if="isNotEmpty" class="font-serif font-bold text-base">
        <tr
          v-for="(row, index) in dataset"
          :key="`row-${index}`"
          test-table-row
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="`cell-${index}-${cellIndex}`"
            class="px-2 py-4 first:pl-4 last:pr-4 text-right"
          >
            <BaseButton
              v-if="cell.button"
              test-table-claim-button
              :palette="cell.color"
              :label="cell.value"
              :disabled="!cell.claimable || props.loading"
              :inline="true"
              size="sm"
              @click="onButtonPressed(index, cellIndex)"
            />
            <span v-else :class="cell.color">{{ cell.value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-else
      class="border-t-2 border-white border-opacity-10 min-h-[100px] flex items-center justify-center w-full text-white text-opacity-20 text-xl"
    >
      <span>{{ t("no_options") }}</span>
    </div>
  </div>
</template>
