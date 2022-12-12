<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "MyPotionCard",
});
</script>
<script lang="ts" setup>
import { computed } from "vue";
import type { Token } from "dapp-types";
import { useI18n } from "vue-i18n";

import AssetTag from "../AssetTag/AssetTag.vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import CardFooter from "../CardFooter/CardFooter.vue";
import BaseTag from "../BaseTag/BaseTag.vue";
import BaseButton from "../BaseButton/BaseButton.vue";
import LabelValue from "../LabelValue/LabelValue.vue";

export interface Props {
  withdrawable: boolean;
  expiry: string;
  isExpired: boolean;
  isWithdrawEnabled: boolean;
  token: Token;
  strikePrice: string;
  currentPayout: string;
  quantity: string;
  currency?: string;
  otokenAddress: string;
}

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  currency: "USDC",
  etherscan: () => ({ url: "", label: "" }),
});
const emits = defineEmits<{
  (e: "withdraw"): void;
}>();

const withdrawLabel = computed(() => {
  return props.isWithdrawEnabled ? t("withdraw") : t("not_withdrawable");
});
const payoutLabel = computed(() => {
  return props.isExpired ? t("total_payout") : t("current_payout");
});

const etherscanUrl = computed(() => {
  return `https://etherscan.io/address/${props.otokenAddress}`;
});
</script>
<template>
  <BaseCard class="text-dwhite-400" :full-height="false" test-my-potion-card>
    <div class="grid grid-flow-row grid-cols-2 justify-between gap-8 py-4 px-6">
      <BaseTag class="uppercase justify-self-start">{{
        t("put_option")
      }}</BaseTag>

      <span class="self-center justify-self-end text-dwhite-300 font-mono z-10">
        <a
          :href="etherscanUrl"
          class="flex items-center text-xs font-semibold hover:underline"
        >
          <i class="i-ph-arrow-square-in mr-1"></i>
          {{ otokenAddress.substring(0, 8) }}...
        </a>
      </span>
    </div>
    <div class="grid grid-flow-row grid-cols-2 gap-6 py-3 px-6 grow pb-4">
      <AssetTag :token="props.token" title="" size="2xl" class="col-span-2" />
      <LabelValue
        size="md"
        :title="t('strike_price')"
        :value="props.strikePrice"
        value-type="currency"
        :symbol="props.currency"
        test-strike-price
      />
      <LabelValue
        size="md"
        :title="t('expiration')"
        :value="props.expiry"
        value-type="timestamp"
        test-expiration
      />
      <LabelValue
        size="md"
        :title="t('quantity')"
        :value="props.quantity.toString()"
        test-quantity
      />
      <LabelValue
        size="md"
        :title="payoutLabel"
        :value="props.currentPayout"
        value-type="currency"
        value-color-class="text-secondary-500"
        :symbol="props.currency"
        test-current-payout
      />
    </div>
    <CardFooter v-if="props.withdrawable" class="flex justify-center gap-3">
      <BaseButton
        palette="secondary"
        :label="withdrawLabel"
        :disabled="!(props.isExpired && props.isWithdrawEnabled)"
        test-withdraw-button
        @click="emits('withdraw')"
      ></BaseButton>
    </CardFooter>
  </BaseCard>
</template>
