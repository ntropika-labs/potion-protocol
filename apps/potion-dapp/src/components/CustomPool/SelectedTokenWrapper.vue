<script lang="ts" setup>
import { ref } from "vue";
import {
  BaseCard,
  TokenIcon,
  BaseButton,
  InputSlider,
  Tooltip,
} from "potion-ui";
import type { Token, ApiTokenPrice } from "dapp-types";
import { useI18n } from "vue-i18n";

interface Props {
  underlying: Token;
  priceInfo: ApiTokenPrice;
  initialMaxStrike?: number;
  initialMaxDuration?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialMaxStrike: 100,
  initialMaxDuration: 60,
});

const emit = defineEmits<{
  (e: "removeSelection", address: string): void;
  (
    e: "update:strikeDuration",
    value: { strike: number; duration: number }
  ): void;
}>();

const { t } = useI18n();
const maxStrike = ref(props.initialMaxStrike);
const maxDuration = ref(props.initialMaxDuration);

const updateStrikeDuration = (strike: number, duration: number) => {
  maxStrike.value = strike;
  maxDuration.value = duration;

  emit("update:strikeDuration", {
    strike: maxStrike.value,
    duration: maxDuration.value,
  });
};

updateStrikeDuration(maxStrike.value, maxDuration.value);
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
        <div class="flex flex-row items-center gap-2 mb-6">
          <p class="text-sm">{{ t("max_strike") }}</p>
          <Tooltip :message="t('hint_strike')"></Tooltip>
        </div>
        <p class="text-sm">{{ t("strike_description") }}</p>
        <div
          class="flex flex-row items-center gap-2 text-sm text-secondary-600 mt-2 mb-12"
        >
          <i class="i-ph-warning-circle"></i>
          <template v-if="priceInfo.success && !priceInfo.loading">
            <p>{{ priceInfo.formattedPrice }}</p>
          </template>
          <template v-else-if="priceInfo.loading">
            {{ t("loading") }}
          </template>
          <template v-else-if="!priceInfo.success && !priceInfo.loading">
            {{ t("loading_error") }}
          </template>
        </div>
        <InputSlider
          test-wrapper-strike
          :model-value="maxStrike"
          symbol="%"
          class="mt-auto"
          :max="200"
          @update:model-value="(value: number) => updateStrikeDuration(value, maxDuration)"
        ></InputSlider>
      </div>
      <div class="flex flex-col p-1">
        <div class="flex flex-row items-center gap-2 mb-6">
          <p class="text-sm">{{ t("max_duration") }}</p>
          <Tooltip :message="t('hint_duration')"></Tooltip>
        </div>
        <p class="text-sm mb-12">{{ t("duration_description") }}</p>
        <InputSlider
          test-wrapper-duration
          :model-value="maxDuration"
          :min="1"
          :max="365"
          symbol=" Dd"
          class="mt-auto"
          @update:model-value="(value: number) => updateStrikeDuration(maxStrike, value)"
        ></InputSlider>
      </div>
    </div>
  </BaseCard>
</template>
