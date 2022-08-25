import { computed, ref, watch } from "vue";
import { useUnderlyingLiquidity } from "./useProtocolLiquidity";
import type { Ref } from "vue";

export function useStrikeSelection(
  tokenAddress: Ref<string | null>,
  tokenPrice: Ref<number>
) {
  const { maxStrike, executeQuery } = useUnderlyingLiquidity(tokenAddress);

  const maxSelectableStrikeAbsolute = computed(() => {
    return (maxStrike.value * tokenPrice.value) / 100;
  });

  const strikeSelected = ref(0);

  const strikeSelectedRelative = computed(() => {
    return parseFloat(
      ((strikeSelected.value * 100) / tokenPrice.value).toFixed(2)
    );
  });

  const isStrikeValid = ref(false);
  watch([tokenAddress, tokenPrice], executeQuery);

  return {
    strikeSelected,
    strikeSelectedRelative,
    maxSelectableStrikeAbsolute,
    isStrikeValid,
  };
}
