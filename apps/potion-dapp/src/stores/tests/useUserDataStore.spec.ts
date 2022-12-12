import { setActivePinia, createPinia } from "pinia";
import { describe, expect, it, beforeEach } from "vitest";

import { useUserDataStore } from "../useUserDataStore";

describe("UserData Store", () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia());
  });

  it("initializes", () => {
    const userDataStore = useUserDataStore();
    expect(userDataStore.walletAddress).toBe(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
    expect(userDataStore.connectedChain).toStrictEqual({
      id: "0x7a69",
      namespace: "evm",
    });
    expect(userDataStore.userAllowance).toBe(0);
    expect(userDataStore.userCollateralBalance).toBe(0);
  });
});
