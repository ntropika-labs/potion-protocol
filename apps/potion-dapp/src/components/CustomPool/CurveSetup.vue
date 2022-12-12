<script lang="ts" setup>
import type {
  BondingCurveParams,
  Criteria,
  EmergingCurvePoints,
} from "dapp-types";
import {
  BaseCard,
  BondingCurve,
  CurveFormula,
  CustomCurveParams,
  Tooltip,
} from "potion-ui";
import PoolSettingsCard from "@/components/CustomPool/PoolSettingsCard.vue";
import _times from "lodash.times";
import { HyperbolicCurve } from "contracts-math";
import { computed, onActivated } from "vue";
import { useI18n } from "vue-i18n";

interface Props {
  modelValue: BondingCurveParams;
  unselectedTokens: string[];
  emergingCurves?: EmergingCurvePoints[];
  hasPoolSettings?: boolean;
  liquidity?: string;
  poolId?: number;
  criterias?: Criteria[];
  disableNavigationNext?: boolean;
  navigateNextLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  unselectedTokens: () => [],
  emergingCurves: () => [],
  hasPoolSettings: true,
  criterias: () => [],
  disableNavigationNext: false,
  navigateNextLabel: "Next",
  poolId: 0,
  liquidity: "0",
});
const emits = defineEmits([
  "update:modelValue",
  "navigate:back",
  "navigate:next",
  "activated",
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

onActivated(() => {
  emits("activated");
});
</script>

<template>
  <div
    class="grid gap-5"
    :class="
      props.hasPoolSettings
        ? 'lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr]'
        : ''
    "
  >
    <PoolSettingsCard
      v-if="props.hasPoolSettings"
      :pool-id="props.poolId"
      :liquidity="props.liquidity"
      :criterias="props.criterias"
      :disable-navigation-next="props.disableNavigationNext"
      :navigate-next-label="props.navigateNextLabel"
      @navigate:back="emits('navigate:back')"
      @navigate:next="emits('navigate:next')"
    />
    <BaseCard>
      <div class="grid gap-5 xl:grid-cols-[3fr_1fr]">
        <BondingCurve
          class="py-3 px-4"
          :bonding-curve="getCurvePoints(bondingCurve)"
          :emerging-curves="props.emergingCurves"
          :unload-keys="props.unselectedTokens"
        >
        </BondingCurve>
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
            :a="props.modelValue.a"
            :b="props.modelValue.b"
            :c="props.modelValue.c"
            :d="props.modelValue.d"
            :max-util="props.modelValue.maxUtil"
            :readonly="false"
            :disabled="false"
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
