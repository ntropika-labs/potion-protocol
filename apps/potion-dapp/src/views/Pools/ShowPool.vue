<script lang="ts" setup>
import { useTokenList } from "@/composables/useTokenList";
import { computed, onMounted, ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useGetPoolByIdQuery } from "subgraph-queries/generated/urql";

import type {
  BondingCurveParams,
  Criteria,
  OptionToken,
  Token,
} from "dapp-types";

import { BaseCard, BaseButton, LabelValue, AssetTag, BaseTag } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { contractsAddresses } from "@/helpers/contracts";
import { hexValue } from "@ethersproject/bytes";

import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { usePoolSnapshots } from "@/composables/useSnapshots";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useCoinGecko } from "@/composables/useCoinGecko";
import { usePoolOtokens } from "@/composables/usePoolRecords";

import CurvesChart from "@/components/CurvesChart.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import UnderlyingList from "potion-ui/src/components/UnderlyingList/UnderlyingList.vue";
import LiquidityCard from "@/components/LiquidityCard.vue";
import OtokenClaimTable from "@/components/OTokenClaimTable/OTokenClaimTable.vue";
import { useNotifications } from "@/composables/useNotifications";

const getTokenFromAddress = (address: string): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol };
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const poolStatus = ref("Active");
const payoutMap = ref<Map<string, number>>(new Map());

const lpId = Array.isArray(route.params.lp)
  ? route.params.lp[0]
  : route.params.lp;
const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());
const poolId = computed(() => {
  const poolId = route.params.id;
  if (Array.isArray(poolId)) {
    return null;
  }
  return parseInt(poolId);
});

const poolIdentifier = computed(() => {
  if (poolId.value !== null && Number.isInteger(poolId.value)) {
    return `${lpId.toLowerCase()}${hexValue(poolId.value)}`;
  }
  return "";
});

const queryVariable = computed(() => {
  return {
    id: poolIdentifier.value,
  };
});

const pauseQuery = computed(() => {
  return !queryVariable.value.id;
});
const { data: poolData } = useGetPoolByIdQuery({
  variables: queryVariable,
  pause: pauseQuery,
});

const { poolOtokens } = usePoolOtokens(poolIdentifier.value);

const {
  chartData,
  fetching: loadingSnapshots,
  executeQuery: fetchPoolSnapshots,
} = usePoolSnapshots(poolIdentifier.value as string);

const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();

const activeOtokens = computed(() =>
  poolOtokens.value.filter(
    ({ otoken }) =>
      !loadingBlock.value && parseInt(otoken.expiry) > blockTimestamp.value
  )
);
const expiredOtokens = computed(() =>
  poolOtokens.value.filter(
    ({ otoken }) =>
      !loadingBlock.value && parseInt(otoken.expiry) <= blockTimestamp.value
  )
);

const performanceChartDataReady = computed(
  () => !loadingSnapshots.value && !loadingBlock.value
);

const pool = computed(() => poolData?.value?.pool);
const template = computed(() => pool.value?.template);
const curve = computed(() => template?.value?.curve);
const criteriaSet = computed(() => template?.value?.criteriaSet);
const criterias = computed<Criteria[]>(
  () =>
    criteriaSet?.value?.criterias?.map(({ criteria }) => ({
      token: getTokenFromAddress(criteria.underlyingAsset.address),
      maxStrike: parseInt(criteria.maxStrikePercent),
      maxDuration: parseInt(criteria.maxDurationInDays),
    })) ?? []
);
const assetsFlat = computed<OptionToken[]>(
  () =>
    criteriaSet?.value?.criterias?.map(({ criteria }) => {
      const token = getTokenFromAddress(criteria.underlyingAsset.address);

      return {
        id: "",
        isPut: false,
        duration: criteria.maxDurationInDays,
        strike: criteria.maxStrikePercent,
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        image: token.image,
      };
    }) ?? []
);
const tokenPricesMap = ref<Map<string, string>>(new Map());

const fetchAssetsPrice = async () => {
  const prices = new Map();
  const addresses =
    criteriaSet?.value?.criterias?.map(
      ({ criteria }) => criteria.underlyingAsset.address
    ) ?? [];

  try {
    const promises = addresses.map(async (address) => {
      const { fetchTokenPrice, formattedPrice } = useCoinGecko(
        undefined,
        address
      );
      await fetchTokenPrice();
      prices.set(address, formattedPrice.value);
    });
    await Promise.allSettled(promises);
  } catch (error) {
    console.error("Error while fetching token prices.");
  }

  return prices;
};

