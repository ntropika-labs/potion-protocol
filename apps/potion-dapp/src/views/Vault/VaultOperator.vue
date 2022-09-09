<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { formatUnits } from "@ethersproject/units";
import { createValidExpiry } from "@/helpers/time";
import {
  AssetTag,
  BaseButton,
  BaseCard,
  BaseTag,
  LabelValue,
  TimeTag,
} from "potion-ui";
import { LifecycleStates } from "hedging-vault-sdk";

import { useHedgingVaultOperatorHelperContract } from "@/composables/useHedgingVaultOperatorHelperContract";
import { useNotifications } from "@/composables/useNotifications";
// import { useCoinGecko } from "@/composables/useCoinGecko";
import { useDepthRouter } from "@/composables/useDepthRouter";
import { useBlockNative } from "@/composables/useBlockNative";

import NotificationDisplay from "@/components/NotificationDisplay.vue";
import TokenSwap from "@/components/TokenSwap/TokenSwap.vue";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";

import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
import { contractsAddresses as coreContractsAddresses } from "@/helpers/contracts";
import { useEthersProvider } from "@/composables/useEthersProvider";

import { useOtokenFactory } from "@/composables/useOtokenFactory";
import { useBuyerRecords } from "@/composables/useBuyerRecords";
import { useRouteVaultIdentifier } from "@/composables/useRouteVaultIdentifier";
import { useVaultOperatorCalculations } from "@/composables/useVaultOperatorCalculations";
import { useVaultOperatorActions } from "@/composables/useVaultOperatorActions";

const TabNavigationComponent = defineAsyncComponent(
  () =>
    import(
      "potion-ui/src/components/TabNavigationComponent/TabNavigationComponent.vue"
    )
);

const IS_DEV_ENV = import.meta.env;

const { t } = useI18n();
const router = useRouter();

const route = useRoute();
const { vaultId } = useRouteVaultIdentifier(route.params);

const { blockTimestamp, getBlock, initProvider } = useEthersProvider();
const { getGas, gasPrice } = useBlockNative();

const { principalPercentages, vaultStatus } = useInvestmentVaultContract(
  vaultId,
  true,
  true
);

const principalPercentage = computed(() =>
  principalPercentages.value && principalPercentages.value.length
    ? principalPercentages.value[0]
    : 0
);

const { vaultName, assetSymbol, assetAddress, totalAssets, tokenAsset } =
  useErc4626Contract(vaultId, true, true);

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
  fetchCanPositionBeEntered,
  fetchCanPositionBeExited,
} = useHedgingVaultOperatorHelperContract();

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

const { oraclePrice, strikePrice, orderSize, numberOfOtokensToBuyBN } =
  useVaultOperatorCalculations(
    assetAddress,
    strikePercentage,
    principalPercentage,
    totalAssets
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
  getPoolsFromCriterias,
  routerParams: potionRouterParameters,
} = useDepthRouter(
  criteriasParam,
  orderSize,
  strikePrice,
  gasPrice,
  oraclePrice,
  false
);

const {
  //uniswapRouterResult,
  enterPositionData,
  exitPositionData,
  isActionLoading,
  hasCounterparties,
  isEnterPositionOperationValid,
  isExitPositionOperationValid,
  loadEnterPositionRoute,
  loadExitPositionRoute,
  evaluateEnterPositionData,
  evaluateExitPositionData,
} = useVaultOperatorActions(currentPayout);

const counterpartiesText = computed(() => {
  return enterPositionData.value &&
    enterPositionData.value.potionRouterResult.counterparties.length > 1
    ? t("counterparties")
    : t("counterparty");
});

const { getTargetOtokenAddress } = useOtokenFactory();

const enterPosition = async () => {
  if (!isEnterPositionOperationValid.value) {
    throw new Error(
      "A uniswap route and a set of counterparties is required to enter position"
    );
  }

  const expirationTimestamp = createValidExpiry(
    blockTimestamp.value,
    cycleDurationDays.value
  );
  const newOtokenAddress = await getTargetOtokenAddress(
    tokenAsset.value.address,
    coreContractsAddresses.USDC.address,
    coreContractsAddresses.USDC.address,
    strikePrice.value,
    expirationTimestamp,
    true
  );

  const { swapInfo, potionBuyInfo } = evaluateEnterPositionData(
    tokenAsset,
    oraclePrice,
    strikePrice,
    numberOfOtokensToBuyBN,
    newOtokenAddress,
    expirationTimestamp
  );

  await vaultEnterPosition(swapInfo, potionBuyInfo);
};

