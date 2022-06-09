<script lang="ts" setup>
import { computed } from "vue";
import type { Token } from "dapp-types";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

import AssetTag from "../AssetTag/AssetTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseButton from "../BaseButton/BaseButton.vue";
import LabelValue from "../LabelValue/LabelValue.vue";

export interface Props {
  withdrawable: boolean;
  expiry: string;
  token: Token;
  strikePrice: string;
  currentPayout: string;
  quantity: string;
  etherscan?: {
    url: string;
    label: string;
  };
}

const { t } = useI18n();

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "withdraw"): void;
}>();
const isExpired = computed(() => {
  return dayjs.unix(parseInt(props.expiry)).isBefore(dayjs());
});
const withdrawLabel = computed(() => {
  return isExpired.value ? t("withdraw") : t("not_withdrawable");
});
</script>
<template>
  <BaseCard class="text-dwhite-400" :full-height="false">
    <div
      class="grid grid-flow-row grid-cols-2 justify-between items-center gap-8 p-4"
    >
      <div>
        <BaseTag class="uppercase">{{ t("put_option") }}</BaseTag>
      </div>

      <span v-if="props.etherscan">
        <a
          :href="props.etherscan.url"
          class="flex items-center text-xs font-serif font-semibold hover:underline self-end"
        >
          <i class="i-ph-arrow-square-in mr-1"></i>
          {{ props.etherscan.label }}
        </a>
      </span>
    </div>
    <div class="grid grid-flow-row grid-cols-2 gap-6 py-3 px-4 grow pb-4">
      <AssetTag :token="props.token" title="" size="xl" class="col-span-2" />
      <LabelValue
        size="md"
        :title="t('strike_price')"
        :value="props.strikePrice"
        value-type="currency"
        symbol="$"
      />
      <LabelValue
        size="md"
        :title="t('expiration')"
        :value="props.expiry"
        value-type="timestamp"
      />
      <LabelValue
        size="md"
        :title="t('quantity')"
        :value="props.quantity.toString()"
      />
      <LabelValue
        size="md"
        :title="t('current_payout')"
        :value="props.currentPayout"
        value-type="currency"
        value-color-class="text-secondary-500"
        symbol="$"
      />
    </div>
    <CardFooter v-if="props.withdrawable" class="flex justify-center gap-3">
      <BaseButton
        palette="secondary"
        :label="withdrawLabel"
        :disabled="!isExpired"
        @click="emits('withdraw')"
      ></BaseButton>
    </CardFooter>
  </BaseCard>
</template>
