<template>
  <template v-if="!fetching && pool">
    <PoolSetup
      v-model:liquidity.number="liquidity"
      :size="parseFloat(pool.size)"
      :liquidity-title="t('add_more_liquidity')"
      :liquidity-check="true"
      :user-collateral-balance="userCollateralBalance"
      :available-tokens="availableTokens"
      :criteria-map="criteriaMap"
      :token-prices="tokenPricesMap"
      :pool-id="poolId ?? 0"
      :disable-navigation="false"
      :min="0"
      @token-selected="toggleTokenSelection"
      @token-remove="toggleTokenSelection"
      @update:criteria="updateCriteria"
      @valid-input="validInput = $event"
    >
      <BaseButton
        test-next
        class="uppercase"
        palette="plain"
        :inline="true"
        :label="t('back')"
        @click="
          router.push(
            `/liquidity-provider/${route.params.lp}/${route.params.id}`
          )
        "
      >
      </BaseButton>
      <BaseButton
        test-next
        palette="secondary"
        :inline="true"
        :label="deployLabel"
        :disabled="!canEdit || isLoading"
        :loading="isLoading"
        @click="handleDeployPool"
      >
      </BaseButton>
    </PoolSetup>
    <div class="grid grid-cols-12 justify-end gap-5 mt-6">
      <CurveSetup
        v-model="bondingCurve"
        :has-pool-settings="false"
        :emerging-curves="emergingCurves"
        :unselected-tokens="unselectedTokens"
        class="col-span-12 md:col-span-8 xl:col-span-9 col-start-1 md:col-start-5 xl:col-start-4"
      />
    </div>
    <NotificationDisplay
      :toasts="notifications"
      @hide-toast="(index) => removeToast(index)"
    >
    </NotificationDisplay>
  </template>
  <template v-else-if="error"> Can't load the pool </template>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { watchDebounced } from "@vueuse/core";

import { BaseButton } from "potion-ui";

import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";

import { contractsAddresses } from "@/helpers/contracts";

import { useBondingCurves } from "@/composables/useBondingCurves";
import { useCriterias } from "@/composables/useCriterias";
import { useDeployPool } from "@/composables/useDeployPool";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useLiquidity } from "@/composables/useLiquidity";
import { useNotifications } from "@/composables/useNotifications";
import { usePool } from "@/composables/usePool";
import { useRoutePoolId } from "@/composables/useRoutePoolId";
import { usePoolTokens } from "@/composables/usePoolTokens";
import { useUserData } from "@/composables/useUserData";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

/*
 * Data setup
 */
const collateral: string = contractsAddresses.USDC.address.toLowerCase();
const { userCollateralBalance } = useUserData();
const { poolId, id, validPoolId } = useRoutePoolId(route.params);
const {
  pool,
  curve,
  criterias: templateCriterias,
  fetching,
  error,
} = usePool(id);
const { liquidity, validInput, validLiquidity } = useLiquidity(
  0,
  userCollateralBalance,
  -1
);

const { availableTokens, tokenPricesMap, unselectedTokens, toggleToken } =
  usePoolTokens(collateral);
const {
  criteriaMap,
  criterias,
  validCriterias,
  updateCriteria,
  deleteCriteria,
} = useCriterias(availableTokens);

const { bondingCurve, validCurve, setBondingCurve } = useBondingCurves();
const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const toggleTokenSelection = (tokenAddress: string) => {
  deleteCriteria(tokenAddress);
  toggleToken(tokenAddress);
};

/*
 * load the already existing criteriaSet and curve
 */
watch(curve, () => {
  if (curve.value) {
    setBondingCurve(
      curve.value.a,
      curve.value.b,
      curve.value.c,
      curve.value.d,
      curve.value.maxUtil
    );
  }
});

watch([availableTokens, templateCriterias], () => {
  if (availableTokens.value.length > 0) {
    templateCriterias.value.forEach((criteria) => {
      const token = availableTokens.value.find(
        (token) => token.address === criteria.token.address
      );
      if (token) {
        toggleTokenSelection(token.address);
        updateCriteria(token.address, criteria.maxStrike, criteria.maxDuration);
      }
    });
  }
});

// Run the router to retrieve the emergingCurves
watchDebounced(criterias, loadEmergingCurves);

/*
 * Pool deployment data and functions
 */
const {
  deployLabel,
  handleDeployPool,
  approveDeployPoolTx,
  approveDeployPoolLoading,
  approveDeployPoolReceipt,
  deployPoolTx,
  deployPoolReceipt,
  deployPoolLoading,
} = useDeployPool(
  poolId,
  liquidity,
  bondingCurve,
  criterias,
  `${t("approve")} USDC`,
  t("edit")
);

/*
 * Guarding and loading
 */
const canEdit = computed(
  () =>
    validPoolId.value &&
    validCriterias.value &&
    validLiquidity.value &&
    validCurve.value
);
const isLoading = computed(
  () => deployPoolLoading.value || approveDeployPoolLoading.value
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
