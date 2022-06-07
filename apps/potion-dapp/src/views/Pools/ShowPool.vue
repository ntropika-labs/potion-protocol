<script lang="ts" setup>
import { useTokenList } from "@/composables/useTokenList";
import { computed, onMounted, ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useGetPoolByIdQuery } from "subgraph-queries/generated/urql";
import {
  SrcsetEnum,
  type BondingCurveParams,
  type Criteria,
  type NotificationProps,
  type OptionToken,
  type Token,
} from "dapp-types";
import { BaseCard, BaseButton, LabelValue, AssetTag, BaseTag } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { contractsAddresses } from "@/helpers/contracts";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { etherscanUrl } from "@/helpers";
import { hexValue } from "@ethersproject/bytes";

import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { usePoolSnapshots } from "@/composables/useSnapshots";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";

import CurvesChart from "@/components/CurvesChart.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import UnderlyingList from "potion-ui/src/components/UnderlyingList/UnderlyingList.vue";
import LiquidityCard from "@/components/LiquidityCard.vue";
import OtokenClaimTable from "@/components/OTokenClaimTable/OTokenClaimTable.vue";

const getTokenFromAddress = (address: string): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol };
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const poolStatus = ref("Active");

const lpId = route.params.lp as string;
const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());
const poolId = computed(() => {
  const poolId = route.params.id;
  if (Array.isArray(poolId)) {
    return null;
  }
  return parseInt(poolId);
});

const poolIdentifier = computed(() => {
  if (poolId.value !== null && Number.isInteger(poolId.value)) {
    return `${lpId.toLowerCase()}${hexValue(poolId.value)}`;
  } else {
    return null;
  }
});
const queryVariable = computed(() => {
  return {
    id: poolIdentifier.value,
  };
});

const pauseQuery = computed(() => {
  return !queryVariable.value.id;
});
const { data } = useGetPoolByIdQuery({
  //@ts-expect-error queryVariable could have a null value - we pause the query if so
  variables: queryVariable,
  pause: pauseQuery,
});
console.log(pauseQuery.value, queryVariable.value, data.value);

const { chartData, fetching: loadingSnapshots } = usePoolSnapshots(
  poolIdentifier.value as string
);
const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();

const performanceChartDataReady = computed(
  () => !loadingSnapshots.value && !loadingBlock.value
);

const pool = computed(() => data?.value?.pool);
const template = computed(() => data?.value?.pool?.template);
const curve = computed(() => template?.value?.curve);
const criteriaSet = computed(() => template?.value?.criteriaSet);
const criterias = computed<Criteria[]>(
  () =>
    criteriaSet?.value?.criterias?.map(({ criteria }) => ({
      token: getTokenFromAddress(criteria.underlyingAsset.address),
      maxStrike: parseInt(criteria.maxStrikePercent),
      maxDuration: parseInt(criteria.maxDurationInDays),
    })) ?? []
);
const assetsFlat = computed<OptionToken[]>(
  () =>
    criteriaSet?.value?.criterias?.map(({ criteria }) => {
      const token = getTokenFromAddress(criteria.underlyingAsset.address);

      return {
        id: "",
        isPut: false,
        duration: criteria.maxDurationInDays,
        strike: criteria.maxStrikePercent,
        name: token.name,
        symbol: token.symbol,
        address: token.address,
        decimals: token.decimals,
        image: token.image,
      };
    }) ?? []
);
const tokenPricesMap = ref<Map<string, string>>(new Map());

const fetchAssetsPrice = async () => {
  const prices = new Map();
  const addresses = criteriaSet?.value?.criterias?.map(
    ({ criteria }) => criteria.underlyingAsset.address
  );
  if (!addresses) return prices;

  try {
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      const { fetchPrice, formattedPrice } = useFetchTokenPrices(addr);

      await fetchPrice();

      prices.set(addr, formattedPrice.value);
    }
  } catch (error) {
    console.error("Error while fetching token prices.");
  }

  return prices;
};

const tokens = computed(() => criterias.value?.map(({ token }) => token) ?? []);
const totalLiquidity = computed(() =>
  pool?.value?.size ? parseInt(pool.value.size) : 0
);
const totalUtilization = computed(() => parseInt(pool?.value?.locked || "0"));
const unutilizedLiquidity = computed(
  () => totalLiquidity.value - totalUtilization.value
);
const utilizationPercentage = computed(() => {
  const totSize = parseInt(pool?.value?.size || "0");

  return (totalUtilization.value * 100) / totSize;
});
const pnlPercentage = computed(() => pool?.value?.pnlPercentage ?? "0");

