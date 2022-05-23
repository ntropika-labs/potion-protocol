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
          @click="emits('navigate:next')"
        >
          <template #post-icon>
            <i class="i-ph-caret-right"></i>
          </template>
        </BaseButton>
      </template>
    </AddLiquidityCard>
    <BaseCard class="col-span-12 md:col-span-8 xl:col-span-9 p-6">
      <TokenSelection
        :tokens="props.availableTokens"
        @token-selected="handleTokenSelected"
      />
      <hr class="my-6 opacity-10" />
      <div class="flex flex-col gap-6">
        <template v-for="token of selectedTokens" :key="token.address">
          <SelectedTokenWrapper
            :underlying="token"
            :price-info="props.tokenPrices.get(token.address)!"
            @remove-selection="handleTokenRemove"
            @update:strike-duration="
              (newValues) => handleCriteriaUpdate(token.address, newValues)
            "
          ></SelectedTokenWrapper>
        </template>
      </div>
    </BaseCard>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import type { SelectableToken, ApiTokenPrice } from "dapp-types";
import { BaseCard, BaseButton, TokenSelection } from "potion-ui";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import SelectedTokenWrapper from "@/components/SelectedTokenWrapper/SelectedTokenWrapper.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface Props {
  liquidity: number;
  userCollateralBalance: number;
  liquidityCheck: boolean;
  availableTokens: SelectableToken[];
  tokenPrices: Map<string, ApiTokenPrice>;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:liquidity", value: number): void;
  (
    e: "update:criteria",
    address: string,
    maxStrike: number,
    maxDuration: number
  ): void;
  (e: "navigate:next"): void;
  (e: "token-selected", address: string): void;
  (e: "token-remove", address: string): void;
}>();

const handleTokenSelected = (address: string) =>
  emits("token-selected", address);

const handleCriteriaUpdate = (
  address: string,
  newValues: { strike: number; duration: number }
) => {
  emits("update:criteria", address, newValues.strike, newValues.duration);
};

const handleTokenRemove = (address: string) => emits("token-remove", address);

const selectedTokens = computed(() => {
  return props.availableTokens.filter((u) => u.selected);
});
</script>
