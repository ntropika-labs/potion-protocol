<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { BaseCard, BaseTag } from "potion-ui";
import type { Slippage } from "dapp-types";

interface Props {
  slippage: Slippage[];
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:slippage", index: number): void;
}>();

const { t } = useI18n();
</script>

<template>
  <BaseCard color="no-bg" class="p-4">
    <p class="text-lg font-bold capitalize">
      {{ t("slippage_tolerance") }}
    </p>
    <div class="flex gap-3 mt-3">
      <button
        v-for="(s, index) in props.slippage"
        :key="`slippage-${index}`"
        class="outline-none focus:outline-none"
        @click="emits('update:slippage', index)"
      >
        <BaseTag :color="s.selected === true ? 'primary' : 'base'">{{
          s.label
        }}</BaseTag>
      </button>
    </div>
  </BaseCard>
</template>
