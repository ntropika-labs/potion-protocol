<template>
  <CustomPoolNavigation v-model="currentSelectedTab" :tabs="tabs" />
  <KeepAlive>
    <component
      :is="selectedComponent.component"
      v-model.number="computedModel"
      v-bind="selectedComponent.props"
    ></component>
  </KeepAlive>
</template>
<script lang="ts" setup>
import CustomPoolNavigation from "@/components/CustomPool/CustomPoolNavigation.vue";
// import { useI18n } from "vue-i18n";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed, watch } from "vue";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import CreatePool from "@/components/CustomPool/CreatePool.vue";

const { connectedWallet } = useOnboard();
// const { t } = useI18n();

/* Setup data validation */
const liquidity = ref(100);
const curve = ref({ a: 0, b: 0, c: 0, maxUtil: 0 });

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  // fetchUserCollateralBalanceLoading,
  fetchUserCollateralAllowance,
  userAllowance,
  // fetchUserAllowanceLoading,
  // approveForPotionLiquidityPool,
  // approveLoading,
} = useCollateralToken();

const liquidityCheck = computed(() => {
  if (userCollateralBalance.value >= liquidity.value && liquidity.value > 0) {
    return true;
  } else {
    return false;
  }
});

/* This will be needed for the last step*/

// const amountNeededToApprove = computed(() => {
//   if (userAllowance.value === 0) {
//     return liquidity.value;
//   }
//   if (liquidity.value > userAllowance.value) {
//     return liquidity.value - userAllowance.value;
//   }
//   return 0;
// });

/* this needs to be expanded with the 3 steps checks */

// const readyToDeploy = computed(() => {
//   if (liquidityCheck.value) {
//     return true;
//   } else {
//     return false;
//   }
// });

/* Setup navigation logic */

const currentSelectedTab = ref<"PoolSetup" | "CurveSetup" | "CreatePool">(
  "PoolSetup"
);
const selectedComponent = computed(() => {
  if (currentSelectedTab.value === "PoolSetup") {
    return {
      component: PoolSetup,
      props: {
        // liquidity: liquidity.value,
        liquidityCheck: liquidityCheck.value,
        userCollateralBalance: userCollateralBalance.value,
      },
    };
  }
  if (currentSelectedTab.value === "CurveSetup") {
    return { component: CurveSetup };
  }
  if (currentSelectedTab.value === "CreatePool") {
    return { component: CreatePool };
  }
  return { component: PoolSetup };
});

const computedModel = computed({
  get() {
    if (currentSelectedTab.value === "PoolSetup") {
      return liquidity.value;
    }
    if (currentSelectedTab.value === "CurveSetup") {
      return curve.value;
    }
    return liquidity.value;
  },
  set(newValue: any) {
    if (currentSelectedTab.value === "PoolSetup") {
      liquidity.value = newValue;
    }
    if (currentSelectedTab.value === "CurveSetup") {
      curve.value = newValue;
    }
  },
});

const tabs = [
  {
    title: "Pool Setup",
    subtitle: "Choose one or more assets this pool will insure",
    componentName: "PoolSetup",
    isValid: liquidityCheck,
  },
  {
    title: "Curve Setup",
    subtitle:
      "Curve the pool will use to determine sell prices, as a function of your pool utilization.",
    componentName: "CurveSetup",
    isValid: false,
  },
  {
    title: "Review and Create",
    subtitle: "Review your choices before creating the pool on chain.",
    componentName: "CreatePool",
    isValid: false,
  },
];

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