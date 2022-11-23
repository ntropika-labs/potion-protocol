<template>
  <div>
    <HedgingVaultHeader
      :address="vaultId"
      :admin-address="vault.admin"
      :operator-address="vault.operator"
      :underlying-asset="vault.asset"
      :strike-percent="vault.strikePercentage"
      :round-length="vault.cycleDurationSecs"
      :premium-percentage="vault.maxPremiumPercentage"
      :slippage-percentage="vault.premiumSlippage"
      :uniswap-slippage-percentage="vault.swapSlippage"
      :next-cycle-timestamp="vault.nextCycleTimestamp"
      :current-timestamp="blockTimestamp.toString()"
      @back="handleNavigateBack"
    />
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
            <BaseTag :is-loading="vaultLoading">
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ admin }}</span>
            </BaseTag>
          </a>
        </div>
        <div>
          <p class="capitalize">{{ t("operator") }}</p>
          <a :href="getEtherscanUrl(operator)">
            <BaseTag :is-loading="vaultLoading">
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
          :loading="vaultLoading"
        />
        <LabelValue
          size="lg"
          :title="t('vault_size')"
          :value="vault.totalAssets"
          :symbol="assetSymbol"
          :loading="vaultLoading"
        />
        <LabelValue
          size="lg"
          :title="t('your_shares')"
          :value="userBalance.toString()"
          :symbol="`= ${balanceInAsset} ${assetSymbol}`"
          :loading="vaultLoading"
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
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('hedging_level')"
          :value="vault.hedgingRate"
          symbol="%"
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('strike')"
          :value="vault.strikePercentage"
          symbol="%"
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('cycle_duration')"
          :value="vault.cycleDurationSecs"
          symbol="days"
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium')"
          :value="vault.maxPremiumPercentage"
          symbol="%"
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium_slippage')"
          :value="vault.premiumSlippage"
          symbol="%"
          :loading="vaultLoading"
        />
        <LabelValue
          size="sm"
          :title="t('max_swap_slippage')"
          :value="vault.swapSlippage"
          symbol="%"
          :loading="vaultLoading"
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
              :loading="vaultLoading"
            />
          </div>
          <div class="flex gap-6 w-full mt-5">
            <div class="w-1/2 flex flex-col items-center gap-4">
              <h3 v-if="currentDepositAmount > 0">
                {{
                  t("current_deposit_request_info", {
                    currentDepositAmount,
                    assetSymbol,
                  })
                }}
              </h3>
              <InputNumber
                v-model="depositAmount"
                class="self-stretch"
                :max="userCollateralBalance"
                :min="0.1"
                :step="0.01"
                :unit="assetSymbol"
              />
              <div class="flex gap-4">
                <BaseButton
                  palette="secondary"
                  :label="depositLabel"
                  :disabled="invalidDepositAmount || isLoading"
                  :loading="approveLoading || updateDepositLoading"
                  @click="handleUpdateDeposit"
                />
                <BaseButton
                  v-if="canDeleteDepositRequest"
                  palette="secondary-o"
                  :label="t('delete')"
                  :disabled="isLoading"
                  :loading="deleteDepositLoading"
                  @click="handleDeleteDeposit"
                />
              </div>
            </div>
            <div
              v-if="estimatedAssets > 0"
              class="w-1/2 flex flex-col items-center gap-4"
            >
              <h3>{{ t("estimated_exchange_assets", { estimatedAssets }) }}</h3>
              <InputSlider
                class="my-4"
                symbol="%"
                :step="0.1"
                :model-value="exchangePercentage"
                @update:model-value="updateExchangePercentage"
              />
              <BaseButton
                palette="secondary"
                :label="exchangeLabel"
                :disabled="isLoading || canDeleteWithdrawalRequest"
                :loading="approveExchangeLoading || exchangeTicketsLoading"
                @click="handleExchange"
              />
            </div>
            <div
              v-if="availableAssets > 0"
              class="w-1/2 flex flex-col items-center gap-4"
            >
              <h4>
                {{ t("available_assets_to_redeem", { availableAssets }) }}
              </h4>
              <BaseButton
                palette="secondary"
                :label="t('redeem')"
                :disabled="isLoading"
                :loading="redeemAssetsLoading"
                @click="handleRedeemAssets"
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
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import {
  BaseCard,
  // BaseTag,
  LabelValue,
  AssetTag,
  InputNumber,
  BaseButton,
  TimeTag,
  InputSlider,
  getEtherscanUrl,
} from "potion-ui";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import HedgingVaultHeader from "@/components/HedgingVault/HedgingVaultHeader.vue";

