<script setup lang="ts">
import { useI18n } from "vue-i18n";

import AssetTag from "../AssetTag/AssetTag.vue";
import BaseButton from "../BaseButton/BaseButton.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
import LabelValue from "../LabelValue/LabelValue.vue";

import type { Token } from "dapp-types";

const props = withDefaults(
  defineProps<{
    asset: Token;
    hedgingRate: string;
    size: string;
    strike: string;
    currency?: string;
  }>(),
  { currency: "USDC" }
);

const emits = defineEmits<{
  (e: "selected"): void;
}>();

const { t } = useI18n();
</script>

<template>
  <BaseCard class="text-dwhite-400" :full-height="false" test-vault-card>
    <div
      class="grid grid-flow-row grid-cols-2 justify-between items-center gap-8 py-4 px-6"
    >
      <AssetTag
        :token="props.asset"
        title=""
        size="2xl"
        class="col-span-2"
        test-asset
      />
      <div class="col-span-2"></div>
      <LabelValue
        size="md"
        :title="t('strike_percentage')"
        :value="props.strike.toString()"
        value-type="number"
        symbol="%"
        test-strike-percentage
      ></LabelValue>
      <LabelValue
        size="md"
        :title="t('hedging_rate')"
        :value="props.hedgingRate.toString()"
        value-type="number"
        symbol="%"
        test-hedging-rate
      ></LabelValue>
      <LabelValue
        size="md"
        :title="t('vault_size')"
        :value="props.size.toString()"
        value-type="currency"
        :symbol="props.currency"
        test-vault-size
      ></LabelValue>
    </div>
    <CardFooter class="flex justify-center gap-3">
      <BaseButton
        class="self-center"
        size="sm"
        palette="secondary"
        :label="t('view_hedging_vault')"
        test-button
        @click="emits('selected')"
      ></BaseButton>
    </CardFooter>
  </BaseCard>
</template>
