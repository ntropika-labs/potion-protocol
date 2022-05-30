// We use vue-demi to automatically use the correct reactivity API for both Vue 2 and Vue 3
import { computed, readonly, ref, shallowRef } from "vue";

import { useStorage } from "@vueuse/core";
// Vueuse helper to streamline the use of rxjs observables as vue refs
import { useSubscription } from "@vueuse/rxjs";
import Web3Onboard from "@web3-onboard/core";

import type {
  ConnectedChain,
  ConnectOptions,
  DisconnectOptions,
  InitOptions,
  OnboardAPI,
  WalletState,
} from "@web3-onboard/core";
import type { AppState } from "@web3-onboard/core/dist/types";
import type { SetChainOptions } from "@/types";

// Onboard will be kept here to be reused every time that we access the composable
let web3Onboard: OnboardAPI | null = null;
const alreadyConnectedWallets = useStorage<string[]>(
  "alreadyConnectedWallets",
  []
);
const lastConnectionTimestamp = useStorage<number>(
  "lastWalletConnectionTimestamp",
  0
);

const updateAlreadyConnectedWallets = () => {
  alreadyConnectedWallets.value = onboardState.value.wallets.map(
    (w) => w.label
  );
};

const onboardState = shallowRef<AppState>({} as AppState);

const init = (options: InitOptions): OnboardAPI => {
  web3Onboard = Web3Onboard(options);
  onboardState.value = web3Onboard.state.get();

  useSubscription(
    web3Onboard.state.select().subscribe((update) => {
      onboardState.value = update;
      updateAlreadyConnectedWallets();
    })
  );
  return web3Onboard;
};

const useOnboard = () => {
  // Raise an error if init() wasn't called
  if (!web3Onboard) {
    throw new Error("web3Onboard is not initialized");
  }

  const connectingWallet = ref<boolean>(false);
  const wallets = computed(() => onboardState.value.wallets);

  const connectedWallet = computed<WalletState | null>(() => {
    return wallets.value.length > 0 ? wallets.value[0] : null;
  });

  const connectWallet = async (options?: ConnectOptions) => {
    connectingWallet.value = true;
    await (web3Onboard as OnboardAPI).connectWallet(options);
    connectingWallet.value = false;
    lastConnectionTimestamp.value = Date.now();
  };

  const disconnectWallet = async (wallet: DisconnectOptions) => {
    console.log("here");
    connectingWallet.value = true;
    await (web3Onboard as OnboardAPI).disconnectWallet(wallet);
    updateAlreadyConnectedWallets();
    connectingWallet.value = false;
  };

  const disconnectConnectedWallet = async () => {
    if (connectedWallet.value) {
      await disconnectWallet({ label: connectedWallet.value.label });
    }
  };

  // Chain related functions and variables

  const settingChain = ref<boolean>(false);

  const connectedChain = computed<ConnectedChain | null>(
    () => connectedWallet?.value?.chains[0] ?? null
  );

  const getChain = (walletLabel: string) => {
    const wallet = onboardState.value.wallets.find(
      (w: WalletState) => w.label === walletLabel
    );
    return wallet?.chains[0] ?? null;
  };

  const setChain = async (options: SetChainOptions) => {
    settingChain.value = true;
    await (web3Onboard as OnboardAPI).setChain(options);
    settingChain.value = false;
  };

  return {
    connectWallet,
    connectedChain,
    connectedWallet,
    connectingWallet: readonly(connectingWallet),
    disconnectWallet,
    disconnectConnectedWallet,
    getChain,
    setChain,
    settingChain: readonly(settingChain),
    onboardState,
    alreadyConnectedWallets,
    lastConnectionTimestamp,
    wallets,
  };
};

export { init, useOnboard };