import { useDepositRequests } from "@/composables/useDepositRequests";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useHedgingVault } from "@/composables/useHedgingVault";
import { useInputOutputVaultExchange } from "@/composables/useInputOutputVaultExchange";
import { useNotifications } from "@/composables/useNotifications";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { useWithdrawalRequests } from "@/composables/useWithdrawalRequests";

import {
  getRoundsExchangerFromVault,
  getRoundsInputFromVault,
  getRoundsOutputFromVault,
} from "@/helpers/hedgingVaultContracts";

import { useUserDataStore } from "@/stores/useUserDataStore";
import { useVaultStore } from "@/stores/useVaultStore";

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const { vaultId } = useRouteVaultIdentifier(route.params);
const roundsExchangerAddress = getRoundsExchangerFromVault(vaultId.value);
const roundsInputAddress = getRoundsInputFromVault(vaultId.value);
const roundsOutputAddress = getRoundsOutputFromVault(vaultId.value);

// current block info
const { blockTimestamp, getBlock } = useEthersProvider();

// user info
const { walletAddress, userCollateralBalance } = storeToRefs(
  useUserDataStore()
);

// vault info
const {
  vault,
  loading: vaultLoading,
  loadVault,
} = useHedgingVault(vaultId, walletAddress);
const currentRound = computed(() => vault.value.currentRound);
const assetSymbol = computed(() => vault.value.asset.symbol);
const assetAddress = computed(() => vault.value.asset.address);
const assetDecimals = computed(() => vault.value.asset.decimals);
const vaultRounds = computed(() => vault.value.rounds);
const lastShareToAssetRate = computed(() => vault.value.lastShareToAssetRate);

// InputsRoundsVault
const roundsInputStore = useVaultStore(
  roundsInputAddress,
  "RoundsInputVault",
  assetAddress
);
const roundsInputState = roundsInputStore();

const { approveLoading, approveReceipt, approveTx, userAllowance } =
  storeToRefs(roundsInputState);

// Deposit requests
const {
  canDeleteDepositRequest,
  currentDepositAmount,
  deleteDepositLoading,
  deleteDepositRequest,
  deleteDepositReceipt,
  deleteDepositTransaction,
  updateDepositLoading,
  updateDepositRequest,
  updateDepositReceipt,
  updateDepositTransaction,
} = useDepositRequests(
  roundsInputAddress,
  assetAddress,
  assetDecimals,
  currentRound,
  vaultRounds
);

const depositAmount = ref(0.1);
const invalidDepositAmount = computed(
  () =>
    depositAmount.value <= 0 ||
    depositAmount.value > userCollateralBalance.value
);
const depositLabel = computed(() => {
  if (depositAmount.value > userAllowance.value) {
    return t("approve");
  }
  if (currentDepositAmount.value > 0) {
    return t("update");
  }
  return t("deposit");
});

const handleUpdateDeposit = async () => {
  if (!invalidDepositAmount.value) {
    if (depositAmount.value > userAllowance.value) {
      await roundsInputState.approve(depositAmount.value);
      roundsInputState.fetchUserData();
    } else {
      await updateDepositRequest(depositAmount);
      setTimeout(loadVault, 5000);
    }
  }
};

const handleDeleteDeposit = async () => {
  if (currentDepositAmount.value > 0) {
    await deleteDepositRequest();
    setTimeout(loadVault, 5000);
  }
};