const bondingCurveParams = computed<BondingCurveParams>(() => {
  return {
    a: parseFloat(curve?.value?.a ?? "0"),
    b: parseFloat(curve?.value?.b ?? "0"),
    c: parseFloat(curve?.value?.c ?? "0"),
    d: parseFloat(curve?.value?.d ?? "0"),
    maxUtil: parseFloat(curve?.value?.maxUtil ?? "0"),
  };
});

const userBalance = ref(1000),
  modelDeposit = ref(100),
  modelWithdraw = ref(100);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

// const onLiquidityUpdate = (newValue: number) => {
//   console.log("ON LIQUIDITY UPDATE");
//   modelDeposit.value = newValue;
// };

const { connectedWallet } = useOnboard();
const isNotConnected = computed(() => !connectedWallet.value);
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);

const {
  fetchUserCollateralBalance,
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
  await fetchAssetsPrice();
  await getBlock("latest");
});

watch(walletAddress, async (newAWallet) => {
  if (newAWallet) {
    await fetchUserData();
  } else {
    userAllowance.value = 0;
  }
});

const amountNeededToApprove = computed(() => {
  if (userAllowance.value === 0) {
    return modelDeposit.value;
  }
  if (modelDeposit.value > userAllowance.value) {
    return parseFloat(
      (modelDeposit.value - userAllowance.value).toPrecision(6)
    );
  }
  return 0;
});

const {
  depositTx,
  depositReceipt,
  deposit,
  depositLoading,
  withdrawTx,
  withdrawReceipt,
  withdraw,
  withdrawLoading,
} = usePotionLiquidityPoolContract();

