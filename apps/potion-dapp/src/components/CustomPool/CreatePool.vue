<template>
  <div>CreatePool</div>
  <button @click="$emit('deployPool')">{{ props.actionLabel }}</button>
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

defineEmits(["deployPool"]);
interface Props {
  transaction: ContractTransaction | null;
  receipt: ContractReceipt | null;
  actionLabel: string;
}
const props = defineProps<Props>();
</script>
