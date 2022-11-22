import { VaultStrategy, type Token } from "dapp-types";
import type {
  DepositTicketInfoFragment,
  WithdrawalTicketInfoFragment,
} from "subgraph-queries-hv/generated/operations";

export * from "@/types/web3Onboard";
export * from "@/types/uniswapAlphaRouter";

export interface RoundsFragment {
  roundNumber: string;
  underlyingToShareRate: string;
  shareToUnderlyingRate: string;
  depositTickets: DepositTicketInfoFragment[];
  withdrawalTickets: WithdrawalTicketInfoFragment[];
}

export interface EstimatedPrice {
  confidence: number;
  price: number;
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

export interface BlockPrice {
  blockNumber: number;
  estimatedTransactionCount: number;
  baseFeePerGas: number;
  estimatedPrices: EstimatedPrice[];
}

export interface Pending {
  confidence: number;
  baseFee: number;
}

export interface EstimatedBaseFee {
  "pending+1": Pending[];
  "pending+2": Pending[];
  "pending+3": Pending[];
  "pending+4": Pending[];
  "pending+5": Pending[];
}

export interface BlocknativeGasApiReturn {
  system: string;
  network: string;
  unit: string;
  maxPrice: number;
  currentBlockNumber: number;
  msSinceLastBlock: number;
  blockPrices: BlockPrice[];
  estimatedBaseFees: EstimatedBaseFee[];
}

export interface VaultData {
  address: string;
  underlying: Token;
  shareToken: Token;
  action: { maxPremium: string; cycleDurationInSecs: string };
  rounds: RoundsFragment[];
  size: string;
  hedgingRate: string;
  strikePercentage: string;
}
export interface VaultDataWithStrategy extends VaultData {
  strategy: VaultStrategy;
}

export enum AVAILABLE_TABS {
  DEPOSIT,
  WITHDRAWAL,
}
