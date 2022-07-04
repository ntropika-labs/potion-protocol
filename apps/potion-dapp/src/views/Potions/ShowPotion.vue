<template>
  <template v-if="error || !otokenData || !otokenData.otoken">
    Can't load the pool
  </template>
  <template v-if="otokenData && otokenData.otoken">
    <BaseCard class="p-4">
      <div class="w-full flex gap-2">
        <BaseTag>{{ t("put_option") }}</BaseTag>
        <a
          :href="etherscanUrl"
          class="flex items-center text-xs font-semibold hover:underline"
        >
          <i class="i-ph-arrow-square-in mr-1"></i>
          {{ otokenData.otoken.id.substring(0, 8) }}...
        </a>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-5 gap-6 sm:gap-4 justify-items-center sm:justify-items-stretch"
      >
        <AssetTag
          :title="t('asset')"
          :token="
            underlyingAssetToToken(
              otokenData.otoken.underlyingAsset.address,
              parseInt(otokenData.otoken.underlyingAsset.decimals)
            )
          "
        />
        <LabelValue
          :title="t('strike_price')"
          :value="otokenData.otoken.strikePrice"
          value-type="currency"
          symbol="USDC"
          class="sm:justify-self-end md:justify-self-stretch"
          test-potion-strike-price
        />
        <LabelValue
          :title="t('expiration')"
          :value="otokenData.otoken.expiry"
          value-type="timestamp"
          test-potion-expiration
          @click="handleBuyPotions()"
        />
        <BaseButton
          :label="buyPotionButtonState.label"
          :disabled="buyPotionButtonState.disabled"
          palette="secondary"
          class="sm:justify-self-end md:col-span-1 md:justify-self-stretch"
          test-potion-buy-button
          @click="handleBuyPotions()"
        />
      </div>
    </BaseCard>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <BaseCard class="w-full justify-between">
        <div class="flex justify-between p-4 items-start text-sm">
          <p class="capitalize">{{ t("market_size") }}</p>
          <p test-potion-market-size>{{ formattedMarketSize }}</p>
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
          test-potion-number-of-potions-input
          @valid-input="isPotionQuantityValid = $event"
        />
      </BaseCard>
      <BaseCard class="w-full gap-8 pt-4">
        <div class="flex justify-between px-4 items-start text-sm">
          <div class="flex gap-2 items-center justify-between w-full">
            <p class="capitalize">{{ t("price_per_potion") }}</p>
            <p test-potion-price-per-potion>{{ formattedPremium }}</p>
          </div>
        </div>
        <div class="flex justify-between px-4 items-start text-sm">
          <div class="flex gap-2 items-center justify-between w-full">
            <p class="capitalize">{{ t("number_of_potions") }}</p>
            <p test-potion-number-of-potions>{{ potionQuantity }}</p>
          </div>
        </div>
        <div class="flex justify-between px-4 items-start text-sm">
          <div class="flex gap-2 items-center justify-between w-full">
            <p class="capitalize">{{ t("number_of_transactions") }}</p>
            <p test-potion-number-of-transactions>{{ numberOfTransactions }}</p>
          </div>
        </div>
        <div
          class="flex justify-between px-4 items-start text-sm text-secondary-500"
        >
          <div class="flex gap-2 items-center justify-between w-full">
            <p class="capitalize">{{ t("total") }}</p>
            <div class="text-right">
              <p test-potion-total-price>{{ formattedPremiumSlippage }}</p>
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
              <BaseTag
                :color="s.selected === true ? 'primary' : 'base'"
                test-potion-slippage-button
                >{{ s.label }}</BaseTag
              >
            </button>
          </div>
        </BaseCard>
      </BaseCard>
      <BaseCard class="p-4 md:col-span-2 text-sm">
        <p>Orderbook</p>
        <div
          class="grid grid-cols-2 gap-1 mt-5 border-b-1 border-white/10 mb-3"
        >
          <div class="capitalize">{{ t("timestamp") }}</div>
          <div class="capitalize text-right">{{ t("quantity") }}</div>
        </div>
        <div
          v-for="(order, index) in orders"
          :key="`order-${index}`"
          class="flex w-full justify-between py-1 odd:bg-white/10 rounded px-2 mt-0.5"
        >
          <div>
            {{ dayjs.unix(parseInt(order.timestamp)).format("ll") }}
          </div>
          <div>
            {{ order.numberOfOTokens }}
          </div>
        </div>
      </BaseCard>
    </div>
  </template>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
<script setup lang="ts">
import type { Token } from "dapp-types";
import {
  BaseCard,
  BaseTag,
  BaseButton,
  AssetTag,
  LabelValue,
  InputNumber,
  currencyFormatter,
} from "potion-ui";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import dayjs from "dayjs";
import type { Criteria } from "dapp-types";
import { dateToOffset } from "@/helpers/days";
import { useNotifications } from "@/composables/useNotifications";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useOnboard } from "@onboard-composable";
import { useBlockNative } from "@/composables/useBlockNative";
import { useGetPotionByIdQuery } from "subgraph-queries/generated/urql";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useCoinGecko } from "@/composables/useCoinGecko";
import { useTokenList } from "@/composables/useTokenList";
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { usePotionOrders } from "@/composables/usePotionOrders";
const { t } = useI18n();
const route = useRoute();
const { blockTimestamp, getBlock } = useEthersProvider();
const { connectedWallet } = useOnboard();
const validIdParam = computed(() => {
  if (Array.isArray(route.params.id)) {
    return route.params.id[0];
  } else {
    return route.params.id;
  }
});
const {
  data: otokenData,
  error,
  fetching,
} = useGetPotionByIdQuery({
  variables: {
    id: validIdParam.value,
  },
});
const { getGas, gasPrice } = useBlockNative();
const { coinsPrices, fetchCoinsPrices, fetchTokenPrice, price } = useCoinGecko(
  ["ethereum"],
  otokenData.value?.otoken?.underlyingAsset.address
);

