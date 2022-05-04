import type { Chain } from "@web3-onboard/common";
import type {
  ConnectedChain,
  ConnectOptions,
  DisconnectOptions,
  WalletState,
} from "@web3-onboard/core";
import type { ComputedRef, Ref } from "vue";

// Syntax sugar for Readonly Refs
type ReadonlyRef<T> = Readonly<Ref<T>>;

type SetChainOptions = {
  chainId: string;
  chainNamespace?: string;
  wallet: string;
};

interface OnboardComposable {
  chains: ReadonlyRef<Chain[]>;
  connectWallet: (options?: ConnectOptions) => Promise<void>;
  connectedChain: ComputedRef<ConnectedChain | null>;
  connectedWallet: ComputedRef<WalletState | null>;
  connectingWallet: ReadonlyRef<boolean>;
  disconnectWallet: (wallet: DisconnectOptions) => Promise<void>;
  disconnectConnectedWallet: () => Promise<void>;
  getChain: (walletLabel: string) => ConnectedChain | null;
  setChain: (options: SetChainOptions) => Promise<void>;
  settingChain: ReadonlyRef<boolean>;
  wallets: ReadonlyRef<WalletState[]>;
}

export type { OnboardComposable, SetChainOptions };
