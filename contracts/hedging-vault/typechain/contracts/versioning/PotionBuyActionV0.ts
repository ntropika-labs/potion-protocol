/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface PotionBuyActionV0Interface extends utils.Interface {
  functions: {
    "MIN_CYCLE_DURATION()": FunctionFragment;
    "calculateCurrentPayout(address)": FunctionFragment;
    "cycleDurationSecs()": FunctionFragment;
    "hedgingRate()": FunctionFragment;
    "hedgingRateSlippage()": FunctionFragment;
    "maxPremiumPercentage()": FunctionFragment;
    "maxSwapDurationSecs()": FunctionFragment;
    "nextCycleStartTimestamp()": FunctionFragment;
    "premiumSlippage()": FunctionFragment;
    "setCycleDuration(uint256)": FunctionFragment;
    "setHedgingRate(uint256)": FunctionFragment;
    "setHedgingRateSlippage(uint256)": FunctionFragment;
    "setMaxPremiumPercentage(uint256)": FunctionFragment;
    "setMaxSwapDuration(uint256)": FunctionFragment;
    "setPremiumSlippage(uint256)": FunctionFragment;
    "setStrikePercentage(uint256)": FunctionFragment;
    "setSwapSlippage(uint256)": FunctionFragment;
    "strikePercentage()": FunctionFragment;
    "swapSlippage()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MIN_CYCLE_DURATION"
      | "calculateCurrentPayout"
      | "cycleDurationSecs"
      | "hedgingRate"
      | "hedgingRateSlippage"
      | "maxPremiumPercentage"
      | "maxSwapDurationSecs"
      | "nextCycleStartTimestamp"
      | "premiumSlippage"
      | "setCycleDuration"
      | "setHedgingRate"
      | "setHedgingRateSlippage"
      | "setMaxPremiumPercentage"
      | "setMaxSwapDuration"
      | "setPremiumSlippage"
      | "setStrikePercentage"
      | "setSwapSlippage"
      | "strikePercentage"
      | "swapSlippage"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MIN_CYCLE_DURATION",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateCurrentPayout",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "cycleDurationSecs",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hedgingRate",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "hedgingRateSlippage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxPremiumPercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxSwapDurationSecs",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextCycleStartTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "premiumSlippage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setCycleDuration",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setHedgingRate",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setHedgingRateSlippage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxPremiumPercentage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxSwapDuration",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPremiumSlippage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStrikePercentage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSwapSlippage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "strikePercentage",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "swapSlippage",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "MIN_CYCLE_DURATION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateCurrentPayout",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cycleDurationSecs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hedgingRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "hedgingRateSlippage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxPremiumPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxSwapDurationSecs",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextCycleStartTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "premiumSlippage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCycleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setHedgingRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setHedgingRateSlippage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxPremiumPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxSwapDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPremiumSlippage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStrikePercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSwapSlippage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "strikePercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapSlippage",
    data: BytesLike
  ): Result;

  events: {
    "CycleDurationChanged(uint256)": EventFragment;
    "HedgingRateChanged(uint256)": EventFragment;
    "HedgingRateSlippageChanged(uint256)": EventFragment;
    "HedgingRateValidated(uint256,uint256,uint256)": EventFragment;
    "MaxPremiumPercentageChanged(uint256)": EventFragment;
    "MaxSwapDurationChanged(uint256)": EventFragment;
    "PremiumSlippageChanged(uint256)": EventFragment;
    "StrikePercentageChanged(uint256)": EventFragment;
    "SwapSlippageChanged(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CycleDurationChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "HedgingRateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "HedgingRateSlippageChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "HedgingRateValidated"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "MaxPremiumPercentageChanged"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxSwapDurationChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PremiumSlippageChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrikePercentageChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SwapSlippageChanged"): EventFragment;
}

export interface CycleDurationChangedEventObject {
  cycleDurationSecs: BigNumber;
}
export type CycleDurationChangedEvent = TypedEvent<
  [BigNumber],
  CycleDurationChangedEventObject
>;

export type CycleDurationChangedEventFilter =
  TypedEventFilter<CycleDurationChangedEvent>;

export interface HedgingRateChangedEventObject {
  hedgingRate: BigNumber;
}
export type HedgingRateChangedEvent = TypedEvent<
  [BigNumber],
  HedgingRateChangedEventObject
>;

export type HedgingRateChangedEventFilter =
  TypedEventFilter<HedgingRateChangedEvent>;

export interface HedgingRateSlippageChangedEventObject {
  hedgingRateSlippage: BigNumber;
}
export type HedgingRateSlippageChangedEvent = TypedEvent<
  [BigNumber],
  HedgingRateSlippageChangedEventObject
>;

export type HedgingRateSlippageChangedEventFilter =
  TypedEventFilter<HedgingRateSlippageChangedEvent>;

