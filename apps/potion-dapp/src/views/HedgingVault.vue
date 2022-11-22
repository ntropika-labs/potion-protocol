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
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3 w-full">
        <LabelValue
          size="lg"
          :title="t('vault_size')"
          :value="vault.totalShares"
          :symbol="underlyingSymbol"
          :loading="vaultLoading"
        />
      </div>
    </BaseCard>
    <div class="grid grid-cols-5 gap-4 mt-4">
      <BaseCard class="p-4 grid gap-4">
        <AssetTag
          :title="t('asset')"
          :token="{
            name: vault.underlying.name,
            symbol: vault.underlying.symbol,
            address: vault.underlying.address,
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
        <BaseCard class="p-4 gap-4">
          <div class="flex items-center gap-4">
            <TimeTag
              :horizontal="true"
              :title="t('time_left_until_next_cycle')"
              :time-from="blockTimestamp.toString()"
              :time-to="vault.nextCycleTimestamp"
              :loading="vaultLoading"
            />
          </div>
          <TabMenu v-model="selectedTab"></TabMenu>
          <DepositTab
            v-if="selectedTab === AVAILABLE_TABS.DEPOSIT"
            :current-deposit-amount="currentDepositAmount"
            :is-delete-loading="deleteDepositLoading"
            :is-loading="isLoading"
            :is-update-loading="approveLoading || updateDepositLoading"
            :underlying-symbol="underlyingSymbol"
            :user-allowance="userAllowance"
            :user-collateral-balance="userCollateralBalance"
            @update-deposit="handleUpdateDeposit"
            @delete-deposit="handleDeleteDeposit"
          ></DepositTab>
          <WithdrawalTab
            v-if="selectedTab === AVAILABLE_TABS.WITHDRAWAL"
            :available-underlyings="availableUnderlyings"
            :can-exchange="canExchange"
            :estimated-underlyings="estimatedUnderlyings"
            :is-loading="isLoading"
            :is-exchange-loading="
              approveExchangeLoading || exchangeTicketsLoading
            "
            :is-redeem-loading="redeemUnderlyingsLoading"
            @exchange-tickets="handleExchange"
            @redeem="handleRedeemUnderlyings"
          ></WithdrawalTab>
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
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import {
  BaseCard,
  LabelValue,
  AssetTag,
  TimeTag,
  getEtherscanUrl,
} from "potion-ui";

import TabMenu from "@/components/HedgingVault/TabMenu.vue";
import DepositTab from "@/components/HedgingVault/DepositTab.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { useDepositTickets } from "@/composables/useDepositTickets";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useHedgingVault } from "@/composables/useHedgingVault";
import { useInputOutputVaultExchange } from "@/composables/useInputOutputVaultExchange";
import { useNotifications } from "@/composables/useNotifications";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { useWithdrawalTickets } from "@/composables/useWithdrawalTickets";

import {
  getRoundsExchangerFromVault,
  getRoundsInputFromVault,
  getRoundsOutputFromVault,
} from "@/helpers/hedgingVaultContracts";

import { useUserDataStore } from "@/stores/useUserDataStore";
import { useVaultStore } from "@/stores/useVaultStore";

import { AVAILABLE_TABS } from "@/types";

const selectedTab = ref<AVAILABLE_TABS>(AVAILABLE_TABS.DEPOSIT);

const { t } = useI18n();

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
const underlyingSymbol = computed(() => vault.value.underlying.symbol);
const underlyingAddress = computed(() => vault.value.underlying.address);
const underlyingDecimals = computed(() => vault.value.underlying.decimals);
const vaultRounds = computed(() => vault.value.rounds);
const lastShareToUnderlyingRate = computed(
  () => vault.value.lastShareToUnderlyingRate
);

// InputsRoundsVault
const roundsInputStore = useVaultStore(
  roundsInputAddress,
  "RoundsInputVault",
  underlyingAddress
);
const roundsInputState = roundsInputStore();

const { approveLoading, approveReceipt, approveTx, userAllowance } =
  storeToRefs(roundsInputState);

// Deposit requests
const {
  currentDepositAmount,
  deleteDepositLoading,
  deleteDepositTicket,
  deleteDepositReceipt,
  deleteDepositTransaction,
  updateDepositLoading,
  updateDepositTicket,
  updateDepositReceipt,
  updateDepositTransaction,
} = useDepositTickets(
  roundsInputAddress,
  underlyingAddress,
  underlyingDecimals,
  currentRound,
  vaultRounds
);

const handleUpdateDeposit = async (depositAmount: number) => {
  if (depositAmount > userAllowance.value) {
    await roundsInputState.approve(depositAmount);
    roundsInputState.fetchUserData();
  } else {
    await updateDepositTicket(depositAmount);
    setTimeout(loadVault, 5000);
  }
};

const handleDeleteDeposit = async () => {
  if (currentDepositAmount.value > 0) {
    await deleteDepositTicket();
    setTimeout(loadVault, 5000);
  }
};

// Input output exchange
const {
  estimatedUnderlyings,
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
  underlyingAddress,
  vaultRounds,
  currentRound,
  lastShareToUnderlyingRate
);

const handleExchange = async (exchangePercentage: number) => {
  if (canExchange.value) {
    await exchangeTickets(exchangePercentage);
    setTimeout(loadVault, 5000);
  } else {
    approveExchange();
  }
};

// withdrawal requests
const {
  deleteWithdrawalLoading,
  deleteWithdrawalReceipt,
  // currentWithdrawalAmount,
  // deleteWithdrawalTicket,
  deleteWithdrawalTransaction,
  availableUnderlyings,
  redeemUnderlyings,
  redeemUnderlyingsLoading,
  redeemUnderlyingsReceipt,
  redeemUnderlyingsTransaction,
} = useWithdrawalTickets(
  roundsOutputAddress,
  underlyingAddress,
  currentRound,
  vaultRounds
);

// const handleDeleteWithdrawal = async () => {
//   if (currentWithdrawalAmount.value > 0) {
//     await deleteWithdrawalTicket();
//     setTimeout(loadVault, 5000);
//   }
// };

const handleRedeemUnderlyings = async () => {
  if (availableUnderlyings.value > 0) {
    await redeemUnderlyings();
    setTimeout(loadVault, 5000);
  }
};

const isLoading = computed(
  () =>
    approveExchangeLoading.value ||
    approveLoading.value ||
    deleteDepositLoading.value ||
    deleteWithdrawalLoading.value ||
    exchangeTicketsLoading.value ||
    redeemUnderlyingsLoading.value ||
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

watch(redeemUnderlyingsTransaction, (transaction) => {
  createTransactionNotification(transaction, t("redeeming"));
});

watch(redeemUnderlyingsReceipt, (receipt) => {
  createReceiptNotification(receipt, t("redeemed"));
});
</script>
