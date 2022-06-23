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
} from "../../../common";

export interface BaseActionUpgradeableInterface extends utils.Interface {
  functions: {
    "canPositionBeEntered(address)": FunctionFragment;
    "canPositionBeExited(address)": FunctionFragment;
    "canRefund(address)": FunctionFragment;
    "canRefundETH()": FunctionFragment;
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "enterPosition(address,uint256)": FunctionFragment;
    "exitPosition(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getLifecycleState()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "refund(address,uint256,address)": FunctionFragment;
    "refundETH(uint256,address)": FunctionFragment;
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
      | "getOperator"
      | "getStrategist"
      | "pause"
      | "paused"
      | "refund"
      | "refundETH"
      | "unpause"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canPositionBeEntered",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "canPositionBeExited",
    values: [string]
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
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "exitPosition",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getLifecycleState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refund",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "refundETH",
    values: [BigNumberish, string]
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
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refundETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;

  events: {
    "ActionPositionEntered(address,uint256)": EventFragment;
    "ActionPositionExited(address,uint256)": EventFragment;
    "AdminChanged(address,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "LifecycleStateChanged(uint8,uint8)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "Paused(address)": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "Unpaused(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionPositionEntered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ActionPositionExited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LifecycleStateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Paused"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategistChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpaused"): EventFragment;
}

export interface ActionPositionEnteredEventObject {
  investmentAsset: string;
  amountToInvest: BigNumber;
}
export type ActionPositionEnteredEvent = TypedEvent<
  [string, BigNumber],
  ActionPositionEnteredEventObject
>;

export type ActionPositionEnteredEventFilter =
  TypedEventFilter<ActionPositionEnteredEvent>;

export interface ActionPositionExitedEventObject {
  investmentAsset: string;
  amountReturned: BigNumber;
}
export type ActionPositionExitedEvent = TypedEvent<
  [string, BigNumber],
  ActionPositionExitedEventObject
>;

export type ActionPositionExitedEventFilter =
  TypedEventFilter<ActionPositionExitedEvent>;

export interface AdminChangedEventObject {
  prevAdminAddress: string;
  newAdminAddress: string;
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

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

export interface OperatorChangedEventObject {
  prevOperatorAddress: string;
  newOperatorAddress: string;
}
export type OperatorChangedEvent = TypedEvent<
  [string, string],
  OperatorChangedEventObject
>;

export type OperatorChangedEventFilter = TypedEventFilter<OperatorChangedEvent>;

export interface PausedEventObject {
  account: string;
}
export type PausedEvent = TypedEvent<[string], PausedEventObject>;

export type PausedEventFilter = TypedEventFilter<PausedEvent>;

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

export interface UnpausedEventObject {
  account: string;
}
export type UnpausedEvent = TypedEvent<[string], UnpausedEventObject>;

export type UnpausedEventFilter = TypedEventFilter<UnpausedEvent>;

export interface BaseActionUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BaseActionUpgradeableInterface;

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
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<[boolean] & { canEnter: boolean }>;

    canPositionBeExited(
      investmentAsset: string,
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
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getLifecycleState(overrides?: CallOverrides): Promise<[number]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

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

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  canPositionBeEntered(
    investmentAsset: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  canPositionBeExited(
    investmentAsset: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

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
    investmentAsset: string,
    amountToInvest: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    investmentAsset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getLifecycleState(overrides?: CallOverrides): Promise<number>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

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

  unpause(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canPositionBeEntered(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    canPositionBeExited(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

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

    enterPosition(
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    exitPosition(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getLifecycleState(overrides?: CallOverrides): Promise<number>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

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

    unpause(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "ActionPositionEntered(address,uint256)"(
      investmentAsset?: string | null,
      amountToInvest?: null
    ): ActionPositionEnteredEventFilter;
    ActionPositionEntered(
      investmentAsset?: string | null,
      amountToInvest?: null
    ): ActionPositionEnteredEventFilter;

    "ActionPositionExited(address,uint256)"(
      investmentAsset?: string | null,
      amountReturned?: null
    ): ActionPositionExitedEventFilter;
    ActionPositionExited(
      investmentAsset?: string | null,
      amountReturned?: null
    ): ActionPositionExitedEventFilter;

    "AdminChanged(address,address)"(
      prevAdminAddress?: string | null,
      newAdminAddress?: string | null
    ): AdminChangedEventFilter;
    AdminChanged(
      prevAdminAddress?: string | null,
      newAdminAddress?: string | null
    ): AdminChangedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "LifecycleStateChanged(uint8,uint8)"(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;
    LifecycleStateChanged(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;

    "OperatorChanged(address,address)"(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;
    OperatorChanged(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;

    "Paused(address)"(account?: null): PausedEventFilter;
    Paused(account?: null): PausedEventFilter;

    "StrategistChanged(address,address)"(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;
    StrategistChanged(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;

    "Unpaused(address)"(account?: null): UnpausedEventFilter;
    Unpaused(account?: null): UnpausedEventFilter;
  };

  estimateGas: {
    canPositionBeEntered(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    canPositionBeExited(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getLifecycleState(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

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

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canPositionBeEntered(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canPositionBeExited(
      investmentAsset: string,
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
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLifecycleState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

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

    unpause(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
