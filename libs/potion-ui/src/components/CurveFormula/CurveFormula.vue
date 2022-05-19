<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CurveFormula",
});
</script>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import Tooltip from "../Tooltip/Tooltip.vue";
import BaseCard from "../BaseCard/BaseCard.vue";

const { t } = useI18n();
</script>

<template>
  <BaseCard
    class="p-3 text-sm"
    color="neutral"
    rounded="internal"
    :full-height="false"
  >
    <span class="text-white inline-flex items-center gap-[.5ch]">
      <span>{{ t("curve_formula.title") }}</span>
      <Tooltip :message="t('curve_formula.tooltip')" />
    </span>
    <span class="text-deep-black-500 mt-2"
      >P = a ⋅ U ⋅ cosh(b ⋅ U<sup>c</sup>) +d</span
    >
  </BaseCard>
</template>
