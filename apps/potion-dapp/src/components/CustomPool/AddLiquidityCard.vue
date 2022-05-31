<template>
  <BaseCard class="leading-none" :full-height="false">
    <div class="py-3 px-4">
      <p class="text-sm uppercase">{{ t("my_pool") }} #{{ props.poolId }}</p>

      <div
        v-if="size"
        class="flex justify-between border-b-1 border-white/10 pb-3 mt-5"
      >
        <p>{{ t("total-liquidity") }}</p>
        <p class="font-semibold">{{ props.size }}</p>
      </div>

      <p class="text-sm mt-6">{{ t("deposit_collateral_description") }}</p>
      <InputNumber
        class="mt-3"
        :title="props.title"
        :min="1"
        :max="props.userBalance"
        :step="0.1"
        unit="USDC"
        :model-value="props.modelValue"
        :footer-description="t('deposit_collateral_footer_description')"
        @update:model-value="emits('update:modelValue', $event)"
        @valid-input="emits('validInput', $event)"
      />
    </div>
    <CardFooter class="flex justify-center gap-3">
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
  poolId: number;
  userBalance: number;
  modelValue: number;
  size?: string;
  title: string;
}
const props = withDefaults(defineProps<Props>(), {
  poolId: 0,
  userBalance: 0,
  modelValue: 100,
  size: "",
  title: "",
});
</script>
