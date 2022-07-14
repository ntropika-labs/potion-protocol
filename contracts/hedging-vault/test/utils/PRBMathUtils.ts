import { BigNumber } from "ethers";
import { toBn, fromBn } from "evm-bn";

export function toPRBMath(floatingPointNumber: string): BigNumber {
    return toBn(floatingPointNumber);
}

export function fromPRBMath(prbMathNumber: BigNumber): string {
    return fromBn(prbMathNumber);
}
