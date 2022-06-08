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
      @valid-input="validInput = $event"
    >
      <BaseButton
        test-next
        palette="secondary"
        :inline="true"
        :label="t('next')"
        :disabled="!criteriasCheck"
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
      :disable-navigation-next="!criteriasCheck"
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
      :transaction="depositAndCreateCurveAndCriteriaTx"
      :receipt="depositAndCreateCurveAndCriteriaReceipt"
      :action-label="deployButtonLabel"
      :liquidity="currencyFormatter(liquidity, 'USDC')"
      :pool-id="poolId"
      :criterias="criterias"
      :disable-action="!readyToDeploy"
      :action-loading="
        depositAndCreateCurveAndCriteriaLoading || approveLoading
      "
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
import { useI18n } from "vue-i18n";
import type {
  ApiTokenPrice,
  SelectableToken,
  Token,
  BondingCurveParams,
  Criteria,
} from "dapp-types";

import {
  currencyFormatter,
  BaseButton,
  TabNavigationComponent,
} from "potion-ui";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useOnboard } from "@onboard-composable";
import { onMounted, ref, computed, watch } from "vue";
import { contractsAddresses } from "@/helpers/contracts";
import { useTokenList } from "@/composables/useTokenList";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import CreatePool from "@/components/CustomPool/CreatePool.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import {
  useAllCollateralizedProductsUnderlyingQuery,
  useGetNumberOfPoolsFromUserQuery,
} from "subgraph-queries/generated/urql";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useRouter } from "vue-router";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useNotifications } from "@/composables/useNotifications";

const { t } = useI18n();
const router = useRouter();

// Initial data setup
const liquidity = ref(100);
const { connectedWallet } = useOnboard();
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);
const collateral: string =
  contractsAddresses.PotionTestUSD.address.toLowerCase();

/*
 * Available tokens are fetched from the subgraph
 * Prices are loaded from an API
 */

const availableTokens = ref<SelectableToken[]>([]);
const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());

const unselectedTokens = computed(() =>
  availableTokens.value
    .filter((token) => !token.selected)
    .map((token) => token.symbol)
);

const { data: availableProducts } = useAllCollateralizedProductsUnderlyingQuery(
  {
    variables: { collateral },
  }
);

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

watch(availableProducts, () => {
  availableTokens.value =
    availableProducts?.value?.products?.map((product) =>
      tokenToSelectableToken(
        product.underlying.address,
        parseInt(product.underlying.decimals)
      )
    ) ?? [];
});

/*
 * criterias
 */

const criteriaMap = ref(
  new Map<string, { maxStrike: number; maxDuration: number }>()
);

const updateCriteria = (
  tokenAddress: string,
  maxStrike: number,
  maxDuration: number
) => criteriaMap.value.set(tokenAddress, { maxStrike, maxDuration });

const criterias = computed(() => {
  const existingCriteria: Array<Criteria> = [];

  for (const [address, strikeAndDuration] of criteriaMap.value.entries()) {
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

/*
 * Bonding Curve and emerging curves
 */
const bondingCurve = ref<BondingCurveParams>({
  a: 0.05,
  b: 0.05,
  c: 0.05,
  d: 0.05,
  maxUtil: 1,
});

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

/*
 * Pool deployment data and functions
 */

const {
  depositAndCreateCurveAndCriteriaTx,
  depositAndCreateCurveAndCriteriaReceipt,
  depositAndCreateCurveAndCriteria,
  depositAndCreateCurveAndCriteriaLoading,
} = usePotionLiquidityPoolContract();

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
  approveForPotionLiquidityPool,
  approveLoading,
  approveTx,
  approveReceipt,
} = useCollateralTokenContract();

const userPoolsQueryVariables = computed(() => {
  return {
    lp: walletAddress.value,
    ids: [""],
  };
});
const { data: userPools } = useGetNumberOfPoolsFromUserQuery({
  variables: userPoolsQueryVariables,
});

const userPoolsCount = computed(() => {
  return userPools?.value?.pools?.length ?? 0;
});

const poolId = computed(() => {
  return userPoolsCount.value + 1;
});

const amountNeededToApprove = computed(() => {
  if (userAllowance.value === 0) {
    return liquidity.value;
  }
  if (liquidity.value > userAllowance.value) {
    return parseFloat((liquidity.value - userAllowance.value).toPrecision(6));
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
      criterias.value
    );
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

/*
 * Data validation and guarding
 */

const validInput = ref(false);
const liquidityCheck = computed(
  () =>
    validInput.value &&
    liquidity.value > 0 &&
    liquidity.value < userCollateralBalance.value
);

const bondingCurveCheck = computed(
  () =>
    bondingCurve.value.a > 0 &&
    bondingCurve.value.b > 0 &&
    bondingCurve.value.c > 0 &&
    bondingCurve.value.d > 0 &&
    bondingCurve.value.maxUtil > 0 &&
    bondingCurve.value.maxUtil <= 1
);

const criteriasCheck = computed(() => criterias.value.length > 0);
const liquidityAndCriteriaCheck = computed(
  () => liquidityCheck.value && criteriasCheck.value
);
const canNavigateToDeploy = computed(
  () => criteriasCheck.value && bondingCurveCheck.value
);
const readyToDeploy = computed(
  () => liquidityCheck.value && canNavigateToDeploy.value
);

/*
 * Tab navigation
 */

const currentFormStep = ref(0);
const tabs = ref([
  {
    title: "Pool Setup",
    subtitle: "Choose one or more assets this pool will insure",
    isValid: liquidityAndCriteriaCheck,
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

const fetchUserData = async () => {
  if (connectedWallet.value) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

onMounted(async () => await fetchUserData());

watch(walletAddress, async (newAWallet) => {
  if (newAWallet) {
    await fetchUserData();
  } else {
    userCollateralBalance.value = 0;
    userAllowance.value = 0;
  }
});

/*
 * Toast notifications
 */
const {
  notifications,
  createTransactionNotification,
  createReceiptNotification,
  removeToast,
} = useNotifications();

watch(depositAndCreateCurveAndCriteriaTx, (transaction) => {
  createTransactionNotification(transaction, "Creating pool");
});

watch(depositAndCreateCurveAndCriteriaReceipt, (receipt) => {
  createReceiptNotification(receipt, "Pool created");
});

watch(approveTx, (transaction) => {
  createTransactionNotification(transaction, "Approving USDC");
});

watch(approveReceipt, (receipt) => {
  createReceiptNotification(receipt, "USDC spending approved");
});
</script>
