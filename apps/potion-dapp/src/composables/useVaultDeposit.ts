import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useOnboard } from "@onboard-composable";
import { useErc4626Contract } from "./useErc4626Contract";
import { useErc20Contract } from "./useErc20Contract";
import { LifecycleState } from "./useInvestmentVaultContract";
import type { Ref, ComputedRef } from "vue";

const useVaultDeposit = (
  userBalance: Ref<number> | ComputedRef<number>,
  vaultId: Ref<string> | ComputedRef<string>,
  vaultStatus: Ref<LifecycleState> | ComputedRef<LifecycleState>
) => {
  const { connectedWallet } = useOnboard();
  const { t } = useI18n();
  const { assetSymbol, assetAddress, deposit } = useErc4626Contract(
    vaultId,
    true,
    true
  );

  const { userAllowance, fetchUserAllowance, approveSpending } =
    useErc20Contract(assetAddress, false);

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
    if (userBalance.value < amount.value) {
      return {
        label: t("not_enough", { msg: assetSymbol.value }),
        disabled: true,
      };
    }
    if (amount.value < userAllowance.value) {
      return {
        label: t("approve"),
        disabled: false,
      };
    }
    return {
      label: t("deposit"),
      disabled: false,
    };
  });

  const handleDeposit = async () => {
    if (buttonState.value.label === t("deposit")) {
      await deposit(amount.value, true);
    }
    if (buttonState.value.label === t("approve")) {
      await approveSpending(vaultId.value, true);
      await fetchUserAllowance(vaultId.value);
    }
  };

  return {
    amount,
    buttonState,
    handleDeposit,
  };
};

export { useVaultDeposit };
