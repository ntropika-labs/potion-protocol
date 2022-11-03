<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  unref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { formatUnits } from "@ethersproject/units";
import {
  AssetTag,
  BaseButton,
  BaseCard,
  BaseTag,
  LabelValue,
  TimeTag,
} from "potion-ui";
import { LifecycleStates } from "hedging-vault-sdk";

import { useHedgingVaultOrchestratorContract } from "@/composables/useHedgingVaultOrchestratorContract";
import { useNotifications } from "@/composables/useNotifications";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import TokenSwap from "@/components/TokenSwap/TokenSwap.vue";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";

import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";
import { useEthersProvider } from "@/composables/useEthersProvider";

import { useBuyerRecords } from "@/composables/useBuyerRecords";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";

import { useVaultOperatorEnterPosition } from "@/composables/useVaultOperatorEnterPosition";
import { useVaultOperatorExitPosition } from "@/composables/useVaultOperatorExitPosition";
import { useOracleContract } from "@/composables/useOracleContract";

const TabNavigationComponent = defineAsyncComponent(
  () =>
    import(
      "potion-ui/src/components/TabNavigationComponent/TabNavigationComponent.vue"
    )
);

const rerunRequired = ref(false);
const IS_DEV_ENV = import.meta.env;

const { t } = useI18n();
const router = useRouter();

const route = useRoute();
const { vaultId } = useRouteVaultIdentifier(route.params);
const { potionBuyAction, roundsOutputVault } = getContractsFromVault(
  vaultId.value.toLowerCase()
);

const { blockTimestamp, getBlock, initProvider } = useEthersProvider();
const { polledPrice, startPolling, stopPolling } = useOracleContract();
const oraclePrice = computed(() => parseFloat(polledPrice?.value ?? 0));

const {
  vaultStatus,
  getTotalSupply,
  totalSupply,
  getShareBalance,
  shareBalance,
} = useInvestmentVaultContract(vaultId, true, true);

const {
  vaultName,
  assetSymbol,
  assetAddress,
  totalAssets,
  tokenAsset,
  getTotalAssets,
} = useErc4626Contract(vaultId, true, true);

const {
  enterNextRound: vaultEnterNextRound,
  fetchCanEnterNextRound,
  canEnterNextRound,
  nextRoundLoading,
  //  nextRoundError,
  nextRoundTx,
  nextRoundReceipt,
} = useHedgingVaultOrchestratorContract(vaultId.value.toLowerCase());

const {
  nextCycleTimestamp,
  cycleDurationDays,
  maxPremiumPercentage,
  premiumSlippage,
  swapSlippage,
  maxSwapDurationSecs,
  strikePercentage,
  currentPayout,
  hedgingRate,
  totalPayoutUSDC,
  getCurrentPayout,
  getStrategyInfo,
  getTotalPayoutInUSDC,
  strategyLoading,
} = usePotionBuyActionContract(potionBuyAction, true);

const {
  enterPositionData, // Raw data to use when entering the position
  isActionLoading: isEnterPositionLoading,
  hasCounterparties,
  isEnterPositionOperationValid,
  loadEnterPositionRoute,
  evaluateEnterPositionData,
} = useVaultOperatorEnterPosition(
  vaultId,
  tokenAsset,
  totalPayoutUSDC,
  totalSupply,
  shareBalance,
  hedgingRate,
  strikePercentage,
  oraclePrice,
  cycleDurationDays
);

const {
  exitPositionData, // Raw data to use when entering the position
  isActionLoading: isExitPositionLoading,
  isExitPositionOperationValid,
  loadExitPositionRoute,
  evaluateExitPositionData,
} = useVaultOperatorExitPosition(
  vaultId,
  tokenAsset,
  totalPayoutUSDC,
  oraclePrice
);

const statusInfo = computed(() => {
  switch (vaultStatus.value) {
    case LifecycleStates.Unlocked:
      return {
        label: t("unlocked"),
        class: "bg-accent-500",
      };
    case LifecycleStates.Committed:
      return {
        label: t("committed"),
        class: "bg-orange-500",
      };
    case LifecycleStates.Locked:
    default:
      return {
        label: t("locked"),
        class: "bg-error",
      };
  }
});

const counterpartiesText = computed(() => {
  return enterPositionData.value &&
    enterPositionData.value.potionRouterData.counterparties.length > 1
    ? t("counterparties")
    : t("counterparty");
});

/**
 * Callback to enter the next round.
 * It requires the user to manually load routes ('callbackLoadRoutes') for the enter and exit positions before being able to issue this command.
 *
 * Executes the following steps:
 * 1. Evaluates previously loaded data for the exit position. This results in an object containing encoded data, suitable for the contracts,
 *    for the uniswap route and fallback route
 * 2. Gets a new otoken address
 * 3. Evaluates previously loaded data for the enter position. This results in an object containing encoded data, suitable for the contracts,
 *    for the uniswap route, the potion buy info and the fallback route
 */
