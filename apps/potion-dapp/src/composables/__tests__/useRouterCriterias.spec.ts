import { describe, expect, it } from "vitest";
import { ref, nextTick } from "vue";
import { useRouterCriterias } from "../useRouterCriterias";

describe("useRouterCriterias", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns criterias", () => {
      const { criterias } = useRouterCriterias(ref(undefined), ref(0), ref(0));
      expect(criterias).not.toBeUndefined();
    });
  });

  describe("criterias are computated as expected", () => {
    it("returns an empty criterias initially", () => {
      const { criterias } = useRouterCriterias(ref(undefined), ref(0), ref(0));
      expect(criterias.value.length).toBe(0);
    });

    it("doesn't update if token is undefined and the maxStrike change", () => {
      const maxStrike = ref(0);
      const { criterias } = useRouterCriterias(
        ref(undefined),
        maxStrike,
        ref(0)
      );

      maxStrike.value = 1;

      nextTick(() => {
        expect(criterias.value.length).toBe(0);
      });
    });

    it("doesn't update if token is undefined and the maxDuration change", () => {
      const maxDuration = ref(0);
      const { criterias } = useRouterCriterias(
        ref(undefined),
        ref(0),
        maxDuration
      );

      maxDuration.value = 1;

      nextTick(() => {
        expect(criterias.value.length).toBe(0);
      });
    });

    it("updates if the token changes", () => {
      const token = ref({
        selected: true,
        name: "abcd",
        symbol: "SMB",
        address: "0x010",
      });
      const { criterias } = useRouterCriterias(token, ref(0), ref(0));

      token.value = {
        selected: true,
        name: "xoxo",
        symbol: "XOX",
        address: "0x000",
      };

      nextTick(() => {
        expect(criterias.value.length).toBe(1);
        expect(criterias.value[0].token).toEqual({
          name: "xoxo",
          symbol: "XOX",
          address: "0x000",
        });
        expect(criterias.value[0].maxStrike).toBe(0);
        expect(criterias.value[0].maxDuration).toBe(0);
      });
    });

    it("updates if there is a token and maxStrike changes", () => {
      const token = ref({
        selected: true,
        name: "abcd",
        symbol: "SMB",
        address: "0x010",
      });
      const maxStrike = ref(0);
      const { criterias } = useRouterCriterias(token, maxStrike, ref(0));

      maxStrike.value = 100;

      nextTick(() => {
        expect(criterias.value.length).toBe(1);
        expect(criterias.value[0].token).toEqual({
          name: "abcd",
          symbol: "SMB",
          address: "0x010",
        });
        expect(criterias.value[0].maxStrike).toBe(100);
        expect(criterias.value[0].maxDuration).toBe(0);
      });
    });

    it("updates if there is a token and maxDuration changes", () => {
      const token = ref({
        selected: true,
        name: "abcd",
        symbol: "SMB",
        address: "0x010",
      });
      const maxDuration = ref(0);
      const { criterias } = useRouterCriterias(token, ref(0), maxDuration);

      maxDuration.value = 42;

      nextTick(() => {
        expect(criterias.value.length).toBe(1);
        expect(criterias.value[0].token).toEqual({
          name: "abcd",
          symbol: "SMB",
          address: "0x010",
        });
        expect(criterias.value[0].maxStrike).toBe(0);
        expect(criterias.value[0].maxDuration).toBe(42);
      });
    });

    it("updates if there is a token and both maxStrike and maxDuration changes", () => {
      const token = ref({
        selected: true,
        name: "abcd",
        symbol: "SMB",
        address: "0x010",
      });
      const maxStrike = ref(0);
      const maxDuration = ref(0);
      const { criterias } = useRouterCriterias(token, maxStrike, maxDuration);

      maxStrike.value = 100;
      maxDuration.value = 32;

      nextTick(() => {
        expect(criterias.value.length).toBe(1);
        expect(criterias.value[0].token).toEqual({
          name: "abcd",
          symbol: "SMB",
          address: "0x010",
        });
        expect(criterias.value[0].maxStrike).toBe(100);
        expect(criterias.value[0].maxDuration).toBe(32);
      });
    });
  });
});
