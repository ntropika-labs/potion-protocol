<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Token, TradeType } from "@uniswap/sdk-core";
import { useOracleContract } from "@/composables/useOracleContract";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { createValidExpiry } from "@/helpers/time";
import {
  AssetTag,
  BaseButton,
  BaseCard,
  BaseTag,
  LabelValue,
  TabNavigationComponent,
  TimeTag,
} from "potion-ui";

import { useOnboard } from "@onboard-composable";

import { useHedgingVaultOperatorHelperContract } from "@/composables/useHedgingVaultOperatorHelperContract";
import { useNotifications } from "@/composables/useNotifications";
// import { useCoinGecko } from "@/composables/useCoinGecko";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useBlockNative } from "@/composables/useBlockNative";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { currencyFormatter } from "potion-ui/src/helpers";
import { ChainId } from "@uniswap/smart-order-router";
import TokenSwap from "@/components/TokenSwap/TokenSwap.vue";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import {
  useInvestmentVaultContract,
  LifecycleState,
} from "@/composables/useInvestmentVaultContract";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useAlphaRouter } from "@/composables/useAlphaRouter";

import { useOtokenFactory } from "@/composables/useOtokenFactory";
// import dayjs from "dayjs";

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
const expectedPriceRate = ref(1);

// Input validity

const hasSwapRoute = ref(false);
const isExpectedPriceRateValid = ref(true);
/**
 * Setup
 */
const { t } = useI18n();
const router = useRouter();
const { connectedWallet } = useOnboard();
const { blockTimestamp, getBlock, initProvider } = useEthersProvider();
const { getGas, gasPrice } = useBlockNative();

const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);

/**
 * Vault operation
 */
const { principalPercentages, vaultStatus } =
  useInvestmentVaultContract(validId);

const principalPercentage = computed(() =>
  principalPercentages.value && principalPercentages.value.length
    ? principalPercentages.value[0]
    : 0
);

//const actionsStrategyInfo = ref(new Map<string, string | number | boolean>());
const {
  vaultName,
  assetName,
  assetSymbol,
  assetAddress,
  assetDecimals,
  //assetImage,
  totalAssets,
} = useErc4626Contract(validId);

const tokenAsset = computed(() => {
  return {
    name: assetName.value,
    symbol: assetSymbol.value,
    address: assetAddress.value.toLowerCase(),
    decimas: assetDecimals.value,
    //image: assetImage.value, // TODO FIX
  };
});

const oraclePrice = ref(0);
const { getPrice } = useOracleContract();
watch(assetAddress, async () => {
  oraclePrice.value = parseFloat(await getPrice(assetAddress.value));
  await getCurrentPayout(assetAddress.value);
});

const strikePrice = computed(() => {
  return oraclePrice.value * (strikePercentage.value / 100);
});

const orderSize = computed(() => {
  return (
    (principalPercentage.value / 100) * totalAssets.value * strikePrice.value
  );
});

const numberOfOtokensToBuyBN = computed(() => {
  const ppBN = parseUnits(principalPercentage.value.toString(), 18);
  const taBN = parseUnits(totalAssets.value.toString(), 18);
  const dBN = parseUnits("100", 18);
  const noBN = ppBN.mul(taBN).div(dBN);
  // otokens are in 8 digits, we need to remove some digits here by dividing by 10^10
  return noBN.div(10 ** 10);
});
// Hedging Vault interaction

const {
  enterPositionTx,
  enterPositionReceipt,
  enterPositionLoading,
  enterPosition: vaultEnterPosition,
  canPositionBeEntered,
  exitPositionTx,
  exitPositionReceipt,
  exitPositionLoading,
  exitPosition: vaultExitPosition,
  canPositionBeExited,
  //actionsAddress,
} = useHedgingVaultOperatorHelperContract();

const statusInfo = computed(() => {
  switch (vaultStatus.value) {
    case LifecycleState.Unlocked:
      return {
        label: "Unlocked",
        class: "bg-accent-500",
      };
    case LifecycleState.Committed:
      return {
        label: "Committed",
        class: "bg-orange-500",
      };
    case LifecycleState.Locked:
    default:
      return {
        label: "Locked",
        class: "bg-error",
      };
  }
});

const {
  nextCycleTimestamp,
  cycleDurationDays,
  maxPremiumPercentage,
  premiumSlippage,
  swapSlippage,
  maxSwapDurationSecs,
  strikePercentage,
  currentPayout,
  getCurrentPayout,
  getStrategyInfo,
} = usePotionBuyActionContract(contractsAddresses.PotionBuyAction.address);

