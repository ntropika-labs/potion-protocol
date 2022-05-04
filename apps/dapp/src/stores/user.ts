import { defineStore } from "pinia";

import { useOnboard } from "@/composables/useOnboard";

import type { WalletState } from "@web3-onboard/core";
import type { Chain } from "@web3-onboard/common";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    wallets: [] as WalletState[],
    chains: [] as Chain[],
  }),
  getters: {
    connectedChain: (state) => state.chains[0] ?? null,
    connectedWallet: (state) => state.wallets[0] ?? null,
  },
  actions: {
    async connect() {
      const onboard = useOnboard();
      await onboard.connectWallet();
      this.wallets = onboard.wallets.value;
      this.chains = onboard.chains.value;
    },
  },
});
