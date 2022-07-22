import type { Ref } from "vue";

export type MaybeStringRef = Ref<string> | Ref<null> | string | null;
export type MaybeNumberRef = Ref<number> | Ref<null> | number | null;

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

export interface OptionToken {
  id: string;
  address: string;
  decimals?: number;
  name: string;
  symbol: string;
  isPut: boolean;
  duration: string;
  strike: string;
  image?: string;
}

export interface Criteria {
  token: Token | SelectableToken;
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
  hideTimeout?: number;
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

export interface OtokenDatasetItem {
  value: string;
  color?: string;
  button?: boolean;
  claimable?: boolean;
}

export type OtokenDataset = OtokenDatasetItem[][];

export enum CustomPotionStep {
  ASSET,
  STRIKE,
  EXPIRATION,
  REVIEW,
}
