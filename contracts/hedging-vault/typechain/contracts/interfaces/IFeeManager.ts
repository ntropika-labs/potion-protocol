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

export interface IFeeManagerInterface extends utils.Interface {
  functions: {
    "getFeesRecipient()": FunctionFragment;
    "getManagementFee()": FunctionFragment;
    "getPerformanceFee()": FunctionFragment;
    "setFeesRecipient(address)": FunctionFragment;
    "setManagementFee(uint256)": FunctionFragment;
    "setPerformanceFee(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getFeesRecipient"
      | "getManagementFee"
      | "getPerformanceFee"
      | "setFeesRecipient"
      | "setManagementFee"
      | "setPerformanceFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getFeesRecipient",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getManagementFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPerformanceFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFeesRecipient",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setManagementFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPerformanceFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getFeesRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getManagementFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPerformanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setFeesRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setManagementFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPerformanceFee",
    data: BytesLike
  ): Result;

  events: {
    "FeesETHSent(address,uint256,uint256)": EventFragment;
    "FeesReceipientChanged(address,address)": EventFragment;
    "FeesSent(address,address,uint256,uint256)": EventFragment;
    "ManagementFeeChanged(uint256,uint256)": EventFragment;
    "PerformanceFeeChanged(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FeesETHSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesReceipientChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ManagementFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PerformanceFeeChanged"): EventFragment;
}

export interface FeesETHSentEventObject {
  receipient: string;
  managementAmount: BigNumber;
  performanceAmount: BigNumber;
}
export type FeesETHSentEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  FeesETHSentEventObject
>;

export type FeesETHSentEventFilter = TypedEventFilter<FeesETHSentEvent>;

export interface FeesReceipientChangedEventObject {
  oldFeeReceipient: string;
  newFeeReceipient: string;
}
export type FeesReceipientChangedEvent = TypedEvent<
  [string, string],
  FeesReceipientChangedEventObject
>;

export type FeesReceipientChangedEventFilter =
  TypedEventFilter<FeesReceipientChangedEvent>;

export interface FeesSentEventObject {
  receipient: string;
  token: string;
  managementAmount: BigNumber;
  performanceAmount: BigNumber;
}
export type FeesSentEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  FeesSentEventObject
>;

export type FeesSentEventFilter = TypedEventFilter<FeesSentEvent>;

export interface ManagementFeeChangedEventObject {
  oldManagementFee: BigNumber;
  newManagementFee: BigNumber;
}
export type ManagementFeeChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  ManagementFeeChangedEventObject
>;

export type ManagementFeeChangedEventFilter =
  TypedEventFilter<ManagementFeeChangedEvent>;

export interface PerformanceFeeChangedEventObject {
  oldPerformanceFee: BigNumber;
  newPerformanceFee: BigNumber;
}
export type PerformanceFeeChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  PerformanceFeeChangedEventObject
>;

export type PerformanceFeeChangedEventFilter =
  TypedEventFilter<PerformanceFeeChangedEvent>;

export interface IFeeManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IFeeManagerInterface;

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
    getFeesRecipient(overrides?: CallOverrides): Promise<[string]>;

    getManagementFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPerformanceFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    setFeesRecipient(
      newFeesRecipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setManagementFee(
      newManagementFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPerformanceFee(
      newPerformanceFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getFeesRecipient(overrides?: CallOverrides): Promise<string>;

  getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

  getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

  setFeesRecipient(
    newFeesRecipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setManagementFee(
    newManagementFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPerformanceFee(
    newPerformanceFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getFeesRecipient(overrides?: CallOverrides): Promise<string>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    setFeesRecipient(
      newFeesRecipient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setManagementFee(
      newManagementFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPerformanceFee(
      newPerformanceFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "FeesETHSent(address,uint256,uint256)"(
      receipient?: PromiseOrValue<string> | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesETHSentEventFilter;
    FeesETHSent(
      receipient?: PromiseOrValue<string> | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesETHSentEventFilter;

    "FeesReceipientChanged(address,address)"(
      oldFeeReceipient?: PromiseOrValue<string> | null,
      newFeeReceipient?: PromiseOrValue<string> | null
    ): FeesReceipientChangedEventFilter;
    FeesReceipientChanged(
      oldFeeReceipient?: PromiseOrValue<string> | null,
      newFeeReceipient?: PromiseOrValue<string> | null
    ): FeesReceipientChangedEventFilter;

    "FeesSent(address,address,uint256,uint256)"(
      receipient?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesSentEventFilter;
    FeesSent(
      receipient?: PromiseOrValue<string> | null,
      token?: PromiseOrValue<string> | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesSentEventFilter;

    "ManagementFeeChanged(uint256,uint256)"(
      oldManagementFee?: null,
      newManagementFee?: null
    ): ManagementFeeChangedEventFilter;
    ManagementFeeChanged(
      oldManagementFee?: null,
      newManagementFee?: null
    ): ManagementFeeChangedEventFilter;

    "PerformanceFeeChanged(uint256,uint256)"(
      oldPerformanceFee?: null,
      newPerformanceFee?: null
    ): PerformanceFeeChangedEventFilter;
    PerformanceFeeChanged(
      oldPerformanceFee?: null,
      newPerformanceFee?: null
    ): PerformanceFeeChangedEventFilter;
  };

  estimateGas: {
    getFeesRecipient(overrides?: CallOverrides): Promise<BigNumber>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    setFeesRecipient(
      newFeesRecipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setManagementFee(
      newManagementFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPerformanceFee(
      newPerformanceFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getFeesRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getManagementFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPerformanceFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setFeesRecipient(
      newFeesRecipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setManagementFee(
      newManagementFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPerformanceFee(
      newPerformanceFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