// Depth Router logic
const criteriasParam = computed(() => {
  return [
    {
      token: tokenAsset.value,
      maxStrike: strikePercentage.value,
      maxDuration: cycleDurationDays.value,
    },
  ];
});

const { routerResult, formattedPremium } = useDepthRouter(
  criteriasParam,
  orderSize,
  strikePrice,
  gasPrice,
  oraclePrice
);

const formattedPremiumSlippage = computed(() => {
  return currencyFormatter(premiumSlippage.value, "USDC");
});

const hasCounterparties = computed(() => {
  return routerResult.value && routerResult.value.counterparties.length > 0
    ? true
    : false;
});

const totalAmountToSwap = computed(() => {
  if (!routerResult.value) return 0;

  return (
    (premiumSlippage.value / 100) * routerResult.value.premium + orderSize.value
  );
});

const {
  routerData: uniswapRouteData,
  getRoute,
  routerLoading,
  togglePolling,
  routerPolling,
} = useAlphaRouter(ChainId.MAINNET);

const { getTargetOtokenAddress } = useOtokenFactory();

const loadExitPositionRoute = async () => {
  if (!currentPayout.value?.currentPayout) {
    throw new Error("no payout");
  }

  await getRoute(
    USDC,
    currentPayout.value?.currentPayout,
    WETH,
    walletAddress.value,
    TradeType.EXACT_INPUT,
    swapSlippage.value
  );

  console.log("exit route", uniswapRouteData.value);
};

const exitPosition = async () => {
  if (!uniswapRouteData.value || !expectedPriceRate.value) return;

  const swapRoute = uniswapRouteData.value.route[0];
  const firstPoolFee: number = (swapRoute.route as any).pools[0].fee;
  const swapInfo = {
    steps: [
      { inputTokenAddress: contractsAddresses.USDC.address, fee: firstPoolFee },
    ],
    outputTokenAddress: tokenAsset.value.address,
    expectedPriceRate: expectedPriceRate.value,
  };

  await vaultExitPosition(swapInfo);
  //await TESTsetSwapInfo(swapInfo);
  //await TESTexitPosition();
};

const loadEnterPositionRoute = async () => {
  await getRoute(
    WETH,
    totalAmountToSwap.value,
    USDC,
    walletAddress.value,
    TradeType.EXACT_OUTPUT,
    swapSlippage.value
  );

  console.log("enter route", uniswapRouteData.value);
};
const enterPosition = async () => {
  if (
    !uniswapRouteData.value ||
    !routerResult.value ||
    !routerResult.value.counterparties ||
    !expectedPriceRate.value
  )
    return;

  const expirationTimestamp = createValidExpiry(
    blockTimestamp.value,
    1 //cycleDurationDays.value
  ); //nextCycleTimestamp.value + 86400 * 10;
  const newOtokenAddress = await getTargetOtokenAddress(
    tokenAsset.value.address,
    contractsAddresses.USDC.address,
    contractsAddresses.USDC.address,
    strikePrice.value,
    expirationTimestamp,
    true
  );

  const swapRoute = uniswapRouteData.value.route[0];

  const counterparties = routerResult.value.counterparties.map((seller) => {
    return {
      lp: seller.lp,
      poolId: seller.poolId,
      curve: seller.curve,
      criteria: seller.criteria,
      orderSizeInOtokens: seller.orderSizeInOtokens,
    };
  });

  const firstPoolFee: number = (swapRoute.route as any).pools[0].fee;
  const swapInfo = {
    steps: [{ inputTokenAddress: tokenAsset.value.address, fee: firstPoolFee }],
    outputTokenAddress: contractsAddresses.USDC.address,
    expectedPriceRate: expectedPriceRate.value,
  };

  const potionBuyInfo = {
    targetPotionAddress: newOtokenAddress,
    underlyingAsset: tokenAsset.value.address,
    strikePriceInUSDC: strikePrice.value.toFixed(6),
    expirationTimestamp: expirationTimestamp,
    sellers: counterparties,
    expectedPremiumInUSDC: routerResult.value.premium.toFixed(6),
    totalSizeInPotions: numberOfOtokensToBuyBN.value,
  };

  vaultEnterPosition(swapInfo, potionBuyInfo);
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
    enabled: true, //hasCounterparties,
  },
]);

