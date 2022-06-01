<script lang="ts" setup>
import { useTokenList } from "@/composables/useTokenList";
import { computed, onMounted, ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  useGetTemplateQuery,
  useGetNumberOfPoolsFromUserQuery,
} from "subgraph-queries/generated/urql";
import {
  SrcsetEnum,
  type BondingCurveParams,
  type Criteria,
  type NotificationProps,
  type OptionToken,
  type Token,
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
import { useFetchTokenPrices } from "@/composables/useFetchTokenPrices";

import CurvesChart from "@/components/CurvesChart.vue";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import PerformanceCard from "@/components/PerformanceCard.vue";
import NotificationDisplay from "@/components/NotificationDisplay.vue";
import UnderlyingList from "potion-ui/src/components/UnderlyingList/UnderlyingList.vue";

const getTokenFromAddress = (address: string): Token => {
  const { image, name, symbol } = useTokenList(address);
  return { address, image, name, symbol };
};

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const templateId = route.params.templateId as string;
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

const userBalance = ref(1000),
  liquidity = ref(100);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const onLiquidityUpdate = (newValue: number) => {
  console.log("ON LIQUIDITY UPDATE");
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
    ids: [""],
  };
});
const { data: userPools } = useGetNumberOfPoolsFromUserQuery({
  pause: isNotConnected,
  variables: userPoolsQueryVariables,
});

const userPoolsCount = computed(() => {
  return userPools?.value?.pools?.length ?? 0;
});

const clonedPoolId = computed(() => {
  return userPoolsCount.value + 1;
});

const handleCloneTemplate = async () => {
  if (amountNeededToApprove.value > 0) {
    await approveForPotionLiquidityPool(liquidity.value, true);
    await fetchUserCollateralBalance();
    await fetchUserCollateralAllowance();
  } else {
    if (clonedPoolId.value) {
      console.log(
        clonedPoolId.value,
        liquidity.value,
        bondingCurveParams.value,
        criterias.value
      );
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

/*
 * Toast notifications
 */

const notifications = ref<Map<string, NotificationProps>>(new Map());

watch(depositAndCreateCurveAndCriteriaTx, (transaction) => {
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

watch(depositAndCreateCurveAndCriteriaReceipt, (receipt) => {
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

const emits = defineEmits(["update:modelValue", "validInput", "navigate:next"]);

onMounted(() => getBlock("latest"));
watch(criterias, loadEmergingCurves);
</script>
<template>
  <div>
    <BaseButton palette="transparent" :label="t('back')" @click="router.back">
      <template #pre-icon>
        <i class="i-ph-caret-left"></i>
      </template>
    </BaseButton>
    <!-- Start header -->
    <BaseCard
      direction="column"
      class="xl:flex-row justify-between px-8 py-6 mt-4"
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
          :user-balance="userBalance"
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
    @hide-toast="(index) => notifications.delete(index)"
  >
  </NotificationDisplay>
</template>
