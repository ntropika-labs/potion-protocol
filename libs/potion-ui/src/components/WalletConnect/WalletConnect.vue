<template>
  <Transition name="fade" :duration="550">
    <div ref="modal" class="inline-flex">
      <template v-if="props.isConnected">
        <div
          class="rounded-[1.75rem] transition-all overflow-hidden"
          :class="[
            props.hasAdditionalInfo ? 'border-2 border-t-0 max-w-64' : '',
            isOpen ? 'border-secondary-500 bg-primary-600/80' : '',
          ]"
        >
          <div
            class="relative flex items-center gap-4 rounded-full before:(content-none absolute top-0 left-0 w-double h-full transition-transform duration-300 z-0 bg-gradient-to-r from-secondary-500 via-secondary-400 to-secondary-600) hover:(shadow-secondary before:translate-x-[-50%])"
          >
            <button
              class="relative flex items-center gap-4 px-2 text-left whitespace-nowrap items-center z-1 overflow-hidden font-poppins transition-shadow duration-300 shadow-none focus:outline-none py-1 px-2"
              :class="[props.hasAdditionalInfo ? '' : 'cursor-normal']"
              :disabled="!props.hasAdditionalInfo"
              @click="() => (isOpen = !isOpen)"
            >
              <AvatarIcon
                :loaded="props.isConnected"
                :avatar-url="props.avatarUrl"
                class="flex-none inline-block bg-white/10 rounded-full"
              ></AvatarIcon>
              <div class="pr-3">
                <p
                  class="font-bold text-lg tracking-wide font-mono text-dwhite-300"
                >
                  {{ props.ensOrAddress }}
                </p>
                <p
                  v-if="props.ethBalance !== undefined"
                  class="text-xs text-gray-600 tracking-widest uppercase text-white/70"
                >
                  {{ props.ethBalance }} ETH
                </p>
              </div>
            </button>
            <div class="flex items-center">
              <BaseButton
                size="icon"
                palette="transparent"
                label=""
                :disabled="props.isConnecting"
                @click="() => emit('disconnectWallet')"
                ><template #pre-icon><LogoutIcon class="w-8" /></template
              ></BaseButton>
            </div>
          </div>
          <div
            v-if="props.hasAdditionalInfo && props.isConnected && isOpen"
            class="text-dwhite-300 p-4"
          >
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
import { AvatarIcon, BaseButton } from "../../index";
import { ref } from "@vue/reactivity";
import { onClickOutside } from "@vueuse/core";
import LogoutIcon from "../icons/LogoutIcon.vue";

export interface Props {
  isConnected: boolean;
  isConnecting: boolean;
  ensOrAddress: string;
  ethBalance?: number;
  avatarUrl: string;
  showConnectButton?: boolean;
  hasAdditionalInfo?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isConnected: false,
  showEnsInfo: false,
  showConnectButton: false,
  hasAdditionalInfo: false,
  ethBalance: undefined,
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