const ethPrice = computed(() => {
  if (coinsPrices.value && coinsPrices.value.ethereum.usd) {
    return coinsPrices.value.ethereum.usd;
  }
  return 0;
});

onMounted(async () => {
  await getBlock("latest");
  await fetchCoinsPrices();
  await getGas();
  await fetchTokenPrice();
});

const etherscanUrl = computed(() => {
  return `https://etherscan.io/address/${validIdParam.value}`;
});

const { orders } = usePotionOrders(validIdParam.value);

const underlyingAssetToToken = (address: string, decimals = 18): Token => {
  const { name, symbol, image } = useTokenList(address);
  return {
    address,
    decimals,
    name,
    symbol,
    image,
  };
};

// Strike
const strikeSelected = computed(() => {
  return parseFloat(otokenData.value?.otoken?.strikePrice ?? "0");
});
const strikeRelative = computed(() => {
  return parseFloat(((strikeSelected.value * 100) / price.value).toFixed(2));
});

// Potion Quantity
const potionQuantity = ref(0.001);
const isPotionQuantityValid = ref(false);

const orderSize = computed(() => {
  return strikeSelected.value * potionQuantity.value;
});

// Router logic
const maxDuration = computed(() => {
  const d = dateToOffset(
    blockTimestamp.value,
    parseInt(otokenData.value?.otoken?.expiry ?? "0")
  );
  if (typeof d !== "string") {
    return d;
  } else {
    return 0;
  }
});
const criteriasParam = ref<Criteria[]>([]);
watch([otokenData, maxDuration, strikeRelative], () => {
  if (
    otokenData.value &&
    otokenData.value.otoken &&
    strikeRelative.value !== 0 &&
    strikeRelative.value !== Infinity
  ) {
    const token = otokenData.value.otoken.underlyingAsset;
    criteriasParam.value = [
      {
        token: {
          name: token.name,
          symbol: token.symbol,
          address: token.address,
        },
        maxStrike: strikeRelative.value,
        maxDuration: maxDuration.value,
      },
    ];
  } else {
    criteriasParam.value = [];
  }
});

const slippage = ref([
  { value: 0.005, label: "0.5%", selected: true },
  { value: 0.02, label: "2%", selected: false },
  { value: 0.05, label: "5%", selected: false },
]);

const handleSlippageSelection = (index: number) => {
  slippage.value.forEach((slippage, i) => {
    if (i === index) {
      slippage.selected = true;
    } else {
      slippage.selected = false;
    }
  });
};
const premiumSlippage = computed(() => {
  const selectedSlippage = slippage.value.find((s) => s.selected);
  if (selectedSlippage && routerResult.value && routerResult.value.premium) {
    return (
      routerResult.value.premium * selectedSlippage.value +
      routerResult.value.premium
    );
  }
  return 0;
});
const formattedPremiumSlippage = computed(() => {
  return currencyFormatter(premiumSlippage.value, "USDC");
});

const {
  routerResult,
  maxNumberOfPotions,
  formattedMarketSize,
  formattedPremium,
  routerRunning,
} = useDepthRouter(
  criteriasParam,
  orderSize,
  strikeSelected,
  gasPrice,
  ethPrice
);

const numberOfTransactions = computed(() => {
  return Math.ceil(
    routerResult.value?.counterparties.length ?? 0 / maxCounterparties
  );
});

// Buy logic
const {
  userCollateralBalance,
  userAllowance,
  approveTx,
  approveReceipt,
  fetchUserCollateralAllowance,
  fetchUserCollateralBalance,
  approveForPotionLiquidityPool,
} = useCollateralTokenContract();

const userCollateralBalanceFormatted = computed(() => {
  return currencyFormatter(userCollateralBalance.value, "USDC");
});
const fetchUserData = async () => {
  if (connectedWallet.value) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};
onMounted(async () => {
  await fetchUserData();
});
const buyPotionButtonState = computed(() => {
  if (routerRunning.value || fetching.value) {
    return {
      label: t("loading"),
      disabled: true,
    };
  }
  if (
    connectedWallet.value &&
    userCollateralBalance.value >= premiumSlippage.value
  ) {
    if (userAllowance.value >= premiumSlippage.value) {
      return {
        label: t("buy_potion"),
        disabled: false,
      };
    } else {
      return {
        label: t("approve"),
        disabled: false,
      };
    }
  }
  if (
    connectedWallet.value &&
    userCollateralBalance.value < premiumSlippage.value
  ) {
    return {
      label: t("not_enough_usdc"),
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
    label: t("buy_potion"),
    disabled: true,
  };
});
const { buyPotions, buyPotionTx, buyPotionReceipt, maxCounterparties } =
  usePotionLiquidityPoolContract();
const handleBuyPotions = async () => {
  console.log("here");
  if (
    routerResult.value &&
    routerResult.value.counterparties &&
    otokenData.value &&
    otokenData.value.otoken
  ) {
    if (premiumSlippage.value > userAllowance.value) {
      await approveForPotionLiquidityPool(premiumSlippage.value, true);
      await fetchUserData();
    } else {
      await buyPotions(
        routerResult.value?.counterparties,
        premiumSlippage.value,
        otokenData.value.otoken.tokenAddress
      );
      await fetchUserData();
    }
  } else {
    console.info("You are missing some parameters to be set");
  }
};

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
</script>
