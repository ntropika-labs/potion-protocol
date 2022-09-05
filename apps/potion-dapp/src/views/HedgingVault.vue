<template>
  <div>
    <BaseCard class="p-4 items-center md:items-start">
      <div class="mb-3">
        <p class="capitalize">{{ t("protective_put_vault") }}</p>
        <a
          class="text-xs flex items-center font-normal text-white/50 hover:text-white transition"
          :href="getEtherscanUrl(vaultAddress)"
        >
          <i class="i-ph-arrow-square-in mr-1 text-xs"></i>
          <span class="truncate max-w-[15ch]">{{ vaultAddress }}</span>
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
        <div>
          <p class="capitalize">{{ t("status") }}</p>
          <BaseTag :is-loading="strategyLoading">
            <div
              class="h-2 w-2 rounded-full mr-1"
              :class="statusInfo.class"
            ></div>
            <span>{{ statusInfo.label }}</span>
          </BaseTag>
        </div>
        <div>
          <p class="capitalize">{{ t("admin") }}</p>
          <a :href="getEtherscanUrl(admin)">
            <BaseTag :is-loading="strategyLoading">
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ admin }}</span>
            </BaseTag>
          </a>
        </div>
        <div>
          <p class="capitalize">{{ t("operator") }}</p>
          <a :href="getEtherscanUrl(operator)">
            <BaseTag :is-loading="strategyLoading">
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ operator }}</span>
            </BaseTag>
          </a>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3 w-full">
        <LabelValue
          size="lg"
          :title="t('share_price')"
          :value="shareToAssetRatio.toString()"
          :symbol="`${assetSymbol}/Share`"
          :loading="strategyLoading"
        />
        <LabelValue
          size="lg"
          :title="t('vault_size')"
          :value="totalAssets?.toString()"
          :symbol="assetSymbol"
          :loading="strategyLoading"
        />
        <LabelValue
          size="lg"
          :title="t('your_shares')"
          :value="userBalance.toString()"
          :symbol="`= ${balanceInAsset} ${assetSymbol}`"
          :loading="strategyLoading"
        />
      </div>
    </BaseCard>
    <div class="grid grid-cols-5 gap-4 mt-4">
      <BaseCard class="p-4 grid gap-4">
        <AssetTag
          :title="t('asset')"
          :token="{
            name: assetName,
            symbol: assetSymbol,
            address: assetAddress,
          }"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('hedging_level')"
          :value="principalPercentages[0].toString()"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('strike')"
          :value="strikePercentage.toString()"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('cycle_duration')"
          :value="cycleDurationDays.toString()"
          symbol="days"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium')"
          :value="maxPremiumPercentage.toString()"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium_slippage')"
          :value="premiumSlippage.toString()"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_swap_slippage')"
          :value="swapSlippage.toString()"
          symbol="%"
          :loading="strategyLoading"
        />
      </BaseCard>
      <div class="col-span-4 self-start">
        <BaseCard class="p-4">
          <div class="flex items-center gap-4">
            <!-- <p class="text-accent-500 text-sm font-normal capitalize">
              {{ t("time_left_until_next_cycle") }}
            </p> -->
            <TimeTag
              :horizontal="true"
              :title="t('time_left_until_next_cycle')"
              :time-from="blockTimestamp.toString()"
              :time-to="nextCycleTimestamp.toString()"
              :loading="strategyLoading"
            />
          </div>
          <div class="flex gap-6 w-full mt-5">
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber
                v-model="depositAmount"
                class="self-stretch"
                :max="assetUserBalance"
                :min="1"
                :step="0.01"
                :unit="assetSymbol"
              />
              <BaseButton
                palette="secondary"
                :label="depositButtonState.label"
                :disabled="depositButtonState.disabled || isLoading"
                :loading="depositLoading || approveLoading"
                @click="handleDeposit()"
              />
            </div>
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber
                v-model="redeemAmount"
                class="self-stretch"
                :max="userBalance"
                :min="1"
                :step="0.01"
                :unit="vaultSymbol"
              />
              <BaseButton
                palette="secondary"
                :label="redeemButtonState.label"
                :disabled="redeemButtonState.disabled || isLoading"
                :loading="redeemLoading"
                @click="handleRedeem()"
              />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index: string) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import {
  BaseCard,
  BaseTag,
  LabelValue,
  AssetTag,
  InputNumber,
  BaseButton,
  TimeTag,
  getEtherscanUrl,
} from "potion-ui";
import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";

