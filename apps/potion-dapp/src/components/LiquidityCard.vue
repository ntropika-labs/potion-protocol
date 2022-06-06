<script lang="ts" setup>
import { BaseCard, CardFooter, InputNumber, BaseButton } from "potion-ui";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

type AvailableTabs = "deposit" | "withdraw";

interface Props {
  showWithdraw?: boolean;
  defaultTab?: AvailableTabs;
  userBalance: number;
  modelDeposit: number;
  modelWithdraw: number;
  totalLiquidity: number;
  utilizedLiquidity: number;
  currencySymbol?: string;
}
const props = withDefaults(defineProps<Props>(), {
  showWithdraw: false,
  defaultTab: "deposit",
  userBalance: 0,
  modelDeposit: 100,
  modelWithdraw: 100,
  totalLiquidity: 0,
  utilizedLiquidity: 0,
  currencySymbol: "$",
});

const { t } = useI18n();
const emits = defineEmits<{
  (e: "update:modelDeposit", newDeposit: number): void;
  (e: "validInput:deposit", value: boolean): void;
  (e: "update:modelWithdraw", newDeposit: number): void;
  (e: "validInput:withdraw", value: boolean): void;
}>();

const currentTab = ref(props.defaultTab);
const setCurrentTab = (newTab: AvailableTabs) => (currentTab.value = newTab);
</script>
<template>
  <BaseCard>
    <div class="grid grid-cols-2">
      <BaseButton
        palette="flat"
        :label="t('your_liquidity')"
        class="uppercase text-xs !rounded-none border-b-2"
        :class="[
          currentTab === 'deposit' ? 'border-primary-500' : 'border-white/10',
        ]"
        @click="setCurrentTab('deposit')"
      ></BaseButton>
      <BaseButton
        palette="flat"
        :label="t('add_more_liquidity')"
        class="uppercase text-xs !rounded-none border-b-2"
        :class="[
          currentTab === 'withdraw' ? 'border-primary-500' : 'border-white/10',
        ]"
        @click="setCurrentTab('withdraw')"
      ></BaseButton>
    </div>
    <div v-if="currentTab === 'deposit'" :full-height="false">
      <BaseCard color="no-bg" class="m-6">
        <div class="p-4">
          <div class="flex justify-between">
            <span>{{ t("total_liquidity") }}</span
            ><span class="text-xl font-bold">${{ props.totalLiquidity }}</span>
          </div>
          <div class="flex justify-between text-secondary-500">
            <span>{{ t("utilized_capital") }}</span
            ><span class="text-xl font-bold"
              >${{ props.utilizedLiquidity }}</span
            >
          </div>
        </div>

        <InputNumber
          class="mt-3"
          :title="t('withdraw_capital')"
          :min="1"
          :max="props.userBalance"
          :step="0.1"
          unit="USDC"
          :model-value="props.modelDeposit"
          :footer-description="t('unutilized_capital')"
          @update:model-value="emits('update:modelDeposit', $event)"
          @valid-input="emits('validInput:deposit', $event)"
        />
      </BaseCard>

      <CardFooter class="flex justify-center gap-3">
        <slot name="deposit-footer"></slot>
      </CardFooter>
    </div>
    <div v-if="currentTab === 'withdraw'" :full-height="false">
      <BaseCard color="no-bg" class="m-6">
        <div class="p-4">
          <div class="flex justify-between">
            <span>{{ t("total_liquidity") }}</span
            ><span class="text-xl font-bold">${{ props.totalLiquidity }}</span>
          </div>
          <div class="flex justify-between text-secondary-500">
            <span>{{ t("utilized_capital") }}</span
            ><span class="text-xl font-bold"
              >${{ props.utilizedLiquidity }}</span
            >
          </div>
        </div>

        <InputNumber
          class="mt-3"
          :title="t('withdraw_capital')"
          :min="1"
          :max="props.userBalance"
          :step="0.1"
          unit="USDC"
          :model-value="props.modelDeposit"
          :footer-description="t('unutilized_capital')"
          @update:model-value="emits('update:modelDeposit', $event)"
          @valid-input="emits('validInput:deposit', $event)"
        />
      </BaseCard>

      <CardFooter class="flex justify-center gap-3">
        <slot name="withdraw-footer"></slot>
      </CardFooter>
    </div>
  </BaseCard>
</template>
