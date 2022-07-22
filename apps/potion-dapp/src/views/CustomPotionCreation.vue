<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import {
  AssetActiveIcon,
  AssetDefaultIcon,
  BaseButton,
  BaseCard,
  BaseTag,
  DurationActiveIcon,
  DurationDefaultIcon,
  InputNumber,
  PotionCard,
  ReviewActiveIcon,
  ReviewDefaultIcon,
  SidebarLink,
  StrikeActiveIcon,
  StrikeDefaultIcon,
  TokenSelection,
  currencyFormatter,
} from "potion-ui";

import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { useOnboard } from "@onboard-composable";
import { useBuyPotions } from "@/composables/useBuyPotions";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useDurationSelection } from "@/composables/useDurationSelection";
import { useEthereumPrice } from "@/composables/useEthereumPrice";
import { useGas } from "@/composables/useGas";
import { useNotifications } from "@/composables/useNotifications";
import { usePotionQuantity } from "@/composables/usePotionQuantity";
import { usePotionTokens } from "@/composables/usePotionTokens";
import { useRouterCriterias } from "@/composables/useRouterCriterias";
import { useSimilarPotions } from "@/composables/useSimilarPotions";
import { useSlippage } from "@/composables/useSlippage";
import { useStrikeSelection } from "@/composables/useStrikeSelection";
import { useUserData } from "@/composables/useUserData";

enum CurrentIndex {
  ASSET,
  STRIKE,
  EXPIRATION,
  REVIEW,
}

const { t } = useI18n();
const currentIndex = ref<CurrentIndex>(CurrentIndex.ASSET);
const { connectedWallet } = useOnboard();

const { userAllowance, userCollateralBalance } = useUserData();
const userCollateralBalanceFormatted = computed(() =>
  currencyFormatter(userCollateralBalance.value, "USDC")
);
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

// Steps validity
const areStepsValid = computed(
  () =>
    isTokenSelected.value &&
    isStrikeValid.value &&
    isDurationValid.value &&
    isPotionQuantityValid.value
);

// Buy logic
const {
  handleBuyPotions,
  buyPotionTx,
  buyPotionReceipt,
  approveTx,
  approveReceipt,
} = useBuyPotions(
  tokenSelectedAddress,
  strikeSelected,
  durationSelected,
  routerResult
);

const buyPotionButtonState = computed(() => {
  if (connectedWallet.value) {
    if (!areStepsValid.value) {
      return {
        label: t("invalid_potion"),
        disabled: true,
      };
    }
    if (userCollateralBalance.value < premiumSlippage.value) {
      return {
        label: t("not_enough_usdc"),
        disabled: true,
      };
    }

    const label =
      userAllowance.value >= premiumSlippage.value
        ? t("buy_potion")
        : t("approve");
    return {
      label,
      disabled: false,
    };
  }

  return {
    label: t("connect_wallet"),
    disabled: true,
  };
});

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

//Similar Potions
const {
  computedSimilarByAsset,
  computedSimilarByStrike,
  computedSimilarByDuration,
} = useSimilarPotions(
  tokenSelectedAddress,
  strikeSelected,
  durationSelected,
  price
);

const similarPotionShown = computed(() => {
  if (currentIndex.value === CurrentIndex.ASSET) {
    return computedSimilarByAsset.value;
  } else if (currentIndex.value === CurrentIndex.STRIKE) {
    return computedSimilarByStrike.value;
  } else if (currentIndex.value === CurrentIndex.EXPIRATION) {
    return computedSimilarByDuration.value;
  } else if (currentIndex.value === CurrentIndex.REVIEW) {
    return computedSimilarByDuration.value;
  }
  return [];
});

