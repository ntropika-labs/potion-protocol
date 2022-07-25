<template>
  <div>
    <BaseCard class="p-4 items-center md:items-start">
      <div class="mb-3">
        <p class="capitalize">{{ t("protective_put_vault") }}</p>
        <a
          class="text-xs flex items-center font-normal text-white/50 hover:text-white transition"
          :href="etherscanUrl + '/address/' + validId"
        >
          <i class="i-ph-arrow-square-in mr-1 text-xs"></i>
          <span class="truncate max-w-[15ch]">{{ validId }}</span>
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
          <a :href="etherscanUrl + '/address/' + admin">
            <BaseTag>
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ admin }}</span>
            </BaseTag>
          </a>
        </div>
        <div>
          <p class="capitalize">{{ t("operator") }}</p>
          <a :href="etherscanUrl + '/address/' + operator">
            <BaseTag>
              <i class="i-ph-arrow-square-in mr-1"></i>
              <span class="truncate max-w-[15ch]">{{ operator }}</span>
            </BaseTag>
          </a>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-3 w-full">
        <LabelValue
          size="lg"
          :title="t('share_price')"
          :value="sharePrice.toString()"
          symbol="MKR/Share"
        />
        <LabelValue
          size="lg"
          :title="t('vault_size')"
          :value="totalAssets.toString()"
          symbol="MKR"
        />
        <LabelValue
          size="lg"
          :title="t('your_shares')"
          :value="userBalance.toString()"
          :symbol="`= ${userAssets} MKR`"
        />
      </div>
    </BaseCard>
    <div class="grid grid-cols-5 gap-4 mt-4">
      <BaseCard class="p-4 grid gap-4">
        <AssetTag
          :title="t('asset')"
          :token="{
            name: assetName,
            symbol: assetSymbol,
            address: assetAddress,
          }"
        />
        <LabelValue
          size="sm"
          :title="t('hedging_level')"
          :value="principalPercentages[0].toString()"
          symbol="%"
        />
        <LabelValue
          size="sm"
          :title="t('strike')"
          :value="strikePercentage.toString()"
          symbol="%"
        />
        <LabelValue
          size="sm"
          :title="t('cycle_duration')"
          :value="cycleDurationDays.toString()"
          symbol="days"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium')"
          :value="maxPremiumPercentage.toString()"
          symbol="%"
        />
        <LabelValue
          size="sm"
          :title="t('max_premium_slippage')"
          :value="premiumSlippage.toString()"
          symbol="%"
        />
        <LabelValue
          size="sm"
          :title="t('max_swap_slippage')"
          :value="swapSlippage.toString()"
          symbol="%"
        />
      </BaseCard>
      <div class="col-span-4 self-start">
        <BaseCard class="p-4">
          <div class="flex items-center gap-4">
            <p class="text-accent-500 text-sm font-normal capitalize">
              {{ t("time_left_until_next_cycle") }}
            </p>
            <BaseTag>
              <span class="text-accent-500">24h 13m 18s</span>
            </BaseTag>
          </div>
          <div class="flex gap-6 w-full mt-5">
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber
                v-model="depositAmount"
                class="self-stretch"
                :max="assetUserBalance"
                :min="1"
                :step="0.01"
                :unit="assetSymbol"
              />
              <BaseButton palette="secondary" :label="t('deposit')" />
            </div>
            <div class="w-1/2 flex flex-col items-center gap-4">
              <InputNumber
                v-model="withdrawAmount"
                class="self-stretch"
                :max="userBalance"
                :min="1"
                :step="0.01"
                :unit="vaultSymbol"
              />
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
// import { useEthersProvider } from "@/composables/useEthersProvider";
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useErc4626Contract } from "@/composables/useErc4626Contract";
import { useInvestmentVaultContract } from "@/composables/useInvestmentVaultContract";
import { useErc20Contract } from "@/composables/useErc20Contract";
import { usePotionBuyActionContract } from "@/composables/usePotionBuyActionContract";
import { contractsAddresses } from "@/helpers/hedgingVaultContracts";
const { t } = useI18n();
const status = ref(true);
const { PotionBuyAction } = contractsAddresses;

// const { lookupAddress } = useEthersProvider();
const depositAmount = ref(1);
const withdrawAmount = ref(1);
const route = useRoute();
const { id } = route.params;
const validId = computed(() => {
  if (Array.isArray(id)) {
    return id[0].toLowerCase();
  }
  return id.toLowerCase();
});

const assetPrice = ref(34.42);
const {
  strikePercentage,
  maxPremiumPercentage,
  cycleDurationDays,
  premiumSlippage,
  swapSlippage,
} = usePotionBuyActionContract(PotionBuyAction.address);
const { operator, admin, principalPercentages } =
  useInvestmentVaultContract(validId);
const {
  // vaultName,
  // vaultDecimals,
  vaultSymbol,
  assetName,
  assetSymbol,
  assetAddress,
  // assetDecimals,
  // assetImage,
  assetToShare,
  totalAssets,
  userBalance,
  userAssets,
} = useErc4626Contract(validId);

const { userBalance: assetUserBalance, getTokenBalance } =
  useErc20Contract(assetAddress);

watch(assetAddress, async () => {
  await getTokenBalance(true);
});

const sharePrice = computed(() => {
  return assetPrice.value * assetToShare.value;
});
</script>
