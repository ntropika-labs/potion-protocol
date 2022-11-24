import { defineStore } from "pinia";
import { onMounted, readonly, watch, unref, isRef } from "vue";

import { useErc20Contract } from "@/composables/useErc20Contract";
import { contractsAddresses } from "@/helpers/contracts";
import { isValidAddress } from "@/helpers/addresses";

import type { MaybeRef } from "@vueuse/core";

const { USDC } = contractsAddresses;

const usePotionBuyActionStore = (
  address: string,
  underlyingAddress: MaybeRef<string>
) =>
  defineStore(`potion_buy_action_${address}`, () => {
    const {
      getTokenBalance: _getUnderlyingBalance,
      balance: underlyingBalance,
    } = useErc20Contract(underlyingAddress);
    const {
      getTokenBalance: _getCollateralBalance,
      balance: collateralBalance,
    } = useErc20Contract(USDC.address);

    const getUnderlyingBalance = () => {
      if (isValidAddress(unref(underlyingAddress))) {
        _getUnderlyingBalance(false, address);
      }
    };
    const getCollateralBalance = () => {
      if (isValidAddress(unref(USDC.address))) {
        _getCollateralBalance(false, address);
      }
    };

    if (isRef(underlyingAddress)) {
      watch(underlyingAddress, () => {
        if (isValidAddress(unref(underlyingAddress))) {
          getUnderlyingBalance();
        }
      });
    }

    onMounted(() => {
      if (isValidAddress(address)) {
        getUnderlyingBalance();
        getCollateralBalance();
      }
    });

    return {
      underlyingBalance: readonly(underlyingBalance),
      collateralBalance: readonly(collateralBalance),
    };
  });

export { usePotionBuyActionStore };
