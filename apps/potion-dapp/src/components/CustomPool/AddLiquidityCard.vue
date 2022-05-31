<template>
  <BaseCard class="leading-none" :full-height="false">
    <div class="py-3 px-4">
      <p class="text-sm uppercase">{{ props.title }}</p>
      <p class="text-sm mt-6">{{ t("deposit_collateral_description") }}</p>
      <InputNumber
        class="mt-3"
        :title="t('deposit_collateral_title')"
        :min="1"
        :max="props.userBalance"
        :step="0.1"
        unit="USDC"
        :model-value="props.modelValue"
        :footer-description="t('deposit_collateral_footer_description')"
        @update:model-value="emits('update:modelValue', $event)"
        @valid-input="emits('validInput', $event)"
      />
      <p v-if="props.hint" class="text-base text-secondary-600 my-5">
        {{ props.hint }}
      </p>
    </div>
    <CardFooter class="flex justify-center">
      <slot name="card-footer"></slot>
    </CardFooter>
  </BaseCard>
</template>
<script lang="ts" setup>
import { BaseCard, CardFooter, InputNumber } from "potion-ui";
import { useI18n } from "vue-i18n";
const emits = defineEmits(["update:modelValue", "validInput"]);
const { t } = useI18n();
interface Props {
  title: string;
  hint?: string;
  userBalance: number;
  modelValue: number;
}
const props = withDefaults(defineProps<Props>(), {
  hint: undefined,
  userBalance: 0,
  modelValue: 100,
});
</script>
