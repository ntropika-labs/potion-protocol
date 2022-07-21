import { describe, expect, it } from "vitest";
import { useSelectableTokens } from "../useSelectableTokens";

describe("useSelectableTokens", () => {
  describe("it doesn't have syntax errors", () => {
    it("returns availableTokens", () => {
      const { availableTokens } = useSelectableTokens();
      expect(availableTokens).not.toBeNull();
    });

    it("returns unselectedTokens", () => {
      const { unselectedTokens } = useSelectableTokens();
      expect(unselectedTokens).not.toBeNull();
    });

    it("returns tokenPricesMap", () => {
      const { tokenPricesMap } = useSelectableTokens();
      expect(tokenPricesMap).not.toBeNull();
    });

    it("returns toggleToken", () => {
      const { toggleToken } = useSelectableTokens();
      expect(toggleToken).not.toBeNull();
    });
  });

  describe("unselectedTokens works as expected", () => {
    it("is empty if availableTokens is empty", () => {
      const { unselectedTokens } = useSelectableTokens();
      expect(unselectedTokens.value.length).toBe(0);
    });

    it("is empty if there is no unselected token", () => {
      const { availableTokens, unselectedTokens } = useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token",
        symbol: "mt",
        address: "0x000",
        selected: true,
      });
      expect(unselectedTokens.value.length).toBe(0);
    });

    it("contains only the unselected tokens", () => {
      const { availableTokens, unselectedTokens } = useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        selected: true,
      });
      availableTokens.value.push({
        name: "mocked token 2",
        symbol: "mt2",
        address: "0x010",
        selected: false,
      });
      availableTokens.value.push({
        name: "mocked token 3",
        symbol: "mt3",
        address: "0x030",
        selected: true,
      });
      expect(unselectedTokens.value.length).toBe(1);
    });
  });

  describe("toggleToken can be used to change selection status", () => {
    it("can set as unselected a selected token", () => {
      const { availableTokens, toggleToken } = useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token",
        symbol: "mt",
        address: "0x000",
        selected: true,
      });
      toggleToken("0x000");
      const token = availableTokens.value[0];
      expect(token.selected).toBe(false);
    });

    it("can set as selected an unselected token", () => {
      const { availableTokens, toggleToken } = useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token",
        symbol: "mt",
        address: "0x000",
        selected: false,
      });
      toggleToken("0x000");
      const token = availableTokens.value[0];
      expect(token.selected).toBe(true);
    });

    it("can change the status when there are multiple tokens", () => {
      const { availableTokens, toggleToken } = useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        selected: false,
      });
      availableTokens.value.push({
        name: "mocked token 2",
        symbol: "mt2",
        address: "0x010",
        selected: false,
      });
      toggleToken("0x010");
      const token = availableTokens.value[1];
      expect(token.selected).toBe(true);
    });

    it("doesn't throw an error when we try to change the status of a token that doesn't exists", () => {
      const { availableTokens, toggleToken } = useSelectableTokens();
      toggleToken("0x010");
      expect(availableTokens.value.length).toBe(0);
    });
  });

  describe("tokenPricesMap is updated correctly when we select tokens", () => {
    it("try to load the price of a token if there wasn't a price", async () => {
      const { availableTokens, toggleToken, tokenPricesMap } =
        useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token",
        symbol: "mt",
        address: "0x000",
        selected: false,
      });
      await toggleToken("0x000");
      const tokenPrice = tokenPricesMap.value.get("0x000");
      expect(tokenPrice).not.toBeUndefined();
      expect(tokenPrice).toEqual({
        loading: false,
        price: 1300,
        formattedPrice: "$ 1.3K",
        success: true,
      });
    });

    it("try to load the price of a token if it previously failed", async () => {
      const { availableTokens, toggleToken, tokenPricesMap } =
        useSelectableTokens();
      availableTokens.value.push({
        name: "mocked token",
        symbol: "mt",
        address: "0x000",
        selected: false,
      });
      tokenPricesMap.value.set("0x000", {
        loading: true,
        price: -1,
        formattedPrice: "errror",
        success: false,
      });
      await toggleToken("0x000");
      const tokenPrice = tokenPricesMap.value.get("0x000");
      expect(tokenPrice).not.toBeUndefined();
      expect(tokenPrice).toEqual({
        loading: false,
        price: 1300,
        formattedPrice: "$ 1.3K",
        success: true,
      });
    });
  });
});
