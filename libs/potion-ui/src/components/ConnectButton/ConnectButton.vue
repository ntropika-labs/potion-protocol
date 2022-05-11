<template>
  <div class="flex items-center">
    <BaseButton
      :label="ensOrAddress"
      palette="secondary"
      size="xs"
      weight="bold"
      class="font-mono !tracking-tight disabled:(!opacity-100)"
      :disabled="props.connected"
      @click="$emit('connectWallet')"
    >
      <template #pre-icon>
        <AvatarIcon
          v-if="props.avatar"
          class="h-4 w-4 mr-2"
          :loaded="props.imageLoaded"
          :avatar-url="props.avatar"
        />
      </template>
    </BaseButton>
    <button
      v-if="connected"
      class="focus:(outline-none)"
      @click="$emit('disconnectWallet')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="transition stroke-deepBlack-500 hover:stroke-deepBlack-700 focus:stroke-deepBlack-900"
        width="32"
        height="32"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 12l-4-4m4 4l-4 4m4-4H9m5 9a9 9 0 1 1 0-18"
        ></path>
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ConnectButton",
});
</script>
<script lang="ts" setup>
import { BaseButton, AvatarIcon } from "../../index";
import { computed } from "vue";
export interface Props {
  label: string;
  avatar?: string;
  connected: boolean;
  imageLoaded: boolean;
}
// const emits = ["connectWallet", "disconnectWallet"];
const props = defineProps<Props>();
const ensOrAddress = computed(() => {
  if (props.label.length === 42 && props.label.startsWith("0x")) {
    return (
      props.label.substring(0, 6) +
      "..." +
      props.label.substring(props.label.length - 4)
    );
  }
  return props.label;
});
</script>