const handleDeposit = async () => {
  if (amountNeededToApprove.value > 0) {
    await approveForPotionLiquidityPool(modelDeposit.value, true);
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    if (poolId.value) {
      await deposit(poolId.value, modelDeposit.value);
    }

    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

const handleWithdraw = async () => {
  if (unutilizedLiquidity.value < modelWithdraw.value) {
    if (poolId.value) {
      await withdraw(poolId.value, modelWithdraw.value);
    }

    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

/*
 * Toast notifications
 */

const notifications = ref<Map<string, NotificationProps>>(new Map());

watch(depositTx, (transaction) => {
  notifications.value.set(`${transaction?.hash}`, {
    title: "Creating pool",
    body: "Your transaction is pending",
    cta: {
      label: "View on Etherscan",
      url: `${etherscanUrl}/tx/${transaction?.hash}`,
    },
    srcset: new Map([
      [SrcsetEnum.AVIF, "/icons/atom.avif"],
      [SrcsetEnum.WEBP, "/icons/atom.webp"],
      [SrcsetEnum.PNG, "/icons/atom.png"],
    ]),
  });
});

watch(depositReceipt, (receipt) => {
  notifications.value.set(
    `${receipt?.blockNumber}${receipt?.transactionIndex}`,
    {
      title: "Pool created",
      body: "Your transaction has completed",
      cta: {
        label: "View on Etherscan",
        url: `${etherscanUrl}/tx/${receipt?.transactionHash}`,
      },
      srcset: new Map([
        [SrcsetEnum.AVIF, "/icons/atom.avif"],
        [SrcsetEnum.WEBP, "/icons/atom.webp"],
        [SrcsetEnum.PNG, "/icons/atom.png"],
      ]),
    }
  );
});

watch(withdrawTx, (transaction) => {
  notifications.value.set(`${transaction?.hash}`, {
    title: "Approving USDC",
    body: "Your transactions is pending",
    cta: {
      label: "View on Etherscan",
      url: `${etherscanUrl}/tx/${transaction?.hash}`,
    },
    srcset: new Map([
      [SrcsetEnum.AVIF, "/icons/atom.avif"],
      [SrcsetEnum.WEBP, "/icons/atom.webp"],
      [SrcsetEnum.PNG, "/icons/atom.png"],
    ]),
  });
});

watch(withdrawReceipt, (receipt) => {
  notifications.value.set(
    `${receipt?.blockNumber}${receipt?.transactionIndex}`,
    {
      title: "USDC spending approved",
      body: "Your transaction has completed",
      cta: {
        label: "View on Etherscan",
        url: `${etherscanUrl}/tx/${receipt?.transactionHash}`,
      },
      srcset: new Map([
        [SrcsetEnum.AVIF, "/icons/atom.avif"],
        [SrcsetEnum.WEBP, "/icons/atom.webp"],
        [SrcsetEnum.PNG, "/icons/atom.png"],
      ]),
    }
  );
});

watch(approveTx, (transaction) => {
  notifications.value.set(`${transaction?.hash}`, {
    title: "Approving USDC",
    body: "Your transactions is pending",
    cta: {
      label: "View on Etherscan",
      url: `${etherscanUrl}/tx/${transaction?.hash}`,
    },
    srcset: new Map([
      [SrcsetEnum.AVIF, "/icons/atom.avif"],
      [SrcsetEnum.WEBP, "/icons/atom.webp"],
      [SrcsetEnum.PNG, "/icons/atom.png"],
    ]),
  });
});

watch(approveReceipt, (receipt) => {
  notifications.value.set(
    `${receipt?.blockNumber}${receipt?.transactionIndex}`,
    {
      title: "USDC spending approved",
      body: "Your transaction has completed",
      cta: {
        label: "View on Etherscan",
        url: `${etherscanUrl}/tx/${receipt?.transactionHash}`,
      },
      srcset: new Map([
        [SrcsetEnum.AVIF, "/icons/atom.avif"],
        [SrcsetEnum.WEBP, "/icons/atom.webp"],
        [SrcsetEnum.PNG, "/icons/atom.png"],
      ]),
    }
  );
});

watch(criterias, loadEmergingCurves);

const onEditClick = () =>
  router.push({
    name: "liquidity-provider-pool-edit",
    params: { lp: lpId, id: poolId.value },
  });
</script>
<template>
  <div>
    <BaseButton palette="transparent" :label="t('back')" @click="router.back">
      <template #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <!-- Start header -->
    <BaseCard direction="column" class="px-8 py-6 mt-4">
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:flex gap-4 justify-between"
      >
        <div>
          <h5 class="mb-2 font-medium">{{ t("status") }}</h5>
          <BaseTag size="xl">
            {{ poolStatus }}
          </BaseTag>
        </div>
        <AssetTag :tokens="tokens" :title="t('assets')" size="xl" />
        <LabelValue
          size="xl"
          :title="t('total_size')"
          :value="totalLiquidity.toString()"
          :symbol="collateral.symbol"
        />
        <LabelValue
          size="xl"
          :title="t('utilization')"
          :value="utilizationPercentage.toString()"
          symbol="%"
        />
        <LabelValue
          size="xl"
          :title="t('pnl')"
          :value="pnlPercentage"
          value-type="pnl"
          symbol="%"
        />
        <div>
          <BaseButton
            palette="secondary-o"
            :label="t('edit')"
            @click="onEditClick"
          ></BaseButton>
        </div>
      </div>
    </BaseCard>
    <!-- End header  -->
    <div class="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-[3fr_1fr]">
      <div class="flex flex-col gap-8">
        <PerformanceCard
          v-if="performanceChartDataReady"
          :performance-data="chartData"
          :today-timestamp="blockTimestamp"
        >
        </PerformanceCard>
        <CurvesChart
          :bonding-curve-params="bondingCurveParams"
          :emerging-curves="emergingCurves"
        />
        <UnderlyingList
          :assets-flat="assetsFlat"
          :stable-coin-collateral="collateral.symbol"
          :price-map="tokenPricesMap"
        ></UnderlyingList>
        <OtokenClaimTable
          :lp-id="lpId"
          :pool-id="poolId"
          :pool-identifier="poolIdentifier"
          :underlyings="assetsFlat"
          :price-map="tokenPricesMap"
        ></OtokenClaimTable>
      </div>
      <div class="self-start">
        <LiquidityCard
          :total-liquidity="totalLiquidity"
          :user-balance="userBalance"
          :model-deposit="modelDeposit"
          :model-withdraw="modelWithdraw"
          :show-withdraw="true"
        >
          <template #deposit-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="t('withdraw')"
              :disabled="
                isNotConnected ||
                depositLoading ||
                approveLoading ||
                withdrawLoading
              "
              :loading="depositLoading || withdrawLoading || approveLoading"
              @click="handleDeposit"
            >
              <template #pre-icon>
                <i class="i-ph-download-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
          <template #withdraw-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="t('add_liquidity')"
              :disabled="
                isNotConnected ||
                depositLoading ||
                approveLoading ||
                withdrawLoading
              "
              :loading="depositLoading || withdrawLoading || approveLoading"
              @click="handleWithdraw"
            >
              <template #pre-icon>
                <i class="i-ph-upload-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
        </LiquidityCard>
      </div>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => notifications.delete(index)"
  >
  </NotificationDisplay>
</template>
