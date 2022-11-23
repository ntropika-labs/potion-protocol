<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseButton, InputNumber, InputSlider, InputWrapper } from "potion-ui";

interface Props {
  availableUnderlyings: number;
  estimatedUnderlyings: number;
  canExchange: boolean;
  isLoading: boolean;
  isExchangeLoading: boolean;
  isRedeemLoading: boolean;
  underlyingSymbol: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "exchangeTickets", value: number): void;
  (e: "redeem"): void;
}>();
const { t } = useI18n();

const exchangePercentage = ref(100);
const updateExchangePercentage = (value: number) => {
  if (value > 0 && value < 101) {
    exchangePercentage.value = value;
  }
};

const label = computed(() =>
  props.canExchange ? t("exchange") : t("approve")
);
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col items-center gap-4">
      <InputWrapper
        class="w-full"
        :footer-description="t('withdraw_estimated_value')"
        :subtitle="t('withdrawals_processed_next_round')"
        :title="t('choose_withdrawal_amount')"
        :value="props.estimatedUnderlyings"
        :max="props.estimatedUnderlyings"
        :unit="props.underlyingSymbol"
      >
        <InputSlider
          class="my-4"
          symbol="%"
          :step="0.1"
          :model-value="exchangePercentage"
          @update:model-value="updateExchangePercentage"
        />
      </InputWrapper>
      <BaseButton
        palette="secondary"
        :label="label"
        :disabled="props.estimatedUnderlyings === 0 || props.isLoading"
        :loading="props.isExchangeLoading"
        @click="emit('exchangeTickets', exchangePercentage)"
      >
        <template #pre-icon>
          <i class="i-ph-upload-simple-bold"></i>
        </template>
      </BaseButton>
    </div>
    <div class="flex flex-col items-center gap-4">
      <InputNumber
        :model-value="props.availableUnderlyings"
        class="self-stretch"
        :title="t('available_assets_to_redeem')"
        subtitle="&nbsp;"
        :footer-description="t('assets_will_be_withdrawn')"
        :readonly="true"
        :min="0"
        :show-max="false"
        :show-balance="false"
        :unit="props.underlyingSymbol"
      />
      <BaseButton
        palette="glass"
        :label="t('instant_withdraw')"
        :disabled="props.availableUnderlyings === 0 || props.isLoading"
        :loading="props.isRedeemLoading"
        @click="emit('redeem')"
      >
        <template #pre-icon>
          <i class="i-ph-lightning-fill"></i>
        </template>
      </BaseButton>
    </div>
  </div>
</template>
