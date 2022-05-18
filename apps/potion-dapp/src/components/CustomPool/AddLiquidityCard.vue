<template>
  <div>
    <BaseCard class="leading-none">
      <div class="py-3 px-4">
        <p class="text-sm uppercase">{{ t("my_pool") }} #{{ props.poolId }}</p>
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
        />
      </div>
      <CardFooter class="flex justify-center">
        <slot name="card-footer"></slot>
      </CardFooter>
    </BaseCard>
  </div>
</template>
<script lang="ts" setup>
import { BaseCard, CardFooter, InputNumber } from "potion-ui";
import { useI18n } from "vue-i18n";
const emits = defineEmits(["update:modelValue"]);
const { t } = useI18n();
interface Props {
  poolId: number;
  userBalance: number;
  modelValue: number;
}
const props = withDefaults(defineProps<Props>(), {
  poolId: 0,
  userBalance: 0,
  modelValue: 100,
});
</script>
