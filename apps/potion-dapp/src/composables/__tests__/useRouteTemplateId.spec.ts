import { describe, expect, it } from "vitest";
import { useRouteTemplateId } from "../useRouteTemplateId";

describe("useRouteTemplateId", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns a templateId", () => {
      const { templateId } = useRouteTemplateId({});
      expect(templateId).not.toBeUndefined();
    });

    it("returns a validTemplateId", () => {
      const { validTemplateId } = useRouteTemplateId({});
      expect(validTemplateId).not.toBeUndefined();
    });
  });
});
