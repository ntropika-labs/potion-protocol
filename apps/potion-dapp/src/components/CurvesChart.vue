<script lang="ts" setup>
import type { BondingCurveParams, EmergingCurvePoints } from "dapp-types";
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

import { HyperbolicCurve } from "contracts-math";

interface Props {
  bondingCurveParams: BondingCurveParams;
  emergingCurves?: EmergingCurvePoints[];
  unselectedTokens?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  emergingCurves: () => [],
  unselectedTokens: () => [],
});

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

<template>
  <BaseCard class="lg:col-span-8 xl:col-span-9">
    <div class="grid gap-5 grid grid-cols-1 xl:grid-cols-[3fr_1fr]">
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
</template>
