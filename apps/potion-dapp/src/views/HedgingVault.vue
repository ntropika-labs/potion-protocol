<template>
  <div>
    <BaseCard class="p-4 items-center md:items-start">
      <div class="mb-3">
        <p class="capitalize">{{ t("protective_put_vault") }}</p>
        <a
          class="text-xs flex items-center font-normal text-white/50 hover:text-white transition"
          :href="getEtherscanUrl(vaultId)"
        >
          <i class="i-ph-arrow-square-in mr-1 text-xs"></i>
          <span class="truncate max-w-[15ch]">{{ vaultId }}</span>
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
        <!-- <div>
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
        </div> -->
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
          :value="vault.totalAssets"
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
            name: vault.asset.name,
            symbol: vault.asset.symbol,
            address: vault.asset.address,
          }"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('hedging_level')"
          :value="vault.hedgingRate"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('strike')"
          :value="vault.strikePercentage"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('cycle_duration')"
          :value="vault.cycleDurationSecs"
          symbol="days"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium')"
          :value="vault.maxPremiumPercentage"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium_slippage')"
          :value="vault.premiumSlippage"
          symbol="%"
          :loading="strategyLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_swap_slippage')"
          :value="vault.swapSlippage"
          symbol="%"
          :loading="strategyLoading"
        />
      </BaseCard>
      <div class="col-span-4 self-start">
        <BaseCard class="p-4">
          <div class="flex items-center gap-4">
            <TimeTag
              :horizontal="true"
              :title="t('time_left_until_next_cycle')"
              :time-from="blockTimestamp.toString()"
              :time-to="vault.nextCycleTimestamp"
              :loading="strategyLoading"
            />
          </div>
          <div class="flex gap-6 w-full mt-5">
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber
                v-model="depositAmount"
                class="self-stretch"
                :max="assetUserBalance"
                :min="0.1"
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
                :min="0.1"
                :step="0.01"
                :unit="vault.shareToken.symbol"
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
import { storeToRefs } from "pinia";

import {
  BaseCard,
  // BaseTag,
  LabelValue,
  AssetTag,
  InputNumber,
  BaseButton,
  TimeTag,
  getEtherscanUrl,
} from "potion-ui";

import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { useOnboard } from "@onboard-composable";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";
import { useErc20Contract } from "@/composables/useErc20Contract";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useNotifications } from "@/composables/useNotifications";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { useVaultDeposit } from "@/composables/useVaultDeposit";
import { useVaultRedeem } from "@/composables/useVaultRedeem";

import { useHedgingVault } from "@/composables/useHedgingVault";

import { useUserDataStore } from "@/stores/useUserDataStore";

const { t } = useI18n();
const { connectedWallet } = useOnboard();

const route = useRoute();
const { vaultId } = useRouteVaultIdentifier(route.params);

const { blockTimestamp, getBlock } = useEthersProvider();

const { walletAddress } = storeToRefs(useUserDataStore());

const { vault, loading: strategyLoading } = useHedgingVault(
  vaultId,
  walletAddress
);

const assetAddress = computed(() => vault.value.asset.address);
const assetSymbol = computed(() => vault.value.asset.symbol);

const { vaultStatus } = useInvestmentVaultContract(vaultId, true, true);
const { assetToShare, userBalance } = useErc4626Contract(vaultId, true, true);

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
  vaultId,
  vaultStatus
);

const {
  redeemLoading,
  redeemReceipt,
  redeemTx,
  handleRedeem,
  amount: redeemAmount,
  buttonState: redeemButtonState,
} = useVaultRedeem(userBalance, vaultId, vaultStatus);

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

watch(assetAddress, async () => {
  if (connectedWallet.value) {
    await Promise.all([
      fetchErc20Info(),
      getTokenBalance(true),
      fetchUserAllowance(vaultId.value),
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
