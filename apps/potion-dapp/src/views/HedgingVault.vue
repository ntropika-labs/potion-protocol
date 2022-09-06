<template>
  <div>
    <BaseCard class="p-4 items-center md:items-start">
      <div class="mb-3">
        <p class="capitalize">{{ t("protective_put_vault") }}</p>
        <a
          class="text-xs flex items-center font-normal text-white/50 hover:text-white transition"
          :href="etherscanUrl + '/address/' + validId"
        >
          <i class="i-ph-arrow-square-in mr-1 text-xs"></i>
          <span class="truncate max-w-[15ch]">{{ validId }}</span>
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
          <a :href="etherscanUrl + '/address/' + admin">
            <BaseTag :is-loading="strategyLoading">
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ admin }}</span>
            </BaseTag>
          </a>
        </div>
        <div>
          <p class="capitalize">{{ t("operator") }}</p>
          <a :href="etherscanUrl + '/address/' + operator">
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
                :disabled="
                  depositButtonState.disabled ||
                  strategyLoading ||
                  isTransactionPending
                "
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
                :disabled="
                  redeemButtonState.disabled ||
                  strategyLoading ||
                  isTransactionPending
                "
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
import {
  BaseCard,
  BaseTag,
  LabelValue,
  AssetTag,
  InputNumber,
  BaseButton,
  TimeTag,
} from "potion-ui";
import { useI18n } from "vue-i18n";
import { etherscanUrl } from "@/helpers";
// import { useEthersProvider } from "@/composables/useEthersProvider";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import {
  LifecycleState,
  useInvestmentVaultContract,
} from "@/composables/useInvestmentVaultContract";
import { useErc20Contract } from "@/composables/useErc20Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { useOnboard } from "@onboard-composable";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useNotifications } from "@/composables/useNotifications";

import NotificationDisplay from "@/components/NotificationDisplay.vue";

const { t } = useI18n();
const { connectedWallet } = useOnboard();
const { PotionBuyAction } = contractsAddresses;

const depositAmount = ref(1);
const redeemAmount = ref(1);
const route = useRoute();
const { id } = route.params;
const validId = computed(() => {
  if (Array.isArray(id)) {
    return id[0].toLowerCase();
  }
  return id.toLowerCase();
});

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
  useInvestmentVaultContract(vaultAddress, true, true);

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

const {
  // vaultName,
  // vaultDecimals,
  vaultSymbol,
  assetName,
  assetSymbol,
  assetAddress,
  // assetDecimals,
  // assetImage,
  assetToShare,
  totalAssets,
  userBalance,
  deposit,
  depositTx,
  redeem,
  redeemTx,
  depositReceipt,
  redeemReceipt,
  depositLoading,
  redeemLoading,
} = useErc4626Contract(validId, true, true);

const {
  userBalance: assetUserBalance,
  userAllowance,
  fetchUserAllowance,
  approveSpending,
  getTokenBalance,
  approveTx,
  approveReceipt,
  approveLoading,
  fetchErc20Info,
} = useErc20Contract(assetAddress, false);

watch(assetAddress, async () => {
  if (connectedWallet.value) {
    await Promise.all([
      fetchErc20Info(),
      getTokenBalance(true),
      fetchUserAllowance(validId.value),
    ]);
  }
});
onMounted(() => {
  getBlock("latest");
});

const isTransactionPending = computed(
  () => redeemLoading.value || depositLoading.value || approveLoading.value
);

const depositButtonState = computed(() => {
  if (connectedWallet.value && assetUserBalance.value >= depositAmount.value) {
    if (vaultStatus.value !== LifecycleState.Unlocked) {
      return {
        label: "locked",
        disabled: true,
      };
    }

    if (userAllowance.value >= depositAmount.value) {
      return {
        label: t("deposit"),
        disabled: false,
      };
    } else {
      return {
        label: t("approve"),
        disabled: false,
      };
    }
  }
  if (connectedWallet.value && assetUserBalance.value < depositAmount.value) {
    return {
      label: t("not_enough", { msg: assetSymbol.value }),
      disabled: true,
    };
  }
  if (!connectedWallet.value) {
    return {
      label: t("connect_wallet"),
      disabled: true,
    };
  }
  return {
    label: t("deposit"),
    disabled: true,
  };
});

const handleDeposit = async () => {
  if (depositButtonState.value.label === t("deposit")) {
    await deposit(depositAmount.value, true);
  }
  if (depositButtonState.value.label === t("approve")) {
    await approveSpending(validId.value, true);
    await fetchUserAllowance(validId.value);
  }
};

const shareToAssetRatio = computed(() => {
  return 1 / assetToShare.value;
});

const balanceInAsset = computed(() => {
  return userBalance.value * shareToAssetRatio.value;
});

const redeemButtonState = computed(() => {
  if (connectedWallet.value && userBalance.value >= redeemAmount.value) {
    if (vaultStatus.value !== LifecycleState.Unlocked) {
      return {
        label: "locked",
        disabled: true,
      };
    }

    return {
      label: t("redeem"),
      disabled: false,
    };
  }
  if (connectedWallet.value && userBalance.value < redeemAmount.value) {
    return {
      label: t("not_enough", { msg: vaultSymbol.value }),
      disabled: true,
    };
  }
  if (!connectedWallet.value) {
    return {
      label: t("connect_wallet"),
      disabled: true,
    };
  }
  return {
    label: t("redeem"),
    disabled: true,
  };
});

const handleRedeem = async () => {
  if (redeemButtonState.value.disabled === false) {
    await redeem(redeemAmount.value, true);
  }
};

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
  createTransactionNotification(transaction, "Despositing");
});

watch(depositReceipt, (receipt) => {
  createReceiptNotification(receipt, "Deposited");
});

watch(redeemTx, (transaction) => {
  createTransactionNotification(transaction, "Redeeming");
});

watch(redeemReceipt, (receipt) => {
  createReceiptNotification(receipt, "Redeemed");
});
</script>