const sidebarItems = computed(() => {
  return [
    {
      title: t("asset"),
      iconSrcset:
        currentIndex.value === CurrentIndex.ASSET
          ? AssetActiveIcon
          : AssetDefaultIcon,
      selected: currentIndex.value === CurrentIndex.ASSET,
      disabled: false,
      onClick: () => {
        currentIndex.value = CurrentIndex.ASSET;
      },
    },
    {
      title: t("strike_price"),
      iconSrcset:
        currentIndex.value === CurrentIndex.STRIKE
          ? StrikeActiveIcon
          : StrikeDefaultIcon,
      selected: currentIndex.value === CurrentIndex.STRIKE,
      disabled: !isTokenSelected.value,
      onClick: () => {
        if (strikeSelected.value === 0) {
          strikeSelected.value = maxSelectableStrikeAbsolute.value * 0.9;
        }
        currentIndex.value = CurrentIndex.STRIKE;
      },
    },
    {
      title: t("expiration"),
      iconSrcset:
        currentIndex.value === CurrentIndex.EXPIRATION
          ? DurationActiveIcon
          : DurationDefaultIcon,
      selected: currentIndex.value === CurrentIndex.EXPIRATION,
      disabled: !isTokenSelected.value || !isStrikeValid.value,
      onClick: () => {
        if (durationSelected.value === 0) {
          durationSelected.value = 1;
        }
        currentIndex.value = CurrentIndex.EXPIRATION;
      },
    },
    {
      title: t("review_and_create"),
      iconSrcset:
        currentIndex.value === CurrentIndex.REVIEW
          ? ReviewActiveIcon
          : ReviewDefaultIcon,
      selected: currentIndex.value === CurrentIndex.REVIEW,
      disabled:
        !isTokenSelected.value ||
        !isStrikeValid.value ||
        !isDurationValid.value,
      onClick: () => {
        currentIndex.value = CurrentIndex.REVIEW;
      },
    },
  ];
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
      <ul
        class="grid grid-cols-1 lg:( grid-cols-4 ) gap-3 w-full xl:( grid-cols-1 ) self-start items-start justify-center"
      >
        <SidebarLink
          v-for="(item, index) in sidebarItems"
          :key="`sidebar-item-${index}`"
          :title="item.title"
          :selected="item.selected"
          :disabled="item.disabled"
          :icon-srcset="item.iconSrcset"
          class="lg:w-1/4 lg:w-full"
          @click="item.onClick"
        >
          <div
            v-if="index === CurrentIndex.ASSET && tokenSelected"
            class="flex gap-2 items-center"
          >
            <img
              class="h-5 w-5"
              :src="tokenSelected?.image"
              :alt="tokenSelected?.symbol"
            />
            <p class="text-xs">{{ tokenSelected?.symbol }}</p>
          </div>
          <div v-if="index === CurrentIndex.STRIKE && strikeSelected">
            <p class="text-xs">USDC {{ strikeSelected }}</p>
          </div>
          <div v-if="index === CurrentIndex.EXPIRATION && durationSelected">
            <p class="text-xs">{{ durationSelectedDate }}</p>
          </div>
        </SidebarLink>
      </ul>
      <div
        v-if="currentIndex === CurrentIndex.ASSET"
        class="w-full xl:col-span-2"
      >
        <TokenSelection
          v-if="availableTokens.length > 0"
          :tokens="availableTokens"
          @token-selected="selectToken"
        />
        <div v-else class="text-center">
          <p class="text-white/40 text-3xl uppercase">
            {{ t("no_underlying_asset_found") }}
          </p>
        </div>
      </div>
      <div
        v-if="currentIndex === CurrentIndex.STRIKE"
        class="xl:col-span-2 flex justify-center"
      >
        <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
          <div class="flex justify-between p-4">
            <div class="flex gap-2 items-center">
              <img
                class="h-5 w-5"
                :src="tokenSelected?.image"
                :alt="tokenSelected?.symbol"
              />
              <p class="text-sm capitalize">{{ t("current_price") }}</p>
            </div>
            <p>{{ formattedPrice }}</p>
          </div>
          <InputNumber
            v-model.number="strikeSelected"
            color="no-bg"
            :title="t('your_strike_price')"
            :min="1"
            :max="maxSelectableStrikeAbsolute"
            :step="0.1"
            unit="USDC"
            :footer-description="t('max_strike_price')"
            @valid-input="isStrikeValid = $event"
          />
        </BaseCard>
      </div>
      <div
        v-if="currentIndex === CurrentIndex.EXPIRATION"
        class="xl:col-span-2 flex justify-center"
      >
        <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
          <div class="flex justify-between p-4 items-start">
            <div class="flex gap-2 items-center">
              <p class="text-sm capitalize">{{ t("max_duration") }}</p>
            </div>
            <div class="text-sm">
              <p>{{ maxSelectableDuration }} {{ t("days") }}</p>
              <p>{{ maxSelectableDurationInDays }}</p>
            </div>
          </div>
          <InputNumber
            v-model.number="durationSelected"
            color="no-bg"
            :title="t('your_potion_expires_in')"
            :min="1"
            :max="maxSelectableDuration"
            :step="1"
            unit="days"
            :max-decimals="0"
            :footer-description="t('expiration')"
            :footer-value="durationSelectedDate"
            @valid-input="isDurationValid = $event"
          />
        </BaseCard>
      </div>
      <div
        v-if="currentIndex === CurrentIndex.REVIEW"
        class="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-3 justify-center"
      >
        <BaseCard color="no-bg" class="w-full justify-between">
          <div class="flex justify-between p-4 items-start text-sm">
            <div class="flex gap-2 items-center">
              <p class="capitalize">{{ t("market_size") }}</p>
            </div>
            <div>
              <p>{{ formattedMarketSize }}</p>
            </div>
          </div>
          <InputNumber
            v-model.number="potionQuantity"
            color="no-bg"
            :title="t('number_of_potions')"
            :min="0.00000001"
            :max="maxNumberOfPotions"
            :step="1"
            unit="POTION"
            :max-decimals="8"
            :footer-description="t('max_number_of_potions')"
            :use-unit="false"
            @valid-input="isPotionQuantityValid = $event"
          />
        </BaseCard>
        <BaseCard color="no-bg" class="w-full gap-8 pt-4">
          <div class="flex justify-between px-4 items-start text-sm">
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("price_per_potion") }}</p>
              <p>{{ formattedPremium }}</p>
            </div>
          </div>
          <div class="flex justify-between px-4 items-start text-sm">
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("number_of_potions") }}</p>
              <p>{{ potionQuantity }}</p>
            </div>
          </div>
          <div class="flex justify-between px-4 items-start text-sm">
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("number_of_transactions") }}</p>
              <p>{{ numberOfTransactions }}</p>
            </div>
          </div>
          <div
            class="flex justify-between px-4 items-start text-sm text-secondary-500"
          >
            <div class="flex gap-2 items-center justify-between w-full">
              <p class="capitalize">{{ t("total") }}</p>
              <div class="text-right">
                <p>{{ formattedPremiumSlippage }}</p>
                <p class="text-xs capitalize text-dwhite-300/30">
                  {{ t("balance") }}: {{ userCollateralBalanceFormatted }}
                </p>
              </div>
            </div>
          </div>
          <BaseCard color="no-bg" class="p-4">
            <p class="text-lg font-bold capitalize">
              {{ t("slippage_tolerance") }}
            </p>
            <div class="flex gap-3 mt-3">
              <button
                v-for="(s, index) in slippage"
                :key="`slippage-${index}`"
                class="outline-none focus:outline-none"
                @click="handleSlippageSelection(index)"
              >
                <BaseTag :color="s.selected === true ? 'primary' : 'base'">{{
                  s.label
                }}</BaseTag>
              </button>
            </div>
          </BaseCard>
        </BaseCard>
      </div>
    </div>
    <div class="flex w-full justify-end items-center gap-3 p-4">
      <BaseButton
        v-if="currentIndex !== CurrentIndex.ASSET"
        class="uppercase"
        test-back
        palette="flat"
        :inline="true"
        :label="t('back')"
        :disabled="false"
        @click="currentIndex--"
      >
        <template #pre-icon>
          <i class="i-ph-caret-left"></i>
        </template>
      </BaseButton>
      <BaseButton
        v-if="currentIndex !== sidebarItems.length - 1"
        test-next
        palette="secondary"
        :inline="true"
        :label="t('next')"
        :disabled="sidebarItems[currentIndex + 1].disabled"
        @click="sidebarItems[currentIndex + 1].onClick()"
      >
        <template #post-icon>
          <i class="i-ph-caret-right"></i>
        </template>
      </BaseButton>
      <BaseButton
        v-if="currentIndex === sidebarItems.length - 1"
        palette="secondary"
        :label="buyPotionButtonState.label"
        :disabled="buyPotionButtonState.disabled"
        @click="handleBuyPotions()"
      />
    </div>
  </BaseCard>
  <div class="mt-10">
    <h2 class="uppercase text-secondary-500 text-sm">
      {{ t("similar_potions") }}
    </h2>
    <p class="text-sm">
      {{ t("similar_potion_message", { dollars: formattedGasSaving }) }}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-5">
      <PotionCard
        v-for="(potion, index) in similarPotionShown"
        :key="`${index}-similar-potion`"
        :token="
          tokenSelected ?? {
            name: '',
            symbol: '',
            address: '',
            decimals: 18,
            image: '',
          }
        "
        :otoken-address="potion.tokenAddress"
        :strike-price="potion.strikePrice"
        :expiration="potion.expiry"
      >
        <router-link
          :to="`/potions/${potion.tokenAddress}`"
          class="rounded-full bg-dwhite-300 py-3 px-4 leading-none text-deepBlack-900 uppercase transition hover:( ring-1 ring-secondary-500 )"
        >
          {{ t("show") }}</router-link
        >
      </PotionCard>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
