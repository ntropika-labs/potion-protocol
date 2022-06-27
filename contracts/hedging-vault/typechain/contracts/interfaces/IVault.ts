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
} from "../../common";

export interface IVaultInterface extends utils.Interface {
  functions: {
    "canPositionBeEntered()": FunctionFragment;
    "canPositionBeExited()": FunctionFragment;
    "canRefund(address)": FunctionFragment;
    "canRefundETH()": FunctionFragment;
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "enterPosition()": FunctionFragment;
    "exitPosition()": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getLifecycleState()": FunctionFragment;
    "getManagementFee()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getPerformanceFee()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "pause()": FunctionFragment;
    "refund(address,uint256,address)": FunctionFragment;
    "refundETH(uint256,address)": FunctionFragment;
    "setFeesRecipient(address)": FunctionFragment;
    "setManagementFee(uint256)": FunctionFragment;
    "setPerformanceFee(uint256)": FunctionFragment;
    "unpause()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "canPositionBeEntered"
      | "canPositionBeExited"
      | "canRefund"
      | "canRefundETH"
      | "changeAdmin"
      | "changeOperator"
      | "changeStrategist"
      | "enterPosition"
      | "exitPosition"
      | "getAdmin"
      | "getLifecycleState"
      | "getManagementFee"
      | "getOperator"
      | "getPerformanceFee"
      | "getStrategist"
      | "pause"
      | "refund"
      | "refundETH"
      | "setFeesRecipient"
      | "setManagementFee"
      | "setPerformanceFee"
      | "unpause"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canPositionBeEntered",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "canPositionBeExited",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "canRefund", values: [string]): string;
  encodeFunctionData(
    functionFragment: "canRefundETH",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "changeOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "changeStrategist",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "enterPosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "exitPosition",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLifecycleState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getManagementFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPerformanceFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refund",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "refundETH",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeesRecipient",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setManagementFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setPerformanceFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "canPositionBeEntered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canPositionBeExited",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "canRefund", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "canRefundETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enterPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exitPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getLifecycleState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getManagementFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPerformanceFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refundETH", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "FeesETHSent(address,uint256,uint256)": EventFragment;
    "FeesReceipientChanged(address,address)": EventFragment;
    "FeesSent(address,address,uint256,uint256)": EventFragment;
    "LifecycleStateChanged(uint8,uint8)": EventFragment;
    "ManagementFeeChanged(uint256,uint256)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "PerformanceFeeChanged(uint256,uint256)": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "VaultPositionEntered(uint256,uint256)": EventFragment;
    "VaultPositionExited(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesETHSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesReceipientChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LifecycleStateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ManagementFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PerformanceFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategistChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultPositionEntered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultPositionExited"): EventFragment;
}

export interface AdminChangedEventObject {
  prevAdminAddress: string;
  newAdminAddress: string;
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

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

export interface LifecycleStateChangedEventObject {
  prevState: number;
  newState: number;
}
export type LifecycleStateChangedEvent = TypedEvent<
  [number, number],
  LifecycleStateChangedEventObject
>;

export type LifecycleStateChangedEventFilter =
  TypedEventFilter<LifecycleStateChangedEvent>;

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

export interface OperatorChangedEventObject {
  prevOperatorAddress: string;
  newOperatorAddress: string;
}
export type OperatorChangedEvent = TypedEvent<
  [string, string],
  OperatorChangedEventObject
>;

export type OperatorChangedEventFilter = TypedEventFilter<OperatorChangedEvent>;

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

export interface StrategistChangedEventObject {
  prevStrategistAddress: string;
  newStrategistAddress: string;
}
export type StrategistChangedEvent = TypedEvent<
  [string, string],
  StrategistChangedEventObject
>;

export type StrategistChangedEventFilter =
  TypedEventFilter<StrategistChangedEvent>;

export interface VaultPositionEnteredEventObject {
  totalPrincipalAmount: BigNumber;
  principalAmountInvested: BigNumber;
}
export type VaultPositionEnteredEvent = TypedEvent<
  [BigNumber, BigNumber],
  VaultPositionEnteredEventObject
>;

export type VaultPositionEnteredEventFilter =
  TypedEventFilter<VaultPositionEnteredEvent>;

export interface VaultPositionExitedEventObject {
  newPrincipalAmount: BigNumber;
}
export type VaultPositionExitedEvent = TypedEvent<
  [BigNumber],
  VaultPositionExitedEventObject
>;

export type VaultPositionExitedEventFilter =
  TypedEventFilter<VaultPositionExitedEvent>;

export interface IVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IVaultInterface;

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
    canPositionBeEntered(
      overrides?: CallOverrides
    ): Promise<[boolean] & { canEnter: boolean }>;

    canPositionBeExited(
      overrides?: CallOverrides
    ): Promise<[boolean] & { canExit: boolean }>;

    canRefund(token: string, overrides?: CallOverrides): Promise<[boolean]>;

    canRefundETH(overrides?: CallOverrides): Promise<[boolean]>;

