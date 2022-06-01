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

export interface ApiTokenPrice {
  loading: boolean;
  price: number;
  formattedPrice: string;
  success: boolean;
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

export interface EmergingCurvePoints {
  data: number[];
  symbol: string;
}

export enum SrcsetEnum {
  AVIF = "AVIF",
  WEBP = "WEBP",
  PNG = "PNG",
}

export interface NotificationProps {
  title: string;
  body: string;
  srcset: Map<SrcsetEnum, string>;
  cta?: {
    label?: string;
    url: string;
  };
}

export type PerformanceData = {
  timestamp: number;
  liquidity: number;
  utilization: number;
  pnl: number;
};

export type TimeMode = "week" | "month" | "year" | "all";
export type NamedTimestamp =
  | "now"
  | "today"
  | "endOfDay"
  | "previousWeek"
  | "previousMonth"
  | "previousYear"
  | "firstPoint";


export type MenuItem = {
  name: string;
  label: string;
};
