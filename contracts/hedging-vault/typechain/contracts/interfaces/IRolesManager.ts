/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
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

export interface IRolesManagerInterface extends utils.Interface {
  functions: {
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "changeVault(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "getVault()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeAdmin"
      | "changeOperator"
      | "changeStrategist"
      | "changeVault"
      | "getAdmin"
      | "getOperator"
      | "getStrategist"
      | "getVault"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "changeAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeOperator",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeStrategist",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeVault",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getOperator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getStrategist",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getVault", values?: undefined): string;

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
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStrategist",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getVault", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "VaultChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategistChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultChanged"): EventFragment;
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

export interface OperatorChangedEventObject {
  prevOperatorAddress: string;
  newOperatorAddress: string;
}
export type OperatorChangedEvent = TypedEvent<
  [string, string],
  OperatorChangedEventObject
>;

export type OperatorChangedEventFilter = TypedEventFilter<OperatorChangedEvent>;

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

export interface IRolesManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRolesManagerInterface;

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
      newAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeOperator(
      newOperatorAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeStrategist(
      newStrategistAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeVault(
      newVaultAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    getVault(overrides?: CallOverrides): Promise<[string]>;
  };

  changeAdmin(
    newAdminAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeOperator(
    newOperatorAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeStrategist(
    newStrategistAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeVault(
    newVaultAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  getVault(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    changeAdmin(
      newAdminAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeOperator(
      newOperatorAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeStrategist(
      newStrategistAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeVault(
      newVaultAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    getVault(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AdminChanged(address,address)"(
      prevAdminAddress?: PromiseOrValue<string> | null,
      newAdminAddress?: PromiseOrValue<string> | null
    ): AdminChangedEventFilter;
    AdminChanged(
      prevAdminAddress?: PromiseOrValue<string> | null,
      newAdminAddress?: PromiseOrValue<string> | null
    ): AdminChangedEventFilter;

    "OperatorChanged(address,address)"(
      prevOperatorAddress?: PromiseOrValue<string> | null,
      newOperatorAddress?: PromiseOrValue<string> | null
    ): OperatorChangedEventFilter;
    OperatorChanged(
      prevOperatorAddress?: PromiseOrValue<string> | null,
      newOperatorAddress?: PromiseOrValue<string> | null
    ): OperatorChangedEventFilter;

    "StrategistChanged(address,address)"(
      prevStrategistAddress?: PromiseOrValue<string> | null,
      newStrategistAddress?: PromiseOrValue<string> | null
    ): StrategistChangedEventFilter;
    StrategistChanged(
      prevStrategistAddress?: PromiseOrValue<string> | null,
      newStrategistAddress?: PromiseOrValue<string> | null
    ): StrategistChangedEventFilter;

    "VaultChanged(address,address)"(
      prevVaultAddress?: PromiseOrValue<string> | null,
      newVaultAddress?: PromiseOrValue<string> | null
    ): VaultChangedEventFilter;
    VaultChanged(
      prevVaultAddress?: PromiseOrValue<string> | null,
      newVaultAddress?: PromiseOrValue<string> | null
    ): VaultChangedEventFilter;
  };

  estimateGas: {
    changeAdmin(
      newAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeOperator(
      newOperatorAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeStrategist(
      newStrategistAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeVault(
      newVaultAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    changeAdmin(
      newAdminAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeOperator(
      newOperatorAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeStrategist(
      newStrategistAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeVault(
      newVaultAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}