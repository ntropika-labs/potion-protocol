<template>
  <div class="break-all">
    <div>EDIT {{ route.params.id }}</div>
    <div>{{ collateral }}</div>
    <div>{{ poolData }}</div>
    <div>{{ availableProducts }}</div>
  </div>

  <PoolSetup
    v-model:liquidity.number="liquidity"
    :liquidity-check="true"
    :user-collateral-balance="userCollateralBalance"
    :available-tokens="availableTokens"
    :token-prices="tokenPricesMap"
    :pool-id="poolParamToNumber ?? 0"
    :disable-navigation="false"
    @token-selected="toggleTokenSelection"
    @token-remove="toggleTokenSelection"
    @update:criteria="updateCriteria"
    @valid-input="true"
  />
</template>
<script lang="ts" setup>
import type {
  ApiTokenPrice,
  SelectableToken,
  Token,
  // BondingCurveParams,
  // Criteria,
  // EmergingCurvePoints,
  // NotificationProps,
} from "dapp-types";
import PoolSetup from "@/components/CustomPool/PoolSetup.vue";
import { ref, computed, watch, onMounted } from "vue";
import { hexValue } from "@ethersproject/bytes";
import {
  useGetPoolByIdQuery,
  useAllCollateralizedProductsUnderlyingQuery,
} from "subgraph-queries/generated/urql";
import { useOnboard } from "@onboard-composable";
import { useRoute } from "vue-router";
import { contractsAddresses } from "@/helpers/contracts";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { useTokenList } from "@/composables/useTokenList";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";
const collateral: string =
  contractsAddresses.PotionTestUSD.address.toLowerCase();

const { connectedWallet } = useOnboard();
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);
const route = useRoute();

const poolParamToNumber = computed(() => {
  const poolId = route.params.id;
  if (Array.isArray(poolId)) {
    return null;
  }
  return parseInt(poolId);
});

const poolId = computed(() => {
  if (poolParamToNumber.value) {
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
const { data: poolData } = useGetPoolByIdQuery({
  //@ts-expect-error queryVariable could have a null value - we pause the query if so
  variables: queryVariable,
  pause: pauseQuery,
});

const liquidity = ref(parseFloat(poolData.value?.pool?.size ?? "0"));
watch(poolData, () => {
  liquidity.value = parseFloat(poolData.value?.pool?.size ?? "0");
});

const {
  fetchUserCollateralBalance,
  userCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
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

// const criterias = computed(() => {
//   const existingCriteria: Array<Criteria> = [];

//   for (const [address, strikeAndDuration] of criteriaMap.value.entries()) {
//     const token = availableTokens.value.find((t) => t.address === address);
//     if (token) {
//       existingCriteria.push({
//         token: token,
//         maxStrike: strikeAndDuration?.maxStrike,
//         maxDuration: strikeAndDuration?.maxDuration,
//       });
//     }
//   }

//   return existingCriteria;
// });

const availableTokens = ref<SelectableToken[]>([]);
const tokenPricesMap = ref(new Map<string, ApiTokenPrice>());
const { data: availableProducts } = useAllCollateralizedProductsUnderlyingQuery(
  {
    variables: { collateral },
  }
);
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
  poolData.value?.pool?.template?.criteriaSet?.criterias.forEach((criteria) => {
    console.log(criteria);
    const token = availableTokens.value.find(
      (token) => token.address === criteria.criteria.underlyingAsset.address
    );
    if (token) {
      toggleTokenSelection(token.address);
    }
  });
});
</script>
