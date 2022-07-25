import { BigNumber } from "ethers";
import { toBn } from "evm-bn";

export function toPRBMath(
    floatingPointNumber: number,
    inputDecimals: number = 18,
    outputDecimals: number = 18,
): BigNumber {
    if (inputDecimals === outputDecimals) {
        return toBn(String(floatingPointNumber));
    } else if (inputDecimals > outputDecimals) {
        return toBn(String(floatingPointNumber)).div(BigNumber.from(10).pow(inputDecimals - outputDecimals));
    } else {
        return toBn(String(floatingPointNumber)).mul(BigNumber.from(10).pow(outputDecimals - inputDecimals));
    }
}
