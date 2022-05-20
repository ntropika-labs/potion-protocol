<template>
  <div class="grid grid-cols-12 gap-5 items-start">
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
    <BaseCard class="col-span-12 md:col-span-8 xl:col-span-9 p-6">
      <UnderlyingSelection
        :underlyings="props.availableUnderlyings"
        @underlying-selected="handleUnderlyingSelected"
      />
      <hr class="my-6 opacity-10" />
      <div class="flex flex-col gap-6">
        <template
          v-for="underlying of selectedUnderlyings"
          :key="underlying.address"
        >
          <SelectedUnderlyingWrapper
            :underlying="underlying"
            :price-info="props.underlyingPrices.get(underlying.address)"
          ></SelectedUnderlyingWrapper>
        </template>
      </div>
    </BaseCard>
  </div>
</template>
<script lang="ts" setup>
import { computed, type ComputedRef, type Ref } from "vue";
import type { SelectableToken, Criteria } from "@/types";
import { BaseCard, BaseButton, UnderlyingSelection } from "potion-ui";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import SelectedUnderlyingWrapper from "@/components/SelectedUnderlyingWrapper/SelectedUnderlyingWrapper.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  liquidity: number;
  userCollateralBalance: number;
  liquidityCheck: boolean;
  availableUnderlyings: SelectableToken[];
  underlyingPrices: Map<
    string,
    {
      loading: Ref<boolean>;
      price: Ref<number>;
      formattedPrice: ComputedRef<string>;
      success: Ref<boolean>;
    }
  >;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:liquidity", value: number): void;
  (e: "update:criteria", criteria: Criteria): void;
  (e: "navigate:next"): void;
  (e: "underlying-selected", address: string): void;
}>();

const handleUnderlyingSelected = (address: string) =>
  emits("underlying-selected", address);

const selectedUnderlyings = computed(() => {
  return props.availableUnderlyings.filter((u) => u.selected);
});
</script>
