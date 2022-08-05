<script lang="ts" setup>
import { BaseCard } from "potion-ui";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import type { OrderBookEntries } from "@/composables/usePotionOrders";

interface Props {
  orders: OrderBookEntries;
}

const props = defineProps<Props>();

const { t } = useI18n();
</script>

<template>
  <BaseCard class="p-4 text-sm">
    <p>{{ t("orderbook") }}</p>
    <div class="grid grid-cols-2 gap-1 mt-5 border-b-1 border-white/10 mb-3">
      <div class="capitalize">{{ t("timestamp") }}</div>
      <div class="capitalize text-right">{{ t("quantity") }}</div>
    </div>
    <div
      v-for="(order, index) in props.orders"
      :key="`order-${index}`"
      class="flex w-full justify-between py-1 odd:bg-white/10 rounded px-2 mt-0.5"
    >
      <div>
        {{ dayjs.unix(parseInt(order.timestamp)).format("ll") }}
      </div>
      <div>
        {{ order.numberOfOTokens }}
      </div>
    </div>
  </BaseCard>
</template>
