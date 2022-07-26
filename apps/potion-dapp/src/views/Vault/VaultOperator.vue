<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Token } from "@uniswap/sdk-core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

import {
  AssetTag,
  BaseButton,
  BaseCard,
  BaseTag,
  LabelValue,
  TabNavigationComponent,
} from "potion-ui";
import type { Criteria } from "dapp-types";

import { useOnboard } from "@onboard-composable";

import { useHedgingVaultHelperContract } from "@/composables/useHedgingVaultHelperContract";
import { useNotifications } from "@/composables/useNotifications";
import { useCoinGecko } from "@/composables/useCoinGecko";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useBlockNative } from "@/composables/useBlockNative";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { currencyFormatter } from "potion-ui/src/helpers";
import { ChainId } from "@uniswap/smart-order-router";
import TokenSwap from "@/components/TokenSwap/TokenSwap.vue";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useAlphaRouter } from "@/composables/useAlphaRouter";

import { $fetch } from "ohmyfetch";

dayjs.extend(relativeTime);
dayjs.extend(duration);
/**
 * Const
 */
const USDC = new Token(
  ChainId.MAINNET,
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  6,
  "USDC",
  "USD//C"
);

// TODO: remove once we have proper integration for underlying assets
const WETH = new Token(
  ChainId.MAINNET,
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  18,
  "WETH",
  "Wrapped Ether"
);

/**
 * Data
 */

const route = useRoute();
const { id } = route.params;
const validId = computed(() => {
  if (Array.isArray(id)) {
    return id[0].toLowerCase();
  }
  return id.toLowerCase();
});
const totalAmountToSwap = ref(99);
const timeToNextCycle = ref("-");
// Form

const potionQuantity = ref(1);
const criteriasParam = ref<Criteria[]>([]);

// Input validity

const isPotionQuantityValid = ref(false);
const hasSwapRoute = ref(false);

/**
 * Setup
 */
const { t } = useI18n();
const router = useRouter();
const { connectedWallet } = useOnboard();
const { blockTimestamp, getBlock } = useEthersProvider();
const { getGas, gasPrice } = useBlockNative();
const { coinsPrices, fetchCoinsPrices } = useCoinGecko(["ethereum"]);

const { fetchTokenPrice, formattedPrice } = useCoinGecko(
  undefined,
  WETH.address
);

const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);

const ethPrice = computed(() => {
  if (coinsPrices.value && coinsPrices.value.ethereum.usd) {
    return coinsPrices.value.ethereum.usd;
  }
  return 0;
});

const orderSize = computed(() => {
  return strikePercentage.value * potionQuantity.value;
});

/**
 * Vault operation
 */
watch(blockTimestamp, (t) =>
  console.log(
    "blockTimestamp",
    dayjs.unix(t).toISOString(),
    dayjs.unix(nextCycleTimestamp.value).toISOString()
  )
);
const { principalPercentages } = useInvestmentVaultContract(validId);

const principalPercentage = computed(() =>
  principalPercentages.value && principalPercentages.value.length
    ? principalPercentages.value[0].toString()
    : "0"
);

//const actionsStrategyInfo = ref(new Map<string, string | number | boolean>());
const {
  vaultName,
  assetName,
  assetSymbol,
  assetAddress,
  assetDecimals,
  assetImage,
} = useErc4626Contract(validId);

const tokenAsset = computed(() => {
  return {
    name: assetName.value,
    symbol: assetSymbol.value,
    address: assetAddress.value,
    decimas: assetDecimals.value,
    image: assetImage.value,
  };
});
// Hedging Vault interaction

const {
  enterPositionTx,
  enterPositionReceipt,
  //enterPositionLoading,
  //enterPosition: vaultEnterPosition,
  canPositionBeEntered,
  exitPositionTx,
  exitPositionReceipt,
  //exitPositionLoading,
  exitPosition: vaultExitPosition,
  canPositionBeExited,
  //actionsAddress,
  currentStatus,
} = useHedgingVaultHelperContract();

