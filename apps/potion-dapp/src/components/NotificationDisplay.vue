<script lang="ts">
import type { NotificationProps } from "dapp-types";
import { defineComponent } from "vue";
export default defineComponent({
  name: "NotificationDisplay",
});
</script>
<script lang="ts" setup>
import { BaseToast } from "potion-ui";

export interface Props {
  toasts: Map<string, NotificationProps>;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: "hide-toast", toastId: string): void;
}>();
</script>
<template>
  <template v-for="[hash, info] of props.toasts" :key="hash">
    <Teleport to="#toast-wrap">
      <BaseToast
        class="z-50"
        :title="info.title"
        :body="info.body"
        :cta="info.cta"
        :srcset-map="info.srcset"
        :timeout="info.hideTimeout"
        @click="() => emits('hide-toast', hash)"
      ></BaseToast>
    </Teleport>
  </template>
</template>
