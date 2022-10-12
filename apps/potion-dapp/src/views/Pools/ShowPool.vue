<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import {
  BaseCard,
  BaseButton,
  LabelValue,
  AssetTag,
  BaseTag,
  UnderlyingList,
} from "potion-ui";

import { contractsAddresses } from "@/helpers/contracts";

import CurvesChart from "@/components/CurvesChart.vue";
import LiquidityCard from "@/components/LiquidityCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import OtokenClaimTable from "@/components/OTokenClaimTable/OTokenClaimTable.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";

import { useBondingCurves } from "@/composables/useBondingCurves";
import { useClaimCollateral } from "@/composables/useClaimCollateral";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useCriteriasTokens } from "@/composables/useCriteriasTokens";
import { useDeposit } from "@/composables/useDeposit";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useNotifications } from "@/composables/useNotifications";
import { usePool } from "@/composables/usePool";
import { usePoolLiquidity } from "@/composables/usePoolLiquidity";
import { usePoolOtokens } from "@/composables/usePoolOtokens";
import { useRoutePoolId } from "@/composables/useRoutePoolId";
import { useTokenList } from "@/composables/useTokenList";
import { useUserData } from "@/composables/useUserData";
import { useWithdraw } from "@/composables/useWithdraw";
import type { PerformanceData } from "dapp-types";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const poolStatus = ref("Active");

const { fetchUserData, userAllowance, userCollateralBalance } = useUserData();
const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();

const { poolId, poolLp, id } = useRoutePoolId(route.params);
const { pool, curve, criterias, fetching, error, dailyData } = usePool(id);

const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const { activeOtokens, expiredOtokens, payoutMap } = usePoolOtokens(
  id,
  poolId,
  poolLp
);

const { assets, tokens, tokenPricesMap } = useCriteriasTokens(criterias);

const poolLocked = computed(() => pool?.value?.locked ?? "0");
const poolSize = computed(() => pool?.value?.size ?? "0");
const pnlPercentage = computed(() => pool?.value?.pnlPercentage ?? "0");

const {
  liquidity,
  addLiquidity,
  decreaseLiquidity,
  formattedLiquidity,
  utilization,
  utilizationPercentage,
  unutilizedLiquidity,
} = usePoolLiquidity(poolSize, poolLocked);

const { bondingCurve, setBondingCurve } = useBondingCurves();

watch(curve, () => {
  if (curve?.value) {
    setBondingCurve(
      curve.value.a,
      curve.value.b,
      curve.value.c,
      curve.value.d,
      curve.value.maxUtil
    );
  }
});

const {
  canDeposit,
  deposit,
  depositReceipt,
  depositLoading,
  depositTx,
  depositLabel,
  amount: modelDeposit,
} = useDeposit(poolId, userAllowance, userCollateralBalance);

const handleDeposit = async () => {
  const deposited = await deposit();
  if (deposited) {
    addLiquidity(modelDeposit);
    fetchUserData();
  }
};

const {
  canWithdraw,
  withdraw,
  withdrawReceipt,
  withdrawLoading,
  withdrawTx,
  amount: modelWithdraw,
} = useWithdraw(poolId, unutilizedLiquidity);

const handleWithdraw = async () => {
  const withdrawed = await withdraw();
  if (withdrawed) {
    decreaseLiquidity(modelWithdraw);
    fetchUserData();
  }
};

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);
watch(criterias, loadEmergingCurves);

const { approveLoading, approveTx, approveReceipt } =
  useCollateralTokenContract();

const {
  claimOtoken,
  claimCollateralTx,
  claimCollateralReceipt,
  claimedOtokens,
} = useClaimCollateral(poolId, poolLp);

onMounted(() => getBlock("latest"));

const sessionData = ref<PerformanceData[]>([]);
const chartData = computed(() => dailyData.value.concat(sessionData.value));

watch(liquidity, () => {
  if (!loadingBlock.value) {
    sessionData.value.push({
      timestamp: blockTimestamp.value,
      pnl: parseFloat(pnlPercentage.value),
      liquidity: liquidity.value,
      utilization: parseFloat(utilizationPercentage.value),
    });
  }
});

const onEditClick = () =>
  router.push({
    name: "liquidity-provider-pool-edit",
    params: { lp: poolLp.value, id: poolId.value },
  });

const isLoading = computed(
  () => depositLoading.value || withdrawLoading.value || approveLoading.value
);

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
  <div v-if="fetching">
    {{ t("loading") }}
  </div>
  <div v-else-if="error">
    {{ t("error") }}
  </div>
  <div v-else>
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
          :value="formattedLiquidity"
          :symbol="collateral.symbol"
        />
        <LabelValue
          size="xl"
          :title="t('utilization')"
          :value="utilizationPercentage"
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
    <div class="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-3">
      <div class="flex flex-col gap-8 xl:col-span-2">
        <PerformanceCard
          v-if="!loadingBlock"
          :performance-data="chartData"
          :today-timestamp="blockTimestamp"
        >
        </PerformanceCard>
        <CurvesChart
          :bonding-curve-params="bondingCurve"
          :emerging-curves="emergingCurves"
        />
        <UnderlyingList
          :assets-flat="assets"
          :stable-coin-collateral="collateral.symbol"
          :price-map="tokenPricesMap"
        >
        </UnderlyingList>
        <OtokenClaimTable
          :active-otokens="activeOtokens"
          :expired-otokens="expiredOtokens"
          :underlyings="assets"
          :price-map="tokenPricesMap"
          :payout-map="payoutMap"
          :claimed-otokens="claimedOtokens"
          @otoken-claimed="claimOtoken"
        ></OtokenClaimTable>
      </div>
      <div class="self-start">
        <LiquidityCard
          v-model:current-deposit.number="modelDeposit"
          v-model:current-withdraw.number="modelWithdraw"
          :total-liquidity="liquidity"
          :user-balance="userCollateralBalance"
          :utilized-liquidity="utilization"
          :show-withdraw="true"
        >
          <template #withdraw-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="t('withdraw')"
              :disabled="!canWithdraw || isLoading"
              :loading="isLoading"
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
              :label="depositLabel"
              :disabled="!canDeposit || isLoading"
              :loading="isLoading"
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