const statusInfo = computed(() => {
  switch (currentStatus.value) {
    case "unlocked":
      return {
        label: "Unlocked",
        class: "bg-accent-500",
      };
    case "locked":
    case "suspended":
    default:
      return {
        label: "Locked",
        class: "bg-error",
      };
  }
});
// watch(vaultActionsAddresses, (addresses) => {
//   const actionInfo = addresses[0];
//   actionsStrategyInfo
// })
console.log(contractsAddresses);
const {
  nextCycleTimestamp,
  cycleDurationSecs,
  maxPremiumPercentage,
  premiumSlippage,
  swapSlippage,
  maxSwapDurationSecs,
  strikePercentage,
  currentPayout,
  getCurrentPayout,
  getStrategyInfo,
} = usePotionBuyActionContract(contractsAddresses.PotionBuyAction.address);

const cycleDurationDays = computed(() => {
  return (cycleDurationSecs.value / 8640).toString();
});

watch(
  [blockTimestamp, nextCycleTimestamp],
  ([blockTimestamp, nextCycleTimestamp]) => {
    const blockT = dayjs.unix(blockTimestamp);
    const cycleT = dayjs.unix(nextCycleTimestamp);

    console.log(blockT, cycleT, blockT.isBefore(cycleT));

    timeToNextCycle.value = blockT.isBefore(cycleT)
      ? dayjs.duration(blockT.diff(cycleT)).humanize()
      : "-";

    getStrategyInfo();
  }
);

// Depth Router logic
const { routerResult, formattedPremium } = useDepthRouter(
  criteriasParam,
  orderSize,
  strikePercentage,
  gasPrice,
  ethPrice
);

const formattedPremiumSlippage = computed(() => {
  return currencyFormatter(premiumSlippage.value, "USDC");
});

const hasCounterparties = computed(() => {
  return routerResult.value && routerResult.value.counterparties.length > 0
    ? true
    : false;
});

watch([strikePercentage, assetAddress], async () => {
  if (assetAddress.value) {
    await getCurrentPayout(assetAddress);
    if (strikePercentage.value) {
      const t = {
        name: assetName.value,
        symbol: assetSymbol.value,
        address: "0xa85233c63b9ee964add6f2cffe00fd84eb32338f", // assetAddress.value, // TODO REPLACE WITH CORRECT ADDRESS
      };
      console.log(t);
      criteriasParam.value = [
        {
          token: t,
          maxStrike: strikePercentage.value,
          maxDuration: cycleDurationSecs.value / 8640, // TODO CHECK
        },
      ];
    }
  }
});

const {
  routerData: uniswapRouteData,
  getRoute,
  routerLoading,
} = useAlphaRouter(ChainId.MAINNET);

const exitPosition = async () => {
  console.log("test exit");
  await getRoute(WETH, totalAmountToSwap.value, USDC, walletAddress.value);

  await vaultExitPosition(uniswapRouteData.value);
};

const loadEnterPositionRoute = async () => {
  await getRoute(WETH, totalAmountToSwap.value, USDC, walletAddress.value);
};
const enterPosition = async () => {
  console.log("enter position");
};

// Tab navigation
const currentFormStep = ref(0);
const tabs = ref([
  {
    title: "Counterparties",
    subtitle: "",
    isValid: hasCounterparties,
    enabled: true,
  },
  {
    title: "Enter position",
    subtitle: "",
    isValid: hasSwapRoute,
    enabled: hasCounterparties,
  },
]);

onMounted(async () => {
  await fetchCoinsPrices();
  await getGas();
  await fetchTokenPrice();
  await getBlock("latest");
});

// Toast notifications
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(enterPositionTx, (transaction) => {
  createTransactionNotification(transaction, "Entering Position");
});

watch(enterPositionReceipt, (receipt) => {
  createReceiptNotification(receipt, "Position entered");
});

watch(exitPositionTx, (transaction) => {
  createTransactionNotification(transaction, "Exiting Position");
});

watch(exitPositionReceipt, (receipt) => {
  createReceiptNotification(receipt, "Position Exited");
});

