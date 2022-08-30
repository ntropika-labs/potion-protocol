<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Token as UniToken, TradeType } from "@uniswap/sdk-core";
import { useOracleContract } from "@/composables/useOracleContract";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { createValidExpiry } from "@/helpers/time";
import {
  AssetTag,
  BaseButton,
  BaseCard,
  BaseTag,
  LabelValue,
  //TabNavigationComponent,
  TimeTag,
} from "potion-ui";

import { useOnboard } from "@onboard-composable";

import {
  useHedgingVaultOperatorHelperContract,
  type UniSwapInfo,
} from "@/composables/useHedgingVaultOperatorHelperContract";
import { useNotifications } from "@/composables/useNotifications";
// import { useCoinGecko } from "@/composables/useCoinGecko";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useBlockNative } from "@/composables/useBlockNative";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { getChainId, getUSDCAddress, getWETHAddress } from "@/helpers/uniswap";
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
import { useBuyerRecords } from "@/composables/useBuyerRecords";

const TabNavigationComponent = defineAsyncComponent(
  () =>
    import(
      "potion-ui/src/components/TabNavigationComponent/TabNavigationComponent.vue"
    )
);

/**
 * Const
 */
const IS_DEV_ENV = import.meta.env.DEV;

const USDC = new UniToken(getChainId(), getUSDCAddress(), 6, "USDC", "USD//C");

