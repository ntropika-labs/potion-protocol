<template>
  <BaseCard class="self-start" :full-height="false">
    <div class="py-3 px-4 flex flex-col gap-4">
      <p class="text-sm uppercase">{{ t("my_pool") }} #{{ props.poolId }}</p>
      <div class="flex justify-between text-sm">
        <p>{{ t("deposit_collateral_title") }}</p>
        <p class="font-bold font-serif">{{ liquidity }}</p>
      </div>
      <div class="w-full bg-white/10 h-[1px]"></div>
      <p class="text-sm">{{ t("insurance_description") }}</p>
      <CriteriasRecap class="" :criterias="criterias"></CriteriasRecap>
    </div>

    <CardFooter class="flex justify-center gap-5">
      <BaseButton
        palette="transparent"
        :inline="true"
        :label="t('back')"
        @click="emits('navigate:back')"
      >
        <template #pre-icon>
          <i class="i-ph-caret-left"></i>
        </template>
      </BaseButton>
      <BaseButton
        test-pool-settings-card-next-button
        palette="secondary"
        :inline="true"
        :label="props.navigateNextLabel"
        :disabled="props.disableNavigationNext"
        :loading="props.actionLoading"
        @click="emits('navigate:next')"
      >
        <template v-if="props.navigateNextLabel === t('next')" #post-icon>
          <i class="i-ph-caret-right"></i>
        </template>
      </BaseButton>
    </CardFooter>
  </BaseCard>
</template>
<script lang="ts" setup>
import { BaseCard, CardFooter, BaseButton, CriteriasRecap } from "potion-ui";
import { useI18n } from "vue-i18n";
import type { Criteria } from "dapp-types";
interface Props {
  poolId: number;
  liquidity: string;
  criterias: Criteria[];
  disableNavigationNext: boolean;
  navigateNextLabel: string;
  actionLoading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  actionLoading: false,
});
const emits = defineEmits(["navigate:back", "navigate:next"]);
const { t } = useI18n();
</script>
