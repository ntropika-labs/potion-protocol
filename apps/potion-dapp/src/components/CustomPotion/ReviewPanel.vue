<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseCard, BaseTag, InputNumber, currencyFormatter } from "potion-ui";
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

const balanceFormatted = computed(() =>
  currencyFormatter(props.balance, "USDC")
);
</script>

<template>
  <div
    class="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-3 justify-center"
  >
    <BaseCard color="no-bg" class="w-full justify-between">
      <div class="flex justify-between p-4 items-start text-sm">
        <div class="flex gap-2 items-center">
          <p class="capitalize">{{ t("market_size") }}</p>
        </div>
        <div>
          <p>{{ props.marketSize }}</p>
        </div>
      </div>
      <InputNumber
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
          <p>{{ props.premium }}</p>
        </div>
      </div>
      <div class="flex justify-between px-4 items-start text-sm">
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("number_of_potions") }}</p>
          <p>{{ props.potionQuantity }}</p>
        </div>
      </div>
      <div class="flex justify-between px-4 items-start text-sm">
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("number_of_transactions") }}</p>
          <p>{{ props.numberOfTransactions }}</p>
        </div>
      </div>
      <div
        class="flex justify-between px-4 items-start text-sm text-secondary-500"
      >
        <div class="flex gap-2 items-center justify-between w-full">
          <p class="capitalize">{{ t("total") }}</p>
          <div class="text-right">
            <p>{{ props.selectedSlippage }}</p>
            <p class="text-xs capitalize text-dwhite-300/30">
              {{ t("balance") }}: {{ balanceFormatted }}
            </p>
          </div>
        </div>
      </div>
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
    </BaseCard>
  </div>
</template>
