import { unref } from "vue";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";

import type { MaybeRef } from "@vueuse/core";
import type { BigNumberish } from "@ethersproject/bignumber";

import type {
  DepositTicketInfoFragment,
  WithdrawalTicketInfoFragment,
} from "subgraph-queries-hv/generated/operations";

const ROUNDS_VAULT_DECIMALS = 18;

const valueOrZero = (value?: MaybeRef<BigNumberish>) => unref(value) ?? "0";

const formatAmount = (amount?: MaybeRef<BigNumberish>) =>
  parseFloat(formatUnits(valueOrZero(amount), ROUNDS_VAULT_DECIMALS));

const parseAmount = (
  amount?: MaybeRef<number | string>,
  decimals = ROUNDS_VAULT_DECIMALS
) => parseUnits(valueOrZero(amount).toString(), decimals);

const hasShares = (depositTicket?: DepositTicketInfoFragment) =>
  valueOrZero(depositTicket?.sharesRemaining) !== "0";
const hasUnderlyings = (withdrawalTicket?: WithdrawalTicketInfoFragment) =>
  valueOrZero(withdrawalTicket?.underlyingsRemaining) !== "0";

const _calcUnderlyings = (amount: BigNumberish, exchangeRate: BigNumberish) =>
  BigNumber.from(amount)
    .mul(BigNumber.from(exchangeRate))
    .div(BigNumber.from(10).pow(ROUNDS_VAULT_DECIMALS));

const calcUnderlyings = (
  amount?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) => {
  const assets = _calcUnderlyings(
    valueOrZero(amount),
    valueOrZero(exchangeRate)
  );
  return parseFloat(formatAmount(assets).toFixed(2));
};

const calcUnderlyingsBN = (
  amount?: MaybeRef<BigNumberish>,
  exchangeRate?: MaybeRef<BigNumberish>
) =>
  _calcUnderlyings(valueOrZero(amount), valueOrZero(exchangeRate)).toString();

export {
  formatAmount,
  parseAmount,
  hasShares,
  hasUnderlyings,
  calcUnderlyings,
  calcUnderlyingsBN,
};
