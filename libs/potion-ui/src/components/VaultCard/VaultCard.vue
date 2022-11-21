<script setup lang="ts">
import { useI18n } from "vue-i18n";

import TokenIcon from "../TokenIcon/TokenIcon.vue";
import BaseCard from "../BaseCard/BaseCard.vue";

import LabelValue from "../LabelValue/LabelValue.vue";
import BaseTag from "../BaseTag/BaseTag.vue";

import { VaultStrategy, type Token } from "dapp-types";
import { computed } from "vue";
import { getEtherscanUrl } from "@/helpers";

const props = withDefaults(
  defineProps<{
    address: string;
    asset: Token;
    strike: string;
    maxPremium: string;
    cycleDurationSecs: string;
    currency?: string;
    strategy?: VaultStrategy;
  }>(),
  { currency: "USDC", strategy: VaultStrategy.PROTECTIVE_PUT }
);

const emits = defineEmits<{
  (e: "selected"): void;
}>();

const { t } = useI18n();

const roundLength = computed(
  () => Number.parseInt(props.cycleDurationSecs) / 86400
);

const strategyName = computed(() => {
  switch (props.strategy) {
    case VaultStrategy.DELTA_NEUTRAL:
      return t("delta_neutral");
    case VaultStrategy.STRADDLE:
      return t("straddle");
    default:
    case VaultStrategy.PROTECTIVE_PUT:
      return t("protective_put");
  }
});
const vaultEtherscanLink = getEtherscanUrl(props.address);
</script>

<template>
  <BaseCard
    class="text-dwhite-400 overflow-hidden"
    :full-height="false"
    test-vault-card
  >
    <a href="#" @click.prevent="emits('selected')">
      <div
        class="group relative grid grid-flow-row grid-cols-2 justify-between items-center gap-6 p-6 bg-gradient-to-br transition-all hover:(bg-opacity-100 from-primary-500 via-primary-400 to-primary-600)"
      >
        <div class="col-span-2 grid grid-cols-2 justify-between gap-6">
          <BaseTag
            size="md"
            class="!capitalize group-hover:bg-black/20 transition-none"
            >{{ strategyName }}</BaseTag
          >
          <a
            :href="vaultEtherscanLink"
            class="w-full flex items-center justify-center hover:underline"
          >
            <BaseTag
              size="md"
              class="group-hover:bg-black/20 hover:!bg-black/70 transition-none"
            >
              {{ props.address.substring(0, 8) }}...
              <i class="i-ph-arrow-square-in mr-1"></i>
            </BaseTag>
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <span>{{ t("covered_asset") }}</span>
          <TokenIcon
            class="rounded-full bg-deep-black-700 mr-2"
            :address="props.asset.address"
            :name="props.asset.name"
            :image="props.asset.image"
            size="2xl"
            test-asset
          />
        </div>
        <LabelValue
          size="lg"
          :title="t('strike')"
          :value="props.strike.toString()"
          value-type="number"
          value-size="3xl"
          symbol="%"
          test-strike-percentage
        ></LabelValue>
        <LabelValue
          size="lg"
          :title="t('max_premium')"
          :value="props.maxPremium.toString()"
          value-type="number"
          value-size="3xl"
          symbol="%"
          test-strike-percentage
        ></LabelValue>
        <LabelValue
          size="lg"
          :title="t('round_length')"
          :value="roundLength.toString()"
          value-type="raw"
          value-size="3xl"
          symbol="d"
          test-strike-percentage
        ></LabelValue>
      </div>
    </a>
  </BaseCard>
</template>
