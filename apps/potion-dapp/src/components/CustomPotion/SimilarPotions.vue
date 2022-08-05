<script lang="ts" setup>
import { computed, toRef } from "vue";
import { useI18n } from "vue-i18n";
import { PotionCard } from "potion-ui";
import { useSimilarPotions } from "@/composables/useSimilarPotions";

import { CustomPotionStep } from "dapp-types";
import type { SelectableToken } from "dapp-types";

interface Props {
  token: SelectableToken | undefined;
  tokenAddress: string;
  strike: number;
  duration: number;
  price: number;
  gasSaving: string;
  currentStep: CustomPotionStep;
}

const props = defineProps<Props>();
const { t } = useI18n();

const {
  isLoading,
  computedSimilarByAsset,
  computedSimilarByStrike,
  computedSimilarByDuration,
} = useSimilarPotions(
  toRef(props, "tokenAddress"),
  toRef(props, "strike"),
  toRef(props, "duration"),
  toRef(props, "price")
);

const similarPotionsShown = computed(() => {
  switch (props.currentStep) {
    case CustomPotionStep.ASSET:
      return computedSimilarByAsset.value;
    case CustomPotionStep.STRIKE:
      return computedSimilarByStrike.value;
    case CustomPotionStep.EXPIRATION:
      return computedSimilarByDuration.value;
    case CustomPotionStep.REVIEW:
      return computedSimilarByDuration.value;
    default:
      return [];
  }
});
</script>

<template>
  <div class="mt-10">
    <h2 class="uppercase text-secondary-500 text-sm">
      {{ t("similar_potions") }}
    </h2>
    <div v-if="isLoading">{{ t("loading") }}</div>
    <div v-else-if="similarPotionsShown.length === 0">{{ t("empty") }}</div>
    <template v-else>
      <p class="text-sm">
        {{ t("similar_potion_message", { dollars: props.gasSaving }) }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 gap-5">
        <PotionCard
          v-for="(potion, index) in similarPotionsShown"
          :key="`${index}-similar-potion`"
          :token="token"
          :otoken-address="potion.tokenAddress"
          :strike-price="potion.strikePrice"
          :expiration="potion.expiry"
        >
          <router-link
            :to="`/potions/${potion.tokenAddress}`"
            class="rounded-full bg-dwhite-300 py-3 px-4 leading-none text-deepBlack-900 uppercase transition hover:( ring-1 ring-secondary-500 )"
          >
            {{ t("show") }}</router-link
          >
        </PotionCard>
      </div>
    </template>
  </div>
</template>