const tokens = computed(() => criterias.value?.map(({ token }) => token) ?? []);
const totalLiquidity = ref(0);
const totalUtilization = computed(() => parseInt(pool?.value?.locked || "0"));
const unutilizedLiquidity = computed(
  () => totalLiquidity.value - totalUtilization.value
);
const utilizationPercentage = computed(() => {
  const totSize = parseInt(pool?.value?.size || "0");

  return (totalUtilization.value * 100) / totSize;
});
const pnlPercentage = computed(() => pool?.value?.pnlPercentage ?? "0");

const bondingCurveParams = computed<BondingCurveParams>(() => {
  return {
    a: parseFloat(curve?.value?.a ?? "0"),
    b: parseFloat(curve?.value?.b ?? "0"),
    c: parseFloat(curve?.value?.c ?? "0"),
    d: parseFloat(curve?.value?.d ?? "0"),
    maxUtil: parseFloat(curve?.value?.maxUtil ?? "0"),
  };
});

const modelDeposit = ref(100),
  modelWithdraw = ref(100);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const { connectedWallet } = useOnboard();
const isNotConnected = computed(() => !connectedWallet.value);
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);

const {
  fetchUserCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
  userCollateralBalance,
  approveForPotionLiquidityPool,
  approveLoading,
  approveTx,
  approveReceipt,
} = useCollateralTokenContract();

