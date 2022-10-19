<template>
  <TabNavigationComponent
    title="Create Pool"
    :tabs="tabs"
    :default-index="currentFormStep"
    :show-quit-tabs="true"
    @navigate-tab="(index) => (currentFormStep = index)"
    @quit-tabs="router.push('/templates')"
  >
    <PoolSetup
      v-model:liquidity.number="liquidity"
      :liquidity-title="t('total_liquidity')"
      :liquidity-check="validLiquidity"
      :user-collateral-balance="userCollateralBalance"
      :available-tokens="availableTokens"
      :token-prices="tokenPricesMap"
      :pool-id="poolId"
      :disable-navigation="!validCriterias"
      @token-selected="toggleTokenSelection"
      @token-remove="toggleTokenSelection"
      @update:criteria="updateCriteria"
      @navigate:next="currentFormStep = 1"
      @valid-input="validInput = $event"
    >
      <BaseButton
        test-next
        palette="secondary"
        :inline="true"
        :label="t('next')"
        :disabled="!validCriterias"
        @click="currentFormStep = 1"
      >
        <template #post-icon>
          <i class="i-ph-caret-right"></i>
        </template>
      </BaseButton>
    </PoolSetup>
    <CurveSetup
      v-model="bondingCurve"
      :criterias="criterias"
      :disable-navigation-next="!validCriterias"
      :emerging-curves="emergingCurves"
      :liquidity="currencyFormatter(liquidity, 'USDC')"
      :pool-id="poolId"
      :unselected-tokens="unselectedTokens"
      :navigate-next-label="t('next')"
      @activated="loadEmergingCurves"
      @navigate:back="currentFormStep = 0"
      @navigate:next="currentFormStep = 2"
    ></CurveSetup>
    <CreatePool
      :emerging-curves="emergingCurves"
      :unselected-tokens="unselectedTokens"
      :transaction="deployPoolTx"
      :receipt="deployPoolReceipt"
      :action-label="deployLabel"
      :liquidity="currencyFormatter(liquidity, 'USDC')"
      :pool-id="poolId"
      :criterias="criterias"
      :disable-action="!readyToDeploy"
      :action-loading="deployPoolLoading"
      :bonding-curve-params="bondingCurve"
      @deploy-pool="handleDeployPool"
      @navigate:back="currentFormStep = 1"
    />
  </TabNavigationComponent>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="removeToast"
  ></NotificationDisplay>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import {
  currencyFormatter,
  BaseButton,
  TabNavigationComponent,
} from "potion-ui";

import { contractsAddresses } from "@/helpers/contracts";

import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import CreatePool from "@/components/CustomPool/CreatePool.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { useBondingCurves } from "@/composables/useBondingCurves";
import { useCriterias } from "@/composables/useCriterias";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useNextPoolId } from "@/composables/useNextPoolId";
import { useNotifications } from "@/composables/useNotifications";
import { usePoolTokens } from "@/composables/usePoolTokens";
import { useDeployPool } from "@/composables/useDeployPool";
import { useLiquidity } from "@/composables/useLiquidity";
import { useUserDataStore } from "@/stores/useUserDataStore";

const { t } = useI18n();
const router = useRouter();

/*
 * Data setup
 */
const collateral: string = contractsAddresses.USDC.address.toLowerCase();
const { walletAddress, userCollateralBalance, approveTx, approveReceipt } =
  storeToRefs(useUserDataStore());
const { liquidity, validInput, validLiquidity } = useLiquidity(
  100,
  userCollateralBalance
);
const { availableTokens, tokenPricesMap, unselectedTokens, toggleToken } =
  usePoolTokens(collateral);
const { criterias, validCriterias, updateCriteria, deleteCriteria } =
  useCriterias(availableTokens);
const { bondingCurve, validCurve } = useBondingCurves();
const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const toggleTokenSelection = (tokenAddress: string) => {
  deleteCriteria(tokenAddress);
  toggleToken(tokenAddress);
};
/*
 * Pool deployment data and functions
 */
const { poolId } = useNextPoolId(walletAddress);
const {
  deployLabel,
  handleDeployPool,
  isLoading: deployPoolLoading,
  deployPoolTx,
  deployPoolReceipt,
} = useDeployPool(
  poolId,
  liquidity,
  bondingCurve,
  criterias,
  `${t("approve")} USDC`,
  t("create_pool")
);

/*
 * Tab navigation
 */
const liquidityAndCriteriaCheck = computed(
  () => validLiquidity.value && validCriterias.value
);
const canNavigateToDeploy = computed(
  () => validCriterias.value && validCurve.value
);
const readyToDeploy = computed(
  () => validLiquidity.value && canNavigateToDeploy.value
);

const currentFormStep = ref(0);
const tabs = ref([
  {
    title: t("pool_setup"),
    subtitle: t("choose_pool_assets"),
    isValid: liquidityAndCriteriaCheck,
    enabled: true,
  },
  {
    title: t("curve_setup"),
    subtitle: t("choose_pool_curve"),
    isValid: validCurve,
    enabled: validCriterias,
  },
  {
    title: t("review_and_create"),
    subtitle: t("review_your_choices"),
    isValid: readyToDeploy,
    enabled: canNavigateToDeploy,
  },
]);

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

watch(approveTx, (transaction) => {
  createTransactionNotification(transaction, t("approving_usdc"));
});

watch(approveReceipt, (receipt) => {
  createReceiptNotification(receipt, t("usdc_approved"));
});
</script>
