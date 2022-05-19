<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UnderlyingRecap",
});
</script>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import BaseCard from "../BaseCard/BaseCard.vue";
import TokenIcon from "../TokenIcon/TokenIcon.vue";
import type { SelectedUnderlying } from "../../types";

export interface Props {
  underlyings?: SelectedUnderlying[];
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
  underlyings: () => [],
});
</script>

<template>
  <BaseCard :full-height="false" rounded="internal" color="no-bg" class="p-3">
    <template v-if="props.underlyings.length > 0">
      <div
        test-underlying-recap-header
        class="grid grid-cols-3 gap-3 mb-3 text-white font-medium text-center text-xs"
      >
        <span class="text-left">{{ t("app.asset") }}</span>
        <span>{{ t("app.max_strike") }}</span>
        <span>{{ t("app.max_duration") }}</span>
      </div>
      <div
        test-underlying-recap-container
        class="flex flex-col gap-6 font-semibold text-center text-white"
      >
        <div
          v-for="underlying in props.underlyings"
          :key="underlying.address"
          test-underlying-recap-row
          class="grid grid-cols-3 gap-3"
        >
          <span class="flex items-center gap-2">
            <TokenIcon
              :name="underlying.name"
              :image="underlying.image"
              :address="underlying.address"
              size="base"
            />
            {{ underlying.symbol }}
          </span>
          <span>{{ toPercentage(underlying.strike) }}</span>
          <span>{{ toDuration(underlying.duration) }}</span>
        </div>
      </div>
    </template>
    <div v-else test-underlying-recap-empty class="text-white/10">
      {{ t("app.empty") }}
    </div>
  </BaseCard>
</template>
