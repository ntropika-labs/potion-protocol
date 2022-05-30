import { computed, ref } from "vue";

import { mockWeb3Onboard } from "@/helpers/onboard";
import { useStorage } from "@vueuse/core";

import type { MockWeb3Onboard } from "@/helpers/onboard";

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

const onboardState = ref<MockWeb3Onboard>(mockWeb3Onboard);
const init = (options: any) => {
  console.info("Initializing Mocked web3-onboard", options);
  updateAlreadyConnectedWallets();
};

const useOnboard = () => {
  const connectingWallet = ref<boolean>(false);
  const wallets = computed(() => onboardState.value.wallets);

  const connectedWallet = computed(() => {
    return wallets.value.length > 0 ? wallets.value[0] : null;
  });

  const connectWallet = async (options?: any) => {
    console.info(options);
    connectingWallet.value = true;
    if (onboardState.value.wallets.length === 0) {
      onboardState.value.wallets.push({
        label: "Metamask",
        icon: "<svg><svg/>",
        provider: {},
        accounts: [
          {
            address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            ens: null,
            balance: {
              eth: 10000,
            },
          },
        ],
        chains: [
          {
            id: "0x7a69",
            namespace: "evm",
          },
        ],
      });
      lastConnectionTimestamp.value = Date.now();
    }
    connectingWallet.value = false;
  };

  const disconnectWallet = async (wallet: any) => {
    console.info(wallet);
    connectingWallet.value = true;
    onboardState.value.wallets = [];
    connectingWallet.value = false;
  };
  const disconnectConnectedWallet = async () => {
    if (connectedWallet.value) {
      await disconnectWallet({ label: connectedWallet.value.label });
    }
  };

  const settingChain = ref<boolean>(false);
  const connectedChain = computed(
    () => connectedWallet?.value?.chains[0] ?? null
  );

  const getChain = (walletLabel: string) => {
    console.info(walletLabel);
    const wallet = onboardState.value.wallets.find(
      (w) => w.label === walletLabel
    );
    return wallet?.chains[0] ?? null;
  };

  const setChain = async (options: any) => {
    console.info("Setting Chain with ", options);
  };

  return {
    connectingWallet,
    wallets,
    connectedWallet,
    connectWallet,
    disconnectWallet,
    disconnectConnectedWallet,
    settingChain,
    connectedChain,
    getChain,
    setChain,
    onboardState,
    alreadyConnectedWallets,
    lastConnectionTimestamp,
  };
};
export { useOnboard, init };
