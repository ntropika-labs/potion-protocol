import { ref, computed } from "vue";

import type { Ref } from "vue";
import type { Criteria, SelectableToken } from "dapp-types";

export function useCriterias(availableTokens: Ref<SelectableToken[]>) {
  const criteriaMap = ref(
    new Map<string, { maxStrike: number; maxDuration: number }>()
  );

  const criterias = computed(() => {
    const existingCriteria: Array<Criteria> = [];

    for (const [address, strikeAndDuration] of criteriaMap.value.entries()) {
      const token = availableTokens.value.find((t) => t.address === address);
      if (token) {
        existingCriteria.push({
          token: token,
          maxStrike: strikeAndDuration?.maxStrike,
          maxDuration: strikeAndDuration?.maxDuration,
        });
      }
    }

    return existingCriteria;
  });

  const validCriterias = computed(() => criterias.value.length > 0);

  const updateCriteria = (
    tokenAddress: string,
    maxStrike: number,
    maxDuration: number
  ) => criteriaMap.value.set(tokenAddress, { maxStrike, maxDuration });

  const deleteCriteria = (tokenAddress: string) =>
    criteriaMap.value.delete(tokenAddress);

  return {
    criteriaMap,
    criterias,
    validCriterias,
    updateCriteria,
    deleteCriteria,
  };
}
