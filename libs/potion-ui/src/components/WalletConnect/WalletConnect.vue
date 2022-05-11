<template>
  <Transition name="fade" :duration="550">
    <div ref="modal">
      <template v-if="props.isConnected">
        <div
          class="bg-slate-50 ring-1 ring-gray-300 rounded-full p-1 shadow-lg transition overflow-hidden"
        >
          <div class="flex flex-row items-center gap-4 px-2">
            <div class="flex-0">
              <AvatarIcon
                :loaded="props.isConnected"
                :avatar-url="props.avatarUrl"
                :fallback-image-icon="props.fallbackImage"
              ></AvatarIcon>
            </div>
            <div class="flex flex-grow">
              <button
                class="w-full text-left bg-gray-50 py-1 px-2 rounded-lg"
                :class="[
                  props.hasAdditionalInfo
                    ? 'hover:bg-slate-200'
                    : 'cursor-normal',
                ]"
                :disabled="!props.hasAdditionalInfo"
                @click="() => (isOpen = !isOpen)"
              >
                <p class="font-bold text-md tracking-wide font-mono">
                  {{ props.shortAddress }}
                </p>
                <p class="text-sm text-gray-600 tracking-widest">
                  {{ props.ethBalance }} ETH
                </p>
              </button>
              <div class="flex items-center">
                <BaseButton
                  size="icon"
                  palette="opaque"
                  label=""
                  :disabled="props.isConnecting"
                  @click="() => emit('disconnectWallet')"
                  ><template #pre-icon
                    ><img
                      :src="logoutIcon"
                      class="w-10 inline-block" /></template
                ></BaseButton>
              </div>
            </div>
          </div>
          <div v-if="props.hasAdditionalInfo && isOpen" class="p-2">
            <slot />
          </div>
        </div>
      </template>
      <template v-else-if="props.showConnectButton">
        <BaseButton
          palette="secondary"
          label="Connect to wallet"
          :disabled="props.isConnecting"
          @click="() => emit('connectWallet')"
        />
      </template>
    </div>
  </Transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "WalletConnect",
});
</script>
<script lang="ts" setup>
import { AvatarIcon, BaseButton } from "potion-ui";
import { ref } from "@vue/reactivity";
import { onClickOutside } from "@vueuse/core";
import logoutIcon from "../../assets/logout_icon.svg";

export interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  ensOrAddress: string;
  shortAddress: string;
  ethBalance: number;
  avatarUrl: string;
  fallbackImage: string;
  showEnsInfo?: boolean;
  showConnectButton?: boolean;
  hasAdditionalInfo?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isConnected: false,
  showEnsInfo: false,
  showConnectButton: false,
  hasAdditionalInfo: false,
});
const emit = defineEmits<{
  (e: "disconnectWallet"): void;
  (e: "connectWallet"): void;
  (e: "clickOutside"): void;
}>();

const isOpen = ref(false);
const modal = ref(null);
onClickOutside(modal, (event) => (isOpen.value = false));
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
