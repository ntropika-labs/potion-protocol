<template>
  <TabNavigationComponent
    title="Create Pool"
    :tabs="tabs"
    :default-index="currentFormStep"
    @navigate-tab="(index) => (currentFormStep = index)"
  >
    <PoolSetup
      v-model:liquidity.number="liquidity"
      :liquidity-check="liquidityCheck"
      :user-collateral-balance="userCollateralBalance"
      :available-underlyings="availableUnderlyings"
      @underlying-selected="toggleUnderlyingSelection"
      @update:criteria="updateCriteria"
    />
    <div></div>
    <div></div>
  </TabNavigationComponent>
</template>
<script lang="ts" setup>
//import CustomPoolNavigation from "@/components/CustomPool/CustomPoolNavigation.vue";
// import { useI18n } from "vue-i18n";
import type { Criteria, SelectableToken } from "@/types";
import { useCollateralToken } from "@/composables/useCollateralToken";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed, watch } from "vue";
import { contractsAddresses } from "@/helpers/contracts";
import { useTokenList } from "@/composables/useTokenList";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
// import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
// import CreatePool from "@/components/CustomPool/CreatePool.vue";
import { TabNavigationComponent } from "potion-ui";
import { useAllCollateralizedProductsUnderlyingQuery } from "subgraph-queries/generated/urql";

const collateral = contractsAddresses.PotionTestUSD.address.toLowerCase();
const { data } = useAllCollateralizedProductsUnderlyingQuery({
  variables: { collateral },
});
const availableUnderlyings = ref<SelectableToken[]>([]);

const tokenToUnderlying = (
  address: string,
  decimals = 18,
  selected = false
) => {
  const { name, symbol, image } = useTokenList(address);
  return {
    address,
    decimals,
    name,
    symbol,
    image,
    selected,
  };
};

watch(data, () => {
  availableUnderlyings.value =
    data?.value?.products?.map((product) =>
      tokenToUnderlying(
        product.underlying.address,
        parseInt(product.underlying.decimals)
      )
    ) ?? [];
});

const toggleUnderlyingSelection = (address: string) => {
  const underlying = availableUnderlyings.value.find(
    (u) => u.address === address
  );
  if (underlying) {
    underlying.selected = !underlying.selected;
  }
};

const criteriaMap = new Map<string, Criteria>();

const updateCriteria = (criteria: Criteria) =>
  criteriaMap.set(criteria.tokenAddress, criteria);

const { connectedWallet } = useOnboard();
// const { t } = useI18n();

/* Setup data validation */
const liquidity = ref(100);
//const curve = ref({ a: 0, b: 0, c: 0, maxUtil: 0 });

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
  // fetchUserAllowanceLoading,
  // approveForPotionLiquidityPool,
  // approveLoading,
} = useCollateralToken();

const liquidityCheck = computed(
  () => userCollateralBalance.value >= liquidity.value && liquidity.value > 0
);

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

const currentFormStep = ref(0);
const tabs = ref([
  {
    title: "Pool Setup",
    subtitle: "Choose one or more assets this pool will insure",
    isValid: liquidityCheck,
  },
  {
    title: "Curve Setup",
    subtitle:
      "Curve the pool will use to determine sell prices, as a function of your pool utilization.",
    isValid: false,
  },
  {
    title: "Review and Create",
    subtitle: "Review your choices before creating the pool on chain.",
    isValid: false,
  },
]);

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
