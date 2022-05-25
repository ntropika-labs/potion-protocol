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
      :pool-id="poolId"
      :disable-navigation="!criteriasCheck"
      @token-selected="toggleTokenSelection"
      @token-remove="toggleTokenSelection"
      @update:criteria="updateCriteria"
      @navigate:next="currentFormStep = 1"
    />
    <CurveSetup
      v-model="bondingCurve"
      :pool-id="poolId"
      :liquidity="currencyFormatter(liquidity, 'USDC')"
      :criterias="criterias"
      :disable-navigation-next="!criteriasCheck"
      :navigate-next-label="t('next')"
      @navigate:back="currentFormStep = 0"
      @navigate:next="currentFormStep = 2"
    ></CurveSetup>
    <CreatePool
      :transaction="depositAndCreateCurveAndCriteriaTx"
      :receipt="depositAndCreateCurveAndCriteriaReceipt"
      :action-label="deployButtonLabel"
      :liquidity="currencyFormatter(liquidity, 'USDC')"
      :pool-id="poolId"
      :criterias="criterias"
      :disable-action="readyToDeploy"
      @deploy-pool="handleDeployPool"
    />
  </TabNavigationComponent>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import type {
  ApiTokenPrice,
  SelectableToken,
  Token,
  BondingCurveParams,
  Criteria,
} from "dapp-types";

import { currencyFormatter } from "potion-ui";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useOnboard } from "@/composables/useOnboard";
import { onMounted, ref, computed, watch } from "vue";
import { contractsAddresses } from "@/helpers/contracts";
import { useTokenList } from "@/composables/useTokenList";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import CreatePool from "@/components/CustomPool/CreatePool.vue";
import { TabNavigationComponent } from "potion-ui";
import {
  useAllCollateralizedProductsUnderlyingQuery,
  useGetNumberOfPoolsFromUserQuery,
} from "subgraph-queries/generated/urql";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
import { useRouter } from "vue-router";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";

const { connectedWallet } = useOnboard();
const walletAddress = ref(connectedWallet.value?.accounts[0].address ?? "");
watch(connectedWallet, () => {
  walletAddress.value = connectedWallet.value?.accounts[0].address ?? "";
});
const { t } = useI18n();

const {
  depositAndCreateCurveAndCriteriaTx,
  depositAndCreateCurveAndCriteriaReceipt,
  depositAndCreateCurveAndCriteria,
} = usePotionLiquidityPoolContract();
const router = useRouter();
const bondingCurve = ref<BondingCurveParams>({
  a: 2.5,
  b: 2.5,
  c: 2.5,
  d: 2.5,
  maxUtil: 1,
});
const collateral: string =
  contractsAddresses.PotionTestUSD.address.toLowerCase();
const { data: availableProducts } = useAllCollateralizedProductsUnderlyingQuery(
  {
    variables: { collateral },
  }
);

const { data: userPools } = useGetNumberOfPoolsFromUserQuery({
  variables: {
    //@ts-expect-error URQL accepts refs, but typings are not correct here?
    lp: walletAddress,
  },
});

const userPoolsCount = computed(() => {
  return userPools?.value?.pools?.length ?? 0;
});

const poolId = computed(() => {
  return userPoolsCount.value + 1;
});
const availableTokens = ref<SelectableToken[]>([]);
const criteriaMap = ref(
  new Map<string, { maxStrike: number; maxDuration: number }>()
);
const selectedCriterias = computed(() => {
  return [...criteriaMap.value].map((criteria) => {
    return {
      tokenAddress: criteria[0],
      maxStrike: criteria[1].maxStrike,
      maxDuration: criteria[1].maxDuration,
    };
  });
});
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

watch(availableProducts, () => {
  availableTokens.value =
    availableProducts?.value?.products?.map((product) =>
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
const criterias = computed(() => {
  const existingCriteria: Array<Criteria> = [];

  for (const entry of criteriaMap.value.entries()) {
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

  return existingCriteria;
});

/* Setup data validation */
const liquidity = ref(100);

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
  // fetchUserAllowanceLoading,
  approveForPotionLiquidityPool,
  // approveLoading,
} = useCollateralTokenContract();

const liquidityCheck = computed(
  () => userCollateralBalance.value >= liquidity.value && liquidity.value > 0
);
const bondingCurveCheck = computed(() => {
  if (
    bondingCurve.value.a > 0 &&
    bondingCurve.value.b > 0 &&
    bondingCurve.value.c > 0 &&
    bondingCurve.value.d > 0 &&
    bondingCurve.value.maxUtil > 0 &&
    bondingCurve.value.maxUtil <= 1
  ) {
    return true;
  }
  return false;
});
const criteriasCheck = computed(() => {
  if (criterias.value.length > 0) {
    return true;
  }
  return false;
});

/* This will be needed for the last step*/

const amountNeededToApprove = computed(() => {
  if (userAllowance.value === 0) {
    return liquidity.value;
  }
  if (liquidity.value > userAllowance.value) {
    return liquidity.value - userAllowance.value;
  }
  return 0;
});

const deployButtonLabel = computed(() => {
  if (amountNeededToApprove.value > 0) {
    return `${t("approve")} USDC`;
  }
  return `${t("create_pool")}`;
});

const handleDeployPool = async () => {
  if (amountNeededToApprove.value > 0) {
    await approveForPotionLiquidityPool(liquidity.value, true);
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    await depositAndCreateCurveAndCriteria(
      poolId.value,
      liquidity.value,
      bondingCurve.value,
      selectedCriterias.value
    );
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

/* Setup navigation logic */

const canNavigateToDeploy = computed(() => {
  if (criteriasCheck.value && bondingCurveCheck.value) {
    return true;
  } else {
    return false;
  }
});

const readyToDeploy = computed(() => {
  if (liquidityCheck.value && bondingCurveCheck.value && criteriasCheck.value) {
    return true;
  } else {
    return false;
  }
});

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
    enabled: true,
  },
  {
    title: "Curve Setup",
    subtitle:
      "Curve the pool will use to determine sell prices, as a function of your pool utilization.",
    isValid: bondingCurveCheck,
    cta: {
      externalUrl: true,
      label: "learn more",
      url: "https://google.com",
    },
    enabled: criteriasCheck,
  },
  {
    title: "Review and Create",
    subtitle: "Review your choices before creating the pool on chain.",
    isValid: readyToDeploy,
    enabled: canNavigateToDeploy,
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
