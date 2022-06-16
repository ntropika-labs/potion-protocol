<template>
  <BaseCard class="group relative">
    <div
      class="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity rounded-3xl group-hover:opacity-100 bg-radial-primary"
    ></div>
    <div class="grid grid-cols-2 p-4 gap-8 relative">
      <BaseTag class="self-center justify-self-start z-10">{{
        t("put_option")
      }}</BaseTag>
      <span class="self-center justify-self-end text-dwhite-300 font-mono z-10">
        <a
          :href="etherscanUrl"
          class="flex items-center text-xs font-serif font-semibold hover:underline"
        >
          <i class="i-ph-arrow-square-in mr-1"></i>
          {{ otokenAddress.substring(0, 8) }}...
        </a>
      </span>
      <AssetTag
        class="col-span-2 z-10"
        :token="props.token"
        title=""
        size="2xl"
      />
      <LabelValue
        size="md"
        :title="t('strike_price')"
        :value="props.strikePrice"
        value-type="currency"
        class="group-hover:opacity-0"
      />
      <LabelValue
        size="md"
        :title="t('expiration')"
        :value="props.expiration"
        value-type="timestamp"
        class="group-hover:opacity-0"
      />
    </div>
    <div
      class="absolute z-10 bottom-4 left-0 w-full justify-center hidden group-hover:flex transition"
    >
      <BaseButton
        :label="t('show')"
        palette="white"
        size="sm"
        @click="$emit('click')"
      />
    </div>
  </BaseCard>
</template>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
import AssetTag from "../AssetTag/AssetTag.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseButton from "../BaseButton/BaseButton.vue";
import LabelValue from "../LabelValue/LabelValue.vue";

import { computed } from "vue";
import type { Token } from "dapp-types";
import { useI18n } from "vue-i18n";

export interface Props {
  token: Token;
  otokenAddress: string;
  strikePrice: string;
  expiration: string;
}
const props = defineProps<Props>();
defineEmits(["click"]);
const { t } = useI18n();

const etherscanUrl = computed(() => {
  return `https://etherscan.io/address/${props.otokenAddress}`;
});
</script>
