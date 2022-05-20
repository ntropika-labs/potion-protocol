<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CriteriasRecap",
});
</script>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import BaseCard from "../BaseCard/BaseCard.vue";
import TokenIcon from "../TokenIcon/TokenIcon.vue";
import type { Criteria } from "dapp-types";

export interface Props {
  criterias?: Criteria[];
}

const { t } = useI18n();

const relativeTimeFormatter = new Intl.RelativeTimeFormat(navigator.language, {
  numeric: "always",
  style: "narrow",
});

const toPercentage = (n: number) => `${n}%`;
const toDuration = (days: number) => {
  const parts = relativeTimeFormatter.formatToParts(days, "day");
  return parts
    .slice(1)
    .map((p) => p.value)
    .join("");
};

const props = withDefaults(defineProps<Props>(), {
  criterias: () => [],
});
</script>

<template>
  <BaseCard :full-height="false" rounded="internal" color="no-bg" class="p-3">
    <template v-if="props.criterias.length > 0">
      <div
        test-criterias-recap-header
        class="grid grid-cols-3 gap-3 mb-3 text-white font-medium text-center text-xs"
      >
        <span class="text-left">{{ t("app.asset") }}</span>
        <span>{{ t("app.max_strike") }}</span>
        <span>{{ t("app.max_duration") }}</span>
      </div>
      <div
        test-criterias-recap-container
        class="flex flex-col gap-6 font-semibold text-center text-white"
      >
        <div
          v-for="criteria in props.criterias"
          :key="criteria.token.address"
          test-criterias-recap-row
          class="grid grid-cols-3 gap-3"
        >
          <span class="flex items-center gap-2">
            <TokenIcon
              :name="criteria.token.name"
              :image="criteria.token.image"
              :address="criteria.token.address"
              size="base"
            />
            {{ criteria.token.symbol }}
          </span>
          <span>{{ toPercentage(criteria.maxStrike) }}</span>
          <span>{{ toDuration(criteria.maxDuration) }}</span>
        </div>
      </div>
    </template>
    <div v-else test-criterias-recap-empty class="text-white/10">
      {{ t("app.empty") }}
    </div>
  </BaseCard>
</template>