const callbackEnterNextRound = async () => {
  if (
    nextRoundLoading.value ||
    !canEnterNextRound.value ||
    !isEnterPositionOperationValid.value ||
    !isExitPositionOperationValid.value
  ) {
    throw new Error(
      "2 uniswap routes and a set of counterparties are required to enter the next round"
    );
  }

  // EXIT POSITION DATA
  const { swapInfo: exitSwapInfo, fallback: exitFallbackSwapInfo } =
    evaluateExitPositionData();

  // ENTER POSITION DATA
  const {
    swapInfo: enterSwapInfo,
    potionBuyInfo,
    fallback: enterFallbackSwapInfo,
  } = await evaluateEnterPositionData(blockTimestamp.value);

  console.log("NEXT ROUND");
  console.table([
    {
      enterSwapInfo,
      potionBuyInfo,
      exitSwapInfo,
      enterFallbackSwapInfo,
      exitFallbackSwapInfo,
      sizeInPotions: formatUnits(potionBuyInfo.totalSizeInPotions.toString()),
    },
  ]);

  await vaultEnterNextRound(
    enterSwapInfo,
    potionBuyInfo,
    exitSwapInfo,
    enterFallbackSwapInfo,
    exitFallbackSwapInfo
  );
};

const callbackLoadRoutes = async () => {
  await Promise.all([
    loadEnterPositionRoute(premiumSlippage.value, swapSlippage.value),
    loadExitPositionRoute(swapSlippage.value),
  ]);
  rerunRequired.value = false;
};

const addOraclePolling = (address: string | null) => {
  stopPolling();
  if (address) {
    startPolling(address);
  }
};

watch(vaultStatus, async () => {
  await Promise.all([getStrategyInfo(), fetchCanEnterNextRound()]);

  await Promise.all([getCurrentPayout(assetAddress.value), getTotalAssets()]);

  getTotalSupply();
  getShareBalance(roundsOutputVault as string);
});

watch(assetAddress, async (address) => {
  if (!address) return;

  addOraclePolling(address);

  await Promise.all([getTotalPayoutInUSDC(), getCurrentPayout(address)]);
});

// Tab navigation
const currentFormStep = ref(0);
const tabs = ref([
  {
    title: t("enter_position"),
    subtitle: "",
    isValid: hasCounterparties,
    enabled: true,
  },
  {
    title: t("exit_position"),
    subtitle: "",
    isValid: true,
    enabled: hasCounterparties,
  },
]);

onMounted(async () => {
  addOraclePolling(unref(assetAddress));
  await getBlock("latest");
});

onBeforeUnmount(stopPolling);

