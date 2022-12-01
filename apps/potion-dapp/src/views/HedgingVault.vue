<template>
  <div class="grid gap-6">
    <HedgingVaultHeader
      :address="vaultId"
      :admin-address="vault.admin"
      :operator-address="vault.operator"
      :underlying-asset="useTokenList(vault.underlying.address)"
      :strike-percent="vault.strikePercentage"
      :round-length="vault.cycleDurationSecs"
      :premium-percentage="vault.maxPremiumPercentage"
      :slippage-percentage="vault.premiumSlippage"
      :uniswap-slippage-percentage="vault.swapSlippage"
      :next-cycle-timestamp="vault.nextCycleTimestamp"
      :current-timestamp="blockTimestamp.toString()"
      @back="handleNavigateBack"
    />
    <div class="grid grid-cols-6 gap-6">
      <EstimationCard
        class="col-span-2"
        :deposit-tickets="depositTickets"
        :investment-vault-contract-shares="parseFloat(vault.totalShares)"
        :potions-quantity="potionsQuantity"
        :strike-price="strikePrice"
        :total-underlyings-at-round-end="vault.lastTotalUnderlyingsAtRoundEnd"
        :underlying-balance-action-contract="potionBuyActionBalance"
        :underlying-price="parseFloat(polledPrice ?? '0')"
        :underlying-symbol="underlyingSymbol"
        :usdc-balance-action-contract="potionBuyActionUSDC"
      ></EstimationCard>
      <BaseCard class="p-4 col-span-4">
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
          :underlying-symbol="underlyingSymbol"
          @exchange-tickets="handleExchange"
          @redeem="handleRedeemUnderlyings"
        ></WithdrawalTab>
      </BaseCard>
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

import { BaseCard } from "potion-ui";

import DepositTab from "@/components/HedgingVault/DepositTab.vue";
import EstimationCard from "@/components/HedgingVault/EstimationCard.vue";
import HedgingVaultHeader from "@/components/HedgingVault/HedgingVaultHeader.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import TabMenu from "@/components/HedgingVault/TabMenu.vue";
import WithdrawalTab from "@/components/HedgingVault/WithdrawalTab.vue";

import { useDepositTickets } from "@/composables/useDepositTickets";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useHedgingVault } from "@/composables/useHedgingVault";
import { useInputOutputVaultExchange } from "@/composables/useInputOutputVaultExchange";
import { useNotifications } from "@/composables/useNotifications";
import { useOracleContract } from "@/composables/useOracleContract";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { useWithdrawalTickets } from "@/composables/useWithdrawalTickets";
import { useTokenList } from "@/composables/useTokenList";

import {
  getRoundsExchangerFromVault,
  getRoundsInputFromVault,
  getRoundsOutputFromVault,
  getPotionBuyActionFromVault,
} from "@/helpers/hedgingVaultContracts";

import { useUserDataStore } from "@/stores/useUserDataStore";
import { useVaultStore } from "@/stores/useVaultStore";
import { usePotionBuyActionStore } from "@/stores/usePotionBuyActionStore";

import { AVAILABLE_TABS } from "@/types";
import { useVaultPotion } from "@/composables/useVaultPotion";

const selectedTab = ref<AVAILABLE_TABS>(AVAILABLE_TABS.DEPOSIT);

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const { vaultId } = useRouteVaultIdentifier(route.params);

const roundsExchangerAddress = getRoundsExchangerFromVault(vaultId.value);
const roundsInputAddress = getRoundsInputFromVault(vaultId.value);
const roundsOutputAddress = getRoundsOutputFromVault(vaultId.value);
const potionBuyActionAddress = getPotionBuyActionFromVault(vaultId.value);

const { polledPrice, stopPolling, startPolling } = useOracleContract();

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
const nextCycleTimestamp = computed(() =>
  parseInt(vault.value.nextCycleTimestamp)
);

watch(underlyingAddress, () => {
  stopPolling();
  if (underlyingAddress.value) {
    startPolling(underlyingAddress.value);
  }
});

// Purchased potion vault info
const { potionsQuantity, strikePrice } = useVaultPotion(
  potionBuyActionAddress,
  nextCycleTimestamp
);

// potionBuyAction balances
const potionBuyActionStore = usePotionBuyActionStore(
  potionBuyActionAddress,
  underlyingAddress
);
const potionBuyActionState = potionBuyActionStore();

const {
  underlyingBalance: potionBuyActionBalance,
  collateralBalance: potionBuyActionUSDC,
} = storeToRefs(potionBuyActionState);

// InputsRoundsVault
const roundsInputStore = useVaultStore(
  roundsInputAddress,
  "RoundsInputVault",
  underlyingAddress
);
const roundsInputState = roundsInputStore();

const { approveLoading, approveReceipt, approveTx, userAllowance } =
  storeToRefs(roundsInputState);

// Deposit tickets
const {
  depositTickets,
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

const handleNavigateBack = () => {
  router.push({ name: "discover-hedging-vaults" });
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
  createTransactionNotification(
    transaction,
    t("approving_token", { token: underlyingSymbol.value })
  );
});

watch(approveReceipt, (receipt) => {
  createReceiptNotification(
    receipt,
    t("token_approved", { token: underlyingSymbol.value })
  );
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
