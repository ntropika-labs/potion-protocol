<template>
  <div v-if="fetching">
    {{ t("loading") }}
  </div>
  <template v-else>
    <template v-if="error">
      {{ t("loading_error") }}
    </template>
    <template v-else-if="otoken">
      <div class="flex flex-col gap-4">
        <OtokenRecap
          :address="otoken.id"
          :token="tokenSelected"
          :strike-price="otoken.strikePrice"
          :expiration="otoken.expiry"
          :loading="loading"
          :slippage="premiumSlippage"
          :balance="userCollateralBalance"
          :allowance="userAllowance"
          @buy-potions="handleBuyPotions"
        >
        </OtokenRecap>

        <ReviewPanel
          :balance="userCollateralBalance"
          :premium="formattedPremium"
          :potion-quantity="potionQuantity"
          :max-quantity="maxNumberOfPotions"
          :number-of-transactions="numberOfTransactions"
          :market-size="formattedMarketSize"
          :slippage="slippage"
          :selected-slippage="formattedPremiumSlippage"
          @valid-input="isPotionQuantityValid = $event"
          @update:potion-quantity="potionQuantity = $event"
          @update:slippage="handleSlippageSelection"
        ></ReviewPanel>
        <OrderBook :address="potionAddress"></OrderBook>
      </div>
    </template>
    <NotificationDisplay
      :toasts="notifications"
      @hide-toast="(index) => removeToast(index)"
    >
    </NotificationDisplay>
  </template>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { useNotifications } from "@/composables/useNotifications";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useStrikeSelection } from "@/composables/useStrikeSelection";
import { useDurationSelection } from "@/composables/useDurationSelection";
import { usePotionQuantity } from "@/composables/usePotionQuantity";
import { useEthereumPrice } from "@/composables/useEthereumPrice";
import { useGas } from "@/composables/useGas";
import { useRouterCriterias } from "@/composables/useRouterCriterias";
import { usePotionTokens } from "@/composables/usePotionTokens";
import { useSlippage } from "@/composables/useSlippage";
import { useBuyPotions } from "@/composables/useBuyPotions";
import { useUserData } from "@/composables/useUserData";
import { useRoutePotionId } from "@/composables/useRoutePotionId";
import { usePotion } from "@/composables/usePotion";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import OrderBook from "@/components/OrderBook.vue";
import OtokenRecap from "@/components/OtokenRecap.vue";
import ReviewPanel from "@/components/CustomPotion/ReviewPanel.vue";

const { t } = useI18n();
const route = useRoute();

const { potionAddress } = useRoutePotionId(route.params);

const { userAllowance, userCollateralBalance } = useUserData();
const { ethPrice } = useEthereumPrice();
const { gasPrice } = useGas(ethPrice);

// Otoken data loaded from the subgraph
const {
  otoken,
  otokenStrikePrice,
  otokenExpiry,
  otokenAddress,
  underlyingAddress,
  error,
  fetching,
} = usePotion(potionAddress);

// Token
const {
  availableTokens,
  selectToken,
  tokenSelected,
  tokenSelectedAddress,
  price,
} = usePotionTokens();

// strike
const { strikeSelected, strikeSelectedRelative } = useStrikeSelection(
  tokenSelectedAddress,
  price
);

// duration
const { durationSelected, setDurationFromExpiry } = useDurationSelection(
  tokenSelectedAddress,
  strikeSelectedRelative
);

// Potion Quantity
const { orderSize, potionQuantity, isPotionQuantityValid } =
  usePotionQuantity(strikeSelected);

// Router logic
const { criterias } = useRouterCriterias(
  tokenSelected,
  strikeSelectedRelative,
  durationSelected
);

const {
  routerResult,
  maxNumberOfPotions,
  formattedMarketSize,
  formattedPremium,
  routerRunning,
  numberOfTransactions,
} = useDepthRouter(criterias, orderSize, strikeSelected, gasPrice, ethPrice);

const {
  slippage,
  handleSlippageSelection,
  formattedPremiumSlippage,
  premiumSlippage,
} = useSlippage(routerResult);

// Buy logic
const {
  handleBuyPotions,
  buyPotionTx,
  buyPotionReceipt,
  approveTx,
  approveReceipt,
} = useBuyPotions(
  otokenAddress,
  strikeSelected,
  durationSelected,
  routerResult
);

const loading = computed(() => routerRunning.value || fetching.value);

// Notifications
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

watch(buyPotionTx, (transaction) => {
  createTransactionNotification(transaction, t("buying_potion"));
});
watch(buyPotionReceipt, (receipt) => {
  createReceiptNotification(receipt, t("usdc_approved"));
});

// Select the correct data from the already existing potion after everything has been loaded
watch([availableTokens, otoken], async () => {
  if (availableTokens?.value?.length > 0 && otoken.value) {
    await selectToken(underlyingAddress.value);
    strikeSelected.value = otokenStrikePrice.value;
    setDurationFromExpiry(otokenExpiry.value);
  }
});
</script>
