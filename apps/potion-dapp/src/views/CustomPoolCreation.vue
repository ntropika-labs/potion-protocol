<template>
  <div class="flex items-center gap-4 mb-5">
    <h1 class="text-2xl font-semibold">Create Pool</h1>
    <BaseButton
      label="Cancel"
      palette="flat"
      size="md"
      class="border border-dwhite-400 font-bold uppercase"
      @click="$router.back()"
    ></BaseButton>
  </div>
  <TabNavigationComponent
    :default-index="currentFormStep"
    @navigate-tab="(index) => (currentFormStep = index)"
  >
    <TabComponent title="Pool Setup" :is-valid="liquidityCheck">
      <template #header>
        <i class="i-ph-check-circle-bold text-green-400 ml-2"></i>
      </template>
      <div class="grid grid-cols-12 gap-5">
        <AddLiquidityCard
          v-model.number="liquidity"
          :pool-id="1"
          :user-balance="userCollateralBalance"
          class="col-span-12 md:col-span-4 xl:col-span-3"
        >
          <template #card-footer>
            <BaseButton
              palette="secondary"
              :inline="true"
              :label="t('next')"
              :disabled="!liquidityCheck"
              @click="currentFormStep++"
            >
              <template #post-icon>
                <i class="i-ph-caret-right"></i>
              </template>
            </BaseButton>
          </template>
        </AddLiquidityCard>
        <div class="col-span-12 md:col-span-8 xl:col-span-9">
          <h2 class="text-3xl font-bold">
            Assets you want to sell insurance from this pool.
          </h2>
        </div>
      </div>
    </TabComponent>
    <TabComponent title="Curve Setting"></TabComponent>
    <TabComponent title="Review & Creation"></TabComponent>
  </TabNavigationComponent>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed, watch } from "vue";

import { TabNavigationComponent, TabComponent, BaseButton } from "potion-ui";

const liquidity = ref(100);
const currentFormStep = ref(0);
const { connectedWallet } = useOnboard();
const { t } = useI18n();

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
watch(connectedWallet, async (newAWallet) => {
  if (newAWallet) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    userCollateralBalance.value = 0;
    userAllowance.value = 0;
  }
});
</script>
