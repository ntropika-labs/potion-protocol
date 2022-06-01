<template>
  <BaseCard class="text-dwhite-400" :full-height="false">
    <div class="grid grid-flow-row grid-cols-2 gap-6 py-3 px-4">
      <div class="col-span-2">
        <BaseTag :label="activeLabel" />
      </div>
      <AssetTag :tokens="props.tokens" :title="t('assets')" />
      <LabelValue
        size="md"
        :title="t('total_size')"
        :value="props.size"
        symbol="USDC"
      />
      <LabelValue
        size="md"
        :title="t('utilization')"
        :value="props.utilization"
        symbol="%"
      />
      <LabelValue
        size="md"
        :title="t('pnl')"
        :value="props.pnl"
        value-type="pnl"
        symbol="%"
      />
    </div>
    <CardFooter class="flex justify-center gap-3">
      <slot name="poolLink" />
    </CardFooter>
  </BaseCard>
</template>
<script lang="ts" setup>
import type { Token } from "dapp-types";
import AssetTag from "../AssetTag/AssetTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import LabelValue from "../LabelValue/LabelValue.vue";
import { useI18n } from "vue-i18n";

import { computed } from "vue";

export interface Props {
  active: boolean;
  tokens: Token[];
  size: string;
  utilization: string;
  pnl: string;
}

const { t } = useI18n();

const props = defineProps<Props>();
const activeLabel = computed(() => {
  return props.active ? t("active") : t("inactive");
});
</script>
