<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { BaseCard, InputNumber } from "potion-ui";

interface Props {
  tokenImage: string;
  tokenSymbol: string;
  price: string | undefined;
  strike: number;
  maxStrike: number;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:strike", value: number): void;
  (e: "valid-input", value: boolean): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="xl:col-span-2 flex justify-center">
    <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
      <div class="flex justify-between p-4">
        <div class="flex gap-2 items-center">
          <img class="h-5 w-5" :src="props.tokenImage" :alt="tokenSymbol" />
          <p class="text-sm capitalize">{{ t("current_price") }}</p>
        </div>
        <p>{{ props.price }}</p>
      </div>
      <InputNumber
        :model-value="props.strike"
        color="no-bg"
        :title="t('your_strike_price')"
        :min="1"
        :max="props.maxStrike"
        :step="0.1"
        unit="USDC"
        :footer-description="t('max_strike_price')"
        @valid-input="(value: boolean) => emits('valid-input', value)"
        @update:model-value="(value: number) => emits('update:strike', value)"
      />
    </BaseCard>
  </div>
</template>
