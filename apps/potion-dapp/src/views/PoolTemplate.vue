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
  type Token,
} from "dapp-types";
import {
  BaseCard,
  BaseButton,
  LabelValue,
  CreatorTag,
  AssetTag,
  BaseToast,
} from "potion-ui";
import { useOnboard } from "@onboard-composable";
import AddLiquidityCard from "../components/CustomPool/AddLiquidityCard.vue";
import { contractsAddresses } from "@/helpers/contracts";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";
import { etherscanUrl } from "@/helpers";

import { useEmergingCurves } from "@/composables/useEmergingCurves";
import CurvesChart from "@/components/CurvesChart.vue";

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

const unselectedTokens = ref([]),
  userBalance = ref(1000),
  liquidity = ref(0);

const { emergingCurves, loadEmergingCurves } = useEmergingCurves(criterias);

const onLiquidityUpdate = (newValue: number) => {
  console.log("ON LIQUIDITY UPDATE");
  liquidity.value = newValue;
};

const { connectedWallet } = useOnboard();
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

const notificationTimeout =
  process.env.NODE_ENV === "development" ? 20000 : 5000;
const notifications = ref<Map<string, NotificationProps>>(new Map());

const addToast = (index: string, info: NotificationProps) => {
  notifications.value.set(index, info);

  setTimeout(() => {
    notifications.value.delete(index);
  }, notificationTimeout);
};
const removeToast = (hash: string) => notifications.value.delete(hash);

watch(depositAndCreateCurveAndCriteriaTx, (transaction) => {
  addToast(`${transaction?.hash}`, {
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
  addToast(`${receipt?.blockNumber}${receipt?.transactionIndex}`, {
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
  });
});

watch(approveTx, (transaction) => {
  addToast(`${transaction?.hash}`, {
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
  addToast(`${receipt?.blockNumber}${receipt?.transactionIndex}`, {
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
  });
});

const emits = defineEmits(["update:modelValue", "validInput", "navigate:next"]);

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
    <div class="mt-8 grid gap-5 xl:grid-cols-[3fr_1fr] gap-8">
      <div class="flex flex-col gap-8">
        <!-- Start total liquidity chart -->
        <BaseCard class="h-96 px-8 py-6" :full-height="false"></BaseCard>
        <!-- End total liquidity chart -->
        <!-- Start bonding cuve  -->
        <CurvesChart
          :bonding-curve-params="bondingCurveParams"
          :emerging-curves="emergingCurves"
        />
        <!-- End bonding curve -->
        <!-- Start underlyings list  -->
        <!-- End underlyings list -->
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
              palette="secondary"
              :inline="true"
              :label="t('add_liquidity')"
              :disabled="
                depositAndCreateCurveAndCriteriaLoading || approveLoading
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
  <template v-for="[hash, info] of notifications" :key="hash">
    <Teleport to="#toast-wrap">
      <BaseToast
        class="z-50"
        :title="info.title"
        :body="info.body"
        :cta="info.cta"
        :srcset-map="info.srcset"
        :timeout="notificationTimeout"
        @click="() => removeToast(hash)"
      ></BaseToast>
    </Teleport>
  </template>
</template>
