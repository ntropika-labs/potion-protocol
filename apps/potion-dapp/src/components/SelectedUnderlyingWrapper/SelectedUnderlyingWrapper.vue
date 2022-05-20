<script lang="ts">
import { defineComponent, ref, type ComputedRef, type Ref } from "vue";
import {
  BaseCard,
  TokenIcon,
  BaseButton,
  InputSlider,
  Tooltip,
} from "potion-ui";
import type { Token } from "@/types";
import { useI18n } from "vue-i18n";

defineComponent({
  name: "SelectedUnderlyingWrapper",
});
</script>
<script lang="ts" setup>
export interface Props {
  underlying: Token;
  priceInfo: {
    loading: Ref<boolean>;
    price: Ref<number>;
    formattedPrice: ComputedRef<string>;
    success: Ref<boolean>;
  };
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: "removeSelection", assetSymbol: string): void;
}>();

const { t } = useI18n();
const maxStrike = ref(100);
const maxDuration = ref(60);
</script>
<template>
  <BaseCard color="glass" test-wrapper-card>
    <div class="flex justify-between py-5 px-6">
      <div class="flex items-center gap-2">
        <TokenIcon
          test-wrapper-icon
          size="lg"
          :name="props.underlying.address"
          :image="props.underlying.image"
        />
        <p class="text-2xl text-dwhite-400 font-semibold">
          {{ props.underlying.symbol }}
        </p>
      </div>

      <BaseButton
        test-wrapper-button
        label=""
        size="icon"
        palette="flat"
        @click="() => emit('removeSelection', props.underlying.address)"
      >
        <template #post-icon>
          <i class="i-ph-x"></i>
        </template>
      </BaseButton>
    </div>

    <div class="grid md:grid-cols-2 gap-14 px-6 mt-8 mb-4">
      <div class="flex flex-col p-1">
        <div class="flex flex-row items-center gap-2">
          <p class="text-sm">{{ t("max_strike") }}</p>
          <Tooltip :message="t('hint_strike')"></Tooltip>
        </div>
        <p class="text-sm">{{ t("description_strike") }}</p>
        <div>
          success: {{ priceInfo.success }} loading:
          {{ priceInfo.loading }} price: {{ priceInfo.price }} formattedPrice:
          {{ priceInfo.formattedPrice }}
        </div>
        <div
          class="flex flex-row items-center gap-2 text-sm text-secondary-600 mb-12"
        >
          <i class="i-ph-warning-circle"></i>
          <p>{{ priceInfo.formattedPrice.value }}</p>
        </div>
        <InputSlider
          :model-value="maxStrike"
          symbol="%"
          class="mt-auto"
          @update:model-value="(value: number) => maxStrike = value"
        ></InputSlider>
      </div>
      <div class="flex flex-col p-1">
        <div class="flex flex-row items-center gap-2">
          <p class="text-sm">{{ t("max_duration") }}</p>
          <Tooltip :message="t('hint_strike')"></Tooltip>
        </div>
        <p class="text-sm mb-12">{{ t("description_strike") }}</p>
        <InputSlider
          :model-value="maxDuration"
          :min="1"
          :max="365"
          symbol=" Dd"
          class="mt-auto"
          @update:model-value="(value: number) => maxDuration = value"
        ></InputSlider>
      </div>
    </div>
  </BaseCard>
</template>
