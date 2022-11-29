<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { getEtherscanUrl } from "../../helpers";

import TokenIcon from "../TokenIcon/TokenIcon.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import BaseButton from "../BaseButton/BaseButton.vue";

import LabelValue from "../LabelValue/LabelValue.vue";
import BaseTag from "../BaseTag/BaseTag.vue";

import { VaultStrategy, type Token } from "dapp-types";

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
const vaultEtherscanLink = computed(() => getEtherscanUrl(props.address));
const vaultEtherscanLabel = computed(
  () => props.address.substring(0, 8) + "..."
);
const callbackNavigateToEtherscan = (url: string) => {
  window && window.open(url, "_blank")?.focus();
};
</script>

<template>
  <BaseCard
    color="glass"
    class="text-dwhite-400 overflow-hidden"
    :full-height="false"
    test-vault-card
  >
    <div
      class="group relative grid grid-flow-row grid-cols-2 justify-between items-center gap-6 p-6 transition-all hover:(bg-gradient-to-br bg-opacity-100 from-primary-500 via-primary-400 to-primary-600)"
    >
      <div class="col-span-2 grid grid-cols-2 justify-between gap-6">
        <BaseTag
          size="md"
          class="!capitalize group-hover:bg-black/20 transition-none"
          test-strategy
          >{{ strategyName }}</BaseTag
        >
        <BaseButton
          :label="vaultEtherscanLabel"
          size="sm"
          palette="flat"
          class="!rounded bg-white/10 !hover:bg-black/40 group-hover:bg-black/20 transition-none z-4"
          test-address
          @click.prevent="callbackNavigateToEtherscan(vaultEtherscanLink)"
        >
          <template #post-icon>
            <i class="i-ph-arrow-square-in mr-1"></i> </template
        ></BaseButton>
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
        test-max-premium
      ></LabelValue>
      <LabelValue
        size="lg"
        :title="t('round_length')"
        :value="roundLength.toString()"
        value-type="raw"
        value-size="3xl"
        symbol="d"
        test-round-length
      ></LabelValue>
    </div>
  </BaseCard>
</template>
