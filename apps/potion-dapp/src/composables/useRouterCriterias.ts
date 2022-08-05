import { ref, unref, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import type { Criteria, SelectableToken } from "dapp-types";

export function useRouterCriterias(
  tokenSelected:
    | ComputedRef<SelectableToken | undefined>
    | Ref<SelectableToken | undefined>,
  strikeSelected: ComputedRef<number> | Ref<number>,
  durationSelected: ComputedRef<number> | Ref<number>
) {
  const criterias = ref<Criteria[]>([]);

  watch([tokenSelected, strikeSelected, durationSelected], () => {
    if (tokenSelected.value) {
      const t = unref(tokenSelected) ?? { name: "", symbol: "", address: "" };
      criterias.value = [
        {
          token: t,
          maxStrike: strikeSelected.value,
          maxDuration: durationSelected.value,
        },
      ];
    }
  });

  return {
    criterias,
  };
}
