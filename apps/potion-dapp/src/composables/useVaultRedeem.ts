import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useOnboard } from "@onboard-composable";
import { useErc4626Contract } from "./useErc4626Contract";
import { LifecycleState } from "./useInvestmentVaultContract";
import type { Ref, ComputedRef } from "vue";

const useVaultRedeem = (
  vaultBalance: Ref<number> | ComputedRef<number>,
  vaultAddress: Ref<string> | ComputedRef<string>,
  vaultStatus: Ref<LifecycleState> | ComputedRef<LifecycleState>
) => {
  const { connectedWallet } = useOnboard();
  const { t } = useI18n();
  const { redeem, redeemLoading, redeemReceipt, redeemTx, vaultSymbol } =
    useErc4626Contract(vaultAddress);

  const amount = ref(1);

  const buttonState = computed(() => {
    if (!connectedWallet.value) {
      return {
        label: t("connect_wallet"),
        disabled: true,
      };
    }
    if (vaultStatus.value !== LifecycleState.Unlocked) {
      return {
        label: "locked",
        disabled: true,
      };
    }
    if (vaultBalance.value < amount.value) {
      return {
        label: t("not_enough", { msg: vaultSymbol.value }),
        disabled: true,
      };
    }
    return {
      label: t("redeem"),
      disabled: false,
    };
  });

  const handleRedeem = async () => {
    if (buttonState.value.disabled === false) {
      await redeem(amount.value, true);
    }
  };

  return {
    amount,
    buttonState,
    handleRedeem,
    redeemLoading,
    redeemReceipt,
    redeemTx,
  };
};

export { useVaultRedeem };
