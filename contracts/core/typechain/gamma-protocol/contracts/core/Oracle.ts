/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, BigNumber, Signer, utils } from "ethers";
import type {
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
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
} from "../../../common";

export interface OracleInterface extends utils.Interface {
  functions: {
    "disputeExpiryPrice(address,uint256,uint256)": FunctionFragment;
    "endMigration()": FunctionFragment;
    "getChainlinkRoundData(address,uint80)": FunctionFragment;
    "getDisputer()": FunctionFragment;
    "getExpiryPrice(address,uint256)": FunctionFragment;
    "getPrice(address)": FunctionFragment;
    "getPricer(address)": FunctionFragment;
    "getPricerDisputePeriod(address)": FunctionFragment;
    "getPricerLockingPeriod(address)": FunctionFragment;
    "isDisputePeriodOver(address,uint256)": FunctionFragment;
    "isLockingPeriodOver(address,uint256)": FunctionFragment;
    "migrateOracle(address,uint256[],uint256[])": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setAssetPricer(address,address)": FunctionFragment;
    "setDisputePeriod(address,uint256)": FunctionFragment;
    "setDisputer(address)": FunctionFragment;
    "setExpiryPrice(address,uint256,uint256)": FunctionFragment;
    "setLockingPeriod(address,uint256)": FunctionFragment;
    "setStablePrice(address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "disputeExpiryPrice"
      | "endMigration"
      | "getChainlinkRoundData"
      | "getDisputer"
      | "getExpiryPrice"
      | "getPrice"
      | "getPricer"
      | "getPricerDisputePeriod"
      | "getPricerLockingPeriod"
      | "isDisputePeriodOver"
      | "isLockingPeriodOver"
      | "migrateOracle"
      | "owner"
      | "renounceOwnership"
      | "setAssetPricer"
      | "setDisputePeriod"
      | "setDisputer"
      | "setExpiryPrice"
      | "setLockingPeriod"
      | "setStablePrice"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "disputeExpiryPrice",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "endMigration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getChainlinkRoundData",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getDisputer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getExpiryPrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPrice",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPricer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPricerDisputePeriod",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPricerLockingPeriod",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isDisputePeriodOver",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isLockingPeriodOver",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "migrateOracle",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setAssetPricer",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDisputePeriod",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setDisputer",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setExpiryPrice",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setLockingPeriod",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStablePrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "disputeExpiryPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "endMigration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getChainlinkRoundData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDisputer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExpiryPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPricer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPricerDisputePeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPricerLockingPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isDisputePeriodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLockingPeriodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "migrateOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAssetPricer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDisputePeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDisputer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setExpiryPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLockingPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStablePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "DisputerUpdated(address)": EventFragment;
    "ExpiryPriceDisputed(address,uint256,uint256,uint256,uint256)": EventFragment;
    "ExpiryPriceUpdated(address,uint256,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PricerDisputePeriodUpdated(address,uint256)": EventFragment;
    "PricerLockingPeriodUpdated(address,uint256)": EventFragment;
    "PricerUpdated(address,address)": EventFragment;
    "StablePriceUpdated(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DisputerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExpiryPriceDisputed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ExpiryPriceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PricerDisputePeriodUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PricerLockingPeriodUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PricerUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StablePriceUpdated"): EventFragment;
}

export interface DisputerUpdatedEventObject {
  newDisputer: string;
}
export type DisputerUpdatedEvent = TypedEvent<
  [string],
  DisputerUpdatedEventObject
>;

export type DisputerUpdatedEventFilter = TypedEventFilter<DisputerUpdatedEvent>;

export interface ExpiryPriceDisputedEventObject {
  asset: string;
  expiryTimestamp: BigNumber;
  disputedPrice: BigNumber;
  newPrice: BigNumber;
  disputeTimestamp: BigNumber;
}
export type ExpiryPriceDisputedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber, BigNumber],
  ExpiryPriceDisputedEventObject
>;

export type ExpiryPriceDisputedEventFilter =
  TypedEventFilter<ExpiryPriceDisputedEvent>;

export interface ExpiryPriceUpdatedEventObject {
  asset: string;
  expiryTimestamp: BigNumber;
  price: BigNumber;
  onchainTimestamp: BigNumber;
}
export type ExpiryPriceUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  ExpiryPriceUpdatedEventObject
>;

export type ExpiryPriceUpdatedEventFilter =
  TypedEventFilter<ExpiryPriceUpdatedEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PricerDisputePeriodUpdatedEventObject {
  pricer: string;
  disputePeriod: BigNumber;
}
export type PricerDisputePeriodUpdatedEvent = TypedEvent<
  [string, BigNumber],
  PricerDisputePeriodUpdatedEventObject
>;

export type PricerDisputePeriodUpdatedEventFilter =
  TypedEventFilter<PricerDisputePeriodUpdatedEvent>;

export interface PricerLockingPeriodUpdatedEventObject {
  pricer: string;
  lockingPeriod: BigNumber;
}
export type PricerLockingPeriodUpdatedEvent = TypedEvent<
  [string, BigNumber],
  PricerLockingPeriodUpdatedEventObject
>;

export type PricerLockingPeriodUpdatedEventFilter =
  TypedEventFilter<PricerLockingPeriodUpdatedEvent>;

export interface PricerUpdatedEventObject {
  asset: string;
  pricer: string;
}
export type PricerUpdatedEvent = TypedEvent<
  [string, string],
  PricerUpdatedEventObject
>;

export type PricerUpdatedEventFilter = TypedEventFilter<PricerUpdatedEvent>;