export interface HedgingRateValidatedEventObject {
  expectedHedgingRate: BigNumber;
  hedgingRateSlippage: BigNumber;
  actualHedgingRate: BigNumber;
}
export type HedgingRateValidatedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  HedgingRateValidatedEventObject
>;

export type HedgingRateValidatedEventFilter =
  TypedEventFilter<HedgingRateValidatedEvent>;

export interface MaxPremiumPercentageChangedEventObject {
  maxPremiumPercentage: BigNumber;
}
export type MaxPremiumPercentageChangedEvent = TypedEvent<
  [BigNumber],
  MaxPremiumPercentageChangedEventObject
>;

export type MaxPremiumPercentageChangedEventFilter =
  TypedEventFilter<MaxPremiumPercentageChangedEvent>;

export interface MaxSwapDurationChangedEventObject {
  maxSwapDurationSecs: BigNumber;
}
export type MaxSwapDurationChangedEvent = TypedEvent<
  [BigNumber],
  MaxSwapDurationChangedEventObject
>;

export type MaxSwapDurationChangedEventFilter =
  TypedEventFilter<MaxSwapDurationChangedEvent>;

export interface PremiumSlippageChangedEventObject {
  premiumSlippage: BigNumber;
}
export type PremiumSlippageChangedEvent = TypedEvent<
  [BigNumber],
  PremiumSlippageChangedEventObject
>;

export type PremiumSlippageChangedEventFilter =
  TypedEventFilter<PremiumSlippageChangedEvent>;

export interface StrikePercentageChangedEventObject {
  strikePercentage: BigNumber;
}
export type StrikePercentageChangedEvent = TypedEvent<
  [BigNumber],
  StrikePercentageChangedEventObject
>;

export type StrikePercentageChangedEventFilter =
  TypedEventFilter<StrikePercentageChangedEvent>;

export interface SwapSlippageChangedEventObject {
  swapSlippage: BigNumber;
}
export type SwapSlippageChangedEvent = TypedEvent<
  [BigNumber],
  SwapSlippageChangedEventObject
>;

export type SwapSlippageChangedEventFilter =
  TypedEventFilter<SwapSlippageChangedEvent>;

