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

export declare namespace IVaultV0 {
  export type StrategyStruct = {
    actionsIndexes: PromiseOrValue<BigNumberish>[];
  };

  export type StrategyStructOutput = [BigNumber[]] & {
    actionsIndexes: BigNumber[];
  };
}

export interface IVaultInterface extends utils.Interface {
  functions: {
    "canPositionBeEntered()": FunctionFragment;
    "canPositionBeEnteredWith((uint256[]))": FunctionFragment;
    "canPositionBeExited()": FunctionFragment;
    "canRefund(address)": FunctionFragment;
    "canRefundETH()": FunctionFragment;
    "enterPosition()": FunctionFragment;
    "enterPositionWith((uint256[]))": FunctionFragment;
    "exitPosition()": FunctionFragment;
    "getFeesRecipient()": FunctionFragment;
    "getLifecycleState()": FunctionFragment;
    "getManagementFee()": FunctionFragment;
    "getPerformanceFee()": FunctionFragment;
    "getRoleAdmin(bytes32)": FunctionFragment;
    "getRoleMember(bytes32,uint256)": FunctionFragment;
    "getRoleMemberCount(bytes32)": FunctionFragment;
    "grantRole(bytes32,address)": FunctionFragment;
    "hasRole(bytes32,address)": FunctionFragment;
    "pause()": FunctionFragment;
    "refund(address,uint256,address)": FunctionFragment;
    "refundETH(uint256,address)": FunctionFragment;
    "renounceRole(bytes32,address)": FunctionFragment;
    "revokeRole(bytes32,address)": FunctionFragment;
    "setFeesRecipient(address)": FunctionFragment;
    "setManagementFee(uint256)": FunctionFragment;
    "setPerformanceFee(uint256)": FunctionFragment;
    "unpause()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "canPositionBeEntered"
      | "canPositionBeEnteredWith"
      | "canPositionBeExited"
      | "canRefund"
      | "canRefundETH"
      | "enterPosition"
      | "enterPositionWith"
      | "exitPosition"
      | "getFeesRecipient"
      | "getLifecycleState"
      | "getManagementFee"
      | "getPerformanceFee"
      | "getRoleAdmin"
      | "getRoleMember"
      | "getRoleMemberCount"
      | "grantRole"
      | "hasRole"
      | "pause"
      | "refund"
      | "refundETH"
      | "renounceRole"
      | "revokeRole"
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
    functionFragment: "canPositionBeEnteredWith",
    values: [IVaultV0.StrategyStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "canPositionBeExited",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "canRefund",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "canRefundETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enterPosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enterPositionWith",
    values: [IVaultV0.StrategyStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "exitPosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getFeesRecipient",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLifecycleState",
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
    functionFragment: "getRoleAdmin",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleMember",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleMemberCount",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "refund",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "refundETH",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<string>]
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
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "canPositionBeEntered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canPositionBeEnteredWith",
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
    functionFragment: "enterPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "enterPositionWith",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exitPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getFeesRecipient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLifecycleState",
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
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleMember",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleMemberCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refund", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "refundETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
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
    "FeesETHSent(address,uint256,uint256)": EventFragment;
    "FeesReceipientChanged(address,address)": EventFragment;
    "FeesSent(address,address,uint256,uint256)": EventFragment;
    "LifecycleStateChanged(uint8,uint8)": EventFragment;
    "ManagementFeeChanged(uint256,uint256)": EventFragment;
    "PerformanceFeeChanged(uint256,uint256)": EventFragment;
    "RoleAdminChanged(bytes32,bytes32,bytes32)": EventFragment;
    "RoleGranted(bytes32,address,address)": EventFragment;
    "RoleRevoked(bytes32,address,address)": EventFragment;
    "VaultPositionEntered(uint256,uint256)": EventFragment;
    "VaultPositionExited(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FeesETHSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesReceipientChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LifecycleStateChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ManagementFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PerformanceFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultPositionEntered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultPositionExited"): EventFragment;
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

export interface RoleAdminChangedEventObject {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}
export type RoleAdminChangedEvent = TypedEvent<
  [string, string, string],
  RoleAdminChangedEventObject
>;

export type RoleAdminChangedEventFilter =
  TypedEventFilter<RoleAdminChangedEvent>;

export interface RoleGrantedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleGrantedEvent = TypedEvent<
  [string, string, string],
  RoleGrantedEventObject
>;

export type RoleGrantedEventFilter = TypedEventFilter<RoleGrantedEvent>;

export interface RoleRevokedEventObject {
  role: string;
  account: string;
  sender: string;
}
export type RoleRevokedEvent = TypedEvent<
  [string, string, string],
  RoleRevokedEventObject
>;

export type RoleRevokedEventFilter = TypedEventFilter<RoleRevokedEvent>;

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

    canPositionBeEnteredWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: CallOverrides
    ): Promise<[boolean] & { canEnter: boolean }>;

