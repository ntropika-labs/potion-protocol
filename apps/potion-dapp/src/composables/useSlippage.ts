import { computed, ref } from "vue";
import { currencyFormatter } from "potion-ui";
import type { Ref } from "vue";
import type { DepthRouterReturn } from "potion-router";

export function useSlippage(routerResult: Ref<DepthRouterReturn | null>) {
  const slippage = ref([
    { value: 0.005, label: "0.5%", selected: true },
    { value: 0.02, label: "2%", selected: false },
    { value: 0.05, label: "5%", selected: false },
  ]);

  const handleSlippageSelection = (index: number) => {
    slippage.value.forEach((slippage, i) => {
      slippage.selected = i === index;
    });
  };
  const premiumSlippage = computed(() => {
    const selectedSlippage = slippage.value.find((s) => s.selected);
    if (selectedSlippage && routerResult.value && routerResult.value.premium) {
      return (
        routerResult.value.premium * selectedSlippage.value +
        routerResult.value.premium
      );
    }
    return 0;
  });
  const formattedPremiumSlippage = computed(() =>
    currencyFormatter(premiumSlippage.value, "USDC")
  );

  return {
    slippage,
    handleSlippageSelection,
    premiumSlippage,
    formattedPremiumSlippage,
  };
}
