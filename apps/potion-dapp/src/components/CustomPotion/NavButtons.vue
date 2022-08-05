<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseButton } from "potion-ui";
import { CustomPotionStep } from "dapp-types";
import BuyPotionButton from "@/components/CustomPotion/BuyPotionButton.vue";

interface Props {
  currentStep: CustomPotionStep;
  isTokenSelected: boolean;
  isStrikeValid: boolean;
  isDurationValid: boolean;
  isPotionQuantityValid: boolean;
  slippage: number;
  balance: number;
  allowance: number;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), { loading: false });
const emits = defineEmits<{
  (e: "update:currentStep", value: CustomPotionStep): void;
  (e: "buyPotions"): void;
}>();

const { t } = useI18n();

const nextStepEnabled = computed(() => {
  switch (props.currentStep) {
    case CustomPotionStep.ASSET:
      return props.isTokenSelected;
    case CustomPotionStep.STRIKE:
      return props.isStrikeValid;
    case CustomPotionStep.EXPIRATION:
      return props.isDurationValid;
    default:
      return false;
  }
});

const areStepsValid = computed(
  () =>
    props.isTokenSelected &&
    props.isStrikeValid &&
    props.isDurationValid &&
    props.isPotionQuantityValid
);
</script>

<template>
  <div class="flex w-full justify-end items-center gap-3 p-4">
    <BaseButton
      v-if="props.currentStep !== CustomPotionStep.ASSET"
      class="uppercase"
      test-back
      palette="flat"
      :inline="true"
      :label="t('back')"
      :disabled="false"
      @click="emits('update:currentStep', props.currentStep - 1)"
    >
      <template #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <BaseButton
      v-if="props.currentStep !== CustomPotionStep.REVIEW"
      test-next
      palette="secondary"
      :inline="true"
      :label="t('next')"
      :disabled="!nextStepEnabled"
      @click="emits('update:currentStep', props.currentStep + 1)"
    >
      <template #post-icon>
        <i class="i-ph-caret-right"></i>
      </template>
    </BaseButton>
    <BuyPotionButton
      v-if="props.currentStep === CustomPotionStep.REVIEW"
      :valid="areStepsValid"
      :slippage="props.slippage"
      :allowance="props.allowance"
      :balance="props.balance"
      :loading="props.loading"
      @buy-potions="emits('buyPotions')"
    ></BuyPotionButton>
  </div>
</template>
