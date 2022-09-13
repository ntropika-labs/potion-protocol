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

export interface MockOracleInterface extends utils.Interface {
  functions: {
    "getChainlinkRoundData(address,uint80)": FunctionFragment;
    "getExpiryPrice(address,uint256)": FunctionFragment;
    "getPrice(address)": FunctionFragment;
    "getPricer(address)": FunctionFragment;
    "getPricerDisputePeriod(address)": FunctionFragment;
    "getPricerLockingPeriod(address)": FunctionFragment;
    "isDisputePeriodOver(address,uint256)": FunctionFragment;
    "isFinalized(address,uint256)": FunctionFragment;
    "isLockingPeriodOver(address,uint256)": FunctionFragment;
    "realTimePrice(address)": FunctionFragment;
    "setAssetPricer(address,address)": FunctionFragment;
    "setChainlinkRoundData(address,uint80,uint256,uint256)": FunctionFragment;
    "setDisputePeriod(address,uint256)": FunctionFragment;
    "setExpiryPrice(address,uint256,uint256)": FunctionFragment;
    "setExpiryPriceFinalizedAllPeiodOver(address,uint256,uint256,bool)": FunctionFragment;
    "setIsDisputePeriodOver(address,uint256,bool)": FunctionFragment;
    "setIsFinalized(address,uint256,bool)": FunctionFragment;
    "setIsLockingPeriodOver(address,uint256,bool)": FunctionFragment;
    "setLockingPeriod(address,uint256)": FunctionFragment;
    "setRealTimePrice(address,uint256)": FunctionFragment;
    "setStablePrice(address,uint256)": FunctionFragment;
    "storedPrice(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getChainlinkRoundData"
      | "getExpiryPrice"
      | "getPrice"
      | "getPricer"
      | "getPricerDisputePeriod"
      | "getPricerLockingPeriod"
      | "isDisputePeriodOver"
      | "isFinalized"
      | "isLockingPeriodOver"
      | "realTimePrice"
      | "setAssetPricer"
      | "setChainlinkRoundData"
      | "setDisputePeriod"
      | "setExpiryPrice"
      | "setExpiryPriceFinalizedAllPeiodOver"
      | "setIsDisputePeriodOver"
      | "setIsFinalized"
      | "setIsLockingPeriodOver"
      | "setLockingPeriod"
      | "setRealTimePrice"
      | "setStablePrice"
      | "storedPrice"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getChainlinkRoundData",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
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
    functionFragment: "isFinalized",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isLockingPeriodOver",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "realTimePrice",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setAssetPricer",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setChainlinkRoundData",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setDisputePeriod",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
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
    functionFragment: "setExpiryPriceFinalizedAllPeiodOver",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setIsDisputePeriodOver",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setIsFinalized",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setIsLockingPeriodOver",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setLockingPeriod",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setRealTimePrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setStablePrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "storedPrice",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getChainlinkRoundData",
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
    functionFragment: "isFinalized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLockingPeriodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "realTimePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setAssetPricer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setChainlinkRoundData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setDisputePeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setExpiryPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setExpiryPriceFinalizedAllPeiodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setIsDisputePeriodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setIsFinalized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setIsLockingPeriodOver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setLockingPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRealTimePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStablePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "storedPrice",
    data: BytesLike
  ): Result;

  events: {};
}

export interface MockOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MockOracleInterface;

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
    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

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

    isFinalized(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    realTimePrice(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setExpiryPriceFinalizedAllPeiodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setIsDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setIsFinalized(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setIsLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setRealTimePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    storedPrice(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  getChainlinkRoundData(
    _asset: PromiseOrValue<string>,
    _roundId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<[BigNumber, BigNumber]>;

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

  isFinalized(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isLockingPeriodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  realTimePrice(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  setAssetPricer(
    _asset: PromiseOrValue<string>,
    _pricer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setChainlinkRoundData(
    _asset: PromiseOrValue<string>,
    _roundId: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    _timestamp: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setDisputePeriod(
    _pricer: PromiseOrValue<string>,
    _disputePeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setExpiryPrice(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setExpiryPriceFinalizedAllPeiodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    _isFinalized: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setIsDisputePeriodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _result: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setIsFinalized(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _isFinalized: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setIsLockingPeriodOver(
    _asset: PromiseOrValue<string>,
    _expiryTimestamp: PromiseOrValue<BigNumberish>,
    _result: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setLockingPeriod(
    _pricer: PromiseOrValue<string>,
    _lockingPeriod: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setRealTimePrice(
    _asset: PromiseOrValue<string>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setStablePrice(
    _asset: PromiseOrValue<string>,
    _price: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  storedPrice(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

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

    isFinalized(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    realTimePrice(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber, BigNumber]>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setExpiryPriceFinalizedAllPeiodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setIsDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setIsFinalized(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setIsLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setRealTimePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    storedPrice(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    isFinalized(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    realTimePrice(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setExpiryPriceFinalizedAllPeiodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setIsDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setIsFinalized(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setIsLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setRealTimePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    storedPrice(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

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

    isFinalized(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    realTimePrice(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setAssetPricer(
      _asset: PromiseOrValue<string>,
      _pricer: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setChainlinkRoundData(
      _asset: PromiseOrValue<string>,
      _roundId: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _timestamp: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setDisputePeriod(
      _pricer: PromiseOrValue<string>,
      _disputePeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setExpiryPrice(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setExpiryPriceFinalizedAllPeiodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setIsDisputePeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setIsFinalized(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _isFinalized: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setIsLockingPeriodOver(
      _asset: PromiseOrValue<string>,
      _expiryTimestamp: PromiseOrValue<BigNumberish>,
      _result: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setLockingPeriod(
      _pricer: PromiseOrValue<string>,
      _lockingPeriod: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setRealTimePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setStablePrice(
      _asset: PromiseOrValue<string>,
      _price: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    storedPrice(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
