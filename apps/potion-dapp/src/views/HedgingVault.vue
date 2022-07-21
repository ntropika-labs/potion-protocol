<template>
  <div>
    <BaseCard class="p-4 items-center md:items-start">
      <div class="mb-3">
        <p class="capitalize">{{ t("protectiveputvault") }}</p>
        <a
          class="text-xs flex items-center font-normal text-white/50 hover:text-white transition"
          :href="etherscanUrl + '/address/' + vaultAddress"
        >
          <i class="i-ph-arrow-square-in mr-1 text-xs"></i>
          <span class="truncate max-w-[15ch]">{{ vaultAddress }}</span>
        </a>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
        <div>
          <p class="capitalize">{{ t("status") }}</p>
          <BaseTag>
            <div
              class="h-2 w-2 rounded-full mr-1"
              :class="status ? 'bg-accent-500' : 'bg-error'"
            ></div>
            <span v-if="status">{{ t("unlocked") }}</span>
            <span v-else>{{ t("locked") }}</span> </BaseTag
          ><!--  -->
        </div>
        <div>
          <p class="capitalize">{{ t("admin") }}</p>
          <a :href="etherscanUrl + '/address/' + adminAddress">
            <BaseTag>
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ adminAddress }}</span>
            </BaseTag>
          </a>
        </div>
        <div>
          <p class="capitalize">{{ t("operator") }}</p>
          <a :href="etherscanUrl + '/address/' + operatorAddress">
            <BaseTag>
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ operatorAddress }}</span>
            </BaseTag>
          </a>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3 w-full">
        <LabelValue
          size="lg"
          :title="t('share_price')"
          value="23.4"
          symbol="MKR/Share"
        />
        <LabelValue
          size="lg"
          :title="t('vault_size')"
          value="482938"
          symbol="MKR"
        />
        <LabelValue
          size="lg"
          :title="t('your_shares')"
          value="32"
          symbol="= 50 MKR"
        />
      </div>
    </BaseCard>
    <div class="grid grid-cols-5 gap-4 mt-4">
      <BaseCard class="p-4 grid gap-4">
        <AssetTag
          :title="t('asset')"
          :token="{ name: 'Maker', symbol: 'MKR', address: '0x98e9' }"
        />
        <LabelValue
          size="sm"
          :title="t('hedging_level')"
          value="95"
          symbol="%"
        />
        <LabelValue size="sm" :title="t('strike')" value="80" symbol="%" />
        <LabelValue
          size="sm"
          :title="t('cycle_duration')"
          value="5"
          symbol="days"
        />
        <LabelValue size="sm" :title="t('max_premium')" value="10" symbol="%" />
        <LabelValue
          size="sm"
          :title="t('maxpremiumslippage')"
          value="0.2"
          symbol="%"
        />
        <LabelValue
          size="sm"
          :title="t('maxswapslippage')"
          value="0.01"
          symbol="%"
        />
      </BaseCard>
      <div class="col-span-4 self-start">
        <BaseCard class="p-4">
          <div class="flex items-center gap-4">
            <p class="text-accent-500 text-sm font-normal capitalize">
              {{ t("timeleft-untilnext_cycle") }}
            </p>
            <BaseTag>
              <span class="text-accent-500">24h 13m 18s</span>
            </BaseTag>
          </div>
          <div class="flex gap-6 w-full mt-5">
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber class="self-stretch" />
              <BaseButton palette="secondary" :label="t('deposit')" />
            </div>
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber class="self-stretch" />
              <BaseButton palette="secondary" :label="t('withdraw')" />
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  BaseCard,
  BaseTag,
  LabelValue,
  AssetTag,
  InputNumber,
  BaseButton,
} from "potion-ui";
import { useI18n } from "vue-i18n";
import { etherscanUrl } from "@/helpers";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { onMounted, ref } from "vue";

const { t } = useI18n();
const status = ref(true);
const vaultAddress = ref("0xc0ffee254729296a45a3885639AC7E10F9d54979");
const adminAddress = ref("0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E");
const operatorAddress = ref("0x57B9f79515fED84d2f67e9Bf0fF3A17B9e60aD9E");
const { lookupAddress } = useEthersProvider();

onMounted(async () => {
  adminAddress.value = await lookupAddress(adminAddress.value);
  operatorAddress.value = await lookupAddress(operatorAddress.value);
  vaultAddress.value = await lookupAddress(vaultAddress.value);
});
</script>
