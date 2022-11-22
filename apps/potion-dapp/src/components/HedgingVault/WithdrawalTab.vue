<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { InputSlider, BaseButton } from "potion-ui";

interface Props {
  availableUnderlyings: number;
  estimatedUnderlyings: number;
  canExchange: boolean;
  isLoading: boolean;
  isExchangeLoading: boolean;
  isRedeemLoading: boolean;
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

const exchangeLabel = computed(() =>
  props.canExchange ? t("exchange") : t("approve")
);
</script>

<template>
  <div class="w-1/2 flex flex-col items-center gap-4">
    <h3>
      {{
        t("estimated_exchange_assets", {
          estimatedAssets: estimatedUnderlyings,
        })
      }}
    </h3>
    <InputSlider
      class="my-4"
      symbol="%"
      :step="0.1"
      :model-value="exchangePercentage"
      @update:model-value="updateExchangePercentage"
    />
    <BaseButton
      palette="secondary"
      :label="exchangeLabel"
      :disabled="isLoading"
      :loading="isExchangeLoading"
      @click="emit('exchangeTickets', exchangePercentage)"
    >
      <template #pre-icon>
        <i class="i-ph-upload-simple-bold"></i>
      </template>
    </BaseButton>
    <h4>
      {{
        t("available_assets_to_redeem", {
          availableAssets: availableUnderlyings,
        })
      }}
    </h4>
    <BaseButton
      palette="secondary"
      :label="t('redeem')"
      :disabled="isLoading"
      :loading="isRedeemLoading"
      @click="emit('redeem')"
    >
      <template #pre-icon>
        <i class="i-ph-lightning-fill-bold"></i>
      </template>
    </BaseButton>
  </div>
</template>
