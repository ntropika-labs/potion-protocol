import { unref } from "vue";
import { formatUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";

import type {
  DepositRequestInfoFragment,
  WithdrawalRequestInfoFragment,
} from "subgraph-queries-hv/generated/operations";

const valueOrZero = (value?: MaybeRef<BigNumberish>) => unref(value) ?? "0";

const formatAmount = (amount?: MaybeRef<BigNumberish>) =>
  parseFloat(formatUnits(valueOrZero(amount), 18));

const hasShares = (depositRequest?: DepositRequestInfoFragment) =>
  valueOrZero(depositRequest?.remainingShares) !== "0";
const hasAssets = (withdrawalRequest?: WithdrawalRequestInfoFragment) =>
  valueOrZero(withdrawalRequest?.remainingAssets) !== "0";

const _calcAssets = (assets: BigNumberish, exchangeRate: BigNumberish) =>
  BigNumber.from(assets)
    .mul(BigNumber.from(exchangeRate))
    .div(BigNumber.from(10).pow(18));

const calcAssets = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => {
  const amount = _calcAssets(
    valueOrZero(assets),
    valueOrZero(exchangeRate)
  ).toNumber();
  return parseFloat(amount.toFixed(2));
};

const calcAssetsBN = (
  assets?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => _calcAssets(valueOrZero(assets), valueOrZero(exchangeRate)).toString();

export { formatAmount, hasShares, hasAssets, calcAssets, calcAssetsBN };