    changeAdmin(
      newAdminAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeOperator(
      newOperatorAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeStrategist(
      newStrategistAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getLifecycleState(overrides?: CallOverrides): Promise<[number]>;

    getManagementFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getPerformanceFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    refund(
      token: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    refundETH(
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setFeesRecipient(
      newFeesRecipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setManagementFee(
      newManagementFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPerformanceFee(
      newPerformanceFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

  canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

  canRefund(token: string, overrides?: CallOverrides): Promise<boolean>;

  canRefundETH(overrides?: CallOverrides): Promise<boolean>;

  changeAdmin(
    newAdminAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeOperator(
    newOperatorAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeStrategist(
    newStrategistAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  enterPosition(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getLifecycleState(overrides?: CallOverrides): Promise<number>;

  getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  refund(
    token: string,
    amount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  refundETH(
    amount: BigNumberish,
    recipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setFeesRecipient(
    newFeesRecipient: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setManagementFee(
    newManagementFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPerformanceFee(
    newPerformanceFee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

    canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

    canRefund(token: string, overrides?: CallOverrides): Promise<boolean>;

    canRefundETH(overrides?: CallOverrides): Promise<boolean>;

    changeAdmin(
      newAdminAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    changeOperator(
      newOperatorAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    changeStrategist(
      newStrategistAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    enterPosition(overrides?: CallOverrides): Promise<void>;

    exitPosition(overrides?: CallOverrides): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getLifecycleState(overrides?: CallOverrides): Promise<number>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    refund(
      token: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    refundETH(
      amount: BigNumberish,
      recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeesRecipient(
      newFeesRecipient: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setManagementFee(
      newManagementFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setPerformanceFee(
      newPerformanceFee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "AdminChanged(address,address)"(
      prevAdminAddress?: string | null,
      newAdminAddress?: string | null
    ): AdminChangedEventFilter;
    AdminChanged(
      prevAdminAddress?: string | null,
      newAdminAddress?: string | null
    ): AdminChangedEventFilter;

    "FeesETHSent(address,uint256,uint256)"(
      receipient?: string | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesETHSentEventFilter;
    FeesETHSent(
      receipient?: string | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesETHSentEventFilter;

    "FeesReceipientChanged(address,address)"(
      oldFeeReceipient?: string | null,
      newFeeReceipient?: string | null
    ): FeesReceipientChangedEventFilter;
    FeesReceipientChanged(
      oldFeeReceipient?: string | null,
      newFeeReceipient?: string | null
    ): FeesReceipientChangedEventFilter;

    "FeesSent(address,address,uint256,uint256)"(
      receipient?: string | null,
      token?: string | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesSentEventFilter;
    FeesSent(
      receipient?: string | null,
      token?: string | null,
      managementAmount?: null,
      performanceAmount?: null
    ): FeesSentEventFilter;

    "LifecycleStateChanged(uint8,uint8)"(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;
    LifecycleStateChanged(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;

    "ManagementFeeChanged(uint256,uint256)"(
      oldManagementFee?: null,
      newManagementFee?: null
    ): ManagementFeeChangedEventFilter;
    ManagementFeeChanged(
      oldManagementFee?: null,
      newManagementFee?: null
    ): ManagementFeeChangedEventFilter;

    "OperatorChanged(address,address)"(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;
    OperatorChanged(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;

    "PerformanceFeeChanged(uint256,uint256)"(
      oldPerformanceFee?: null,
      newPerformanceFee?: null
    ): PerformanceFeeChangedEventFilter;
    PerformanceFeeChanged(
      oldPerformanceFee?: null,
      newPerformanceFee?: null
    ): PerformanceFeeChangedEventFilter;

    "StrategistChanged(address,address)"(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;
    StrategistChanged(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;

    "VaultPositionEntered(uint256,uint256)"(
      totalPrincipalAmount?: null,
      principalAmountInvested?: null
    ): VaultPositionEnteredEventFilter;
    VaultPositionEntered(
      totalPrincipalAmount?: null,
      principalAmountInvested?: null
    ): VaultPositionEnteredEventFilter;

    "VaultPositionExited(uint256)"(
      newPrincipalAmount?: null
    ): VaultPositionExitedEventFilter;
    VaultPositionExited(
      newPrincipalAmount?: null
    ): VaultPositionExitedEventFilter;
  };

  estimateGas: {
    canPositionBeEntered(overrides?: CallOverrides): Promise<BigNumber>;

    canPositionBeExited(overrides?: CallOverrides): Promise<BigNumber>;

    canRefund(token: string, overrides?: CallOverrides): Promise<BigNumber>;

    canRefundETH(overrides?: CallOverrides): Promise<BigNumber>;

    changeAdmin(
      newAdminAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeOperator(
      newOperatorAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeStrategist(
      newStrategistAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getLifecycleState(overrides?: CallOverrides): Promise<BigNumber>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    refund(
      token: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    refundETH(
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setFeesRecipient(
      newFeesRecipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setManagementFee(
      newManagementFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPerformanceFee(
      newPerformanceFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canPositionBeEntered(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canPositionBeExited(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canRefund(
      token: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canRefundETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    changeAdmin(
      newAdminAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeOperator(
      newOperatorAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeStrategist(
      newStrategistAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLifecycleState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getManagementFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPerformanceFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    refund(
      token: string,
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    refundETH(
      amount: BigNumberish,
      recipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setFeesRecipient(
      newFeesRecipient: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setManagementFee(
      newManagementFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPerformanceFee(
      newPerformanceFee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
