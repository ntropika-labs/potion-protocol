<script lang="ts" setup>
import { getTokenList } from "potion-tokenlist";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { times as _times } from "lodash-es";
import { HyperbolicCurve } from "contracts-math";
import {
  BaseButton,
  BondingCurve,
  BaseCard,
  LabelValue,
  CustomCurveParams,
  CreatorTag,
  AssetTag,
} from "potion-ui";
import AddLiquidityCard from "../components/CustomPool/AddLiquidityCard.vue";
import OTokenClaimTable from "../components/OTokenClaimTable/OTokenClaimTable.vue";

const { t } = useI18n();

const tokens = getTokenList("ganache");
const timesCloned = ref("5");
const totalSize = ref("595833844");
const totalPnl = ref("59");
const currencySymbol = ref("USDC");
const creator = ref({
  label: "0xd34d...b33f",
  link: "#",
  icon: undefined,
  //icon: "https://mocked.com/placeholder.png",
});
const pnlTrend = computed(() =>
  parseFloat(totalPnl.value) > 0 ? "up" : "down"
);

const curvePoints = 100;
const getCurvePoints = (curve: HyperbolicCurve) =>
  _times(curvePoints, (x: number) => curve.evalAt(x / curvePoints));

const modelValue = {
  a: 1,
  b: 1,
  c: 1,
  d: 1,
  maxUtil: 1,
};
const bondingCurve = computed(
  () =>
    new HyperbolicCurve(
      modelValue.a,
      modelValue.b,
      modelValue.c,
      modelValue.d,
      modelValue.maxUtil
    )
);

const unselectedTokens = ref([]),
  emergingCurves = ref([]),
  userBalance = ref(1000),
  liquidityValue = ref(0);

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
    <BaseButton palette="transparent" :label="t('back')">
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
        :value="totalSize"
        :symbol="currencySymbol"
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
        :value="totalPnl"
        symbol="%"
        :trend="pnlTrend"
      />
      <CreatorTag
        :link="creator.link"
        :label="creator.label"
        :icon="creator.icon"
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
        <BaseCard direction="row" :full-height="false">
          <div class="w-full grid gap-6 xl:grid-cols-[3fr_1fr]">
            <BondingCurve
              class="py-6 px-8"
              :bonding-curve="getCurvePoints(bondingCurve)"
              :emerging-curves="emergingCurves"
              :unload-keys="unselectedTokens"
            />
            <BaseCard
              class="items-center rounded-l-none !ring-none py-3 px-4 border-t-1 xl:( border-l-1 border-t-0 ) border-white/10"
            >
              <p>{{ t("curve_parameters") }}</p>
              <CustomCurveParams
                class="!h-auto"
                :a="bondingCurve.a_number"
                :b="bondingCurve.b_number"
                :c="bondingCurve.c_number"
                :d="bondingCurve.d_number"
                :max-util="bondingCurve.max_util"
                :readonly="true"
                :disabled="false"
              />
            </BaseCard>
          </div>
        </BaseCard>
        <!-- End bonding curve -->
        <!-- Start options table  -->
        <OTokenClaimTable
          class="row-auto"
          :price-map="{}"
          :underlyings="[]"
          @claim-otoken="onReclaim"
        ></OTokenClaimTable>
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
