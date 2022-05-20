export interface Token {
  name: string;
  symbol: string;
  address: string;
  decimals?: number;
  image?: string;
}

export interface SelectableToken extends Token {
  selected: boolean;
}
export interface Criteria {
  token: Token;
  maxStrike: number;
  maxDuration: number;
}

export interface SelectableCriteria extends Criteria {
  selected: boolean;
}
export interface BondingCurveParams {
  a: number;
  b: number;
  c: number;
  d: number;
  maxUtil: number;
}

export interface CurveCriteriaSet {
  curve: BondingCurveParams;
  criterias: Criteria[];
}
