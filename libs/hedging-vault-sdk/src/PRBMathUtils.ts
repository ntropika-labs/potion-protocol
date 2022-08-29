import { toBn } from "evm-bn";

import { BigNumber } from "@ethersproject/bignumber";

export function toPRBMath(
  floatingPointNumber: number,
  inputDecimals = 18,
  outputDecimals = 18
): BigNumber {
  if (inputDecimals === outputDecimals) {
    return toBn(String(floatingPointNumber));
  } else if (inputDecimals > outputDecimals) {
    return toBn(String(floatingPointNumber)).div(
      BigNumber.from(10).pow(inputDecimals - outputDecimals)
    );
  } else {
    return toBn(String(floatingPointNumber)).mul(
      BigNumber.from(10).pow(outputDecimals - inputDecimals)
    );
  }
}
