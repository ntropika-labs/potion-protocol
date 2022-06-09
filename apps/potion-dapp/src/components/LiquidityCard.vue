<script lang="ts" setup>
import { BaseCard, CardFooter, InputNumber, BaseButton } from "potion-ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

type AvailableTabs = "deposit" | "withdraw";

interface Props {
  showWithdraw?: boolean;
  defaultTab?: AvailableTabs;
  userBalance: number;
  currentDeposit: number;
  currentWithdraw: number;
  totalLiquidity: number;
  utilizedLiquidity: number;
  currencySymbol?: string;
}
const props = withDefaults(defineProps<Props>(), {
  showWithdraw: false,
  defaultTab: "withdraw",
  userBalance: 0,
  currentDeposit: 100,
  currentWithdraw: 100,
  totalLiquidity: 0,
  utilizedLiquidity: 0,
  currencySymbol: "$",
});

const { t } = useI18n();
const emits = defineEmits<{
  (e: "update:currentDeposit", newDeposit: number): void;
  (e: "validInput:deposit", value: boolean): void;
  (e: "update:currentWithdraw", newDeposit: number): void;
  (e: "validInput:withdraw", value: boolean): void;
}>();

const currentTab = ref(props.defaultTab);
const setCurrentTab = (newTab: AvailableTabs) => (currentTab.value = newTab);
const unutilizedLiquidity = computed(() => {
  return props.totalLiquidity - props.utilizedLiquidity;
});
</script>
<template>
  <BaseCard>
    <div test-liquidity-card-header class="grid grid-cols-2">
      <BaseButton
        palette="flat"
        :label="t('your_liquidity')"
        class="uppercase text-xs !rounded-none border-b-2"
        :class="[
          currentTab === 'withdraw' ? 'border-primary-500' : 'border-white/10',
        ]"
        @click="setCurrentTab('withdraw')"
      ></BaseButton>
      <BaseButton
        palette="flat"
        :label="t('add_more_liquidity')"
        class="uppercase text-xs !rounded-none border-b-2"
        :class="[
          currentTab === 'deposit' ? 'border-primary-500' : 'border-white/10',
        ]"
        @click="setCurrentTab('deposit')"
      ></BaseButton>
    </div>
    <template v-if="currentTab === 'withdraw'">
      <BaseCard test-liquidity-card-withdraw color="no-bg" class="m-6">
        <div class="flex flex-col gap-6 p-4">
          <div class="flex justify-between">
            <span>{{ t("total_liquidity") }}</span
            ><span test-liquidity-card-total-liquidity class="text-xl font-bold"
              >${{ props.totalLiquidity }}</span
            >
          </div>
          <div class="flex justify-between text-secondary-500">
            <span>{{ t("utilized_capital") }}</span
            ><span
              test-liquidity-card-utilized-liquidity
              class="text-xl font-bold"
              >${{ props.utilizedLiquidity }}</span
            >
          </div>
        </div>

        <InputNumber
          class="mt-3"
          :title="t('withdraw_capital')"
          :min="1"
          :max="unutilizedLiquidity"
          :step="0.1"
          unit="USDC"
          :model-value="props.currentWithdraw"
          @update:model-value="emits('update:currentWithdraw', $event)"
          @valid-input="emits('validInput:withdraw', $event)"
        >
          <template #footerDescription>
            <p>
              {{ t("unutilized_capital") }}:
              <span class="text-secondary-500"
                >{{ unutilizedLiquidity }} USDC</span
              >
            </p>
          </template>
        </InputNumber>
      </BaseCard>

      <CardFooter
        test-liquidity-card-footer-withdraw
        class="flex justify-center gap-3"
      >
        <slot name="deposit-footer"></slot>
      </CardFooter>
    </template>
    <template v-if="currentTab === 'deposit'">
      <BaseCard test-liquidity-card-deposit color="no-bg" class="m-6">
        <div class="flex flex-col gap-6 p-4">
          <div class="flex justify-between">
            <span>{{ t("total_liquidity") }}</span
            ><span test-liquidity-card-total-liquidity class="text-xl font-bold"
              >${{ props.totalLiquidity }}</span
            >
          </div>
          <div class="flex justify-between text-secondary-500">
            <span>{{ t("utilized_capital") }}</span
            ><span
              test-liquidity-card-utilized-liquidity
              class="text-xl font-bold"
              >${{ props.utilizedLiquidity }}</span
            >
          </div>
        </div>

        <InputNumber
          class="mt-3"
          :title="t('add_liquidity')"
          :min="1"
          :max="props.userBalance"
          :step="0.1"
          unit="USDC"
          :model-value="props.currentDeposit"
          @update:model-value="emits('update:currentDeposit', $event)"
          @valid-input="emits('validInput:deposit', $event)"
        />
      </BaseCard>

      <CardFooter
        test-liquidity-card-footer-deposit
        class="flex justify-center gap-3"
      >
        <slot name="withdraw-footer"></slot>
      </CardFooter>
    </template>
  </BaseCard>
</template>
