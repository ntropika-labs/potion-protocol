<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  BaseCard,
  BaseButton,
  LabelValue,
  CreatorTag,
  AssetTag,
} from "potion-ui";

import CurvesChart from "@/components/CurvesChart.vue";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import UnderlyingList from "potion-ui/src/components/UnderlyingList/UnderlyingList.vue";

import { useOnboard } from "@onboard-composable";
import { contractsAddresses } from "@/helpers/contracts";
import { getEtherscanUrl } from "@/helpers/addresses";

import { useTokenList } from "@/composables/useTokenList";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useNotifications } from "@/composables/useNotifications";
import { useCriteriasTokens } from "@/composables/useCriteriasTokens";
import { useUserData } from "@/composables/useUserData";
import { useNextPoolId } from "@/composables/useNextPoolId";
import { useBondingCurves } from "@/composables/useBondingCurves";
import { useRouteTemplateId } from "@/composables/useRouteTemplateId";
import { usePoolTemplate } from "@/composables/usePoolTemplate";
import { useDeployPool } from "@/composables/useDeployPool";
import { useLiquidity } from "@/composables/useLiquidity";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const { walletAddress, userCollateralBalance } = useUserData();

const { templateId } = useRouteTemplateId(route.params);
const { template, curve, criterias, dailyData } = usePoolTemplate(templateId);

const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();
onMounted(() => getBlock("latest"));

const { tokens, assets, tokenPricesMap } = useCriteriasTokens(criterias);

const totalLiquidity = computed(() => template?.value?.size ?? "0");
const timesCloned = computed(() => template?.value?.numPools ?? "0");
const pnlPercentage = computed(() => template?.value?.pnlPercentage ?? "0");
const creatorAddress = computed(() => template?.value?.creator ?? "");

const creator = computed(() => ({
  label: creatorAddress.value,
  icon: undefined,
  link: getEtherscanUrl(creatorAddress.value),
}));

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

const { liquidity, validInput } = useLiquidity(100, userCollateralBalance);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const { connectedWallet } = useOnboard();
const isNotConnected = computed(() => !connectedWallet.value);

const { poolId } = useNextPoolId(walletAddress);

const {
  deployLabel,
  approveDeployPoolTx,
  approveDeployPoolLoading,
  approveDeployPoolReceipt,
  handleDeployPool,
  deployPoolTx,
  deployPoolLoading,
  deployPoolReceipt,
} = useDeployPool(
  poolId,
  liquidity,
  bondingCurve,
  criterias,
  `${t("approve")} USDC`,
  t("add_liquidity")
);

const deployLoading = computed(
  () => approveDeployPoolLoading.value || deployPoolLoading.value
);

watch(criterias, loadEmergingCurves);
/*
 * Toast notifications
 */
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(deployPoolTx, (transaction) => {
  createTransactionNotification(transaction, t("creating_pool"));
});

watch(deployPoolReceipt, (receipt) => {
  createReceiptNotification(receipt, t("pool_created"));
});

watch(approveDeployPoolTx, (transaction) => {
  createTransactionNotification(transaction, t("approving_usdc"));
});

watch(approveDeployPoolReceipt, (receipt) => {
  createReceiptNotification(receipt, t("usdc_approved"));
});
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
        <AssetTag :tokens="tokens" :title="t('assets')" size="xl" />
        <LabelValue
          size="xl"
          :title="t('total_size')"
          :value="totalLiquidity"
          :symbol="collateral.symbol"
        />
        <LabelValue
          size="xl"
          :title="t('cloned')"
          :value="timesCloned"
          :symbol="t('times')"
        />
        <LabelValue
          size="xl"
          :title="t('pnl')"
          :value="pnlPercentage"
          value-type="pnl"
          symbol="%"
        />
        <CreatorTag
          :link="creator?.link"
          :label="creator.label"
          :icon="creator?.icon"
          :with-label="true"
        />
      </div>
    </BaseCard>
    <!-- End header  -->
    <div class="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-3">
      <div class="flex flex-col gap-8 xl:col-span-2">
        <PerformanceCard
          v-if="!loadingBlock"
          :performance-data="dailyData"
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
      </div>
      <BaseCard class="self-start" :full-height="false">
        <AddLiquidityCard
          v-model.number="liquidity"
          :title="t('add_liquidity')"
          :hint="t('add_liquidity_hint')"
          :user-balance="userCollateralBalance"
          class="md:col-span-4 xl:col-span-3 self-start"
          @valid-input="validInput = $event"
        >
          <template #card-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="deployLabel"
              :disabled="isNotConnected || deployLoading"
              :loading="deployLoading"
              @click="handleDeployPool"
            >
              <template #pre-icon>
                <i class="i-ph-upload-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
        </AddLiquidityCard>
      </BaseCard>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
