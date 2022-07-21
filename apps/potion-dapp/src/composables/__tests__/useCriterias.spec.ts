import { describe, expect, it } from "vitest";
import { ref } from "vue";
import { useCriterias } from "../useCriterias";
import type { SelectableToken } from "dapp-types";

describe("useCriterias", () => {
  describe("it doesn't have syntax errors", () => {
    const tokens = ref<SelectableToken[]>([]);

    it("creates a criteriaMap", () => {
      const { criteriaMap } = useCriterias(tokens);
      expect(criteriaMap.value).not.toBeNull();
    });

    it("creates a criterias array", () => {
      const { criterias } = useCriterias(tokens);
      expect(criterias.value.length).toBe(0);
    });

    it("creates a validCriterias boolean", () => {
      const { validCriterias } = useCriterias(tokens);
      expect(validCriterias.value).toBe(false);
    });
  });

  describe("criteriaMap manipulations", () => {
    const tokens = ref<SelectableToken[]>([]);

    it("can add a new criteria to criteriaMap", () => {
      const { criteriaMap, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      const criteria = criteriaMap.value.get("0x000");
      expect(criteria).not.toBeNull();
      expect(criteria.maxStrike).toBe(10);
      expect(criteria.maxDuration).toBe(20);
    });

    it("can update a criteria already present in criteriaMap", () => {
      const { criteriaMap, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      updateCriteria("0x000", 20, 10);
      const criteria = criteriaMap.value.get("0x000");
      expect(criteria).not.toBeNull();
      expect(criteria.maxStrike).toBe(20);
      expect(criteria.maxDuration).toBe(10);
    });

    it("can remove a criteria that exists in criteriaMap", () => {
      const { criteriaMap, updateCriteria, deleteCriteria } =
        useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      deleteCriteria("0x000");
      const criteria = criteriaMap.value.get("0x000");
      expect(criteria).toBeUndefined();
    });

    it("doesn't throw an error when deleting a criteria that doesn't exists in criteriaMap", () => {
      const { criteriaMap, deleteCriteria } = useCriterias(tokens);
      deleteCriteria("0x000");
      const criteria = criteriaMap.value.get("0x000");
      expect(criteria).toBeUndefined();
    });
  });

  describe("criterias is derived correctly from criteriaMap and AvailableTokens", () => {
    const tokens = ref<SelectableToken[]>([
      {
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        decimals: 8,
        image: "https://placeholder.com/mt1.jpg",
        selected: true,
      },
      {
        name: "mocked token 2",
        symbol: "mt2",
        address: "0x010",
        decimals: 16,
        image: "https://placeholder.com/mt2.jpg",
        selected: true,
      },
    ]);

    it("populates criterias correctly when we add one criteria", () => {
      const { criterias, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      expect(criterias.value.length).toBe(1);
      const criteria = criterias.value[0];
      expect(criteria.maxStrike).toBe(10);
      expect(criteria.maxDuration).toBe(20);
      expect(criteria.token).toEqual({
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        decimals: 8,
        image: "https://placeholder.com/mt1.jpg",
        selected: true,
      });
    });

    it("populates criterias correctly when we add multiple criterias", () => {
      const { criterias, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      updateCriteria("0x010", 20, 10);
      expect(criterias.value.length).toBe(2);
      const firstCriteria = criterias.value[0];
      expect(firstCriteria.maxStrike).toBe(10);
      expect(firstCriteria.maxDuration).toBe(20);
      expect(firstCriteria.token).toEqual({
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        decimals: 8,
        image: "https://placeholder.com/mt1.jpg",
        selected: true,
      });
      const secondCriteria = criterias.value[1];
      expect(secondCriteria.maxStrike).toBe(20);
      expect(secondCriteria.maxDuration).toBe(10);
      expect(secondCriteria.token).toEqual({
        name: "mocked token 2",
        symbol: "mt2",
        address: "0x010",
        decimals: 16,
        image: "https://placeholder.com/mt2.jpg",
        selected: true,
      });
    });
  });

  describe("validCriterias updates correctly", () => {
    const tokens = ref<SelectableToken[]>([
      {
        name: "mocked token 1",
        symbol: "mt1",
        address: "0x000",
        selected: true,
      },
      {
        name: "mocked token 2",
        symbol: "mt2",
        address: "0x010",
        selected: true,
      },
    ]);

    it("returns false if there is no criteria", () => {
      const { validCriterias } = useCriterias(tokens);
      expect(validCriterias.value).toBe(false);
    });

    it("returns true if there is one criteria", () => {
      const { validCriterias, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      expect(validCriterias.value).toBe(true);
    });

    it("returns true if there are multiple criterias", () => {
      const { validCriterias, updateCriteria } = useCriterias(tokens);
      updateCriteria("0x000", 10, 20);
      updateCriteria("0x010", 20, 20);
      expect(validCriterias.value).toBe(true);
    });
  });
});
