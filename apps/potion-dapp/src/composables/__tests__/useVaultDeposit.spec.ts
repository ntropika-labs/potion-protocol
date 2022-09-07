import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useVaultDeposit } from "../useVaultDeposit";
import { LifecycleStates } from "hedging-vault-sdk";
import { withSetup } from "./test-utils";

describe("useVaultDeposit", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns amount", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.amount).not.toBeUndefined();
    });
    it("returns buttonState", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.buttonState).not.toBeUndefined();
    });
    it("returns handleDeposit", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.handleDeposit).not.toBeUndefined();
    });
    it("returns depositLoading", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.depositLoading).not.toBeUndefined();
    });
    it("returns depositTx", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.depositTx).not.toBeUndefined();
    });
    it("returns depositReceipt", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.depositReceipt).not.toBeUndefined();
    });
    it("returns approveLoading", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.approveLoading).not.toBeUndefined();
    });
    it("returns approveTx", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.approveTx).not.toBeUndefined();
    });
    it("returns approveReceipt", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
          ref("TKN"),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleStates.Locked)
        )
      );
      expect(result.approveReceipt).not.toBeUndefined();
    });
  });

  describe("buttonState returns the correct state", () => {
    describe("buttonState is disabled", () => {
      describe("locked state", () => {
        it("is locked if vaultStatus = LifecycleStates.Locked", () => {
          const [result] = withSetup(() =>
            useVaultDeposit(
              ref(100),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
              ref("TKN"),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
              ref(LifecycleStates.Locked)
            )
          );
          expect(result.buttonState.value.label).toBe("locked");
          expect(result.buttonState.value.disabled).toBe(true);
        });

        it("is locked if vaultStatus = LifecycleStates.Committed", () => {
          const [result] = withSetup(() =>
            useVaultDeposit(
              ref(100),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
              ref("TKN"),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
              ref(LifecycleStates.Committed)
            )
          );
          expect(result.buttonState.value.label).toBe("locked");
          expect(result.buttonState.value.disabled).toBe(true);
        });
      });

      it("is 'not_enough' if userBalance < amount", () => {
        const [result] = withSetup(() =>
          useVaultDeposit(
            ref(100),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
            ref("TKN"),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleStates.Unlocked)
          )
        );
        result.amount.value = 3000;
        expect(result.buttonState.value.label).toBe("not_enough TKN");
        expect(result.buttonState.value.disabled).toBe(true);
      });
    });

    describe("buttonState is enabled", () => {
      it("is 'approve' if userAllowance < amount", () => {
        const [result] = withSetup(() =>
          useVaultDeposit(
            ref(100),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
            ref("TKN"),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleStates.Unlocked)
          )
        );
        result.userAllowance.value = 15;
        result.amount.value = 30;
        expect(result.buttonState.value.label).toBe("approve");
        expect(result.buttonState.value.disabled).toBe(false);
      });

      it("is 'deposit' if userBalance > amount", () => {
        const [result] = withSetup(() =>
          useVaultDeposit(
            ref(3000),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
            ref("TKN"),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleStates.Unlocked)
          )
        );
        result.userAllowance.value = 1500;
        result.amount.value = 100;
        expect(result.buttonState.value.label).toBe("deposit");
        expect(result.buttonState.value.disabled).toBe(false);
      });

      it("is 'deposit' if userBalance = amount", () => {
        const [result] = withSetup(() =>
          useVaultDeposit(
            ref(100),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92260"),
            ref("TKN"),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleStates.Unlocked)
          )
        );
        result.userAllowance.value = 1500;
        result.amount.value = 100;
        expect(result.buttonState.value.label).toBe("deposit");
        expect(result.buttonState.value.disabled).toBe(false);
      });
    });
  });
});
