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
} from "../../../common";

export declare namespace MarginVault {
  export type VaultStruct = {
    shortOtokens: PromiseOrValue<string>[];
    longOtokens: PromiseOrValue<string>[];
    collateralAssets: PromiseOrValue<string>[];
    shortAmounts: PromiseOrValue<BigNumberish>[];
    longAmounts: PromiseOrValue<BigNumberish>[];
    collateralAmounts: PromiseOrValue<BigNumberish>[];
  };

  export type VaultStructOutput = [
    string[],
    string[],
    string[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ] & {
    shortOtokens: string[];
    longOtokens: string[];
    collateralAssets: string[];
    shortAmounts: BigNumber[];
    longAmounts: BigNumber[];
    collateralAmounts: BigNumber[];
  };
}

export declare namespace FixedPointInt256 {
  export type FixedPointIntStruct = { value: PromiseOrValue<BigNumberish> };

  export type FixedPointIntStructOutput = [BigNumber] & { value: BigNumber };
}

export interface MarginCalculatorInterface extends utils.Interface {
  functions: {
    "AUCTION_TIME()": FunctionFragment;
    "getCollateralDust(address)": FunctionFragment;
    "getExcessCollateral((address[],address[],address[],uint256[],uint256[],uint256[]),uint256)": FunctionFragment;
    "getExpiredPayoutRate(address)": FunctionFragment;
    "getMarginRequired((address[],address[],address[],uint256[],uint256[],uint256[]),uint256)": FunctionFragment;
    "getMaxPrice(address,address,address,bool,uint256)": FunctionFragment;
    "getNakedMarginRequired(address,address,address,uint256,uint256,uint256,uint256,uint256,bool)": FunctionFragment;
    "getOracleDeviation()": FunctionFragment;
    "getSpotShock(address,address,address,bool)": FunctionFragment;
    "getTimesToExpiry(address,address,address,bool)": FunctionFragment;
    "isLiquidatable((address[],address[],address[],uint256[],uint256[],uint256[]),uint256,uint256,uint256)": FunctionFragment;
    "oracle()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setCollateralDust(address,uint256)": FunctionFragment;
    "setOracleDeviation(uint256)": FunctionFragment;
    "setSpotShock(address,address,address,bool,uint256)": FunctionFragment;
    "setUpperBoundValues(address,address,address,bool,uint256[],uint256[])": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "updateUpperBoundValue(address,address,address,bool,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "AUCTION_TIME"
      | "getCollateralDust"
      | "getExcessCollateral"
      | "getExpiredPayoutRate"
      | "getMarginRequired"
      | "getMaxPrice"
      | "getNakedMarginRequired"
      | "getOracleDeviation"
      | "getSpotShock"
      | "getTimesToExpiry"
      | "isLiquidatable"
      | "oracle"
      | "owner"
      | "renounceOwnership"
      | "setCollateralDust"
      | "setOracleDeviation"
      | "setSpotShock"
      | "setUpperBoundValues"
      | "transferOwnership"
      | "updateUpperBoundValue"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "AUCTION_TIME",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCollateralDust",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getExcessCollateral",
    values: [MarginVault.VaultStruct, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getExpiredPayoutRate",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getMarginRequired",
    values: [MarginVault.VaultStruct, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getMaxPrice",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getNakedMarginRequired",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getOracleDeviation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSpotShock",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getTimesToExpiry",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isLiquidatable",
    values: [
      MarginVault.VaultStruct,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "oracle", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setCollateralDust",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setOracleDeviation",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setSpotShock",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setUpperBoundValues",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[]
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateUpperBoundValue",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "AUCTION_TIME",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCollateralDust",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExcessCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExpiredPayoutRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarginRequired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMaxPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNakedMarginRequired",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOracleDeviation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSpotShock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTimesToExpiry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLiquidatable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oracle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setCollateralDust",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setOracleDeviation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSpotShock",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUpperBoundValues",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateUpperBoundValue",
    data: BytesLike
  ): Result;

  events: {
    "CollateralDustUpdated(address,uint256)": EventFragment;
    "MaxPriceAdded(bytes32,uint256,uint256)": EventFragment;
    "MaxPriceUpdated(bytes32,uint256,uint256,uint256)": EventFragment;
    "OracleDeviationUpdated(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "SpotShockUpdated(bytes32,uint256)": EventFragment;
    "TimeToExpiryAdded(bytes32,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CollateralDustUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxPriceAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxPriceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OracleDeviationUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SpotShockUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TimeToExpiryAdded"): EventFragment;
}

export interface CollateralDustUpdatedEventObject {
  collateral: string;
  dust: BigNumber;
}
export type CollateralDustUpdatedEvent = TypedEvent<
  [string, BigNumber],
  CollateralDustUpdatedEventObject
>;

export type CollateralDustUpdatedEventFilter =
  TypedEventFilter<CollateralDustUpdatedEvent>;

export interface MaxPriceAddedEventObject {
  productHash: string;
  timeToExpiry: BigNumber;
  value: BigNumber;
}
export type MaxPriceAddedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  MaxPriceAddedEventObject
>;

export type MaxPriceAddedEventFilter = TypedEventFilter<MaxPriceAddedEvent>;

export interface MaxPriceUpdatedEventObject {
  productHash: string;
  timeToExpiry: BigNumber;
  oldValue: BigNumber;
  newValue: BigNumber;
}
export type MaxPriceUpdatedEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  MaxPriceUpdatedEventObject
>;

export type MaxPriceUpdatedEventFilter = TypedEventFilter<MaxPriceUpdatedEvent>;

export interface OracleDeviationUpdatedEventObject {
  oracleDeviation: BigNumber;
}
export type OracleDeviationUpdatedEvent = TypedEvent<
  [BigNumber],
  OracleDeviationUpdatedEventObject
>;

export type OracleDeviationUpdatedEventFilter =
  TypedEventFilter<OracleDeviationUpdatedEvent>;

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

export interface SpotShockUpdatedEventObject {
  product: string;
  spotShock: BigNumber;
}
export type SpotShockUpdatedEvent = TypedEvent<
  [string, BigNumber],
  SpotShockUpdatedEventObject
>;

export type SpotShockUpdatedEventFilter =
  TypedEventFilter<SpotShockUpdatedEvent>;

export interface TimeToExpiryAddedEventObject {
  productHash: string;
  timeToExpiry: BigNumber;
}
export type TimeToExpiryAddedEvent = TypedEvent<
  [string, BigNumber],
  TimeToExpiryAddedEventObject
>;

export type TimeToExpiryAddedEventFilter =
  TypedEventFilter<TimeToExpiryAddedEvent>;

export interface MarginCalculator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarginCalculatorInterface;

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
    AUCTION_TIME(overrides?: CallOverrides): Promise<[BigNumber]>;

    getCollateralDust(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;

    getExpiredPayoutRate(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getMarginRequired(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        FixedPointInt256.FixedPointIntStructOutput,
        FixedPointInt256.FixedPointIntStructOutput
      ]
    >;

    getMaxPrice(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getNakedMarginRequired(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _shortAmount: PromiseOrValue<BigNumberish>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _underlyingPrice: PromiseOrValue<BigNumberish>,
      _shortExpiryTimestamp: PromiseOrValue<BigNumberish>,
      _collateralDecimals: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getOracleDeviation(overrides?: CallOverrides): Promise<[BigNumber]>;

    getSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getTimesToExpiry(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      _vaultLatestUpdate: PromiseOrValue<BigNumberish>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber, BigNumber]>;

    oracle(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setCollateralDust(
      _collateral: PromiseOrValue<string>,
      _dust: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setOracleDeviation(
      _deviation: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _shockValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setUpperBoundValues(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timesToExpiry: PromiseOrValue<BigNumberish>[],
      _values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateUpperBoundValue(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  AUCTION_TIME(overrides?: CallOverrides): Promise<BigNumber>;

  getCollateralDust(
    _collateral: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getExcessCollateral(
    _vault: MarginVault.VaultStruct,
    _vaultType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean]>;

  getExpiredPayoutRate(
    _otoken: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getMarginRequired(
    _vault: MarginVault.VaultStruct,
    _vaultType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [
      FixedPointInt256.FixedPointIntStructOutput,
      FixedPointInt256.FixedPointIntStructOutput
    ]
  >;

  getMaxPrice(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    _timeToExpiry: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getNakedMarginRequired(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _shortAmount: PromiseOrValue<BigNumberish>,
    _strikePrice: PromiseOrValue<BigNumberish>,
    _underlyingPrice: PromiseOrValue<BigNumberish>,
    _shortExpiryTimestamp: PromiseOrValue<BigNumberish>,
    _collateralDecimals: PromiseOrValue<BigNumberish>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getOracleDeviation(overrides?: CallOverrides): Promise<BigNumber>;

  getSpotShock(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getTimesToExpiry(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  isLiquidatable(
    _vault: MarginVault.VaultStruct,
    _vaultType: PromiseOrValue<BigNumberish>,
    _vaultLatestUpdate: PromiseOrValue<BigNumberish>,
    _roundId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber, BigNumber]>;

  oracle(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setCollateralDust(
    _collateral: PromiseOrValue<string>,
    _dust: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setOracleDeviation(
    _deviation: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSpotShock(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    _shockValue: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setUpperBoundValues(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    _timesToExpiry: PromiseOrValue<BigNumberish>[],
    _values: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateUpperBoundValue(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    _timeToExpiry: PromiseOrValue<BigNumberish>,
    _value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    AUCTION_TIME(overrides?: CallOverrides): Promise<BigNumber>;

    getCollateralDust(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, boolean]>;

    getExpiredPayoutRate(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarginRequired(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [
        FixedPointInt256.FixedPointIntStructOutput,
        FixedPointInt256.FixedPointIntStructOutput
      ]
    >;

    getMaxPrice(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNakedMarginRequired(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _shortAmount: PromiseOrValue<BigNumberish>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _underlyingPrice: PromiseOrValue<BigNumberish>,
      _shortExpiryTimestamp: PromiseOrValue<BigNumberish>,
      _collateralDecimals: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracleDeviation(overrides?: CallOverrides): Promise<BigNumber>;

    getSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTimesToExpiry(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      _vaultLatestUpdate: PromiseOrValue<BigNumberish>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber, BigNumber]>;

    oracle(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setCollateralDust(
      _collateral: PromiseOrValue<string>,
      _dust: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setOracleDeviation(
      _deviation: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _shockValue: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setUpperBoundValues(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timesToExpiry: PromiseOrValue<BigNumberish>[],
      _values: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateUpperBoundValue(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "CollateralDustUpdated(address,uint256)"(
      collateral?: PromiseOrValue<string> | null,
      dust?: null
    ): CollateralDustUpdatedEventFilter;
    CollateralDustUpdated(
      collateral?: PromiseOrValue<string> | null,
      dust?: null
    ): CollateralDustUpdatedEventFilter;

    "MaxPriceAdded(bytes32,uint256,uint256)"(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null,
      value?: null
    ): MaxPriceAddedEventFilter;
    MaxPriceAdded(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null,
      value?: null
    ): MaxPriceAddedEventFilter;

    "MaxPriceUpdated(bytes32,uint256,uint256,uint256)"(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null,
      oldValue?: null,
      newValue?: null
    ): MaxPriceUpdatedEventFilter;
    MaxPriceUpdated(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null,
      oldValue?: null,
      newValue?: null
    ): MaxPriceUpdatedEventFilter;

    "OracleDeviationUpdated(uint256)"(
      oracleDeviation?: null
    ): OracleDeviationUpdatedEventFilter;
    OracleDeviationUpdated(
      oracleDeviation?: null
    ): OracleDeviationUpdatedEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "SpotShockUpdated(bytes32,uint256)"(
      product?: PromiseOrValue<BytesLike> | null,
      spotShock?: null
    ): SpotShockUpdatedEventFilter;
    SpotShockUpdated(
      product?: PromiseOrValue<BytesLike> | null,
      spotShock?: null
    ): SpotShockUpdatedEventFilter;

    "TimeToExpiryAdded(bytes32,uint256)"(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null
    ): TimeToExpiryAddedEventFilter;
    TimeToExpiryAdded(
      productHash?: PromiseOrValue<BytesLike> | null,
      timeToExpiry?: null
    ): TimeToExpiryAddedEventFilter;
  };

  estimateGas: {
    AUCTION_TIME(overrides?: CallOverrides): Promise<BigNumber>;

    getCollateralDust(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getExpiredPayoutRate(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarginRequired(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMaxPrice(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getNakedMarginRequired(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _shortAmount: PromiseOrValue<BigNumberish>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _underlyingPrice: PromiseOrValue<BigNumberish>,
      _shortExpiryTimestamp: PromiseOrValue<BigNumberish>,
      _collateralDecimals: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOracleDeviation(overrides?: CallOverrides): Promise<BigNumber>;

    getSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTimesToExpiry(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      _vaultLatestUpdate: PromiseOrValue<BigNumberish>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    oracle(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setCollateralDust(
      _collateral: PromiseOrValue<string>,
      _dust: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setOracleDeviation(
      _deviation: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _shockValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setUpperBoundValues(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timesToExpiry: PromiseOrValue<BigNumberish>[],
      _values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateUpperBoundValue(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    AUCTION_TIME(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCollateralDust(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getExpiredPayoutRate(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarginRequired(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMaxPrice(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNakedMarginRequired(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _shortAmount: PromiseOrValue<BigNumberish>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _underlyingPrice: PromiseOrValue<BigNumberish>,
      _shortExpiryTimestamp: PromiseOrValue<BigNumberish>,
      _collateralDecimals: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOracleDeviation(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTimesToExpiry(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: PromiseOrValue<BigNumberish>,
      _vaultLatestUpdate: PromiseOrValue<BigNumberish>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setCollateralDust(
      _collateral: PromiseOrValue<string>,
      _dust: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setOracleDeviation(
      _deviation: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSpotShock(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _shockValue: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setUpperBoundValues(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timesToExpiry: PromiseOrValue<BigNumberish>[],
      _values: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateUpperBoundValue(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      _timeToExpiry: PromiseOrValue<BigNumberish>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
