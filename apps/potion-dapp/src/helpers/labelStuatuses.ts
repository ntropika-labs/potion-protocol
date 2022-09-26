import { LifecycleState } from "@/composables/useInvestmentVaultContract";
import type { Ref } from "vue";
import { useI18n } from "vue-i18n";

export const vaultStatusInfo = (vaultStatus: Ref<LifecycleState>) => {
  const { t } = useI18n();

  switch (vaultStatus.value) {
    case LifecycleState.Unlocked:
      return {
        label: t("unlocked"),
        class: "bg-accent-500",
      };
    case LifecycleState.Committed:
      return {
        label: t("committed"),
        class: "bg-orange-500",
      };
    case LifecycleState.Locked:
    default:
      return {
        label: t("locked"),
        class: "bg-error",
      };
  }
};