export interface PotionBuyActionV0 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PotionBuyActionV0Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    MIN_CYCLE_DURATION(overrides?: CallOverrides): Promise<[BigNumber]>;

    calculateCurrentPayout(
      investmentAsset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        isFinal: boolean;
        payout: BigNumber;
        orderSize: BigNumber;
      }
    >;

    cycleDurationSecs(overrides?: CallOverrides): Promise<[BigNumber]>;

    hedgingRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    hedgingRateSlippage(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxPremiumPercentage(overrides?: CallOverrides): Promise<[BigNumber]>;

    maxSwapDurationSecs(overrides?: CallOverrides): Promise<[BigNumber]>;

    nextCycleStartTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    premiumSlippage(overrides?: CallOverrides): Promise<[BigNumber]>;

    setCycleDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setHedgingRate(
      hedgingRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setHedgingRateSlippage(
      hedgingRateSlippage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMaxPremiumPercentage(
      maxPremiumPercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMaxSwapDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPremiumSlippage(
      premiumSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStrikePercentage(
      strikePercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSwapSlippage(
      swapSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    strikePercentage(overrides?: CallOverrides): Promise<[BigNumber]>;

    swapSlippage(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  MIN_CYCLE_DURATION(overrides?: CallOverrides): Promise<BigNumber>;

  calculateCurrentPayout(
    investmentAsset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, BigNumber] & {
      isFinal: boolean;
      payout: BigNumber;
      orderSize: BigNumber;
    }
  >;

  cycleDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

  hedgingRate(overrides?: CallOverrides): Promise<BigNumber>;

  hedgingRateSlippage(overrides?: CallOverrides): Promise<BigNumber>;

  maxPremiumPercentage(overrides?: CallOverrides): Promise<BigNumber>;

  maxSwapDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

  nextCycleStartTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  premiumSlippage(overrides?: CallOverrides): Promise<BigNumber>;

  setCycleDuration(
    durationSeconds: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setHedgingRate(
    hedgingRate: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setHedgingRateSlippage(
    hedgingRateSlippage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMaxPremiumPercentage(
    maxPremiumPercentage_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMaxSwapDuration(
    durationSeconds: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPremiumSlippage(
    premiumSlippage_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStrikePercentage(
    strikePercentage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSwapSlippage(
    swapSlippage_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  strikePercentage(overrides?: CallOverrides): Promise<BigNumber>;

  swapSlippage(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    MIN_CYCLE_DURATION(overrides?: CallOverrides): Promise<BigNumber>;

    calculateCurrentPayout(
      investmentAsset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        isFinal: boolean;
        payout: BigNumber;
        orderSize: BigNumber;
      }
    >;

    cycleDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

    hedgingRate(overrides?: CallOverrides): Promise<BigNumber>;

    hedgingRateSlippage(overrides?: CallOverrides): Promise<BigNumber>;

    maxPremiumPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    maxSwapDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

    nextCycleStartTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    premiumSlippage(overrides?: CallOverrides): Promise<BigNumber>;

    setCycleDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setHedgingRate(
      hedgingRate: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setHedgingRateSlippage(
      hedgingRateSlippage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxPremiumPercentage(
      maxPremiumPercentage_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxSwapDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPremiumSlippage(
      premiumSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStrikePercentage(
      strikePercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSwapSlippage(
      swapSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    strikePercentage(overrides?: CallOverrides): Promise<BigNumber>;

    swapSlippage(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "CycleDurationChanged(uint256)"(
      cycleDurationSecs?: null
    ): CycleDurationChangedEventFilter;
    CycleDurationChanged(
      cycleDurationSecs?: null
    ): CycleDurationChangedEventFilter;

    "HedgingRateChanged(uint256)"(
      hedgingRate?: null
    ): HedgingRateChangedEventFilter;
    HedgingRateChanged(hedgingRate?: null): HedgingRateChangedEventFilter;

    "HedgingRateSlippageChanged(uint256)"(
      hedgingRateSlippage?: null
    ): HedgingRateSlippageChangedEventFilter;
    HedgingRateSlippageChanged(
      hedgingRateSlippage?: null
    ): HedgingRateSlippageChangedEventFilter;

    "HedgingRateValidated(uint256,uint256,uint256)"(
      expectedHedgingRate?: null,
      hedgingRateSlippage?: null,
      actualHedgingRate?: null
    ): HedgingRateValidatedEventFilter;
    HedgingRateValidated(
      expectedHedgingRate?: null,
      hedgingRateSlippage?: null,
      actualHedgingRate?: null
    ): HedgingRateValidatedEventFilter;

    "MaxPremiumPercentageChanged(uint256)"(
      maxPremiumPercentage?: null
    ): MaxPremiumPercentageChangedEventFilter;
    MaxPremiumPercentageChanged(
      maxPremiumPercentage?: null
    ): MaxPremiumPercentageChangedEventFilter;

    "MaxSwapDurationChanged(uint256)"(
      maxSwapDurationSecs?: null
    ): MaxSwapDurationChangedEventFilter;
    MaxSwapDurationChanged(
      maxSwapDurationSecs?: null
    ): MaxSwapDurationChangedEventFilter;

    "PremiumSlippageChanged(uint256)"(
      premiumSlippage?: null
    ): PremiumSlippageChangedEventFilter;
    PremiumSlippageChanged(
      premiumSlippage?: null
    ): PremiumSlippageChangedEventFilter;

    "StrikePercentageChanged(uint256)"(
      strikePercentage?: null
    ): StrikePercentageChangedEventFilter;
    StrikePercentageChanged(
      strikePercentage?: null
    ): StrikePercentageChangedEventFilter;

    "SwapSlippageChanged(uint256)"(
      swapSlippage?: null
    ): SwapSlippageChangedEventFilter;
    SwapSlippageChanged(swapSlippage?: null): SwapSlippageChangedEventFilter;
  };

  estimateGas: {
    MIN_CYCLE_DURATION(overrides?: CallOverrides): Promise<BigNumber>;

    calculateCurrentPayout(
      investmentAsset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    cycleDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

    hedgingRate(overrides?: CallOverrides): Promise<BigNumber>;

    hedgingRateSlippage(overrides?: CallOverrides): Promise<BigNumber>;

    maxPremiumPercentage(overrides?: CallOverrides): Promise<BigNumber>;

    maxSwapDurationSecs(overrides?: CallOverrides): Promise<BigNumber>;

    nextCycleStartTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    premiumSlippage(overrides?: CallOverrides): Promise<BigNumber>;

    setCycleDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setHedgingRate(
      hedgingRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setHedgingRateSlippage(
      hedgingRateSlippage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMaxPremiumPercentage(
      maxPremiumPercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMaxSwapDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPremiumSlippage(
      premiumSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStrikePercentage(
      strikePercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSwapSlippage(
      swapSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    strikePercentage(overrides?: CallOverrides): Promise<BigNumber>;

    swapSlippage(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MIN_CYCLE_DURATION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculateCurrentPayout(
      investmentAsset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    cycleDurationSecs(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    hedgingRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    hedgingRateSlippage(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxPremiumPercentage(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxSwapDurationSecs(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextCycleStartTimestamp(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    premiumSlippage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setCycleDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setHedgingRate(
      hedgingRate: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setHedgingRateSlippage(
      hedgingRateSlippage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMaxPremiumPercentage(
      maxPremiumPercentage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMaxSwapDuration(
      durationSeconds: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPremiumSlippage(
      premiumSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStrikePercentage(
      strikePercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSwapSlippage(
      swapSlippage_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    strikePercentage(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapSlippage(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
