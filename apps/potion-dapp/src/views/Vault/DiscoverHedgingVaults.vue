<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import {
  JumboHeader,
  VaultCard,
  BaseButton,
  TokenIcon,
  BaseCard,
} from "potion-ui";
import { SrcsetEnum, type Token } from "dapp-types";

import { useHedgingVaults } from "@/composables/useHedgingVaults";
import { useUserDataStore } from "@/stores/useUserDataStore";
import type { VaultDataWithStrategy } from "@/types";
import { groupVaultsByUnderlyingAndDeposit } from "@/helpers/hedgingVaults";

interface StrategyButton {
  label: string;
  code: string;
  enabled?: boolean;
  notice?: string;
}

const { t } = useI18n();

// user info
const { walletAddress } = storeToRefs(useUserDataStore());

const jumboIconSrcset = new Map([
  [SrcsetEnum.AVIF, "/icons/cauldron-big.avif"],
  [SrcsetEnum.PNG, "/icons/cauldron-big.png"],
  [SrcsetEnum.WEBP, "/icons/cauldron-big.webp"],
]);

const currentSelectedStrategy: Ref<string | undefined> = ref();
const { loadVaults } = useHedgingVaults(walletAddress);

const availableUnderlyings: Ref<Array<Token>> = ref([]);
const vaultsByUnderlying: Ref<{
  [underlyinAddress: string]: Array<VaultDataWithStrategy>;
}> = ref({});
const personalVaults: Ref<Array<VaultDataWithStrategy>> = ref([]);

const getStrategyPalette = (code: string): "primary" | "filter" => {
  return currentSelectedStrategy.value === code ? "primary" : "filter";
};

const setActiveStrategy = (code?: string) => {
  currentSelectedStrategy.value = code;
};

const strategyButtons: Array<StrategyButton> = [
  {
    label: t("protective_put"),
    code: "protective_put",
    enabled: false,
  },
  {
    label: t("straddle"),
    code: "straddle",
    enabled: false,
  },
  {
    label: t("delta_neutral"),
    code: "delta_neutral",
    notice: t("coming_soon"),
  },
];

const updateData = async () => {
  const vaults = await loadVaults();

  const data = groupVaultsByUnderlyingAndDeposit(vaults);
  availableUnderlyings.value = data.availableUnderlyings;
  vaultsByUnderlying.value = data.vaultsByUnderlying;
  personalVaults.value = data.personalVaults;
};

onMounted(async () => {
  await updateData();
});

watch(walletAddress, () => updateData());
</script>

<template>
  <JumboHeader
    :title="t('hedging_vault_title')"
    :subtitle="t('heding_vault_subtitle')"
    :cta-label="t('hedging_vault')"
    :icon-srcset="jumboIconSrcset"
  >
  </JumboHeader>
  <h2 class="mt-8 mb-4 ml-2 font-semibold text-3xl">{{ t("my_vaults") }}</h2>
  <BaseCard>
    <div
      class="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-12 m-4"
    >
      <router-link
        v-for="vault in personalVaults"
        :key="vault.address"
        :to="{
          name: 'hedging-vault',
          params: {
            id: vault.address,
          },
        }"
      >
        <VaultCard
          :address="vault.address"
          :asset="vault.underlying"
          :max-premium="vault.action.maxPremium"
          :cycle-duration-secs="vault.action.cycleDurationInSecs"
          :strike="vault.strikePercentage"
          :strategy="vault.strategy"
        />
      </router-link>
    </div>
  </BaseCard>

  <h2 class="mt-8 mb-4 ml-2 font-semibold text-3xl">
    {{ t("discover_hedging_vaults_title") }}
  </h2>
  <div class="flex flex-wrap items-start gap-3 mt-4 mb-6 ml-2">
    <BaseButton
      label="All"
      size="md"
      palette="primary"
      @click="setActiveStrategy()"
    />
    <div
      v-for="str in strategyButtons"
      :key="str.code"
      class="flex flex-col items-center"
    >
      <BaseButton
        :palette="getStrategyPalette(str.code)"
        :label="str.label"
        size="md"
        :disabled="!str.enabled"
        :class="[str.notice ? 'bg-white/20' : '']"
        @click="setActiveStrategy(str.code)"
      />
      <span v-if="str.notice" class="text-dwhite-300/80 text-xs mt-2">{{
        str.notice
      }}</span>
    </div>
  </div>
  <div class="flex flex-col gap-8">
    <BaseCard
      v-for="underlying in availableUnderlyings"
      :key="underlying.address"
      class="px-6 py-4"
    >
      <div class="flex flex-row items-center gap-2 mb-8">
        <TokenIcon
          class="rounded-full bg-deep-black-700 mr-2"
          :address="underlying.address"
          :name="underlying.name"
          :image="underlying.image"
          size="lg"
        />
        <p class="font-semibold text-3xl">{{ underlying.symbol }}</p>
      </div>
      <div
        class="grid grid-flow-row grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 mt-4"
      >
        <router-link
          v-for="vault in vaultsByUnderlying[underlying.address]"
          :key="vault.address"
          :to="{
            name: 'hedging-vault',
            params: {
              id: vault.address,
            },
          }"
        >
          <VaultCard
            :address="vault.address"
            :asset="vault.underlying"
            :max-premium="vault.action.maxPremium"
            :cycle-duration-secs="vault.action.cycleDurationInSecs"
            :strike="vault.strikePercentage"
            :strategy="vault.strategy"
          />
        </router-link>
      </div>
      <div class="p-8"></div>
    </BaseCard>
  </div>
</template>
