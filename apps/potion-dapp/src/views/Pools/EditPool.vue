<template>
  <template v-if="error || !poolData?.pool"> Can't load the pool </template>
  <template v-if="!fetching && poolData?.pool">
    <PoolSetup
      v-model:liquidity.number="liquidity"
      :size="formattedSize"
      :liquidity-title="t('add_more_liquidity')"
      :liquidity-check="true"
      :user-collateral-balance="userCollateralBalance"
      :available-tokens="availableTokens"
      :criteria-map="criteriaMap"
      :token-prices="tokenPricesMap"
      :pool-id="poolParamToNumber ?? 0"
      :disable-navigation="false"
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
        :label="editButtonLabel"
        :disabled="
          !canEdit || depositAndCreateCurveAndCriteriaLoading || approveLoading
        "
        :loading="depositAndCreateCurveAndCriteriaLoading || approveLoading"
        @click="handleEditPool()"
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
</template>
<script lang="ts" setup>
import type {
  ApiTokenPrice,
  SelectableToken,
  Token,
  BondingCurveParams,
  Criteria,
} from "dapp-types";

import { useI18n } from "vue-i18n";

import { currencyFormatter, BaseButton } from "potion-ui";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import CurveSetup from "@/components/CustomPool/CurveSetup.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import { ref, computed, watch, onMounted } from "vue";
import { hexValue } from "@ethersproject/bytes";
import {
  useGetPoolByIdQuery,
  useAllCollateralizedProductsUnderlyingQuery,
} from "subgraph-queries/generated/urql";
import { useOnboard } from "@onboard-composable";
import { useRoute, useRouter } from "vue-router";
import { contractsAddresses } from "@/helpers/contracts";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useTokenList } from "@/composables/useTokenList";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
import { watchDebounced } from "@vueuse/core";
import { useNotifications } from "@/composables/useNotifications";
const { t } = useI18n();
const collateral: string =
  contractsAddresses.PotionTestUSD.address.toLowerCase();

const { connectedWallet } = useOnboard();
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);
const route = useRoute();
const router = useRouter();
const poolParamToNumber = computed(() => {
  const poolId = route.params.id;
  if (Array.isArray(poolId)) {
    return null;
  }
  return parseInt(poolId);
});

const poolId = computed(() => {
  if (poolParamToNumber.value !== null && poolParamToNumber.value >= 0) {
    return route.params.lp + hexValue(poolParamToNumber.value);
  } else {
    return null;
  }
});

const queryVariable = computed(() => {
  return {
    id: poolId.value,
  };
});

const pauseQuery = computed(() => {
  return !queryVariable.value.id;
});
const {
  data: poolData,
  error,
  fetching,
} = useGetPoolByIdQuery({
  //@ts-expect-error queryVariable could have a null value - we pause the query if so
  variables: queryVariable,
  pause: pauseQuery,
});

// onMounted(() => {
//   if (!poolData.value) {
//     router.push(`/404`);
//   }
// })

const formattedSize = computed(() => {
  if (poolData.value && poolData.value.pool) {
    return currencyFormatter(parseFloat(poolData.value.pool.size), "USDC");
  } else {
    return currencyFormatter(0, "USDC");
  }
});

const liquidity = ref(100);

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

const fetchUserData = async () => {
  if (connectedWallet.value) {
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

onMounted(async () => {
  await fetchUserData();
});

watch(walletAddress, async (newAWallet) => {
  if (newAWallet) {
    await fetchUserData();
  } else {
    userCollateralBalance.value = 0;
    userAllowance.value = 0;
  }
});

// Available Tokens
const criteriaMap = ref(
  new Map<string, { maxStrike: number; maxDuration: number }>()
);
const updateCriteria = (
  tokenAddress: string,
  maxStrike: number,
  maxDuration: number
) => criteriaMap.value.set(tokenAddress, { maxStrike, maxDuration });

watch(poolData, () => {
  if (poolData.value && poolData.value.pool) {
    const pool = poolData.value.pool;
    pool.template?.criteriaSet?.criterias.forEach((criteria) => {
      updateCriteria(
        criteria.criteria.underlyingAsset.address,
        parseInt(criteria.criteria.maxStrikePercent),
        parseInt(criteria.criteria.maxDurationInDays)
      );
    });
  }
});

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

const availableTokens = ref<SelectableToken[]>([]);
const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());
const { data: availableProducts } = useAllCollateralizedProductsUnderlyingQuery(
  {
    variables: { collateral },
  }
);
const updateTokenPrice = async (token: Token) => {
  const { success, price, formattedPrice, fetchPrice } = useFetchTokenPrices(
    token.address
  );
  try {
    await fetchPrice();
  } catch (error) {
    console.error(
      "Error while fetching token price. Affected token: " + token.name
    );
  } finally {
    tokenPricesMap.value.set(token.address, {
      loading: false,
      price: price.value,
      formattedPrice: formattedPrice.value,
      success: success.value,
    });
  }
};
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

watch(availableProducts, () => {
  availableTokens.value =
    availableProducts?.value?.products?.map((product) =>
      tokenToSelectableToken(
        product.underlying.address,
        parseInt(product.underlying.decimals)
      )
    ) ?? [];
});

watch([availableTokens, poolData], () => {
  if (availableTokens.value.length > 0) {
    poolData.value?.pool?.template?.criteriaSet?.criterias.forEach(
      (criteria) => {
        const token = availableTokens.value.find(
          (token) => token.address === criteria.criteria.underlyingAsset.address
        );
        if (token) {
          toggleTokenSelection(token.address);
        }
      }
    );
  }
});

const bondingCurve = ref<BondingCurveParams>({
  a: 0.05,
  b: 0.05,
  c: 0.05,
  d: 0.05,
  maxUtil: 1,
});

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

//@ts-expect-error strange typings from vueuse
watchDebounced(
  criterias,
  async () => {
    await loadEmergingCurves();
  },
  { debounce: 500, maxWait: 2000 }
);
onMounted(loadEmergingCurves);

const unselectedTokens = computed(() =>
  availableTokens.value
    .filter((token) => !token.selected)
    .map((token) => token.symbol)
);

const validInput = ref(true);
const criteriasCheck = computed(() => criterias.value.length > 0);
const liquidityCheck = computed(
  () =>
    validInput.value &&
    liquidity.value > 0 &&
    liquidity.value <= userCollateralBalance.value
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

const canEdit = computed(() => {
  if (criteriasCheck.value && liquidityCheck.value && bondingCurveCheck.value) {
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
    return parseFloat((liquidity.value - userAllowance.value).toPrecision(6));
  }
  return 0;
});

const editButtonLabel = computed(() => {
  if (amountNeededToApprove.value > 0) {
    return `${t("approve")} USDC`;
  }
  return `${t("edit")}`;
});
const {
  depositAndCreateCurveAndCriteriaTx,
  depositAndCreateCurveAndCriteriaReceipt,
  depositAndCreateCurveAndCriteria,
  depositAndCreateCurveAndCriteriaLoading,
} = usePotionLiquidityPoolContract();

const handleEditPool = async () => {
  if (amountNeededToApprove.value > 0) {
    await approveForPotionLiquidityPool(liquidity.value, true);
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    if (poolParamToNumber.value !== null && poolParamToNumber.value >= 0) {
      await depositAndCreateCurveAndCriteria(
        poolParamToNumber.value,
        liquidity.value,
        bondingCurve.value,
        criterias.value
      );
    }
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

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
