<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { TabItem } from "potion-ui";
import { AVAILABLE_TABS } from "@/types";

interface Props {
  modelValue: AVAILABLE_TABS;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: AVAILABLE_TABS): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="p-4 flex justify-center gap-4 lg:gap-6">
    <TabItem
      class="w-1/3"
      :is-active="props.modelValue === AVAILABLE_TABS.DEPOSIT"
      @click="emit('update:modelValue', AVAILABLE_TABS.DEPOSIT)"
      >{{ t("deposit") }}</TabItem
    >
    <TabItem
      class="w-1/3"
      :is-active="props.modelValue === AVAILABLE_TABS.WITHDRAWAL"
      @click="emit('update:modelValue', AVAILABLE_TABS.WITHDRAWAL)"
      >{{ t("withdrawal") }}</TabItem
    >
  </div>
</template>
