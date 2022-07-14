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

export interface TestWrapperActionsManagerInterface extends utils.Interface {
  functions: {
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "changeVault(address)": FunctionFragment;
    "getAction(uint256)": FunctionFragment;
    "getActionsLength()": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getPrincipalPercentage(uint256)": FunctionFragment;
    "getPrincipalPercentages()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "getTotalPrincipalPercentages()": FunctionFragment;
    "getVault()": FunctionFragment;
    "initialize(address[],uint256[])": FunctionFragment;
    "setPrincipalPercentages(uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeAdmin"
      | "changeOperator"
      | "changeStrategist"
      | "changeVault"
      | "getAction"
      | "getActionsLength"
      | "getAdmin"
      | "getOperator"
      | "getPrincipalPercentage"
      | "getPrincipalPercentages"
      | "getStrategist"
      | "getTotalPrincipalPercentages"
      | "getVault"
      | "initialize"
      | "setPrincipalPercentages"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "changeOperator",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "changeStrategist",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "changeVault", values: [string]): string;
  encodeFunctionData(
    functionFragment: "getAction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getActionsLength",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPrincipalPercentage",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPrincipalPercentages",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategist",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalPrincipalPercentages",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getVault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "setPrincipalPercentages",
    values: [BigNumberish[]]
  ): string;

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
    functionFragment: "changeVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getActionsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPrincipalPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPrincipalPercentages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalPrincipalPercentages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setPrincipalPercentages",
    data: BytesLike
  ): Result;

  events: {
    "ActionsAdded(address[])": EventFragment;
    "AdminChanged(address,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "PrincipalPercentagesUpdated(uint256[])": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "VaultChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionsAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PrincipalPercentagesUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategistChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultChanged"): EventFragment;
}

export interface ActionsAddedEventObject {
  actions: string[];
}
export type ActionsAddedEvent = TypedEvent<[string[]], ActionsAddedEventObject>;

export type ActionsAddedEventFilter = TypedEventFilter<ActionsAddedEvent>;

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

export interface OperatorChangedEventObject {
  prevOperatorAddress: string;
  newOperatorAddress: string;
}
export type OperatorChangedEvent = TypedEvent<
  [string, string],
  OperatorChangedEventObject
>;

export type OperatorChangedEventFilter = TypedEventFilter<OperatorChangedEvent>;

export interface PrincipalPercentagesUpdatedEventObject {
  _principalPercentages: BigNumber[];
}
export type PrincipalPercentagesUpdatedEvent = TypedEvent<
  [BigNumber[]],
  PrincipalPercentagesUpdatedEventObject
>;

export type PrincipalPercentagesUpdatedEventFilter =
  TypedEventFilter<PrincipalPercentagesUpdatedEvent>;

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

export interface VaultChangedEventObject {
  prevVaultAddress: string;
  newVaultAddress: string;
}
export type VaultChangedEvent = TypedEvent<
  [string, string],
  VaultChangedEventObject
>;

export type VaultChangedEventFilter = TypedEventFilter<VaultChangedEvent>;

export interface TestWrapperActionsManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TestWrapperActionsManagerInterface;

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

    changeVault(
      newVaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getActionsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getPrincipalPercentage(
      actionIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { percentage: BigNumber }>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    getTotalPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getVault(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      actions: string[],
      principalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setPrincipalPercentages(
      newPrincipalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

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

  changeVault(
    newVaultAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAction(index: BigNumberish, overrides?: CallOverrides): Promise<string>;

  getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getPrincipalPercentage(
    actionIndex: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber[]>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

  getVault(overrides?: CallOverrides): Promise<string>;

  initialize(
    actions: string[],
    principalPercentages: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setPrincipalPercentages(
    newPrincipalPercentages: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
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

    changeVault(
      newVaultAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getAction(index: BigNumberish, overrides?: CallOverrides): Promise<string>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getPrincipalPercentage(
      actionIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber[]>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<string>;

    initialize(
      actions: string[],
      principalPercentages: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    setPrincipalPercentages(
      newPrincipalPercentages: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ActionsAdded(address[])"(actions?: null): ActionsAddedEventFilter;
    ActionsAdded(actions?: null): ActionsAddedEventFilter;

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

    "OperatorChanged(address,address)"(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;
    OperatorChanged(
      prevOperatorAddress?: string | null,
      newOperatorAddress?: string | null
    ): OperatorChangedEventFilter;

    "PrincipalPercentagesUpdated(uint256[])"(
      _principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;
    PrincipalPercentagesUpdated(
      _principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;

    "StrategistChanged(address,address)"(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;
    StrategistChanged(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;

    "VaultChanged(address,address)"(
      prevVaultAddress?: string | null,
      newVaultAddress?: string | null
    ): VaultChangedEventFilter;
    VaultChanged(
      prevVaultAddress?: string | null,
      newVaultAddress?: string | null
    ): VaultChangedEventFilter;
  };

  estimateGas: {
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

    changeVault(
      newVaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getPrincipalPercentage(
      actionIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      actions: string[],
      principalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setPrincipalPercentages(
      newPrincipalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
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

    changeVault(
      newVaultAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getActionsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPrincipalPercentage(
      actionIndex: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTotalPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      actions: string[],
      principalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setPrincipalPercentages(
      newPrincipalPercentages: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}