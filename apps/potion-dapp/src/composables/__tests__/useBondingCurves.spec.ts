import { describe, expect, it } from "vitest";
import { useBondingCurves } from "../useBondingCurves";

describe("useBondingCurves", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a bondingCurve", () => {
      const { bondingCurve } = useBondingCurves();
      expect(bondingCurve).not.toBeNull();
    });

    it("returns a validCurve", () => {
      const { validCurve } = useBondingCurves();
      expect(validCurve.value).toBe(true);
    });
  });

  describe("bondingCurve initialization", () => {
    it("initialize correctly bondingCurve with default params", () => {
      const { bondingCurve } = useBondingCurves();
      expect(bondingCurve.value).toEqual({
        a: 0.05,
        b: 0.05,
        c: 0.05,
        d: 0.05,
        maxUtil: 1,
      });
    });

    it("initialize correctly bondingCurve with custom params", () => {
      const { bondingCurve } = useBondingCurves({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 0,
      });
      expect(bondingCurve.value).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 0,
      });
    });
  });

  describe("setBondingCurve function", () => {
    it("can use setBondingCurve with a bondingCurve that has been initialized with default params", () => {
      const { bondingCurve, setBondingCurve } = useBondingCurves();
      setBondingCurve("1", "2", "3", "4", "1");
      expect(bondingCurve.value).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 1,
      });
    });

    it("can use setBondingCurve with a bondingCurve that has been initialized with custom params", () => {
      const { bondingCurve, setBondingCurve } = useBondingCurves({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 0,
      });
      setBondingCurve("1.5", "2.1", "4.2", "3.8", "0.56");
      expect(bondingCurve.value).toEqual({
        a: 1.5,
        b: 2.1,
        c: 4.2,
        d: 3.8,
        maxUtil: 0.56,
      });
    });
  });

  describe("validCurve validation works as expected", () => {
    it("returns true with the default params", () => {
      const { validCurve } = useBondingCurves();
      expect(validCurve.value).toBe(true);
    });

    it("returns true if we use valid custom params", () => {
      const { validCurve } = useBondingCurves({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 0.5,
      });
      expect(validCurve.value).toBe(true);
    });

    it("returns true if we use setBondingCurve to set a valid curve", () => {
      const { validCurve, setBondingCurve } = useBondingCurves();
      setBondingCurve("1.5", "2.1", "4.2", "3.8", "0.56");
      expect(validCurve.value).toBe(true);
    });

    it("returns false if we use invalid custom params", () => {
      const { validCurve } = useBondingCurves({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        maxUtil: 11,
      });
      expect(validCurve.value).toBe(false);
    });

    it("returns false if we use setBondingCurve to set an invalid curve", () => {
      const { validCurve, setBondingCurve } = useBondingCurves();
      setBondingCurve("1.5", "2.1", "4.2", "3.8", "56");
      expect(validCurve.value).toBe(false);
    });
  });
});
