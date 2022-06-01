<script lang="ts">
import type { NotificationProps } from "dapp-types";
import { defineComponent, toRef, watch } from "vue";
import { difference } from "lodash-es";

export default defineComponent({
  name: "NotificationDisplay",
});
</script>
<script lang="ts" setup>
import { BaseToast } from "potion-ui";

export interface Props {
  toasts: Map<string, NotificationProps>;
  hideTimeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  hideTimeout: process.env.NODE_ENV === "development" ? 20000 : 5000,
});

const emits = defineEmits<{
  (e: "hide-toast", toastId: string): void;
}>();

const visibleToasts = toRef(props, "toasts");

const removeToast = (hash: string) => emits("hide-toast", hash);
const addToast = (index: string, info: NotificationProps) => {
  setTimeout(() => {
    removeToast(index);
  }, props.hideTimeout);
};

watch(
  () => [...visibleToasts.value.keys()],
  (newMap, oldMap) => {
    console.log("triggering watch", newMap, oldMap, visibleToasts.value);
    const diffKeys = difference(newMap, oldMap || []);

    for (let i = 0; i < diffKeys.length; i++) {
      const key = diffKeys[i];
      const item = visibleToasts.value.get(key) as NotificationProps;

      addToast(key, item);
    }
  },
  { immediate: true }
);
</script>
<template>
  <template v-for="[hash, info] of visibleToasts" :key="hash">
    <Teleport to="#toast-wrap">
      <BaseToast
        class="z-50"
        :title="info.title"
        :body="info.body"
        :cta="info.cta"
        :srcset-map="info.srcset"
        :timeout="props.hideTimeout"
        @click="() => removeToast(hash)"
      ></BaseToast>
    </Teleport>
  </template>
</template>