const fetchUserData = async () => {
  if (connectedWallet.value) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

onMounted(async () => {
  await fetchUserData();
  tokenPricesMap.value = await fetchAssetsPrice();
  fetchPoolSnapshots();
  await getBlock("latest");
});

watch(walletAddress, async (newAWallet) => {
  if (newAWallet) {
    await fetchUserData();
  } else {
    userAllowance.value = 0;
    userCollateralBalance.value = 0;
  }
});

const amountNeededToApprove = computed(() => {
  if (userAllowance.value === 0) {
    return modelDeposit.value;
  }
  if (modelDeposit.value > userAllowance.value) {
    return parseFloat(
      (modelDeposit.value - userAllowance.value).toPrecision(6)
    );
  }
  return 0;
});

const {
  depositTx,
  depositReceipt,
  deposit,
  depositLoading,
  withdrawTx,
  withdrawReceipt,
  withdraw,
  withdrawLoading,
  getOutstandingSettlements,
  claimCollateral,
  claimCollateralTx,
  claimCollateralReceipt,
} = usePotionLiquidityPoolContract();

watch(poolOtokens, async () => {
  if (poolId.value !== null) {
    const otokens = poolOtokens.value.map(({ otoken }) => otoken.id);
    payoutMap.value = await getOutstandingSettlements(otokens, {
      lp: lpId,
      poolId: poolId.value,
    });
  }
});

const canDeposit = computed(
  () =>
    modelDeposit.value > 0 && modelDeposit.value <= userCollateralBalance.value
);
const handleDeposit = async () => {
  if (canDeposit.value) {
    if (amountNeededToApprove.value > 0) {
      await approveForPotionLiquidityPool(modelDeposit.value, true);
    } else {
      if (poolId.value !== null) {
        await deposit(poolId.value, modelDeposit.value);

        totalLiquidity.value += modelDeposit.value;
      }
    }

    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

const canWithdraw = computed(
  () => unutilizedLiquidity.value >= modelWithdraw.value
);
const handleWithdraw = async () => {
  if (canWithdraw.value) {
    if (poolId.value !== null) {
      await withdraw(poolId.value, modelWithdraw.value);

      totalLiquidity.value -= modelWithdraw.value;
    }

    await fetchUserCollateralBalance();
  }
};

const claimOtoken = async (otokenId: string) => {
  if (poolId.value !== null) {
    claimCollateral(otokenId, [{ lp: lpId, poolId: poolId.value }]);
  }
};

const onEditClick = () =>
  router.push({
    name: "liquidity-provider-pool-edit",
    params: { lp: lpId, id: poolId.value },
  });

const addLiquidityButtonLabel = computed(() => {
  if (amountNeededToApprove.value > 0) {
    return `${t("approve")} USDC`;
  }
  return `${t("add_liquidity")}`;
});

watch(criterias, loadEmergingCurves);
watch(poolData, (data) => {
  totalLiquidity.value = parseInt(data?.pool?.size || "0");
});
watch(totalLiquidity, fetchPoolSnapshots);

/*
 * Toast notifications
 */
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(depositTx, (transaction) =>
  createTransactionNotification(transaction, t("depositing_liquidity"))
);
watch(depositReceipt, (receipt) =>
  createReceiptNotification(receipt, t("liquidity_deposited"))
);
watch(withdrawTx, (transaction) =>
  createTransactionNotification(transaction, t("withdrawing_liquidity"))
);
watch(withdrawReceipt, (receipt) =>
  createReceiptNotification(receipt, t("liquidity_withdrawn"))
);
watch(approveTx, (transaction) =>
  createTransactionNotification(transaction, t("approving_usdc"))
);
watch(approveReceipt, (receipt) =>
  createReceiptNotification(receipt, t("usdc_approved"))
);
watch(claimCollateralTx, (transaction) =>
  createTransactionNotification(transaction, t("claiming_collateral"))
);
watch(claimCollateralReceipt, (receipt) =>
  createReceiptNotification(receipt, t("collateral_claimed"))
);
</script>
<template>
  <div>
    <BaseButton palette="transparent" :label="t('back')" @click="router.back">
      <template #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <!-- Start header -->
    <BaseCard direction="column" class="px-8 py-6 mt-4">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:flex gap-4 justify-between"
      >
        <div>
          <h5 class="mb-2 font-medium">{{ t("status") }}</h5>
          <BaseTag size="xl">
            {{ poolStatus }}
          </BaseTag>
        </div>
        <AssetTag :tokens="tokens" :title="t('assets')" size="xl" />
        <LabelValue
          size="xl"
          :title="t('total_size')"
          :value="totalLiquidity.toString()"
          :symbol="collateral.symbol"
        />
        <LabelValue
          size="xl"
          :title="t('utilization')"
          :value="utilizationPercentage.toString()"
          symbol="%"
        />
        <LabelValue
          size="xl"
          :title="t('pnl')"
          :value="pnlPercentage"
          value-type="pnl"
          symbol="%"
        />
        <div>
          <BaseButton
            palette="secondary-o"
            :label="t('edit')"
            @click="onEditClick"
          ></BaseButton>
        </div>
      </div>
    </BaseCard>
    <!-- End header  -->
    <div class="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-[3fr_1fr]">
      <div class="flex flex-col gap-8">
        <PerformanceCard
          v-if="performanceChartDataReady"
          :performance-data="chartData"
          :today-timestamp="blockTimestamp"
        >
        </PerformanceCard>
        <CurvesChart
          :bonding-curve-params="bondingCurveParams"
          :emerging-curves="emergingCurves"
        />
        <UnderlyingList
          :assets-flat="assetsFlat"
          :stable-coin-collateral="collateral.symbol"
          :price-map="tokenPricesMap"
        ></UnderlyingList>
        <OtokenClaimTable
          :active-otokens="activeOtokens"
          :expired-otokens="expiredOtokens"
          :underlyings="assetsFlat"
          :price-map="tokenPricesMap"
          :payout-map="payoutMap"
          @otoken-claimed="claimOtoken"
        ></OtokenClaimTable>
      </div>
      <div class="self-start">
        <LiquidityCard
          v-model:current-deposit.number="modelDeposit"
          v-model:current-withdraw.number="modelWithdraw"
          :total-liquidity="totalLiquidity"
          :user-balance="userCollateralBalance"
          :utilized-liquidity="totalUtilization"
          :show-withdraw="true"
        >
          <template #withdraw-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="t('withdraw')"
              :disabled="
                !canWithdraw ||
                isNotConnected ||
                depositLoading ||
                approveLoading ||
                withdrawLoading
              "
              :loading="depositLoading || withdrawLoading || approveLoading"
              @click="handleWithdraw"
            >
              <template #pre-icon>
                <i class="i-ph-download-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
          <template #deposit-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="addLiquidityButtonLabel"
              :disabled="
                !canDeposit ||
                isNotConnected ||
                depositLoading ||
                approveLoading ||
                withdrawLoading
              "
              :loading="depositLoading || withdrawLoading || approveLoading"
              @click="handleDeposit"
            >
              <template #pre-icon>
                <i class="i-ph-upload-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
        </LiquidityCard>
      </div>
    </div>
  </div>
  <NotificationDisplay :toasts="notifications" @hide-toast="removeToast">
  </NotificationDisplay>
</template>