onMounted(async () => {
  await getGas();
  await getBlock("latest");
});

let pollingIntervalId: any = null;
watch(routerPolling, (doPolling) => {
  console.log("toggling polling", doPolling);
  if (doPolling === true) {
    let callback = null;
    if (canPositionBeEntered.value) callback = loadEnterPositionRoute;
    else if (canPositionBeExited.value) callback = loadExitPositionRoute;
    else {
      throw new Error("Vault is locked");
    }
    pollingIntervalId = setInterval(callback, 60000);
    console.log(`next polling in 60 seconds`, pollingIntervalId);
  } else if (pollingIntervalId) {
    clearInterval(pollingIntervalId);
  }
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
  // await $fetch("http://localhost:8545", {
  //   method: "POST",
  //   body: {
  //     jsonrpc: "2.0",
  //     method: "evm_increaseTime",
  //     params: [addHours * 3660],
  //   },
  // });
  // await $fetch("http://localhost:8545", {
  //   method: "POST",
  //   body: {
  //     jsonrpc: "2.0",
  //     method: "evm_mine",
  //   },
  // });
  const provider = initProvider(false);
  await provider.send("evm_increaseTime", [addHours * 3660]);
  await provider.send("evm_mine", []);
  await getBlock("latest");
  await getStrategyInfo();

  console.log(blockTimestamp.value);
};
</script>
<template>
  <div class="flex flex-row items-end gap-4">
    <BaseButton palette="primary" label="Load str." @click="getStrategyInfo()">
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <div class="border-1">
      <p class="text-sm">TEST ADD BLOCK</p>
      <div class="flex flex-row gap-4">
        <BaseButton
          palette="primary"
          label="+1D"
          @click="() => testAddBlock(24)"
        >
          <template #pre-icon>
            <i class="i-ph-test-tube-fill"></i>
          </template>
        </BaseButton>
        <BaseButton
          palette="primary"
          label="+1M"
          @click="() => testAddBlock(720)"
        >
          <template #pre-icon>
            <i class="i-ph-test-tube-fill"></i>
          </template>
        </BaseButton>
      </div>
    </div>

    <BaseButton palette="primary" label="Get block" @click="getBlock('latest')">
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="enter route"
      @click="loadEnterPositionRoute()"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton
      palette="primary"
      label="exit route"
      @click="loadExitPositionRoute()"
    >
      <template #pre-icon>
        <i class="i-ph-test-tube-fill"></i>
      </template>
    </BaseButton>
    <BaseButton palette="primary" label="Test exit" @click="exitPosition()">
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

  <BaseCard class="p-6 mt-4 mb-8">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      <div>
        <p class="capitalize mb-2">{{ t("status") }}</p>
        <BaseTag>
          <div
            class="h-2 w-2 rounded-full mr-1"
            :class="statusInfo.class"
          ></div>
          <span>{{ statusInfo.label }}</span>
        </BaseTag>
      </div>
      <div class="">
        <!-- <p class="capitalize mb-2">
        {{ t("time_left_until_next_cycle") }}
      </p>
      <BaseTag>
        <span class="text-accent-500">{{ timeToNextCycle }}</span>
      </BaseTag> -->
        <TimeTag
          :title="t('time_left_until_next_cycle')"
          :time-from="blockTimestamp.toString()"
          :time-to="nextCycleTimestamp.toString()"
        ></TimeTag>
      </div>
      <div>
        <p class="capitalize">{{ t("current_payout") }}</p>
        <div v-if="currentPayout" class="flex flex-row gap-4 items-center">
          <!-- TODO: add a tooltip to explain final payout -->
          <span
            v-if="currentPayout.isFinal"
            class="i-ph-lock-key h-8 w-8"
          ></span>
          <span v-else class="i-ph-arrows-clockwise h-8 w-8"></span>
          <p>{{ currentPayout.currentPayout }}</p>
        </div>
      </div>
    </div>
  </BaseCard>
  <div class="grid lg:grid-cols-3 gap-8">
    <div>
      <div class="relative md:sticky md:top-12">
        <BaseCard class="p-6 grid gap-4">
          <h3 class="text-lg font-semibold mb-4">Recap</h3>
          <div class="grid md:grid-cols-2 items-start gap-12">
            <LabelValue
              size="lg"
              :title="t('vault_size')"
              :value="totalAssets.toString()"
              :symbol="assetSymbol"
            />
            <div class="flex flex-col gap-2">
              <AssetTag size="lg" :title="t('asset')" :token="tokenAsset" />
              <div>
                <p class="capitalize">{{ t("current_price") }}</p>
                <p>{{ oraclePrice }}</p>
              </div>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-12">
            <LabelValue
              size="lg"
              :title="t('hedging_level')"
              :value="principalPercentage.toString()"
              symbol="%"
            />
            <LabelValue
              size="lg"
              :title="t('strike')"
              :value="strikePercentage ? strikePercentage.toString() : '-'"
              symbol="%"
            />
          </div>
          <LabelValue
            size="lg"
            :title="t('cycle_duration')"
            :value="cycleDurationDays.toString()"
            symbol="days"
          />
          <div class="grid md:grid-cols-2 gap-12">
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
          </div>
          <div class="grid md:grid-cols-2 gap-12">
            <LabelValue
              size="lg"
              :title="t('max_swap_slippage')"
              :value="swapSlippage ? swapSlippage.toString() : '-'"
              symbol="%"
            />
            <LabelValue
              size="lg"
              :title="t('max_swap_duration')"
              :value="
                maxSwapDurationSecs ? maxSwapDurationSecs.toString() : '-'
              "
              symbol="secs"
            />
          </div>

          <div v-if="routerResult" class="flex flex-col justify-start">
            <h3 class="font-medium text-white/80">> Market size</h3>
            <div class="flex justify-between px-4 items-start text-sm">
              <div class="flex gap-2 items-center justify-between w-full">
                <p class="capitalize">{{ t("price_per_potion") }}</p>
                <p>{{ formattedPremium }}</p>
              </div>
            </div>
            <div class="flex justify-between px-4 items-start text-sm mt-4">
              <p class="capitalize text-lg font-bold">{{ t("total") }}</p>
              <p class="text-lg font-bold">
                {{ formattedPremiumSlippage }}
              </p>
            </div>
          </div>
        </BaseCard>
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
          <BaseCard class="p-6">
            <div class="flex flex-col gap-8">
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
                <div v-if="routerResult?.counterparties">
                  <h3 class="text-xl font-bold mb-4">
                    <span
                      class="w-12 h-12 inline-flex items-center justify-center bg-primary-500 text-2xl font-bold rounded-full mr-2"
                      >{{ routerResult.counterparties.length }}</span
                    >Counterparties
                  </h3>
                  <BaseCard
                    v-for="(cp, index) in routerResult.counterparties"
                    :key="index"
                    class="p-6 relative"
                  >
                    <div class="grid md:grid-cols-3 pl-4 justify-between">
                      <div class="md:col-span-2">
                        <p class="font-medium text-lg">
                          LP: <span class="font-semibold">{{ cp.lp }}</span>
                        </p>
                        <p class="font-medium text-lg">
                          Pool id:
                          <span class="font-semibold">{{ cp.poolId }}</span>
                        </p>
                      </div>
                      <div class="flex justify-end">
                        <div
                          class="flex flex-col items-end rounded-lg ring-1 ring-white ring-opacity-5 p-2"
                        >
                          <p>order size in otokens:</p>
                          <pre
                            class="bg-dark broder-1 border-white rounded-lg m-2 p-1 break-all whitespace-pre-wrap"
                            >{{ formatUnits(cp.orderSizeInOtokens, 8) }}</pre
                          >
                        </div>
                      </div>
                    </div>
                    <hr class="opacity-40 mx-4 mb-2 mt-3" />
                    <p class="">> Curve</p>
                    <div class="flex flex-row gap-4">
                      <div class="text-center">
                        <p>a</p>
                        <pre
                          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.a_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>b</p>
                        <pre
                          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.b_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>c</p>
                        <pre
                          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.c_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>d</p>
                        <pre
                          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.d_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>max_util</p>
                        <pre
                          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.max_util, null, 2)
                          }}</pre
                        >
                      </div>
                    </div>

                    <p class="">> Criteria</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ JSON.stringify(cp.criteria, null, 2) }}</pre
                    >
                  </BaseCard>
                </div>
                <div v-else class="text-center">
                  <p class="text-white/40 text-3xl uppercase">
                    No result found
                  </p>
                </div>
              </div>
            </div>
          </BaseCard>
          <BaseCard class="p-6">
            <h1 class="text-xl font-semibold">Uniswap route</h1>
            <div class="grid md:grid-cols-3">
              <TokenSwap
                :token-input="WETH"
                :token-output="USDC"
                :input-amount-to-swap="totalAmountToSwap"
                :recipient-address="walletAddress"
                :route-data="uniswapRouteData"
                :router-loading="routerLoading"
                class="md:col-span-2"
              />
              <div>
                <div class="flex flex-col justify-start gap-4">
                  <BaseButton
                    label="route"
                    :disabled="routerLoading"
                    @click="loadEnterPositionRoute()"
                  >
                    <template #pre-icon>
                      <i class="i-ph-arrows-clockwise mr-1"></i>
                    </template>
                  </BaseButton>
                  <BaseButton
                    label="enter position"
                    :disabled="!uniswapRouteData || enterPositionLoading"
                    @click="enterPosition()"
                  ></BaseButton>
                  <BaseButton
                    :label="
                      routerPolling ? 'Turn off polling' : 'Turn on polling'
                    "
                    :disabled="routerLoading"
                    @click="togglePolling"
                  ></BaseButton>
                </div>
                <div v-if="uniswapRouteData">
                  <div>
                    <p>Quote for</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{
                        JSON.stringify(uniswapRouteData.quote, null, 2)
                      }}</pre
                    >
                  </div>

                  <div>
                    <p class="text-lg">Quote</p>
                    <p>Quote gas adjusted</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ uniswapRouteData.quoteGasAdjusted.toFixed(4) }}</pre
                    >
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{
                        JSON.stringify(
                          uniswapRouteData.quoteGasAdjusted.currency,
                          null,
                          2
                        )
                      }}</pre
                    >
                    <p>Estimated gas used</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ uniswapRouteData.estimatedGasUsed.toNumber() }}</pre
                    >
                    <p>Gas used USD</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{
                        uniswapRouteData.estimatedGasUsedUSD.toFixed(6)
                      }}</pre
                    >
                  </div>
                  <div>
                    <p>Parameters</p>
                    <pre
                      class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{
                        JSON.stringify(
                          uniswapRouteData.methodParameters,
                          null,
                          2
                        )
                      }}</pre
                    >
                  </div>
                </div>
                <div v-else>No quote available</div>
              </div>
            </div>
          </BaseCard>
        </TabNavigationComponent>
      </div>
      <!-- <p v-else>position cant be entered</p> -->
      <template v-if="canPositionBeExited">
        <BaseCard class="p-6">
          <h1 class="text-xl font-semibold">Uniswap route</h1>
          <div class="grid md:grid-cols-3">
            <div class="md:col-span-2">
              <InputNumber
                v-model.number="expectedPriceRate"
                color="no-bg"
                :title="t('expected_price_rate')"
                :min="1"
                :step="0.1"
                unit="USDC"
                :footer-description="t('max_strike_price')"
                @valid-input="isExpectedPriceRateValid = $event"
              />
              <TokenSwap
                :token-input="USDC"
                :token-output="WETH"
                :input-amount-to-swap="totalAmountToSwap"
                :recipient-address="walletAddress"
                :route-data="uniswapRouteData"
                :router-loading="routerLoading"
              />
            </div>

            <div>
              <div class="flex flex-col justify-start gap-4">
                <BaseButton
                  label="route"
                  :disabled="routerLoading"
                  @click="loadExitPositionRoute()"
                >
                  <template #pre-icon>
                    <i class="i-ph-arrows-clockwise mr-1"></i> </template
                ></BaseButton>
                <BaseButton
                  label="exit position"
                  :disabled="!uniswapRouteData || exitPositionLoading"
                  @click="exitPosition()"
                ></BaseButton>
                <BaseButton
                  :label="
                    routerPolling ? 'Turn off polling' : 'Turn on polling'
                  "
                  :disabled="routerLoading"
                  @click="togglePolling"
                ></BaseButton>
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
                  <p class="text-lg">Quote</p>
                  <p>Quote gas adjusted</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ uniswapRouteData.quoteGasAdjusted.toFixed(4) }}</pre
                  >
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{
                      JSON.stringify(
                        uniswapRouteData.quoteGasAdjusted.currency,
                        null,
                        2
                      )
                    }}</pre
                  >
                  <p>Estimated gas used</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ uniswapRouteData.estimatedGasUsed.toNumber() }}</pre
                  >
                  <p>Gas used USD</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ uniswapRouteData.estimatedGasUsedUSD.toFixed(6) }}</pre
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
          </div>
        </BaseCard>
      </template>
      <!-- <p v-else>Position cant be exited</p> -->
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index: string) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
