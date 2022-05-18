<template>
  <div class="grid grid-cols-12">
    <AddLiquidityCard
      v-model.number="liquidity"
      :pool-id="1"
      :user-balance="userCollateralBalance"
      class="col-span-12 md:col-span-4 xl:col-span-3"
    >
      <BaseButton
        size="sm"
        palette="secondary"
        :inline="true"
        :label="t('next')"
      />
    </AddLiquidityCard>
    <div></div>
  </div>
</template>
<script lang="ts" setup>
import { BaseButton } from "potion-ui";
import { useI18n } from "vue-i18n";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed } from "vue";
const { t } = useI18n();
const liquidity = ref(100);
const { connectedWallet } = useOnboard();

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  fetchUserCollateralBalanceLoading,
  fetchUserCollateralAllowance,
  userAllowance,
  fetchUserAllowanceLoading,
  approveForPotionLiquidityPool,
  approveLoading,
} = useCollateralToken();

const liquidityCheck = computed(() => {
  if (userCollateralBalance.value >= liquidity.value && liquidity.value > 0) {
    return true;
  } else {
    return false;
  }
});

const amountNeededToApprove = computed(() => {
  if (userAllowance.value === 0) {
    return liquidity.value;
  }
  if (liquidity.value > userAllowance.value) {
    return liquidity.value - userAllowance.value;
  }
  return 0;
});

// this needs to be expanded with the underlying and curve checks
const readyToDeploy = computed(() => {
  if (liquidityCheck.value) {
    return true;
  } else {
    return false;
  }
});

console.log(
  fetchUserCollateralBalanceLoading,
  fetchUserAllowanceLoading,
  approveForPotionLiquidityPool,
  approveLoading,
  amountNeededToApprove,
  readyToDeploy
);
onMounted(async () => {
  if (connectedWallet.value) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
});
</script>
