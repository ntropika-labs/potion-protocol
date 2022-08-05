<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseCard, InputNumber, currencyFormatter } from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";
import { contractsAddresses } from "@/helpers/contracts";
import SlippageSelector from "@/components/SlippageSelector.vue";
import type { Slippage } from "dapp-types";

interface Props {
  balance: number;
  potionQuantity: number;
  maxQuantity: number;
  numberOfTransactions: number;
  premium: string;
  selectedSlippage: string;
  slippage: Slippage[];
  marketSize: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:potionQuantity", quantity: number): void;
  (e: "update:slippage", index: number): void;
  (e: "valid-input", value: boolean): void;
}>();

const { t } = useI18n();

const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const balanceFormatted = computed(() =>
  currencyFormatter(props.balance, collateral.symbol)
);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <BaseCard color="no-bg" class="w-full justify-between">
      <div class="flex justify-between p-4 items-start text-sm">
        <div class="flex gap-2 items-center">
          <p class="capitalize">{{ t("market_size") }}</p>
        </div>
        <div>
          <p test-potion-market-size>{{ props.marketSize }}</p>
        </div>
      </div>
      <InputNumber
        test-potion-number-of-potions-input
        :model-value="props.potionQuantity"
        color="no-bg"
        :title="t('number_of_potions')"
        :min="0.00000001"
        :max="props.maxQuantity"
        :step="1"
        unit="POTION"
        :max-decimals="8"
        :footer-description="t('max_number_of_potions')"
        :use-unit="false"
        @valid-input="(value: boolean) => emits('valid-input', value)"
        @update:model-value="(value: number) => emits('update:potionQuantity', value)"
      />
    </BaseCard>
    <BaseCard color="no-bg" class="w-full gap-8 pt-4">
      <div class="flex justify-between px-4 items-start text-sm">
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("price_per_potion") }}</p>
          <p test-potion-price-per-potion>{{ props.premium }}</p>
        </div>
      </div>
      <div class="flex justify-between px-4 items-start text-sm">
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("number_of_potions") }}</p>
          <p test-potion-number-of-potions>{{ props.potionQuantity }}</p>
        </div>
      </div>
      <div class="flex justify-between px-4 items-start text-sm">
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("number_of_transactions") }}</p>
          <p test-potion-number-of-transactions>
            {{ props.numberOfTransactions }}
          </p>
        </div>
      </div>
      <div
        class="flex justify-between px-4 items-start text-sm text-secondary-500"
      >
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("total") }}</p>
          <div class="text-right">
            <p test-potion-total-price>{{ props.selectedSlippage }}</p>
            <p class="text-xs capitalize text-dwhite-300/30">
              {{ t("balance") }}: {{ balanceFormatted }}
            </p>
          </div>
        </div>
      </div>
      <SlippageSelector
        :slippage="props.slippage"
        @update:slippage="(index) => emits('update:slippage', index)"
      >
      </SlippageSelector>
    </BaseCard>
  </div>
</template>
