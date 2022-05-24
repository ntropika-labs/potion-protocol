<template>
  <div>CreatePool</div>
  <button @click="$emit('deployPool')">create pool</button>
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
}
const props = defineProps<Props>();
</script>
