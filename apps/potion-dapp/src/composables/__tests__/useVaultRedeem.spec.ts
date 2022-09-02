import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useVaultRedeem } from "../useVaultRedeem";
import { LifecycleState } from "../useInvestmentVaultContract";
import { withSetup } from "./test-utils";

describe("useVaultRedeem", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns amount", () => {
      const [result] = withSetup(() =>
        useVaultRedeem(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.amount).not.toBeUndefined();
    });
    it("returns buttonState", () => {
      const [result] = withSetup(() =>
        useVaultRedeem(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.buttonState).not.toBeUndefined();
    });
    it("returns handleRedeem", () => {
      const [result] = withSetup(() =>
        useVaultRedeem(
          ref(100),
          ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
          ref(LifecycleState.Locked)
        )
      );
      expect(result.handleRedeem).not.toBeUndefined();
    });
  });

  describe("buttonState returns the correct state", () => {
    describe("buttonState is disabled", () => {
      describe("locked state", () => {
        it("is locked if vaultStatus = LifecycleState.Locked", () => {
          const [result] = withSetup(() =>
            useVaultRedeem(
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
            useVaultRedeem(
              ref(100),
              ref("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
              ref(LifecycleState.Committed)
            )
          );
          expect(result.buttonState.value.label).toBe("locked");
          expect(result.buttonState.value.disabled).toBe(true);
        });
      });

      it("is 'not_enough' if vaultBalance < amount", () => {
        const [result] = withSetup(() =>
          useVaultRedeem(
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
  });
});