// Toast notifications
const {
  notifications,
  createSimpleNotification,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(nextRoundTx, (transaction) => {
  createTransactionNotification(transaction, t("entering_round"));
});

watch(nextRoundReceipt, (receipt) => {
  createReceiptNotification(receipt, t("round_entered"));
});

watch(polledPrice, ({ newPrice, oldPrice }) => {
  if (
    oldPrice !== undefined &&
    newPrice !== undefined &&
    oldPrice !== newPrice
  ) {
    createSimpleNotification(
      t("new_price"),
      t("price_changed", { token: assetSymbol.value, oldPrice, newPrice })
    );
    const fop = parseFloat(oldPrice);
    const fnp = parseFloat(newPrice);
    const tollerance = (fop * swapSlippage.value) / 100;
    if (fnp < fop - tollerance || fnp > fop + tollerance) {
      createSimpleNotification(t("rerun_router"), t("price_not_in_tollerance"));
      rerunRequired.value = true;
    }
  }
});

// TODO: DELETE
const testAddBlock = async (addHours: number) => {
  const provider = initProvider(false);
  await provider.send("evm_increaseTime", [addHours * 3660]);
  await provider.send("evm_mine", []);
  await getBlock("latest");
};

const { records, loadBuyerRecords } = useBuyerRecords(
  potionBuyAction,
  nextCycleTimestamp
);
const potionAddress = computed(() => records?.value?.[0]?.otoken?.id ?? null);
const setPriceCommand = computed(
  () =>
    `yarn set-price --otoken ${potionAddress.value} --price 500 --network localhost`
);
const copySetPriceCommand = async () => {
  if (potionAddress.value) {
    await navigator.clipboard.writeText(setPriceCommand.value);
  }
};

watch(nextCycleTimestamp, () => {
  loadBuyerRecords();
});

watch(blockTimestamp, async () => {
  await Promise.all([
    getStrategyInfo(),
    getCurrentPayout(assetAddress.value),
    fetchCanEnterNextRound(),
  ]);

  loadBuyerRecords();
});
// END TODO: DELETE
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
        label="totalsupply"
        @click="() => getTotalSupply()"
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
        <div class="flex flex-row items-center gap-4">
          <pre
            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ setPriceCommand }}</pre
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
              :value="hedgingRate.toString()"
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
        </BaseCard>
      </div>
    </div>
    <!-- END FIXED SIDEBAR -->
    <div class="lg:col-span-2">
      <!-- START ENTER NEXT ROUND -->
      <div v-if="canEnterNextRound">
        <div class="flex flex-row justify-end mb-4 w-full">
          <div class="flex flex-row items-start gap-4 justify-end">
            <BaseButton
              palette="primary"
              label="Load data"
              :disabled="isEnterPositionLoading"
              @click="callbackLoadRoutes()"
            >
              <template #pre-icon
                ><i
                  class="i-ph-arrows-clockwise mr-1"
                  :class="isEnterPositionLoading && 'animate-spin'"
                ></i
              ></template>
            </BaseButton>
            <div class="flex flex-col justify-end items-end">
              <BaseButton
                label="enter next round"
                palette="secondary"
                :disabled="
                  !isEnterPositionOperationValid ||
                  !isExitPositionOperationValid
                "
                :loading="nextRoundLoading || isEnterPositionLoading"
                @click="callbackEnterNextRound()"
              ></BaseButton>
              <p
                v-if="
                  !isEnterPositionOperationValid ||
                  !isExitPositionOperationValid
                "
                class="text-secondary-500 text-xs text-right mt-2"
              >
                Data to exit the current position and enter the new one are
                required
              </p>
            </div>
          </div>
        </div>
        <TabNavigationComponent
          title="Enter next round"
          :tabs="tabs"
          :default-index="currentFormStep"
          :show-quit-tabs="false"
          @navigate-tab="(index) => (currentFormStep = index)"
        >
          <BaseCard class="p-6">
            <!-- START ENTER POSITION TAB -->
            <!-- START POTION INFO -->
            <div class="flex flex-col gap-8">
              <div class="flex flex-row justify-between">
                <div v-if="hasCounterparties">
                  <h3 class="text-xl font-bold">Premium</h3>
                  <p>
                    Premium + gas:
                    {{ enterPositionData?.potionRouterData?.premiumGas }}
                  </p>
                  <p>
                    Premium:
                    {{ enterPositionData?.potionRouterData?.premium }}
                  </p>
                </div>
              </div>

              <!-- START COUNTERPARTIES HEADER -->
              <div class="flex flex-row items-center gap-2 mb-4">
                <div
                  class="w-12 h-12 inline-flex items-center justify-center bg-primary-500 text-2xl font-bold rounded-full"
                >
                  <span v-if="hasCounterparties">
                    {{
                      enterPositionData?.potionRouterData?.counterparties.length
                    }}
                  </span>
                  <span v-else-if="isEnterPositionLoading || strategyLoading"
                    ><i class="i-ph-arrows-clockwise animate-spin"></i
                  ></span>
                  <span v-else>no</span>
                </div>
                <h3 class="text-xl font-bold capitalize">
                  {{ counterpartiesText }}
                </h3>
              </div>
              <!-- END COUNTERPARTIES HEADER -->
              <!-- START COUNTERPARTIES LIST -->
              <div v-if="hasCounterparties" class="flex flex-col gap-4">
                <BaseCard
                  v-for="(cp, index) in enterPositionData?.potionRouterData
                    ?.counterparties"
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
              <div v-else-if="isEnterPositionLoading">
                <div class="animate-pulse flex space-x-4">
                  <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-2 bg-slate-700 rounded"></div>
                    <div class="space-y-3">
                      <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                        <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                      </div>
                      <div class="h-2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center">
                <p class="text-white/40 text-3xl uppercase">No result found</p>
              </div>
              <!-- END COUNTERPARTIES LIST -->
            </div>
            <!-- END POTION INFO -->
            <!-- START ENTER UNI ROUTE -->
            <div class="mt-4">
              <!-- START ROUTE HEADER -->
              <div>
                <h1 class="text-xl font-semibold">Uniswap route</h1>
              </div>
              <!-- END ROUTE HEADER -->
              <TokenSwap
                :route-data="enterPositionData?.uniswapRouterData"
                :router-loading="isEnterPositionLoading"
              />
              <h3 class="text-xl font-semibold">Fallback route</h3>
              <TokenSwap
                :route-data="enterPositionData?.fallbackUniswapRouterData"
                :router-loading="isEnterPositionLoading"
              />
            </div>
            <!-- END ENTER UNI ROUTE -->
            <!-- END ENTER POSITION TAB -->
          </BaseCard>

          <BaseCard class="p-6">
            <!-- START EXIT POSITION TAB -->
            <h1 class="text-xl font-semibold">Exit position</h1>
            <hr class="opacity-40 my-4" />
            <h3 class="text-xl font-semibold">Uniswap route</h3>
            <TokenSwap
              :route-data="exitPositionData?.uniswapRouterData"
              :router-loading="isExitPositionLoading"
            />
            <h3 class="text-xl font-semibold">Fallback route</h3>
            <TokenSwap
              :route-data="exitPositionData?.fallbackUniswapRouterData"
              :router-loading="isExitPositionLoading"
            />
            <!-- END EXIT POSITION TAB -->
          </BaseCard>
        </TabNavigationComponent>
      </div>
      <!-- END ENTER NEXT ROUND -->
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
