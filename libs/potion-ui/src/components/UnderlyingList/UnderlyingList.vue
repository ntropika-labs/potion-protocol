<script lang="ts">
import { defineComponent } from "vue";
import type { OptionToken } from "dapp-types";

export default defineComponent({
  name: "UnderlyingList",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
import AssetTag from "../AssetTag/AssetTag.vue";
import LabelValue from "../LabelValue/LabelValue.vue";
export interface Props {
  assetsFlat: Array<OptionToken>;
  priceMap: Map<string, string>;
  stableCoinCollateral: string;
}

const props = defineProps<Props>();

const getOptionPrice = (address: string) => {
  return props.priceMap.get(address) || "";
};
</script>
<template>
  <div class="flex flex-col gap-4">
    <BaseCard
      v-for="underlying in assetsFlat"
      :key="underlying.id"
      :full-height="false"
      class="p-6"
    >
      <div class="flex items-center">
        <div class="grid grid-flow-row grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <AssetTag size="md" title="Underlying" :token="underlying" />
          <LabelValue
            title="Current Price"
            :value="getOptionPrice(underlying.address)"
            value-type="number"
            :symbol="props.stableCoinCollateral"
            alignment="center"
          />
          <LabelValue
            alignment="center"
            title="Strike"
            :value="underlying.strike"
            value-type="number"
            symbol="%"
          />
          <LabelValue
            alignment="right"
            title="Duration"
            :value="underlying.duration"
            value-type="number"
            symbol="dd"
          />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
