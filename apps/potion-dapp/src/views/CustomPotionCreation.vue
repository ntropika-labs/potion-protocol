<script lang="ts" setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { BaseCard } from "potion-ui";

import TokenSelectionPanel from "@/components/CustomPotion/TokenSelectionPanel.vue";
import StrikeSelectionPanel from "@/components/CustomPotion/StrikeSelectionPanel.vue";
import DurationSelectionPanel from "@/components/CustomPotion/DurationSelectionPanel.vue";
import ReviewPanel from "@/components/CustomPotion/ReviewPanel.vue";
import NavButtons from "@/components/CustomPotion/NavButtons.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import SimilarPotions from "@/components/CustomPotion/SimilarPotions.vue";
import SidebarMenu from "@/components/CustomPotion/SidebarMenu.vue";

import { useBuyPotions } from "@/composables/useBuyPotions";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useDurationSelection } from "@/composables/useDurationSelection";
import { useEthereumPrice } from "@/composables/useEthereumPrice";
import { useGas } from "@/composables/useGas";
import { useNotifications } from "@/composables/useNotifications";
import { usePotionQuantity } from "@/composables/usePotionQuantity";
import { usePotionTokens } from "@/composables/usePotionTokens";
import { useRouterCriterias } from "@/composables/useRouterCriterias";
import { useSlippage } from "@/composables/useSlippage";
import { useStrikeSelection } from "@/composables/useStrikeSelection";
import { useUserData } from "@/composables/useUserData";

import { CustomPotionStep } from "dapp-types";

const { t } = useI18n();

const { userAllowance, userCollateralBalance } = useUserData();
const { ethPrice } = useEthereumPrice();

// gas units to deploy an otoken: 840000
const { gasPrice, formattedGasSaving } = useGas(ethPrice, 840000);

// Token selection
const {
  availableTokens,
  tokenSelected,
  tokenSelectedAddress,
  isTokenSelected,
  selectToken,
  price,
  formattedPrice,
} = usePotionTokens();

// Strike Selection
const {
  strikeSelected,
  strikeSelectedRelative,
  maxSelectableStrikeAbsolute,
  isStrikeValid,
} = useStrikeSelection(tokenSelectedAddress, price);

// Duration Selection
const {
  durationSelected,
  durationSelectedDate,
  isDurationValid,
  maxSelectableDuration,
  maxSelectableDurationInDays,
} = useDurationSelection(tokenSelectedAddress, strikeSelectedRelative);

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
  routerRunning,
  routerResult,
  maxNumberOfPotions,
  formattedMarketSize,
  formattedPremium,
  numberOfTransactions,
} = useDepthRouter(criterias, orderSize, strikeSelected, gasPrice, ethPrice);

const {
  slippage,
  handleSlippageSelection,
  formattedPremiumSlippage,
  premiumSlippage,
} = useSlippage(routerResult);

// Steps
const currentStep = ref<CustomPotionStep>(CustomPotionStep.ASSET);
const handleChangeStep = (step: CustomPotionStep) => {
  if (step === CustomPotionStep.STRIKE && strikeSelected.value === 0) {
    strikeSelected.value = maxSelectableStrikeAbsolute.value * 0.9;
  }
  if (step === CustomPotionStep.EXPIRATION && durationSelected.value === 0) {
    durationSelected.value = 1;
  }
  currentStep.value = step;
};

// Buy logic
const {
  handleBuyOrCreatePotions,
  buyPotionTx,
  buyPotionReceipt,
  approveTx,
  approveReceipt,
  isLoading,
} = useBuyPotions(
  tokenSelectedAddress,
  strikeSelected,
  durationSelected,
  routerResult
);

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
  createReceiptNotification(receipt, t("potion_bought"));
});
</script>

<template>
  <BaseCard>
    <div class="grid grid-cols-1 xl:grid-cols-3 p-5 gap-5">
      <div class="w-full flex justify-between items-center xl:col-span-3">
        <p class="capitalize">{{ t("your_put_recipe") }}</p>
        <router-link :to="{ name: 'discover-potions' }">
          <i class="i-ph-x"></i>
        </router-link>
      </div>
      <SidebarMenu
        :token-image="tokenSelected?.image ?? ''"
        :token-symbol="tokenSelected?.symbol ?? ''"
        :strike-selected="strikeSelected"
        :duration-selected="durationSelectedDate"
        :is-token-selected="isTokenSelected"
        :is-strike-valid="isStrikeValid"
        :is-duration-valid="isDurationValid"
        :current-step="currentStep"
        @update:current-step="handleChangeStep"
      >
      </SidebarMenu>
      <TokenSelectionPanel
        v-if="currentStep === CustomPotionStep.ASSET"
        :tokens="availableTokens"
        @token-selected="selectToken"
      ></TokenSelectionPanel>
      <StrikeSelectionPanel
        v-if="currentStep === CustomPotionStep.STRIKE"
        :token-image="tokenSelected?.image ?? ''"
        :token-symbol="tokenSelected?.symbol ?? ''"
        :price="formattedPrice"
        :strike="strikeSelected"
        :max-strike="maxSelectableStrikeAbsolute"
        @valid-input="isStrikeValid = $event"
        @update:strike="(value) => (strikeSelected = value)"
      ></StrikeSelectionPanel>
      <DurationSelectionPanel
        v-if="currentStep === CustomPotionStep.EXPIRATION"
        :duration="durationSelected"
        :max-duration="maxSelectableDuration"
        :max-duration-in-days="maxSelectableDurationInDays"
        :selected-date="durationSelectedDate"
        @update:duration="(value) => (durationSelected = value)"
        @valid-input="isDurationValid = $event"
      >
      </DurationSelectionPanel>
      <ReviewPanel
        v-if="currentStep === CustomPotionStep.REVIEW"
        class="xl:col-span-2"
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
    </div>
    <NavButtons
      :current-step="currentStep"
      :is-token-selected="isTokenSelected"
      :is-strike-valid="isStrikeValid"
      :is-duration-valid="isDurationValid"
      :is-potion-quantity-valid="isPotionQuantityValid"
      :slippage="premiumSlippage"
      :balance="userCollateralBalance"
      :allowance="userAllowance"
      :loading="routerRunning || isLoading"
      @update:current-step="handleChangeStep"
      @buy-potions="handleBuyOrCreatePotions"
    >
    </NavButtons>
  </BaseCard>
  <SimilarPotions
    :token="tokenSelected"
    :token-address="tokenSelectedAddress"
    :strike="strikeSelected"
    :duration="durationSelected"
    :price="price"
    :current-step="currentStep"
    :gas-saving="formattedGasSaving"
  >
  </SimilarPotions>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
