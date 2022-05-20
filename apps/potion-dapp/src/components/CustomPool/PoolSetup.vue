<template>
  <div class="grid grid-cols-12 gap-5">
    <AddLiquidityCard
      :model-value="props.liquidity"
      :pool-id="1"
      :user-balance="userCollateralBalance"
      class="col-span-12 md:col-span-4 xl:col-span-3"
      @update:model-value="emits('update:liquidity', $event)"
    >
      <template #card-footer>
        <BaseButton
          palette="secondary"
          :inline="true"
          :label="t('next')"
          :disabled="!liquidityCheck"
          @click="emits('navigate:next')"
        >
          <template #post-icon>
            <i class="i-ph-caret-right"></i>
          </template>
        </BaseButton>
      </template>
    </AddLiquidityCard>
    <div class="col-span-12 md:col-span-8 xl:col-span-9">
      <UnderlyingSelection
        :underlyings="props.availableUnderlyings"
        @underlying-selected="handleUnderlyingSelected"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Underlying, Criteria } from "@/types";
import { BaseButton, UnderlyingSelection } from "potion-ui";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

interface Props {
  liquidity: number;
  userCollateralBalance: number;
  liquidityCheck: boolean;
  availableUnderlyings: Underlying[];
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:liquidity", value: number): void;
  (e: "update:criteria", address: string, criteria: Criteria): void;
  (e: "navigate:next"): void;
  (e: "underlying-selected", address: string): void;
}>();

const handleUnderlyingSelected = (address: string) =>
  emits("underlying-selected", address);
</script>
