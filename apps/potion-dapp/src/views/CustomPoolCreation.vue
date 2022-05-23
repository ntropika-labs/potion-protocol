<template>
  <TabNavigationComponent
    title="Create Pool"
    :tabs="tabs"
    :default-index="currentFormStep"
    @navigate-tab="(index) => (currentFormStep = index)"
    @quit-tabs="router.push('/pools')"
  >
    <PoolSetup
      v-model:liquidity.number="liquidity"
      :liquidity-check="liquidityCheck"
      :user-collateral-balance="userCollateralBalance"
      :available-tokens="availableTokens"
      :token-prices="tokenPricesMap"
      @token-selected="toggleTokenSelection"
      @token-remove="toggleTokenSelection"
      @update:criteria="updateCriteria"
      @navigate:next="currentFormStep = 1"
    />
    <CurveSetup v-model="bondingCurve" :criterias="criterias"></CurveSetup>
    <div></div>
  </TabNavigationComponent>
</template>
<script lang="ts" setup>
//import CustomPoolNavigation from "@/components/CustomPool/CustomPoolNavigation.vue";
// import { useI18n } from "vue-i18n";
import type {
  ApiTokenPrice,
  SelectableToken,
  Token,
  BondingCurveParams,
  Criteria,
} from "dapp-types";

import { useCollateralToken } from "@/composables/useCollateralToken";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed, watch } from "vue";
import { contractsAddresses } from "@/helpers/contracts";
import { useTokenList } from "@/composables/useTokenList";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
// import CreatePool from "@/components/CustomPool/CreatePool.vue";
import { TabNavigationComponent } from "potion-ui";
import { useAllCollateralizedProductsUnderlyingQuery } from "subgraph-queries/generated/urql";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
import { useRouter } from "vue-router";

const router = useRouter();
const bondingCurve = ref<BondingCurveParams>({
  a: 2.5,
  b: 2.5,
  c: 2.5,
  d: 2.5,
  maxUtil: 1,
});
const criterias = ref<Array<Criteria>>([]);

const collateral = contractsAddresses.PotionTestUSD.address.toLowerCase();
const { data } = useAllCollateralizedProductsUnderlyingQuery({
  variables: { collateral },
});
const availableTokens = ref<SelectableToken[]>([]);
const criteriaMap = ref(
  new Map<string, { maxStrike: number; maxDuration: number }>()
);
const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());

const tokenToSelectableToken = (
  address: string,
  decimals = 18,
  selected = false
): SelectableToken => {
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
  availableTokens.value =
    data?.value?.products?.map((product) =>
      tokenToSelectableToken(
        product.underlying.address,
        parseInt(product.underlying.decimals)
      )
    ) ?? [];
});

const toggleTokenSelection = (address: string) => {
  const token = availableTokens.value.find((u) => u.address === address);
  if (token) {
    const tokenHasPrice = tokenPricesMap.value.get(token.address)?.success;
    if (!tokenHasPrice) {
      tokenPricesMap.value.set(token.address, {
        loading: true,
        price: 0,
        formattedPrice: "0",
        success: false,
      });
    }

    token.selected = !token.selected;

    if (token.selected) {
      if (!tokenHasPrice) updateTokenPrice(token);
    } else {
      criteriaMap.value.delete(token.address);
    }
  }
};

const updateCriteria = (
  tokenAddress: string,
  maxStrike: number,
  maxDuration: number
) => criteriaMap.value.set(tokenAddress, { maxStrike, maxDuration });

const updateTokenPrice = async (token: Token) => {
  console.log("[updateTokenPrice] for: ", token.name);
  const { success, price, formattedPrice, fetchPrice } = useFetchTokenPrices(
    token.address
  );
  try {
    await fetchPrice();

    console.log(
      "[updateTokenPrice] completed for: ",
      token.name,
      success.value
    );
  } catch (error) {
    console.error(
      "Error while fetching token price. Affected token: " + token.name
    );
  } finally {
    console.log("[updateTokenPrice] running finally ");
    tokenPricesMap.value.set(token.address, {
      loading: false,
      price: price.value,
      formattedPrice: formattedPrice.value,
      success: success.value,
    });
  }
};

watch(
  criteriaMap.value,
  () => {
    const existingCriteria: Array<Criteria> = [];

    for (const entry of criteriaMap.value.entries()) {
      console.log("criteria entry", entry);
      const address = entry[0];
      const strikeAndDuration = entry[1];
      const token = availableTokens.value.find((t) => t.address === address);
      if (token) {
        existingCriteria.push({
          token: token,
          maxStrike: strikeAndDuration?.maxStrike,
          maxDuration: strikeAndDuration?.maxDuration,
        });
      }
    }

    criterias.value = existingCriteria;
  },
  { deep: true }
);

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
    cta: {
      label: "existing pools (test)",
      url: "/pools",
    },
  },
  {
    title: "Curve Setup",
    subtitle:
      "Curve the pool will use to determine sell prices, as a function of your pool utilization.",
    isValid: false,
    cta: {
      externalUrl: true,
      label: "learn more",
      url: "https://google.com",
    },
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
