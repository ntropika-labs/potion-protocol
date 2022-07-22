import { onMounted, computed, watch } from "vue";
import { useOnboard } from "@onboard-composable";
import { useCollateralTokenContract } from "@/composables/useCollateralTokenContract";

export function useUserData() {
  const { connectedWallet } = useOnboard();
  const walletAddress = computed(
    () => connectedWallet.value?.accounts[0].address ?? ""
  );

  const {
    fetchUserCollateralBalance,
    fetchUserCollateralAllowance,
    userAllowance,
    userCollateralBalance,
  } = useCollateralTokenContract();

  const fetchUserData = async () => {
    if (connectedWallet.value) {
      await fetchUserCollateralBalance();
      await fetchUserCollateralAllowance();
    }
  };

  onMounted(async () => await fetchUserData());

  watch(walletAddress, async (newAWallet) => {
    if (newAWallet) {
      await fetchUserData();
    } else {
      userCollateralBalance.value = 0;
      userAllowance.value = 0;
    }
  });

  return {
    walletAddress,
    userAllowance,
    userCollateralBalance,
    fetchUserData,
  };
}
