import { watchDebounced } from "@vueuse/core";
import { ref, computed, watch } from "vue";
import { useStrikeLiquidity } from "./useProtocolLiquidity";
import { offsetToDate } from "@/helpers/days";
import { useEthersProvider } from "./useEthersProvider";
import type { Ref } from "vue";

export function useDurationSelection(
  tokenSelectedAddress: Ref<string>,
  strikeSelectedRelative: Ref<number>
) {
  const { blockTimestamp, getBlock } = useEthersProvider();
  const durationSelected = ref(0);
  const durationSelectedDate = computed(() => {
    return offsetToDate(blockTimestamp.value, durationSelected.value);
  });

  const {
    maxDuration: maxSelectableDuration,
    maxDurationInDays: maxSelectableDurationInDays,
    executeQuery,
  } = useStrikeLiquidity(tokenSelectedAddress, strikeSelectedRelative);

  const isDurationValid = ref(false);

  watchDebounced(durationSelected, () => getBlock("latest"), {
    debounce: 1000,
  });

  watch([tokenSelectedAddress, strikeSelectedRelative], executeQuery);

  return {
    durationSelected,
    durationSelectedDate,
    isDurationValid,
    maxSelectableDuration,
    maxSelectableDurationInDays,
  };
}
