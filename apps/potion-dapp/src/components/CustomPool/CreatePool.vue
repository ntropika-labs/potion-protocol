<template>
  <div class="grid gap-5 lg:grid-cols-12">
    <PoolSettingsCard
      :pool-id="props.poolId"
      :liquidity="props.liquidity"
      :criterias="props.criterias"
      :disable-navigation-next="props.disableAction"
      :navigate-next-label="props.actionLabel"
      :action-loading="actionLoading"
      class="lg:col-span-4 xl:col-span-3 self-start"
      @navigate:back="emits('navigate:back')"
      @navigate:next="emits('deployPool')"
    />
    <BaseCard class="lg:col-span-8 xl:col-span-9">
      <div class="grid gap-5 grid xl:grid-cols-[3fr_1fr]">
        <BondingCurve
          class="py-3 px-4"
          :bonding-curve="getCurvePoints(bondingCurve)"
          :emerging-curves="props.emergingCurves"
          :unload-keys="props.unselectedTokens"
        />
        <BaseCard
          class="p-6 gap-6 !rounded-none !ring-none xl:(border-l-1 border-t-0) border-t-1 border-white/10"
        >
          <CurveFormula></CurveFormula>
          <div class="text-sm">
            {{ t("set_bonding_curve_params") }}
            <Tooltip
              class="ml-[.5ch] -mb-[.125rem]"
              :message="t('curve_formula_tooltip')"
              icon-weight="bold"
            >
            </Tooltip>
          </div>
          <CustomCurveParams
            class="!h-auto"
            :a="props.bondingCurveParams.a"
            :b="props.bondingCurveParams.b"
            :c="props.bondingCurveParams.c"
            :d="props.bondingCurveParams.d"
            :max-util="props.bondingCurveParams.maxUtil"
            :readonly="true"
            :disabled="false"
          />
        </BaseCard>
      </div>
    </BaseCard>
  </div>
</template>
<script lang="ts" setup>
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type {
  Criteria,
  BondingCurveParams,
  EmergingCurvePoints,
} from "dapp-types";
import { computed } from "vue";
import {
  BondingCurve,
  BaseCard,
  CustomCurveParams,
  CurveFormula,
  Tooltip,
} from "potion-ui";
import { times as _times } from "lodash-es";
import { useI18n } from "vue-i18n";

import PoolSettingsCard from "@/components/CustomPool/PoolSettingsCard.vue";
import { HyperbolicCurve } from "contracts-math";

const emits = defineEmits(["deployPool", "navigate:back"]);
interface Props {
  transaction: ContractTransaction | null;
  receipt: ContractReceipt | null;
  actionLabel: string;
  liquidity: string;
  poolId: number;
  criterias: Criteria[];
  disableAction: boolean;
  bondingCurveParams: BondingCurveParams;
  actionLoading: boolean;
  emergingCurves?: EmergingCurvePoints[];
  unselectedTokens: string[];
}
const props = defineProps<Props>();

const curvePoints = 100;

const { t } = useI18n();

const getCurvePoints = (curve: HyperbolicCurve) =>
  _times(curvePoints, (x: number) => curve.evalAt(x / curvePoints));

const bondingCurve = computed(() => {
  return new HyperbolicCurve(
    props.bondingCurveParams.a,
    props.bondingCurveParams.b,
    props.bondingCurveParams.c,
    props.bondingCurveParams.d,
    props.bondingCurveParams.maxUtil
  );
});
</script>