// Input output exchange
const {
  estimatedAssets,
  approveExchange,
  approveExchangeLoading,
  approveExchangeReceipt,
  approveExchangeTransaction,
  canExchange,
  exchangeTickets,
  exchangeTicketsLoading,
  exchangeTicketsReceipt,
  exchangeTicketsTransaction,
} = useInputOutputVaultExchange(
  walletAddress,
  roundsExchangerAddress,
  roundsInputAddress,
  roundsOutputAddress,
  assetAddress,
  vaultRounds,
  currentRound,
  lastShareToAssetRate
);
const exchangePercentage = ref(100);
const updateExchangePercentage = (value: number) => {
  if (value > 0 && value < 101) {
    exchangePercentage.value = value;
  }
};

const exchangeLabel = computed(() =>
  canExchange.value ? t("exchange") : t("approve")
);

const handleExchange = async () => {
  if (canExchange.value) {
    await exchangeTickets(exchangePercentage.value);
    setTimeout(loadVault, 5000);
  } else {
    approveExchange();
  }
};

// withdrawal requests
const {
  canDeleteWithdrawalRequest,
  deleteWithdrawalLoading,
  deleteWithdrawalReceipt,
  // currentWithdrawalAmount,
  // deleteWithdrawalRequest,
  deleteWithdrawalTransaction,
  availableAssets,
  redeemAssets,
  redeemAssetsLoading,
  redeemAssetsReceipt,
  redeemAssetsTransaction,
} = useWithdrawalRequests(
  roundsOutputAddress,
  assetAddress,
  currentRound,
  vaultRounds
);

// const handleDeleteWithdrawal = async () => {
//   if (currentWithdrawalAmount.value > 0) {
//     await deleteWithdrawalRequest();
//     setTimeout(loadVault, 5000);
//   }
// };

const handleRedeemAssets = async () => {
  if (availableAssets.value > 0) {
    await redeemAssets();
    setTimeout(loadVault, 5000);
  }
};

const handleNavigateBack = () => {
  router.push({ name: "discover-hedging-vaults" });
};

/* 
  Legacy code
*/
const { assetToShare, userBalance } = useErc4626Contract(vaultId, true, true);

const shareToAssetRatio = computed(() => 1 / assetToShare.value);
const balanceInAsset = computed(
  () => userBalance.value * shareToAssetRatio.value
);
/* 
  End of legacy code
*/

const isLoading = computed(
  () =>
    approveExchangeLoading.value ||
    approveLoading.value ||
    deleteDepositLoading.value ||
    deleteWithdrawalLoading.value ||
    exchangeTicketsLoading.value ||
    redeemAssetsLoading.value ||
    updateDepositLoading.value ||
    vaultLoading.value
);

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

watch(approveExchangeTransaction, (transaction) => {
  createTransactionNotification(transaction, t("approving_exchange"));
});

watch(approveExchangeReceipt, (receipt) => {
  createReceiptNotification(receipt, t("exchange_approved"));
});

watch(deleteDepositTransaction, (transaction) => {
  createTransactionNotification(transaction, t("deleting_deposit"));
});

watch(deleteDepositReceipt, (receipt) => {
  createReceiptNotification(receipt, t("deleted_deposit"));
});

watch(deleteWithdrawalTransaction, (transaction) => {
  createTransactionNotification(transaction, t("deleting_withdrawal"));
});

watch(deleteWithdrawalReceipt, (receipt) => {
  createReceiptNotification(receipt, t("deleted_withdrawal"));
});

watch(exchangeTicketsTransaction, (transaction) => {
  createTransactionNotification(transaction, t("exchanging_tickets"));
});

watch(exchangeTicketsReceipt, (receipt) => {
  createReceiptNotification(receipt, t("tickets_exchanged"));
});

watch(updateDepositTransaction, (transaction) => {
  createTransactionNotification(transaction, t("depositing"));
});

watch(updateDepositReceipt, (receipt) => {
  createReceiptNotification(receipt, t("deposited"));
});

watch(redeemAssetsTransaction, (transaction) => {
  createTransactionNotification(transaction, t("redeeming"));
});

watch(redeemAssetsReceipt, (receipt) => {
  createReceiptNotification(receipt, t("redeemed"));
});
</script>
