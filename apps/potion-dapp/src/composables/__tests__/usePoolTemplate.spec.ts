import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { usePoolTemplate } from "../usePoolTemplate";
import { withSetupUrql } from "./test-utils";
import { mockPoolTemplate, mockCriteria } from "./test-mocks";

describe("usePoolTemplate", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns error", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.error).not.toBeUndefined();
    });

    it("returns fetching", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.fetching).not.toBeUndefined();
    });

    it("returns template", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.template).not.toBeUndefined();
    });

    it("returns curve", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.curve).not.toBeUndefined();
    });

    it("returns criterias", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.criterias).not.toBeUndefined();
    });
  });

  describe("template is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("")));
      expect(result.template.value).toBeNull();
    });

    it("returns null if the template doesn't exist", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.template.value).toBeNull();
    });

    it("returns the template if it exists", () => {
      const [result] = withSetupUrql(
        () => usePoolTemplate(ref("0x000")),
        mockPoolTemplate({ id: "0x000", creator: "mock.eth" })
      );
      expect(result.template.value).toMatchObject({
        id: "0x000",
        creator: "mock.eth",
      });
    });
  });

  describe("curve is computated correctly", () => {
    it("returns null if it fails to load", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("")));
      expect(result.curve.value).toBeNull();
    });

    it("returns null if the template doesn't exist", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.curve.value).toBeNull();
    });

    it("returns the template curve if the template exists", () => {
      const [result] = withSetupUrql(
        () => usePoolTemplate(ref("0x000")),
        mockPoolTemplate({
          id: "0x000",
          curve: { a: "10", b: "20", c: "30", d: "40", maxUtil: "0.5" },
        })
      );
      expect(result.curve.value).toMatchObject({
        a: "10",
        b: "20",
        c: "30",
        d: "40",
        maxUtil: "0.5",
      });
    });
  });

  describe("criterias is computated correctly", () => {
    it("returns [] if it fails to load", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("")));
      expect(result.criterias.value.length).toBe(0);
    });

    it("returns [] if the template doesn't exist", () => {
      const [result] = withSetupUrql(() => usePoolTemplate(ref("0x000")));
      expect(result.criterias.value.length).toBe(0);
    });

    it("returns the template criterias if the template exists", () => {
      const [result] = withSetupUrql(
        () => usePoolTemplate(ref("0x000")),
        mockPoolTemplate({
          id: "0x000",
          criterias: [mockCriteria("0x001", "100", "30")],
        })
      );
      expect(result.criterias.value.length).toBe(1);
      expect(result.criterias.value[0]).toMatchObject({
        token: {
          address: "0x001",
          symbol: "",
          image: "",
        },
        maxStrike: 100,
        maxDuration: 30,
      });
    });
  });
});
