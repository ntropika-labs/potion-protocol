import { unref } from "vue";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";

import type {
  DepositRequestInfoFragment,
  WithdrawalRequestInfoFragment,
} from "subgraph-queries-hv/generated/operations";

const ROUNDS_VAULT_DECIMALS = 18;

const valueOrZero = (value?: MaybeRef<BigNumberish>) => unref(value) ?? "0";

const formatAmount = (amount?: MaybeRef<BigNumberish>) =>
  parseFloat(formatUnits(valueOrZero(amount), ROUNDS_VAULT_DECIMALS));

const parseAmount = (
  amount?: MaybeRef<number | string>,
  decimals = ROUNDS_VAULT_DECIMALS
) => parseUnits(valueOrZero(amount).toString(), decimals);

const hasShares = (depositRequest?: DepositRequestInfoFragment) =>
  valueOrZero(depositRequest?.remainingShares) !== "0";
const hasAssets = (withdrawalRequest?: WithdrawalRequestInfoFragment) =>
  valueOrZero(withdrawalRequest?.remainingAssets) !== "0";

const _calcAssets = (assets: BigNumberish, exchangeRate: BigNumberish) =>
  BigNumber.from(assets)
    .mul(BigNumber.from(exchangeRate))
    .div(BigNumber.from(10).pow(ROUNDS_VAULT_DECIMALS));

const calcAssets = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => {
  const amount = _calcAssets(valueOrZero(assets), valueOrZero(exchangeRate));
  return parseFloat(formatAmount(amount).toFixed(2));
};

const calcAssetsBN = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => _calcAssets(valueOrZero(assets), valueOrZero(exchangeRate)).toString();

export {
  formatAmount,
  parseAmount,
  hasShares,
  hasAssets,
  calcAssets,
  calcAssetsBN,
};
