<script lang="ts" setup>
import { useTokenList } from "@/composables/useTokenList";
import { computed, onMounted, ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  useGetTemplateQuery,
  useGetLatestPoolIdQuery,
} from "subgraph-queries/generated/urql";
import type {
  BondingCurveParams,
  Criteria,
  OptionToken,
  Token,
} from "dapp-types";
import {
  BaseCard,
  BaseButton,
  LabelValue,
  CreatorTag,
  AssetTag,
} from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { contractsAddresses } from "@/helpers/contracts";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { etherscanUrl } from "@/helpers";

import { useEmergingCurves } from "@/composables/useEmergingCurves";
import { useTemplateSnapshots } from "@/composables/useSnapshots";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { useCoinGecko } from "@/composables/useCoinGecko";

import CurvesChart from "@/components/CurvesChart.vue";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import UnderlyingList from "potion-ui/src/components/UnderlyingList/UnderlyingList.vue";
import { useNotifications } from "@/composables/useNotifications";

const getTokenFromAddress = (address: string): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol };
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const templateId = Array.isArray(route.params.templateId)
  ? route.params.templateId[0]
  : route.params.templateId;
const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());
const { data } = useGetTemplateQuery({
  variables: {
    id: templateId,
  },
});

const { chartData, fetching: loadingSnapshots } =
  useTemplateSnapshots(templateId);
const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();

const performanceChartDataReady = computed(
  () => !loadingSnapshots.value && !loadingBlock.value
);

const template = computed(() => data?.value?.template);
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
  const addresses =
    criteriaSet?.value?.criterias?.map(
      ({ criteria }) => criteria.underlyingAsset.address
    ) ?? [];

  try {
    const promises = addresses.map(async (address) => {
      const { fetchTokenPrice, price } = useCoinGecko(undefined, address);

      await fetchTokenPrice();

      prices.set(address, price.value);
    });
    await Promise.allSettled(promises);
    tokenPricesMap.value = prices;
  } catch (error) {
    console.error("Error while fetching token prices.");
  }

  return prices;
};

const tokens = computed(() => criterias.value?.map(({ token }) => token) ?? []);
const totalLiquidity = computed(() => template?.value?.size ?? "0");
const timesCloned = computed(() => template?.value?.numPools ?? "0");
const pnlPercentage = computed(() => template?.value?.pnlPercentage ?? "0");
const creator = computed(() => ({
  label: template?.value?.creator ?? "",
  icon: undefined,
  link: etherscanUrl.concat(`/${template?.value?.creator ?? ""}`),
}));

const bondingCurveParams = computed<BondingCurveParams>(() => {
  return {
    a: parseFloat(curve?.value?.a ?? "0"),
    b: parseFloat(curve?.value?.b ?? "0"),
    c: parseFloat(curve?.value?.c ?? "0"),
    d: parseFloat(curve?.value?.d ?? "0"),
    maxUtil: parseFloat(curve?.value?.maxUtil ?? "0"),
  };
});

const liquidity = ref(100);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const onLiquidityUpdate = (newValue: number) => {
  liquidity.value = newValue;
};

const { connectedWallet } = useOnboard();
const isNotConnected = computed(() => !connectedWallet.value);
const walletAddress = computed(
  () => connectedWallet.value?.accounts[0].address ?? ""
);

const {
  fetchUserCollateralBalance,
  fetchUserCollateralAllowance,
  userAllowance,
  userCollateralBalance,
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
    return liquidity.value;
  }
  if (liquidity.value > userAllowance.value) {
    return parseFloat((liquidity.value - userAllowance.value).toPrecision(6));
  }
  return 0;
});

const {
  depositAndCreateCurveAndCriteriaTx,
  depositAndCreateCurveAndCriteriaReceipt,
  depositAndCreateCurveAndCriteria,
  depositAndCreateCurveAndCriteriaLoading,
} = usePotionLiquidityPoolContract();

const userPoolsQueryVariables = computed(() => {
  return {
    lp: walletAddress.value,
  };
});
const { data: userPools } = useGetLatestPoolIdQuery({
  pause: isNotConnected,
  variables: userPoolsQueryVariables,
});

const clonedPoolId = computed(() => {
  const id = userPools?.value?.pools?.[0]?.poolId;
  return id ? 1 + parseInt(id) : 0;
});

const handleCloneTemplate = async () => {
  if (amountNeededToApprove.value > 0) {
    await approveForPotionLiquidityPool(liquidity.value, true);
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    if (clonedPoolId.value) {
      await depositAndCreateCurveAndCriteria(
        clonedPoolId.value,
        liquidity.value,
        bondingCurveParams.value,
        criterias.value
      );
    }

    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  }
};

const emits = defineEmits(["update:modelValue", "validInput", "navigate:next"]);

watch(criterias, loadEmergingCurves);
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
  createTransactionNotification(transaction, t("creating_pool"));
});

watch(depositAndCreateCurveAndCriteriaReceipt, (receipt) => {
  createReceiptNotification(receipt, t("pool_created"));
});

watch(approveTx, (transaction) => {
  createTransactionNotification(transaction, t("approving_usdc"));
});

watch(approveReceipt, (receipt) => {
  createReceiptNotification(receipt, t("usdc_approved"));
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
        <AssetTag :tokens="tokens" :title="t('assets')" size="xl" />
        <LabelValue
          size="xl"
          :title="t('total_size')"
          :value="totalLiquidity"
          :symbol="collateral.symbol"
        />
        <LabelValue
          size="xl"
          :title="t('cloned')"
          :value="timesCloned"
          :symbol="t('times')"
        />
        <LabelValue
          size="xl"
          :title="t('pnl')"
          :value="pnlPercentage"
          value-type="pnl"
          symbol="%"
        />
        <CreatorTag
          :link="creator?.link"
          :label="creator.label"
          :icon="creator?.icon"
          :with-label="true"
        />
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
      </div>
      <BaseCard class="self-start" :full-height="false">
        <AddLiquidityCard
          :model-value="liquidity"
          :title="t('add_liquidity')"
          :hint="t('add_liquidity_hint')"
          :user-balance="userCollateralBalance"
          class="md:col-span-4 xl:col-span-3 self-start"
          @update:model-value="onLiquidityUpdate"
          @valid-input="emits('validInput', $event)"
        >
          <template #card-footer>
            <BaseButton
              test-clone-button
              palette="secondary"
              :inline="true"
              :label="t('add_liquidity')"
              :disabled="
                isNotConnected ||
                depositAndCreateCurveAndCriteriaLoading ||
                approveLoading
              "
              :loading="
                depositAndCreateCurveAndCriteriaLoading || approveLoading
              "
              @click="handleCloneTemplate"
            >
              <template #pre-icon>
                <i class="i-ph-upload-simple-bold mr-2"></i>
              </template>
            </BaseButton>
          </template>
        </AddLiquidityCard>
      </BaseCard>
    </div>
  </div>
  <NotificationDisplay
    :toasts="notifications"
    @hide-toast="(index) => removeToast(index)"
  >
  </NotificationDisplay>
</template>
