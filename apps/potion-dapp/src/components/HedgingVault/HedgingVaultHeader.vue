<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  BaseButton,
  BaseCard,
  BaseTag,
  TokenIcon,
  LabelValue,
  CountdownElement,
} from "potion-ui";
import type { Token } from "dapp-types";
import { getEtherscanUrl } from "@/helpers";

const { t } = useI18n();
interface Props {
  address: string;
  adminAddress: string;
  operatorAddress: string;
  underlyingAsset: Token;
  strikePercent: string;
  roundLength: string;
  premiumPercentage: string;
  slippagePercentage: string;
  uniswapSlippagePercentage: string;
  nextCycleTimestamp: string;
  currentTimestamp: string;
}

const props = defineProps<Props>();
const vaultEtherscanLink = computed(() => getEtherscanUrl(props.address));
const adminEtherscanLink = computed(() => getEtherscanUrl(props.adminAddress));
const operatorEtherscanLink = computed(() =>
  getEtherscanUrl(props.operatorAddress)
);
const emits = defineEmits<{
  (e: "back"): void;
}>();

const nextCycleUnixTimestamp = computed(() =>
  parseInt(props.nextCycleTimestamp)
);
const currentUnixTimestamp = computed(() => parseInt(props.currentTimestamp));
</script>
<template>
  <div class="grid gap-8 md:grid-cols-3 lg:grid-cols-9 items-center mb-8">
    <div>
      <BaseButton
        :label="t('back')"
        size="md"
        palette="white-o"
        @click="emits('back')"
      >
        <template #pre-icon>
          <i class="i-ph-caret-left"></i>
        </template>
      </BaseButton>
    </div>

    <CountdownElement
      :label="t('current_round_ends_in')"
      :start-timestamp-seconds="currentUnixTimestamp"
      :end-timestamp-seconds="nextCycleUnixTimestamp"
      :expiration-message="t('next_round_will_start_soon')"
      class="justify-center md:col-span-2 lg:(col-start-3 col-end-8)"
    />
  </div>
  <BaseCard class="px-12 py-8" test-header>
    <div
      class="grid gap-8 md:(grid-cols-2 gap-8) lg:(grid-cols-10 gap-0) justify-between"
    >
      <!-- START COLUMN 1 -->
      <div class="md:col-span-2 lg:(col-start-1 col-end-4)">
        <h2 class="text-2xl font-medium">Protective Put Vault</h2>
        <a
          :href="vaultEtherscanLink"
          test-header-address
          class="inline-flex items-center justify-center text-xs font-light my-2 hover:underline"
        >
          <i class="i-ph-arrow-square-in mr-1"></i>
          {{ props.address.substring(0, 8) }}...
        </a>
        <p class="font-normal mb-8">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Animi ipsum
          iste quidem corrupti harum consectetur, non dolorem corporis amet nam
          qui at aliquam suscipit repellendus repudiandae quae? Cum, illo nemo.
        </p>
        <div class="flex flex-wrap justify-between">
          <div class="flex flex-row gap-4">
            <p>Admin</p>
            <a
              :href="adminEtherscanLink"
              class="w-full flex items-center justify-center hover:underline"
            >
              <BaseTag
                size="md"
                class="group-hover:bg-black/20 hover:!bg-black/70 transition-none"
                test-admin-address
              >
                {{ props.adminAddress.substring(0, 8) }}...
                <i class="i-ph-arrow-square-in mr-1"></i>
              </BaseTag>
            </a>
          </div>
          <div class="flex flex-row gap-4">
            <p>Operator</p>
            <a
              :href="operatorEtherscanLink"
              class="w-full flex items-center justify-center hover:underline"
            >
              <BaseTag
                size="md"
                class="group-hover:bg-black/20 hover:!bg-black/70 transition-none"
                test-header-operator-address
              >
                {{ props.operatorAddress.substring(0, 8) }}...
                <i class="i-ph-arrow-square-in mr-1"></i>
              </BaseTag>
            </a>
          </div>
        </div>
      </div>
      <!-- END COLUMN 1 -->
      <!-- START COLUMN 2 -->
      <div
        class="lg:(col-start-5 col-end-7) flex flex-col justify-between md:py-8"
      >
        <div class="flex flex-row justify-between items-end">
          <p>Hedged Asset</p>
          <TokenIcon size="lg" :image="props.underlyingAsset.image" name="" />
        </div>
        <div>
          <LabelValue
            size="lg"
            :title="t('put_strike')"
            :value="props.strikePercent"
            value-type="number"
            value-size="3xl"
            symbol="%"
            direction="row"
            test-header-strike-percent
          ></LabelValue>
        </div>
        <div>
          <LabelValue
            size="lg"
            :title="t('put_duration')"
            :value="props.roundLength"
            value-type="raw"
            value-size="3xl"
            :symbol="t('days')"
            direction="row"
            test-header-strike-percent
          ></LabelValue>
        </div>
      </div>
      <!-- END COLUMN 2 -->
      <!-- START COLUMN 3 -->
      <div
        class="lg:(col-start-8 col-end-10) flex flex-col justify-between md:py-8"
      >
        <div>
          <LabelValue
            size="lg"
            :title="t('max_premium')"
            :value="props.premiumPercentage"
            value-type="number"
            value-size="3xl"
            symbol="%"
            direction="row"
            test-header-max-premium
          ></LabelValue>
        </div>
        <div>
          <LabelValue
            size="lg"
            :title="t('max_potion_slippage')"
            :value="props.slippagePercentage"
            value-type="number"
            value-size="3xl"
            symbol="%"
            direction="row"
            test-header-potion-slippage
          ></LabelValue>
        </div>
        <div>
          <LabelValue
            size="lg"
            :title="t('max_uniswap_slippage')"
            :value="props.uniswapSlippagePercentage"
            value-type="number"
            value-size="3xl"
            symbol="%"
            direction="row"
            test-header-swap-slippage
          ></LabelValue>
        </div>
      </div>
      <!-- END COLUMN 3 -->
    </div>
  </BaseCard>
</template>
