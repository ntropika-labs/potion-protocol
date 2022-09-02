import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useVaultDeposit } from "../useVaultDeposit";
import { LifecycleState } from "../useInvestmentVaultContract";
import { withSetup } from "./test-utils";

describe("useVaultDeposit", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns amount", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.amount).not.toBeUndefined();
    });
    it("returns buttonState", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.buttonState).not.toBeUndefined();
    });
    it("returns handleDeposit", () => {
      const [result] = withSetup(() =>
        useVaultDeposit(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.handleDeposit).not.toBeUndefined();
    });
  });

  describe("buttonState returns the correct state", () => {
    describe("buttonState is disabled", () => {
      describe("locked state", () => {
        it("is locked if vaultStatus = LifecycleState.Locked", () => {
          const [result] = withSetup(() =>
            useVaultDeposit(
              ref(100),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
              ref(LifecycleState.Locked)
            )
          );
          expect(result.buttonState.value.label).toBe("locked");
          expect(result.buttonState.value.disabled).toBe(true);
        });

        it("is locked if vaultStatus = LifecycleState.Committed", () => {
          const [result] = withSetup(() =>
            useVaultDeposit(
              ref(100),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
              ref(LifecycleState.Committed)
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
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleState.Unlocked)
          )
        );
        result.amount.value = 3000;
        expect(result.buttonState.value.label).toBe("not_enough");
        expect(result.buttonState.value.disabled).toBe(true);
      });
    });

    describe("buttonState is enabled", () => {
      it("is 'approve' if userAllowance < amount", () => {
        const [result] = withSetup(() =>
          useVaultDeposit(
            ref(100),
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleState.Unlocked)
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
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleState.Unlocked)
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
            ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
            ref(LifecycleState.Unlocked)
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
