<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { BaseCard, InputNumber } from "potion-ui";

interface Props {
  duration: number;
  maxDuration: number;
  maxDurationInDays: string;
  selectedDate: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "update:duration", duration: number): void;
  (e: "valid-input", value: boolean): void;
}>();
const { t } = useI18n();
</script>

<template>
  <div class="xl:col-span-2 flex justify-center">
    <BaseCard color="no-bg" class="w-full xl:w-4/7 justify-between">
      <div class="flex justify-between p-4 items-start">
        <div class="flex gap-2 items-center">
          <p class="text-sm capitalize">{{ t("max_duration") }}</p>
        </div>
        <div class="text-sm">
          <p>{{ props.maxDuration }} {{ t("days") }}</p>
          <p>{{ props.maxDurationInDays }}</p>
        </div>
      </div>
      <InputNumber
        :model-value="props.duration"
        color="no-bg"
        :title="t('your_potion_expires_in')"
        :min="1"
        :max="props.maxDuration"
        :step="1"
        unit="days"
        :max-decimals="0"
        :footer-description="t('expiration')"
        :footer-value="props.selectedDate"
        @update:model-value="(value: number) => emits('update:duration', value)"
        @valid-input="(value: boolean) => emits('valid-input', value)"
      />
    </BaseCard>
  </div>
</template>
