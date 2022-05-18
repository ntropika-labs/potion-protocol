import type {
  CurveCriteria,
  CurveParamsAsBigNumbers,
  HyperbolicCurve,
} from "contracts-math";
import type { BigNumberish } from "@ethersproject/bignumber";

export class CounterpartyDetails {
  curve: CurveParamsAsBigNumbers;

  constructor(
    public lp: string,
    public poolId: number,
    public curveAs64x64: HyperbolicCurve,
    public criteria: CurveCriteria,
    public orderSizeInOtokens: BigNumberish
  ) {
    this.curve = curveAs64x64.asSolidityStruct();
  }
}

export interface IPoolUntyped {
  id: string;
  poolId: string;
  lp: string;
  size: string;
  locked: string;
  unlocked: string;
  poolOrderSize: string;
  utilization: string;
  underlyingAddress: string;
  strikeAddress: string;
  maxStrikePercent: string;
  maxDurationInDays: string;
  isPut: boolean;
  template: {
    curve: {
      id: string;
      a: string;
      b: string;
      c: string;
      d: string;
      maxUtil: string;
    };
  };
}

export interface IPool {
  id: string;
  poolId: number;
  lp: string;
  size: number;
  locked: number;
  unlocked: number;
  curve: HyperbolicCurve;
  curveCriteria: CurveCriteria;
  poolOrderSize: number;
  poolPremium: number;
  marginalCostForDeltaX: number;
  initialMarginalCost: number;
  util: number;
  maxUtil: number;
}

export interface IRouterReturn {
  premium: number;
  counterparties: CounterpartyDetails[];
}
