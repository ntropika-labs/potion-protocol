<script lang="ts" setup>
import { useTokenList } from "@/composables/useTokenList";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useGetTemplateQuery } from "subgraph-queries/generated/urql";
import {
  BaseCard,
  BaseButton,
  LabelValue,
  CreatorTag,
  AssetTag,
} from "potion-ui";

import CurvesChart from "@/components/CurvesChart.vue";
import AddLiquidityCard from "@/components/CustomPool/AddLiquidityCard.vue";
import OTokenClaimTable from "@/components/OTokenClaimTable/OTokenClaimTable.vue";
import { contractsAddresses } from "@/helpers/contracts";

const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const templateId = route.params.templateId as string;

const { data } = useGetTemplateQuery({
  variables: {
    id: templateId,
  },
});

const template = computed(() => data?.value?.template);
const curve = computed(() => template?.value?.curve);
const criteriaSet = computed(() => template?.value?.criteriaSet);

const bondingCurveParams = computed(() => ({
  a: parseFloat(curve?.value?.a ?? "0"),
  b: parseFloat(curve?.value?.b ?? "0"),
  c: parseFloat(curve?.value?.c ?? "0"),
  d: parseFloat(curve?.value?.d ?? "0"),
  maxUtil: parseFloat(curve?.value?.maxUtil ?? "0"),
}));

const tokens = computed(
  () =>
    criteriaSet?.value?.criterias?.map(({ criteria }) => {
      const address = criteria.underlyingAsset.address;
      const { image, name, symbol } = useTokenList(address);
      return { address, image, name, symbol };
    }) ?? []
);
const totalLiquidity = computed(() => template?.value?.size ?? "0");
const timesCloned = computed(() => template?.value?.numPools ?? "0");
const pnlPercentage = computed(() => template?.value?.pnlPercentage ?? "0");
const creator = computed(() => ({
  label: template?.value?.creator ?? "",
}));

const emergingCurves = ref([]);
const userBalance = ref(1000);
const liquidityValue = ref(0);

const onReclaim = () => {
  console.log("RECLAIMING");
};

const onLiquidityUpdate = (newValue: number) => {
  console.log("ON LIQUIDITY UPDATE");
  liquidityValue.value = newValue;
};

const onAddLiquidity = () => {
  console.log("ADDING LIQUIDITY");
};

const emits = defineEmits(["update:modelValue", "validInput", "navigate:next"]);
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
        <!-- Start options table  -->
        <OTokenClaimTable
          class="row-auto"
          :price-map="{}"
          :underlyings="[]"
          @claim-otoken="onReclaim"
        >
        </OTokenClaimTable>
        <!-- End options table -->
      </div>
      <BaseCard class="self-start" :full-height="false">
        <AddLiquidityCard
          :model-value="liquidityValue"
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
              :disabled="false"
              @click="onAddLiquidity"
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
</template>