// TODO: remove once we have proper integration for underlying assets
const WETH = new UniToken(
  getChainId(),
  getWETHAddress(),
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
const { principalPercentages, vaultStatus, getVaultStatus } =
  useInvestmentVaultContract(validId, true);

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
} = useErc4626Contract(validId, true, true);

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
watch(assetAddress, async (address) => {
  if (!address) return;

  const [price] = await Promise.all([
    getPrice(address),
    getCurrentPayout(address),
  ]);

  oraclePrice.value = parseFloat(price);
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
  fetchCanPositionBeEntered,
  fetchCanPositionBeExited,
} = useHedgingVaultOperatorHelperContract();

const statusInfo = computed(() => {
  switch (vaultStatus.value) {
    case LifecycleState.Unlocked:
      return {
        label: t("unlocked"),
        class: "bg-accent-500",
      };
    case LifecycleState.Committed:
      return {
        label: t("committed"),
        class: "bg-orange-500",
      };
    case LifecycleState.Locked:
    default:
      return {
        label: t("locked"),
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
  strategyLoading,
} = usePotionBuyActionContract(
  contractsAddresses.PotionBuyAction.address,
  true
);

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

const {
  runRouter: loadCounterparties,
  routerResult,
  formattedPremium,
  routerRunning: counterpartiesLoading,
} = useDepthRouter(
  criteriasParam,
  orderSize,
  strikePrice,
  gasPrice,
  oraclePrice,
  false
);

const hasCounterparties = computed(() => {
  return routerResult.value && routerResult.value.counterparties.length > 0
    ? true
    : false;
});

const counterpartiesText = computed(() => {
  return routerResult.value && routerResult.value.counterparties.length > 1
    ? t("counterparties")
    : t("counterparty");
});

const totalAmountToSwap = ref(0);
const isTotalAmountValid = computed(
  () => !Number.isNaN(totalAmountToSwap.value)
);
const {
  routerData: uniswapRouteData,
  getRoute,
  routerLoading,
  togglePolling: toggleUniswapPolling,
  routerPolling,
} = useAlphaRouter(getChainId());

const { getTargetOtokenAddress } = useOtokenFactory();

const isEnterPositionOperationValid = computed(() => {
  return (
    isTotalAmountValid.value &&
    !!routerResult.value &&
    routerResult.value.counterparties &&
    routerResult.value.counterparties.length > 0 &&
    !!uniswapRouteData.value &&
    uniswapRouteData.value.route.length > 0
  );
});
const isExitPositionOperationValid = computed(() => {
  return (
    (isTotalAmountValid.value &&
      totalAmountToSwap.value > 0 &&
      !!uniswapRouteData.value &&
      uniswapRouteData.value.route.length > 0) ||
    (totalAmountToSwap.value === 0 && currentPayout.value?.currentPayout === 0)
  );
});

const loadExitPositionRoute = async () => {
  /**
   * TODO: we need to check the contract balance for USDC and add the amount to the eventual payout
   * if the payout is 0 and the leftover is 0, the alpha router is going to fail. We need to fix this at the contract level.
   * We will still need to pass a the swap object with an empty swapPath ("")
   */
  if (currentPayout.value?.currentPayout) {
    totalAmountToSwap.value = currentPayout.value.currentPayout;
    await getRoute(
      USDC,
      WETH,
      TradeType.EXACT_INPUT,
      totalAmountToSwap.value,
      1, // TODO remove: assert here theres only 1 route returned (no split routes)
      walletAddress.value,
      swapSlippage.value
    );
  } else {
    totalAmountToSwap.value = 0;
  }

  console.log("exit route", uniswapRouteData.value);
};

const exitPosition = async () => {
  if (!isExitPositionOperationValid.value) {
    throw new Error("A uniswap route is required to exit position");
  }

  toggleUniswapPolling(false);

  let swapInfo: UniSwapInfo;
  const USDCToken = {
    address: IS_DEV_ENV ? contractsAddresses.USDC.address : USDC.address,
    name: USDC.name || "",
    symbol: USDC.symbol || "",
    decimals: USDC.decimals,
  };
  if (totalAmountToSwap.value > 0) {
    if (!uniswapRouteData.value?.route) {
      throw new Error("A Uniswap route is required to exit position");
    }

    const swapRoute = uniswapRouteData.value.route[0];
    const firstPoolFee: number = (swapRoute.route as any).pools[0].fee;
    const expectedPriceRate = IS_DEV_ENV
      ? 1 / oraclePrice.value //0.001,
      : uniswapRouteData.value?.trade.executionPrice.invert().toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
    swapInfo = {
      steps: [
        {
          inputToken: USDCToken,
          fee: firstPoolFee,
        },
      ],
      outputToken: tokenAsset.value,
      expectedPriceRate: expectedPriceRate, // this value needs to be = to the swap route price rate. Ex: eth is 100 at the time of swap, the value is 1 / 100
    };
  } else {
    swapInfo = {
      steps: [
        {
          inputToken: USDCToken,
          fee: 0,
        },
      ],
      outputToken: tokenAsset.value,
      expectedPriceRate: 0,
    };
  }

  console.log("expectedPriceRate", expectedPriceRate);

  await vaultExitPosition(swapInfo);
  await reloadInfoAfterAction();
};

const loadEnterPositionRoute = async () => {
  if (!routerResult.value) {
    throw new Error("No counterparty available");
  }

  totalAmountToSwap.value =
    routerResult.value.premium +
    (premiumSlippage.value * routerResult.value.premium) / 100;
  await getRoute(
    WETH,
    USDC,
    TradeType.EXACT_OUTPUT,
    totalAmountToSwap.value,
    1, // TODO remove: assert here theres only 1 route returned (no split routes)
    walletAddress.value,
    swapSlippage.value
  );

  console.log(
    "EXECUTION PRICE",
    uniswapRouteData.value?.trade.executionPrice,
    uniswapRouteData.value?.trade.executionPrice.toFixed(10)
  );
};
const enterPosition = async () => {
  if (
    !isEnterPositionOperationValid.value ||
    !routerResult.value ||
    !uniswapRouteData.value
  ) {
    throw new Error(
      "A uniswap route and a set of counterparties is required to enter position"
    );
  }

  toggleUniswapPolling(false);

  const expirationTimestamp = createValidExpiry(
    blockTimestamp.value,
    cycleDurationDays.value
  );
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
  const USDCToken = {
    address: IS_DEV_ENV ? contractsAddresses.USDC.address : USDC.address,
    name: USDC.name || "",
    symbol: USDC.symbol || "",
    decimals: USDC.decimals,
  };
  const expectedPriceRate = IS_DEV_ENV
    ? oraclePrice.value //1000,
    : uniswapRouteData.value.trade.executionPrice.toSignificant(18); //The expected price of the swap as a fixed point SD59x18 number
  const swapInfo: UniSwapInfo = {
    steps: [{ inputToken: tokenAsset.value, fee: firstPoolFee }],
    outputToken: USDCToken,
    expectedPriceRate: expectedPriceRate, // TODO: this value needs to be = to the swap route price rate. Ex: eth is 100 at the time of swap, the value is 100
  };

  const potionBuyInfo = {
    targetPotionAddress: newOtokenAddress,
    underlyingAsset: tokenAsset.value.address,
    strikePriceInUSDC: strikePrice.value.toFixed(6),
    expirationTimestamp: expirationTimestamp,
    sellers: counterparties,
    expectedPremiumInUSDC: routerResult.value?.premium.toFixed(6),
    totalSizeInPotions: numberOfOtokensToBuyBN.value,
  };

  console.log("expectedPriceRate", expectedPriceRate);

  await vaultEnterPosition(swapInfo, potionBuyInfo);
  await reloadInfoAfterAction();
};

const reloadInfoAfterAction = async () => {
  uniswapRouteData.value = undefined;
  await Promise.all([
    getStrategyInfo(),
    getVaultStatus(),
    fetchCanPositionBeEntered(),
    fetchCanPositionBeExited(),
  ]);
};

// Tab navigation
const currentFormStep = ref(0);
const tabs = ref([
  {
    title: t("counterparties"),
    subtitle: "",
    isValid: hasCounterparties,
    enabled: true,
  },
  {
    title: t("enter_position"),
    subtitle: "",
    isValid: hasSwapRoute,
    enabled: hasCounterparties,
  },
]);

onMounted(async () => {
  await Promise.all([getGas(), getBlock("latest")]);
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
  const provider = initProvider(false);
  await provider.send("evm_increaseTime", [addHours * 3660]);
  await provider.send("evm_mine", []);
  await getBlock("latest");
  await getStrategyInfo();

  console.log(blockTimestamp.value);
};

const { records } = useBuyerRecords(
  contractsAddresses["PotionBuyAction"].address,
  nextCycleTimestamp
);
const potionAddress = computed(() => {
  if (!records.value || !records.value.length) return null;

  return records.value[0].otoken ? records.value[0].otoken.id : null;
});
const setPriceCommand = ref<HTMLElement>();
const copySetPriceCommand = async () => {
  if (potionAddress.value && setPriceCommand.value?.textContent) {
    await navigator.clipboard.writeText(setPriceCommand.value.textContent);
  }
};
</script>
<template>
  <!-- START TEST COMMANDS -->
  <div v-if="IS_DEV_ENV">
    <div class="flex flex-row items-end gap-4">
      <div class="border-1 p-2 rounded border-color-white border-opacity-20">
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
      <BaseButton
        palette="primary"
        label="Load info"
        class="mb-2"
        @click="reloadInfoAfterAction"
      >
        <template #pre-icon>
          <i class="i-ph-test-tube-fill"></i>
        </template>
      </BaseButton>
    </div>
    <div class="flex flex-col mt-4 gap-2">
      <p>Underlying asset: {{ assetAddress }}</p>
      <div v-if="potionAddress">
        <p>Set price command:</p>
        <div class="flex flex-row items-start">
          <pre
            ref="setPriceCommand"
            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
          >
yarn set-price --otoken {{ potionAddress }} --price 500 --network localhost</pre
          >
          <BaseButton
            palette="primary"
            label="copy"
            size="sm"
            @click="copySetPriceCommand"
          >
            <template #pre-icon>
              <i class="i-ph-test-tube-fill"></i>
            </template>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
  <!-- END TEST COMMANDS -->
  <!-- START NAVIGATION HEADER -->
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
  <!-- END NAVIGATION HEADER -->
  <!-- START HEADER -->
  <BaseCard class="p-6 mt-4 mb-8">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      <div>
        <p class="capitalize mb-2">{{ t("status") }}</p>
        <BaseTag :is-loading="strategyLoading">
          <div
            class="h-2 w-2 rounded-full mr-1"
            :class="statusInfo.class"
          ></div>
          <span>{{ statusInfo.label }}</span>
        </BaseTag>
      </div>
      <div>
        <TimeTag
          :is-loading="strategyLoading"
          :title="t('time_left_until_next_cycle')"
          :time-from="blockTimestamp.toString()"
          :time-to="nextCycleTimestamp.toString()"
        ></TimeTag>
      </div>
      <div>
        <p class="capitalize mb-2">{{ t("current_payout") }}</p>
        <BaseTag :is-loading="strategyLoading">
          <div v-if="currentPayout" class="flex flex-row gap-4 items-center">
            <!-- TODO: add a tooltip to explain final payout -->
            <span
              v-if="currentPayout.isFinal"
              class="i-ph-lock-key h-6 w-6"
            ></span>
            <span v-else class="i-ph-arrows-clockwise h-6 w-6"></span>
            <p class="text-lg font-semibold">
              {{ currentPayout.currentPayout }}
            </p>
          </div>
          <p v-else>-</p>
        </BaseTag>
      </div>
    </div>
  </BaseCard>
  <!-- END HEADER -->
  <!-- START CONTENT -->
  <div class="grid lg:grid-cols-3 gap-8">
    <!-- START FIXED SIDEBAR -->
    <div>
      <div class="relative lg:sticky lg:top-12">
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
            <h3 class="font-medium text-white/80 text-lg font-bold">
              > Market size
            </h3>
            <div class="flex justify-between px-4 items-start text-sm">
              <div class="flex gap-2 items-center justify-between w-full">
                <p class="capitalize text-lg font-bold">
                  {{ t("premium") }}
                </p>
                <p>{{ formattedPremium }}</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
    <!-- END FIXED SIDEBAR -->
    <div class="lg:col-span-2">
      <!-- START ENTER POSITION -->
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
              <div class="flex flex-row justify-between">
                <div v-if="routerResult">
                  <h3 class="text-xl font-bold">Premium</h3>
                  <p>Premium + gas: {{ routerResult.premiumGas }}</p>
                  <p>Premium: {{ routerResult.premium }}</p>
                </div>
                <div v-else class="text-center">
                  <p class="text-white/40 uppercase">No result found</p>
                </div>
                <div>
                  <BaseButton
                    :label="t('counterparties')"
                    :disabled="counterpartiesLoading"
                    @click="loadCounterparties()"
                  >
                    <template #pre-icon
                      ><i
                        class="i-ph-arrows-clockwise mr-1"
                        :class="counterpartiesLoading && 'animate-spin'"
                      ></i
                    ></template>
                  </BaseButton>
                </div>
              </div>
              <div>
                <div class="flex flex-row items-center gap-2 mb-4">
                  <div
                    class="w-12 h-12 inline-flex items-center justify-center bg-primary-500 text-2xl font-bold rounded-full"
                  >
                    <span v-if="routerResult?.counterparties">
                      {{ routerResult.counterparties.length }}
                    </span>
                    <span v-else-if="counterpartiesLoading || strategyLoading"
                      ><i class="i-ph-arrows-clockwise animate spin"></i
                    ></span>
                    <span v-else>no</span>
                  </div>
                  <h3 class="text-xl font-bold capitalize">
                    {{ counterpartiesText }}
                  </h3>
                </div>
                <div
                  v-if="routerResult?.counterparties"
                  class="flex flex-col gap-4"
                >
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
                            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-1 break-all whitespace-pre-wrap"
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
                          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.a_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>b</p>
                        <pre
                          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.b_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>c</p>
                        <pre
                          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.c_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>d</p>
                        <pre
                          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.d_number, null, 2)
                          }}</pre
                        >
                      </div>
                      <div class="text-center">
                        <p>max_util</p>
                        <pre
                          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                          >{{
                            JSON.stringify(cp.curveAs64x64.max_util, null, 2)
                          }}</pre
                        >
                      </div>
                    </div>

                    <p class="">> Criteria</p>
                    <pre
                      class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ JSON.stringify(cp.criteria, null, 2) }}</pre
                    >
                  </BaseCard>
                </div>
                <div v-else-if="counterpartiesLoading">
                  <div class="animate-pulse flex space-x-4">
                    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                    <div class="flex-1 space-y-6 py-1">
                      <div class="h-2 bg-slate-700 rounded"></div>
                      <div class="space-y-3">
                        <div class="grid grid-cols-3 gap-4">
                          <div
                            class="h-2 bg-slate-700 rounded col-span-2"
                          ></div>
                          <div
                            class="h-2 bg-slate-700 rounded col-span-1"
                          ></div>
                        </div>
                        <div class="h-2 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  </div>
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
            <div
              class="flex flex-row-reverse md:flex-row items-start justify-between gap-4 my-4"
            >
              <div class="flex md:flex-row gap-4">
                <BaseButton
                  label="route"
                  :disabled="routerLoading || enterPositionLoading"
                  @click="loadEnterPositionRoute()"
                >
                  <template #pre-icon>
                    <i
                      class="i-ph-arrows-clockwise mr-1"
                      :class="routerLoading && 'animate-spin'"
                    ></i>
                  </template>
                </BaseButton>

                <BaseButton
                  :label="routerPolling ? 'disable polling' : 'enable polling'"
                  :disabled="routerLoading || enterPositionLoading"
                  @click="toggleUniswapPolling"
                ></BaseButton>
              </div>
              <div class="flex flex-col items-end">
                <BaseButton
                  label="enter position"
                  palette="secondary"
                  :disabled="!isEnterPositionOperationValid || routerLoading"
                  :loading="enterPositionLoading"
                  @click="enterPosition()"
                ></BaseButton>
                <p
                  v-if="!isEnterPositionOperationValid"
                  class="text-secondary-500 text-xs text-right mt-2"
                >
                  A route is required to enter the position
                </p>
              </div>
            </div>
            <TokenSwap
              :route-data="uniswapRouteData"
              :router-loading="routerLoading"
            />
          </BaseCard>
        </TabNavigationComponent>
      </div>
      <!-- END ENTER POSITION -->
      <!-- START EXIT POSITION -->
      <BaseCard v-else-if="canPositionBeExited" class="p-6">
        <h1 class="text-xl font-semibold">Exit position</h1>
        <hr class="opacity-40 my-4" />
        <h3 class="text-xl font-semibold">Uniswap route</h3>
        <div
          class="flex flex-row-reverse md:flex-row justify-between items-start gap-4 my-4"
        >
          <div class="flex md:flex-row gap-4">
            <BaseButton
              label="route"
              :disabled="routerLoading || exitPositionLoading"
              @click="loadExitPositionRoute()"
            >
              <template #pre-icon>
                <i
                  class="i-ph-arrows-clockwise mr-1"
                  :class="routerLoading && 'animate-spin'"
                ></i> </template
            ></BaseButton>

            <BaseButton
              :label="routerPolling ? 'disable polling' : 'enable polling'"
              :disabled="routerLoading || exitPositionLoading"
              @click="toggleUniswapPolling"
            ></BaseButton>
          </div>
          <div class="flex flex-col items-end">
            <BaseButton
              label="exit position"
              palette="secondary"
              :disabled="
                !isExitPositionOperationValid ||
                routerLoading ||
                exitPositionLoading
              "
              :loading="exitPositionLoading"
              @click="exitPosition()"
            ></BaseButton>
            <p
              v-if="!isExitPositionOperationValid"
              class="text-secondary-500 text-xs text-right mt-2"
            >
              A route is required to exit the position
            </p>
          </div>
        </div>
        <TokenSwap
          :route-data="uniswapRouteData"
          :router-loading="routerLoading"
        />
      </BaseCard>
      <!-- END EXIT POSITION -->
      <div v-else class="flex items-center justify-center h-full">
        <p class="text-4xl text-dwhite-400 text-opacity-20">
          No action available
        </p>
      </div>
    </div>
  </div>
  <!-- END CONTET -->
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index: string) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