import { useOnboard } from "@onboard-composable";
import {
  LifecycleState,
  useInvestmentVaultContract,
} from "@/composables/useInvestmentVaultContract";
import { useErc20Contract } from "@/composables/useErc20Contract";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useNotifications } from "@/composables/useNotifications";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { useRouteVaultId } from "@/composables/useRouteVaultId";
import { useVaultDeposit } from "@/composables/useVaultDeposit";
import { useVaultRedeem } from "@/composables/useVaultRedeem";

const { t } = useI18n();
const { connectedWallet } = useOnboard();
const { PotionBuyAction } = contractsAddresses;

const route = useRoute();
const { vaultAddress } = useRouteVaultId(route.params);

const { blockTimestamp, getBlock } = useEthersProvider();

const {
  strikePercentage,
  maxPremiumPercentage,
  cycleDurationDays,
  nextCycleTimestamp,
  premiumSlippage,
  swapSlippage,
  strategyLoading,
} = usePotionBuyActionContract(PotionBuyAction.address, true);

const { operator, admin, principalPercentages, vaultStatus } =
  useInvestmentVaultContract(vaultAddress, true);

const {
  assetAddress,
  assetName,
  assetSymbol,
  assetToShare,
  totalAssets,
  userBalance,
  vaultSymbol,
} = useErc4626Contract(vaultAddress, true, true);

const {
  userBalance: assetUserBalance,
  fetchUserAllowance,
  getTokenBalance,
  fetchErc20Info,
} = useErc20Contract(assetAddress, false);

const {
  approveTx,
  approveReceipt,
  approveLoading,
  depositLoading,
  depositReceipt,
  depositTx,
  handleDeposit,
  amount: depositAmount,
  buttonState: depositButtonState,
} = useVaultDeposit(
  assetUserBalance,
  assetAddress,
  assetSymbol,
  vaultAddress,
  vaultStatus
);

const {
  redeemLoading,
  redeemReceipt,
  redeemTx,
  handleRedeem,
  amount: redeemAmount,
  buttonState: redeemButtonState,
} = useVaultRedeem(userBalance, vaultAddress, vaultStatus);

const shareToAssetRatio = computed(() => 1 / assetToShare.value);
const balanceInAsset = computed(
  () => userBalance.value * shareToAssetRatio.value
);

const isLoading = computed(
  () =>
    strategyLoading.value ||
    redeemLoading.value ||
    depositLoading.value ||
    approveLoading.value
);

const statusInfo = computed(() => {
  switch (vaultStatus.value) {
    case LifecycleState.Unlocked:
      return {
        label: t("unlocked"),
        class: "bg-accent-500",
      };
    case LifecycleState.Committed:
      return {
        label: t("committed"),
        class: "bg-orange-500",
      };
    case LifecycleState.Locked:
    default:
      return {
        label: t("locked"),
        class: "bg-error",
      };
  }
});

watch(assetAddress, async () => {
  if (connectedWallet.value) {
    await Promise.all([
      fetchErc20Info(),
      getTokenBalance(true),
      fetchUserAllowance(vaultAddress.value),
    ]);
  }
});

onMounted(() => {
  getBlock("latest");
});

// Toast notifications
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(approveTx, (transaction) => {
  createTransactionNotification(transaction, t("approving_usdc"));
});

watch(approveReceipt, (receipt) => {
  createReceiptNotification(receipt, t("usdc_approved"));
});

watch(depositTx, (transaction) => {
  createTransactionNotification(transaction, t("depositing"));
});

watch(depositReceipt, (receipt) => {
  createReceiptNotification(receipt, t("deposited"));
});

watch(redeemTx, (transaction) => {
  createTransactionNotification(transaction, t("redeeming"));
});

watch(redeemReceipt, (receipt) => {
  createReceiptNotification(receipt, t("redeemed"));
});
</script>