    canPositionBeExited(
      overrides?: CallOverrides
    ): Promise<[boolean] & { canExit: boolean }>;

    canRefund(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    canRefundETH(overrides?: CallOverrides): Promise<[boolean]>;

    enterPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    enterPositionWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getFeesRecipient(overrides?: CallOverrides): Promise<[string]>;

    getLifecycleState(overrides?: CallOverrides): Promise<[number]>;

    getManagementFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPerformanceFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleMember(
      role: PromiseOrValue<BytesLike>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getRoleMemberCount(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    refund(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    refundETH(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

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

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

  canPositionBeEnteredWith(
    strategy: IVaultV0.StrategyStruct,
    overrides?: CallOverrides
  ): Promise<boolean>;

  canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

  canRefund(
    token: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  canRefundETH(overrides?: CallOverrides): Promise<boolean>;

  enterPosition(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  enterPositionWith(
    strategy: IVaultV0.StrategyStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getFeesRecipient(overrides?: CallOverrides): Promise<string>;

  getLifecycleState(overrides?: CallOverrides): Promise<number>;

  getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

  getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

  getRoleAdmin(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleMember(
    role: PromiseOrValue<BytesLike>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getRoleMemberCount(
    role: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  grantRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  refund(
    token: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  refundETH(
    amount: PromiseOrValue<BigNumberish>,
    recipient: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: PromiseOrValue<BytesLike>,
    account: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

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

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

    canPositionBeEnteredWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: CallOverrides
    ): Promise<boolean>;

    canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

    canRefund(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    canRefundETH(overrides?: CallOverrides): Promise<boolean>;

    enterPosition(overrides?: CallOverrides): Promise<void>;

    enterPositionWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    exitPosition(overrides?: CallOverrides): Promise<BigNumber>;

    getFeesRecipient(overrides?: CallOverrides): Promise<string>;

    getLifecycleState(overrides?: CallOverrides): Promise<number>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleMember(
      role: PromiseOrValue<BytesLike>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getRoleMemberCount(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    pause(overrides?: CallOverrides): Promise<void>;

    refund(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    refundETH(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

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

    unpause(overrides?: CallOverrides): Promise<void>;
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

    "LifecycleStateChanged(uint8,uint8)"(
      prevState?: PromiseOrValue<BigNumberish> | null,
      newState?: PromiseOrValue<BigNumberish> | null
    ): LifecycleStateChangedEventFilter;
    LifecycleStateChanged(
      prevState?: PromiseOrValue<BigNumberish> | null,
      newState?: PromiseOrValue<BigNumberish> | null
    ): LifecycleStateChangedEventFilter;

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

    "RoleAdminChanged(bytes32,bytes32,bytes32)"(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;
    RoleAdminChanged(
      role?: PromiseOrValue<BytesLike> | null,
      previousAdminRole?: PromiseOrValue<BytesLike> | null,
      newAdminRole?: PromiseOrValue<BytesLike> | null
    ): RoleAdminChangedEventFilter;

    "RoleGranted(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;
    RoleGranted(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleGrantedEventFilter;

    "RoleRevoked(bytes32,address,address)"(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;
    RoleRevoked(
      role?: PromiseOrValue<BytesLike> | null,
      account?: PromiseOrValue<string> | null,
      sender?: PromiseOrValue<string> | null
    ): RoleRevokedEventFilter;

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

    canPositionBeEnteredWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    canPositionBeExited(overrides?: CallOverrides): Promise<BigNumber>;

    canRefund(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    canRefundETH(overrides?: CallOverrides): Promise<BigNumber>;

    enterPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    enterPositionWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    exitPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getFeesRecipient(overrides?: CallOverrides): Promise<BigNumber>;

    getLifecycleState(overrides?: CallOverrides): Promise<BigNumber>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleMember(
      role: PromiseOrValue<BytesLike>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getRoleMemberCount(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    refund(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    refundETH(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

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

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canPositionBeEntered(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canPositionBeEnteredWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canPositionBeExited(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canRefund(
      token: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canRefundETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    enterPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    enterPositionWith(
      strategy: IVaultV0.StrategyStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getFeesRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLifecycleState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getManagementFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPerformanceFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleMember(
      role: PromiseOrValue<BytesLike>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getRoleMemberCount(
      role: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    refund(
      token: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    refundETH(
      amount: PromiseOrValue<BigNumberish>,
      recipient: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: PromiseOrValue<BytesLike>,
      account: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

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

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
