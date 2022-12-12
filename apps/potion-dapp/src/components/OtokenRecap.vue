<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  BaseCard,
  BaseTag,
  AssetTag,
  LabelValue,
  formatAddress,
  getEtherscanUrl,
} from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";
import { contractsAddresses } from "@/helpers/contracts";
import BuyPotionButton from "@/components/CustomPotion/BuyPotionButton.vue";

import type { SelectableToken } from "dapp-types";

interface Props {
  address: string;
  token?: SelectableToken;
  strikePrice?: string;
  expiration?: string;
  loading: boolean;
  slippage: number;
  balance: number;
  allowance: number;
  valid: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  token: undefined,
  strikePrice: "",
  expiration: "",
});

const emits = defineEmits<{
  (e: "buyPotions"): void;
}>();

const { t } = useI18n();

const collateral = useTokenList(contractsAddresses.USDC.address.toLowerCase());

const etherscanUrl = computed(() => getEtherscanUrl(props.address));
</script>

<template>
  <BaseCard class="p-4">
    <div class="w-full flex gap-2 justify-between md:justify-start">
      <BaseTag>{{ t("put_option") }}</BaseTag>
      <a
        :href="etherscanUrl"
        class="flex items-center text-xs font-semibold hover:underline"
      >
        <i class="i-ph-arrow-square-in mr-1"></i>
        {{ formatAddress(props.address) }}
      </a>
    </div>
    <div
      class="mt-5 grid grid-cols-2 gap-6 justify-items-center md:grid-cols-4"
    >
      <AssetTag
        class="col-span-2 md:col-span-1 md:justify-self-start"
        :title="t('asset')"
        :token="props.token"
      />
      <LabelValue
        :title="t('strike_price')"
        :value="props.strikePrice"
        value-type="currency"
        :symbol="collateral.symbol"
        test-potion-strike-price
      />
      <LabelValue
        :title="t('expiration')"
        :value="props.expiration"
        value-type="timestamp"
        test-potion-expiration
      />

      <div class="col-span-2 md:col-span-1 md:justify-self-end">
        <BuyPotionButton
          test-potion-buy-button
          :loading="props.loading"
          :slippage="props.slippage"
          :allowance="props.allowance"
          :balance="props.balance"
          :valid="valid"
          @buy-potions="emits('buyPotions')"
        ></BuyPotionButton>
      </div>
    </div>
  </BaseCard>
</template>
