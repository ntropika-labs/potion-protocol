<script lang="ts" setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { InputNumber, BaseButton } from "potion-ui";

interface Props {
  currentDepositAmount: number;
  isDeleteLoading: boolean;
  isLoading: boolean;
  isUpdateLoading: boolean;
  underlyingSymbol: string;
  userAllowance: number;
  userCollateralBalance: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "updateDeposit", value: number): void;
  (e: "deleteDeposit"): void;
}>();

const { t } = useI18n();

const depositAmount = ref(0.1);
const invalidAmount = computed(
  () =>
    depositAmount.value <= 0 ||
    depositAmount.value > props.userCollateralBalance
);

const label = computed(() => {
  if (depositAmount.value > props.userAllowance) {
    return t("approve");
  }
  if (props.currentDepositAmount) {
    return t("update_request");
  }
  return t("deposit_request");
});
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="flex flex-col items-center gap-4">
      <InputNumber
        v-model="depositAmount"
        class="self-stretch"
        :max="props.userCollateralBalance"
        :title="t('choose_deposit_amount')"
        :subtitle="t('deposits_processed_next_round')"
        :min="0.1"
        :step="0.01"
        :unit="props.underlyingSymbol"
      />
      <BaseButton
        palette="secondary"
        :label="label"
        :disabled="invalidAmount || props.isLoading"
        :loading="props.isUpdateLoading"
        @click="emit('updateDeposit', depositAmount)"
      >
        <template #pre-icon>
          <i class="i-ph-download-simple-bold"></i>
        </template>
      </BaseButton>
    </div>
    <div class="flex flex-col items-center gap-4">
      <InputNumber
        :model-value="props.currentDepositAmount"
        class="self-stretch"
        :title="t('current_round_deposit')"
        subtitle="&nbsp;"
        :footer-description="t('cancel_request_to_retrieve_funds')"
        :readonly="true"
        :min="0"
        :show-max="false"
        :show-balance="false"
        :unit="props.underlyingSymbol"
      />
      <BaseButton
        palette="glass"
        :label="t('cancel_request')"
        :disabled="props.isLoading || props.currentDepositAmount === 0"
        :loading="props.isDeleteLoading"
        @click="emit('deleteDeposit')"
      >
        <template #pre-icon>
          <i class="i-ph-x-bold"></i>
        </template>
      </BaseButton>
    </div>
  </div>
</template>
