<script lang="ts" setup>
import type { BondingCurveParams } from "dapp-types";
import {
  BaseCard,
  CurveFormula,
  CustomCurveParams,
  BondingCurve,
  CriteriasRecap,
} from "potion-ui";
import { times as _times } from "lodash-es";
import { HyperbolicCurve } from "contracts-math";
import { computed } from "vue";

interface Props {
  modelValue: BondingCurveParams;
}

const props = defineProps<Props>();
const emits = defineEmits(["update:modelValue"]);

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
  <div class="grid external-grid gap-6">
    <BaseCard class="p-6">
      <CriteriasRecap></CriteriasRecap>
    </BaseCard>
    <BaseCard>
      <div class="grid internal-grid gap-6">
        <BondingCurve
          class="m-6"
          :bonding-curve="getCurvePoints(bondingCurve)"
        ></BondingCurve>
        <BaseCard color="neutral" class="p-6 gap-6 rounded-l-none">
          <CurveFormula></CurveFormula>
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

<style scoped>
.external-grid {
  grid-template-columns: 1fr 4fr;
}

.internal-grid {
  grid-template-columns: 3fr 1fr;
}
</style>