// TODO: DELETE
const testAddBlock = async (addHours: number) => {
  await $fetch("http://127.0.0.1:8545", {
    method: "POST",
    body: {
      jsonrpc: "2.0",
      method: "evm_mine",
      params: [
        {
          timestamp: dayjs
            .unix(blockTimestamp.value)
            .add(addHours, "hours")
            .unix(),
        },
      ],
    },
  });
  await getBlock("latest");
};
</script>
<template>
  <div class="flex flex-row gap-4">
    <BaseButton
      palette="primary"
      label="TEST ENTER"
      @click="() => enterPosition()"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="TEST EXIT"
      @click="() => exitPosition()"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="LOAD STR."
      @click="() => getStrategyInfo()"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="TEST + BLOCK (24h)"
      @click="() => testAddBlock(24)"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton palette="primary" label="+1M" @click="() => testAddBlock(720)">
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="TEST GETBLOCK"
      @click="() => getBlock('latest')"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
  </div>

  <div
    class="flex flex-col-reverse justify-start gap-4 sm:(flex-row justify-between align-center)"
  >
    <BaseButton palette="transparent" :label="t('back')" @click="router.back">
      <template #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <div>
      <h1 class="text-2xl font-semibold">Vault Operator</h1>
      <p>Vault: {{ vaultName }}</p>
    </div>
  </div>
  <hr class="opacity-50 my-4 md:ml-4" />
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4 md:ml-4">
    <div>
      <p class="capitalize mb-2">{{ t("status") }}</p>
      <BaseTag>
        <div class="h-2 w-2 rounded-full mr-1" :class="statusInfo.class"></div>
        <span>{{ statusInfo.label }}</span>
      </BaseTag>
    </div>
    <div class="">
      <p class="capitalize mb-2">
        {{ t("time_left_until_next_cycle") }}
      </p>
      <BaseTag>
        <span class="text-accent-500">{{ timeToNextCycle }}</span>
      </BaseTag>
    </div>
    <div>
      <p class="capitalize">{{ t("current_payout") }}</p>
      <div v-if="currentPayout" class="flex flex-row gap-4 items-center">
        <!-- TODO: add a tooltip to explain final payout -->
        <span v-if="currentPayout.isFinal" class="i-ph-lock-key h-8 w-8"></span>
        <span v-else class="i-ph-arrows-clockwise h-8 w-8"></span>
        <p>{{ currentPayout.currentPayout }}</p>
      </div>
    </div>
    <div></div>
  </div>
  <hr class="opacity-50 my-4 md:ml-4" />
  <div class="grid md:grid-cols-3 gap-8">
    <div>
      <div class="relative md:sticky md:top-12">
        <BaseCard class="p-4 grid gap-4">
          <h3 class="text-lg font-semibold mb-4">Recap</h3>
          <div>
            <AssetTag size="lg" :title="t('asset')" :token="tokenAsset" />
            <p class="capitalize">{{ t("current_price") }}</p>
            <p>{{ formattedPrice }}</p>
          </div>

          <LabelValue
            size="lg"
            :title="t('hedging_level')"
            :value="principalPercentage"
            symbol="%"
          />
          <LabelValue
            size="lg"
            :title="t('strike')"
            :value="strikePercentage ? strikePercentage.toString() : '-'"
            symbol="%"
          />
          <LabelValue
            size="lg"
            :title="t('cycle_duration')"
            :value="cycleDurationDays"
            symbol="days"
          />
          <LabelValue
            size="lg"
            :title="t('max_premium')"
            :value="
              maxPremiumPercentage ? maxPremiumPercentage.toString() : '-'
            "
            symbol="%"
          />
          <LabelValue
            size="lg"
            :title="t('max_premium_slippage')"
            :value="premiumSlippage ? premiumSlippage.toString() : '-'"
            symbol="%"
          />
          <LabelValue
            size="lg"
            :title="t('max_swap_slippage')"
            :value="swapSlippage ? swapSlippage.toString() : '-'"
            symbol="%"
          />
          <LabelValue
            size="lg"
            :title="t('max_swap_duration')"
            :value="maxSwapDurationSecs ? maxSwapDurationSecs.toString() : '-'"
            symbol="%"
          />
        </BaseCard>

        <div v-if="isPotionQuantityValid" class="flex flex-col justify-start">
          <h3 class="font-medium text-white/80">> Market size</h3>
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
          <div class="flex justify-between px-4 items-start text-sm mt-4">
            <p class="capitalize text-lg font-bold">{{ t("total") }}</p>
            <p class="text-lg font-bold">
              {{ formattedPremiumSlippage }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="md:col-span-2">
      <div v-if="canPositionBeEntered">
        <TabNavigationComponent
          title="Enter position"
          :tabs="tabs"
          :default-index="currentFormStep"
          :show-quit-tabs="false"
          @navigate-tab="(index) => (currentFormStep = index)"
        >
          <BaseCard>
            <div class="p-8 grid md:grid-cols-3 items-start gap-12">
              <div class="md:col-span-2 flex flex-col gap-8">
                <div>
                  <h3 class="text-xl font-bold">Premium</h3>

                  <div v-if="routerResult">
                    <p>Premium + gas: {{ routerResult.premiumGas }}</p>
                    <p>Premium: {{ routerResult.premium }}</p>
                  </div>
                  <div v-else class="text-center">
                    <p class="text-white/40 uppercase">No result found</p>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-bold">Counterparties</h3>
                  <div v-if="routerResult?.counterparties">
                    <div
                      v-for="(cp, index) in routerResult.counterparties"
                      :key="cp.lp"
                    >
                      <div>
                        <h2>{{ index }}</h2>
                        <p>LP: {{ cp.lp }}</p>
                        <p>Pool id: {{ cp.poolId }}</p>
                        <p>
                          order size in otokens: {{ cp.orderSizeInOtokens }}
                        </p>
                      </div>
                      <pre
                        class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                        >{{ JSON.stringify(cp.curveAs64x64, null, 2) }}</pre
                      >
                      <pre
                        class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                        >{{ JSON.stringify(cp.criteria, null, 2) }}</pre
                      >
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <p class="text-white/40 text-3xl uppercase">
                      No result found
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
          <BaseCard>
            <TokenSwap
              :token-input="WETH"
              :token-output="USDC"
              :input-amount-to-swap="totalAmountToSwap"
              :recipient-address="walletAddress"
              :route-data="uniswapRouteData"
              :router-loading="routerLoading"
            />
            <div>
              <h1>Uniswap route</h1>
              <div class="flex justify-start gap-8">
                <BaseButton
                  label="update route"
                  :disabled="routerLoading"
                  @click="loadEnterPositionRoute"
                ></BaseButton>
                <!-- <BaseButton
                  :label="
                    routerPolling ? 'Turn off polling' : 'Turn on polling'
                  "
                  :disabled="routerLoading"
                  @click="togglePolling"
                ></BaseButton> -->
              </div>
              <div v-if="uniswapRouteData">
                <div>
                  <p>Quote for</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ JSON.stringify(uniswapRouteData.quote, null, 2) }}</pre
                  >
                </div>

                <div>
                  <p>Gas</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(uniswapRouteData.quoteGasAdjusted, null, 2)
                    }}</pre
                  >
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(uniswapRouteData.estimatedGasUsed, null, 2)
                    }}</pre
                  >
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(uniswapRouteData.gasPriceWei, null, 2)
                    }}</pre
                  >
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(
                        uniswapRouteData.estimatedGasUsedQuoteToken,
                        null,
                        2
                      )
                    }}</pre
                  >
                </div>
                <div>
                  <p>Parameters</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(uniswapRouteData.methodParameters, null, 2)
                    }}</pre
                  >
                </div>
              </div>
              <div v-else>No quote available</div>
            </div>
          </BaseCard>
        </TabNavigationComponent>
      </div>
      <p v-else>position cant be entered</p>
      <template v-if="canPositionBeExited">
        <BaseCard>
          <TokenSwap
            :token-input="USDC"
            :token-output="WETH"
            :input-amount-to-swap="totalAmountToSwap"
            :recipient-address="walletAddress"
            :route-data="uniswapRouteData"
            :router-loading="routerLoading"
          />
        </BaseCard>
      </template>
      <p v-else>Position cant be exited</p>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index: string) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