const exitPosition = async () => {
  const swapData = evaluateExitPositionData(tokenAsset, oraclePrice);
  await vaultExitPosition(swapData);
};

const callbackLoadEnterRoute = async () => {
  await loadEnterPositionRoute(
    potionRouterParameters,
    tokenAsset,
    premiumSlippage,
    swapSlippage
  );
};

const callbackLoadExitRoute = async () => {
  await loadExitPositionRoute(tokenAsset, swapSlippage);
};

watch(vaultStatus, async () => {
  await Promise.all([fetchCanPositionBeEntered(), fetchCanPositionBeExited()]);

  await getStrategyInfo();
});

watch(assetAddress, async (address) => {
  if (!address) return;

  await getCurrentPayout(address);
  await getPoolsFromCriterias();
});

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
    isValid: true,
    enabled: hasCounterparties,
  },
]);

onMounted(async () => {
  await Promise.all([getGas(), getBlock("latest")]);
});

// Toast notifications
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(enterPositionTx, (transaction) => {
  createTransactionNotification(transaction, t("entering_position"));
});

watch(enterPositionReceipt, (receipt) => {
  createReceiptNotification(receipt, t("position_entered"));
});

watch(exitPositionTx, (transaction) => {
  createTransactionNotification(transaction, t("exiting_position"));
});

watch(exitPositionReceipt, (receipt) => {
  createReceiptNotification(receipt, t("position_exited"));
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

const { records, loadBuyerRecords } = useBuyerRecords(
  contractsAddresses["PotionBuyAction"].address,
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

watch(blockTimestamp, () => {
  getStrategyInfo();
  fetchCanPositionBeEntered();
  fetchCanPositionBeExited();
});
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
          <BaseButton
            palette="primary"
            label="TEST load enter"
            @click="() => callbackLoadEnterRoute()"
          >
            <template #pre-icon>
              <i class="i-ph-test-tube-fill"></i>
            </template>
          </BaseButton>
        </div>
      </div>
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
                <div v-if="hasCounterparties">
                  <h3 class="text-xl font-bold">Premium</h3>
                  <p>
                    Premium + gas:
                    {{ enterPositionData?.potionRouterResult?.premiumGas }}
                  </p>
                  <p>
                    Premium:
                    {{ enterPositionData?.potionRouterResult?.premium }}
                  </p>
                </div>
                <div v-else class="text-center">
                  <p class="text-white/40 uppercase">No result found</p>
                </div>
                <div>
                  <BaseButton
                    :label="t('counterparties')"
                    :disabled="isActionLoading"
                    @click="loadCounterparties()"
                  >
                    <template #pre-icon
                      ><i
                        class="i-ph-arrows-clockwise mr-1"
                        :class="isActionLoading && 'animate-spin'"
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
                    <span v-if="hasCounterparties">
                      {{
                        enterPositionData?.potionRouterResult?.counterparties
                          .length
                      }}
                    </span>
                    <span v-else-if="isActionLoading || strategyLoading"
                      ><i class="i-ph-arrows-clockwise animate-spin"></i
                    ></span>
                    <span v-else>no</span>
                  </div>
                  <h3 class="text-xl font-bold capitalize">
                    {{ counterpartiesText }}
                  </h3>
                </div>
                <div v-if="hasCounterparties" class="flex flex-col gap-4">
                  <BaseCard
                    v-for="(cp, index) in enterPositionData?.potionRouterResult
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
                <div v-else-if="isActionLoading">
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
                  :disabled="isActionLoading || enterPositionLoading"
                  @click="callbackLoadEnterRoute()"
                >
                  <template #pre-icon>
                    <i
                      class="i-ph-arrows-clockwise mr-1"
                      :class="isActionLoading && 'animate-spin'"
                    ></i>
                  </template>
                </BaseButton>
              </div>
              <div class="flex flex-col items-end">
                <BaseButton
                  label="enter position"
                  palette="secondary"
                  :disabled="!isEnterPositionOperationValid || isActionLoading"
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
              :route-data="enterPositionData?.uniswapRouterResult"
              :router-loading="isActionLoading"
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
              :disabled="isActionLoading || exitPositionLoading"
              @click="callbackLoadExitRoute()"
            >
              <template #pre-icon>
                <i
                  class="i-ph-arrows-clockwise mr-1"
                  :class="isActionLoading && 'animate-spin'"
                ></i> </template
            ></BaseButton>
          </div>
          <div class="flex flex-col items-end">
            <BaseButton
              label="exit position"
              palette="secondary"
              :disabled="
                !isExitPositionOperationValid ||
                isActionLoading ||
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
          :route-data="exitPositionData"
          :router-loading="isActionLoading"
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
