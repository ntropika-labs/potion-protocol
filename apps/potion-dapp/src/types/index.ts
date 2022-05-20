export * from "@/types/web3Onboard";

export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  image?: string;
}

export interface SelectableToken extends Token {
  selected: boolean;
}

export interface Criteria {
  tokenAddress: string;
  maxStrike: number;
  maxDuration: number;
}
export interface BondingCurve {
  a: number;
  b: number;
  c: number;
  d: number;
  maxUtil: number;
}

export interface CurveCriteriaSet {
  curve: BondingCurve;
  criterias: Criteria[];
}
