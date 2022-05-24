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
  BaseButton,
  CardFooter,
} from "potion-ui";
import { times as _times } from "lodash-es";
import { HyperbolicCurve } from "contracts-math";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  liquidity: string;
  poolId: number;
  modelValue: BondingCurveParams;
  criterias: Criteria[];
  emergingCurves: EmergingCurvePoints[];
  disableNavigationNext: boolean;
}

const props = withDefaults(defineProps<Props>(), { emergingCurves: () => [] });
const emits = defineEmits([
  "update:modelValue",
  "navigate:back",
  "navigate:next",
]);

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
  <div class="grid gap-5 lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]">
    <BaseCard class="self-start" :full-height="false">
      <div class="py-3 px-4 flex flex-col gap-4">
        <p class="text-sm uppercase">{{ t("my_pool") }} #{{ props.poolId }}</p>
        <div class="flex justify-between text-sm">
          <p>{{ t("deposit_collateral_title") }}</p>
          <p class="font-bold font-serif">{{ liquidity }}</p>
        </div>
        <div class="w-full bg-white/10 h-[1px]"></div>
        <p class="text-sm">{{ t("insurance_description") }}</p>
        <CriteriasRecap class="" :criterias="criterias"></CriteriasRecap>
      </div>

      <CardFooter class="flex justify-center gap-5">
        <BaseButton
          palette="transparent"
          :inline="true"
          :label="t('back')"
          @click="emits('navigate:back')"
        >
          <template #post-icon>
            <i class="i-ph-caret-left"></i>
          </template>
        </BaseButton>
        <BaseButton
          palette="secondary"
          :inline="true"
          :label="t('next')"
          :disabled="props.disableNavigationNext"
          @click="emits('navigate:next')"
        >
          <template #post-icon>
            <i class="i-ph-caret-right"></i>
          </template>
        </BaseButton>
      </CardFooter>
    </BaseCard>
    <BaseCard>
      <div class="grid gap-5 xl:grid-cols-[3fr_1fr]">
        <BondingCurve
          class="py-3 px-4"
          :bonding-curve="getCurvePoints(bondingCurve)"
          :emerging-curves="emergingCurves"
        ></BondingCurve>
        <BaseCard
          class="p-6 gap-6 rounded-l-none !ring-none border-l-1 border-white/10"
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