export interface StablePriceUpdatedEventObject {
  asset: string;
  price: BigNumber;
}
export type StablePriceUpdatedEvent = TypedEvent<
  [string, BigNumber],
  StablePriceUpdatedEventObject
>;

export type StablePriceUpdatedEventFilter =
  TypedEventFilter<StablePriceUpdatedEvent>;

export interface Oracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OracleInterface;

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
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    endMigration(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getDisputer(overrides?: CallOverrides): Promise<[string]>;

    getExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;

    getPrice(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPricer(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPricerDisputePeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPricerLockingPeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    migrateOracle(
      _asset: PromiseOrValue<string>,
      _expiries: PromiseOrValue<BigNumberish>[],
      _prices: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDisputer(
      _disputer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  disputeExpiryPrice(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  endMigration(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getChainlinkRoundData(
    _asset: PromiseOrValue<string>,
    _roundId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

  getDisputer(overrides?: CallOverrides): Promise<string>;

  getExpiryPrice(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean]>;

  getPrice(
    _asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPricer(
    _asset: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  getPricerDisputePeriod(
    _pricer: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPricerLockingPeriod(
    _pricer: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isDisputePeriodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isLockingPeriodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  migrateOracle(
    _asset: PromiseOrValue<string>,
    _expiries: PromiseOrValue<BigNumberish>[],
    _prices: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setAssetPricer(
    _asset: PromiseOrValue<string>,
    _pricer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDisputePeriod(
    _pricer: PromiseOrValue<string>,
    _disputePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDisputer(
    _disputer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setExpiryPrice(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setLockingPeriod(
    _pricer: PromiseOrValue<string>,
    _lockingPeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStablePrice(
    _asset: PromiseOrValue<string>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    endMigration(overrides?: CallOverrides): Promise<void>;

    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    getDisputer(overrides?: CallOverrides): Promise<string>;

    getExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;

    getPrice(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricer(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    getPricerDisputePeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricerLockingPeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    migrateOracle(
      _asset: PromiseOrValue<string>,
      _expiries: PromiseOrValue<BigNumberish>[],
      _prices: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setDisputer(
      _disputer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DisputerUpdated(address)"(
      newDisputer?: PromiseOrValue<string> | null
    ): DisputerUpdatedEventFilter;
    DisputerUpdated(
      newDisputer?: PromiseOrValue<string> | null
    ): DisputerUpdatedEventFilter;

    "ExpiryPriceDisputed(address,uint256,uint256,uint256,uint256)"(
      asset?: PromiseOrValue<string> | null,
      expiryTimestamp?: PromiseOrValue<BigNumberish> | null,
      disputedPrice?: null,
      newPrice?: null,
      disputeTimestamp?: null
    ): ExpiryPriceDisputedEventFilter;
    ExpiryPriceDisputed(
      asset?: PromiseOrValue<string> | null,
      expiryTimestamp?: PromiseOrValue<BigNumberish> | null,
      disputedPrice?: null,
      newPrice?: null,
      disputeTimestamp?: null
    ): ExpiryPriceDisputedEventFilter;

    "ExpiryPriceUpdated(address,uint256,uint256,uint256)"(
      asset?: PromiseOrValue<string> | null,
      expiryTimestamp?: PromiseOrValue<BigNumberish> | null,
      price?: null,
      onchainTimestamp?: null
    ): ExpiryPriceUpdatedEventFilter;
    ExpiryPriceUpdated(
      asset?: PromiseOrValue<string> | null,
      expiryTimestamp?: PromiseOrValue<BigNumberish> | null,
      price?: null,
      onchainTimestamp?: null
    ): ExpiryPriceUpdatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PricerDisputePeriodUpdated(address,uint256)"(
      pricer?: PromiseOrValue<string> | null,
      disputePeriod?: null
    ): PricerDisputePeriodUpdatedEventFilter;
    PricerDisputePeriodUpdated(
      pricer?: PromiseOrValue<string> | null,
      disputePeriod?: null
    ): PricerDisputePeriodUpdatedEventFilter;

    "PricerLockingPeriodUpdated(address,uint256)"(
      pricer?: PromiseOrValue<string> | null,
      lockingPeriod?: null
    ): PricerLockingPeriodUpdatedEventFilter;
    PricerLockingPeriodUpdated(
      pricer?: PromiseOrValue<string> | null,
      lockingPeriod?: null
    ): PricerLockingPeriodUpdatedEventFilter;

    "PricerUpdated(address,address)"(
      asset?: PromiseOrValue<string> | null,
      pricer?: PromiseOrValue<string> | null
    ): PricerUpdatedEventFilter;
    PricerUpdated(
      asset?: PromiseOrValue<string> | null,
      pricer?: PromiseOrValue<string> | null
    ): PricerUpdatedEventFilter;

    "StablePriceUpdated(address,uint256)"(
      asset?: PromiseOrValue<string> | null,
      price?: null
    ): StablePriceUpdatedEventFilter;
    StablePriceUpdated(
      asset?: PromiseOrValue<string> | null,
      price?: null
    ): StablePriceUpdatedEventFilter;
  };

  estimateGas: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    endMigration(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDisputer(overrides?: CallOverrides): Promise<BigNumber>;

    getExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrice(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricer(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricerDisputePeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPricerLockingPeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    migrateOracle(
      _asset: PromiseOrValue<string>,
      _expiries: PromiseOrValue<BigNumberish>[],
      _prices: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDisputer(
      _disputer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    endMigration(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDisputer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrice(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPricer(
      _asset: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPricerDisputePeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPricerLockingPeriod(
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    migrateOracle(
      _asset: PromiseOrValue<string>,
      _expiries: PromiseOrValue<BigNumberish>[],
      _prices: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDisputer(
      _disputer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
