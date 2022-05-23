<script lang="ts" setup>
import type {
  BondingCurveParams,
  Criteria,
  EmergingCurvePoints,
} from "dapp-types";
import {
  BaseCard,
  BondingCurve,
  CriteriasRecap,
  CurveFormula,
  CustomCurveParams,
  Tooltip,
} from "potion-ui";
import { times as _times } from "lodash-es";
import { HyperbolicCurve } from "contracts-math";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  modelValue: BondingCurveParams;
  criterias: Criteria[];
  emergingCurves: EmergingCurvePoints[];
}

const props = withDefaults(defineProps<Props>(), { emergingCurves: () => [] });
const emits = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const handleUpdate = (param: string, value: number) => {
  const newValue = {
    ...props.modelValue,
    [param]: value,
  };
  emits("update:modelValue", newValue);
};

const curvePoints = 100;
const getCurvePoints = (curve: HyperbolicCurve) =>
  _times(curvePoints, (x: number) => curve.evalAt(x / curvePoints));

const bondingCurve = computed(
  () =>
    new HyperbolicCurve(
      props.modelValue.a,
      props.modelValue.b,
      props.modelValue.c,
      props.modelValue.d,
      props.modelValue.maxUtil
    )
);
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
    <BaseCard class="p-6">
      <CriteriasRecap :criterias="criterias"></CriteriasRecap>
    </BaseCard>
    <BaseCard>
      <div class="grid gap-6 xl:grid-cols-[3fr_1fr]">
        <BondingCurve
          class="m-6"
          :bonding-curve="getCurvePoints(bondingCurve)"
          :emerging-curves="emergingCurves"
        ></BondingCurve>
        <BaseCard class="p-6 gap-6 rounded-l-none">
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
            :a="props.modelValue.a"
            :b="props.modelValue.b"
            :c="props.modelValue.c"
            :d="props.modelValue.d"
            :max-util="props.modelValue.maxUtil"
            @update:a="(value) => handleUpdate('a', value)"
            @update:b="(value) => handleUpdate('b', value)"
            @update:c="(value) => handleUpdate('c', value)"
            @update:d="(value) => handleUpdate('d', value)"
            @update:max-util="(value) => handleUpdate('maxUtil', value)"
          >
          </CustomCurveParams>
        </BaseCard>
      </div>
    </BaseCard>
  </div>
</template>
