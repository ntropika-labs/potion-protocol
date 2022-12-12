import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePersonalPotions } from "../usePersonalPotions";
import { withSetupUrql } from "./test-utils";

describe("usePersonalPotions", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns activePotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.activePotions).not.toBeUndefined();
    });
    it("returns expiredPotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.expiredPotions).not.toBeUndefined();
    });
    it("returns canLoadMoreActivePotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.canLoadMoreActivePotions).not.toBeUndefined();
    });
    it("returns canLoadMoreExpiredPotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.canLoadMoreExpiredPotions).not.toBeUndefined();
    });
    it("returns loadMoreActive", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.loadMoreActive).not.toBeUndefined();
    });
    it("returns loadMoreExpired", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.loadMoreExpired).not.toBeUndefined();
    });
    it("returns loadingActivePotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.loadingActivePotions).not.toBeUndefined();
    });
    it("returns loadingExpiredPotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.loadingExpiredPotions).not.toBeUndefined();
    });
    it("returns loadingUserPotions", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.loadingUserPotions).not.toBeUndefined();
    });
  });

  describe("combined query load works as expected", () => {
    it("returns active and expired potions as empty arrays if there was an error", () => {
      const [result] = withSetupUrql(() =>
        usePersonalPotions(ref("0x000"), ref(0), ref(false))
      );
      expect(result.activePotions.value.length).toBe(0);
      expect(result.expiredPotions.value.length).toBe(0);
    });

    it("returns active and expired potions as empty arrays if the user doesn't own any potion", () => {
      const [result] = withSetupUrql(
        () => usePersonalPotions(ref("0x000"), ref(0), ref(false)),
        { active: [], expired: [] }
      );
      expect(result.activePotions.value.length).toBe(0);
      expect(result.expiredPotions.value.length).toBe(0);
    });

    it("populates active if the user has some active potions", () => {
      const [result] = withSetupUrql(
        () => usePersonalPotions(ref("0x000"), ref(0), ref(false)),
        {
          active: [
            {
              id: "0x010x000",
            },
          ],
          expired: [],
        }
      );
      expect(result.activePotions.value.length).toBe(1);
      expect(result.activePotions.value[0]).toMatchObject({
        id: "0x010x000",
      });
      expect(result.expiredPotions.value.length).toBe(0);
    });

    it("populates expired if the user has some expired potions", () => {
      const [result] = withSetupUrql(
        () => usePersonalPotions(ref("0x000"), ref(0), ref(false)),
        {
          active: [],
          expired: [
            {
              id: "0x001x000",
            },
          ],
        }
      );
      expect(result.activePotions.value.length).toBe(0);
      expect(result.expiredPotions.value.length).toBe(1);
      expect(result.expiredPotions.value[0]).toMatchObject({
        id: "0x001x000",
      });
    });
  });
});
