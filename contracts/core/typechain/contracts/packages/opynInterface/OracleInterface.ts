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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface OracleInterfaceInterface extends utils.Interface {
  functions: {
    "disputeExpiryPrice(address,uint256,uint256)": FunctionFragment;
    "getChainlinkRoundData(address,uint80)": FunctionFragment;
    "getDisputer()": FunctionFragment;
    "getExpiryPrice(address,uint256)": FunctionFragment;
    "getPrice(address)": FunctionFragment;
    "getPricer(address)": FunctionFragment;
    "getPricerDisputePeriod(address)": FunctionFragment;
    "getPricerLockingPeriod(address)": FunctionFragment;
    "isDisputePeriodOver(address,uint256)": FunctionFragment;
    "isLockingPeriodOver(address,uint256)": FunctionFragment;
    "setAssetPricer(address,address)": FunctionFragment;
    "setDisputePeriod(address,uint256)": FunctionFragment;
    "setDisputer(address)": FunctionFragment;
    "setExpiryPrice(address,uint256,uint256)": FunctionFragment;
    "setLockingPeriod(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "disputeExpiryPrice"
      | "getChainlinkRoundData"
      | "getDisputer"
      | "getExpiryPrice"
      | "getPrice"
      | "getPricer"
      | "getPricerDisputePeriod"
      | "getPricerLockingPeriod"
      | "isDisputePeriodOver"
      | "isLockingPeriodOver"
      | "setAssetPricer"
      | "setDisputePeriod"
      | "setDisputer"
      | "setExpiryPrice"
      | "setLockingPeriod"
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

  decodeFunctionResult(
    functionFragment: "disputeExpiryPrice",
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

  events: {};
}

export interface OracleInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OracleInterfaceInterface;

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
  };

  disputeExpiryPrice(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
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

  callStatic: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

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
  };

  filters: {};

  estimateGas: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
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
  };

  populateTransaction: {
    disputeExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
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
  };
}
