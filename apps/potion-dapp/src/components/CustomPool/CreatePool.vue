<template>
  <div class="grid gap-5 md:grid-cols-12">
    <PoolSettingsCard
      :pool-id="props.poolId"
      :liquidity="props.liquidity"
      :criterias="props.criterias"
      :disable-navigation-next="props.disableAction"
      :navigate-next-label="props.actionLabel"
      class="md:col-span-4 xl:col-span-3 self-start"
      @navigate:back="emits('navigate:back')"
      @navigate:next="emits('deployPool')"
    />
    <div class="md:col-span-8 xl:col-span-9 p-6"></div>
  </div>
  <div>
    <code class="bg-black">
      {{ props.transaction }}
    </code>
    <code class="bg-blue-900">{{ props.receipt }}</code>
  </div>
</template>
<script lang="ts" setup>
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type { Criteria } from "dapp-types";

import PoolSettingsCard from "@/components/CustomPool/PoolSettingsCard.vue";

const emits = defineEmits(["deployPool", "navigate:back"]);
interface Props {
  transaction: ContractTransaction | null;
  receipt: ContractReceipt | null;
  actionLabel: string;
  liquidity: string;
  poolId: number;
  criterias: Criteria[];
  disableAction: boolean;
}
const props = defineProps<Props>();
</script>
