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

export interface TestWrapperFeeManagerInterface extends utils.Interface {
  functions: {
    "calculateManagementPayment(uint256)": FunctionFragment;
    "calculatePerformancePayment(uint256)": FunctionFragment;
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "changeVault(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getFeesRecipient()": FunctionFragment;
    "getManagementFee()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getPerformanceFee()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "getVault()": FunctionFragment;
    "initialize(address,uint256,uint256,address)": FunctionFragment;
    "payFees(address,uint256,uint256)": FunctionFragment;
    "payFeesETH(uint256,uint256)": FunctionFragment;
    "setFeesRecipient(address)": FunctionFragment;
    "setManagementFee(uint256)": FunctionFragment;
    "setPerformanceFee(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "calculateManagementPayment"
      | "calculatePerformancePayment"
      | "changeAdmin"
      | "changeOperator"
      | "changeStrategist"
      | "changeVault"
      | "getAdmin"
      | "getFeesRecipient"
      | "getManagementFee"
      | "getOperator"
      | "getPerformanceFee"
      | "getStrategist"
      | "getVault"
      | "initialize"
      | "payFees"
      | "payFeesETH"
      | "setFeesRecipient"
      | "setManagementFee"
      | "setPerformanceFee"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "calculateManagementPayment",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "calculatePerformancePayment",
    values: [BigNumberish]
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
  encodeFunctionData(functionFragment: "changeVault", values: [string]): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getFeesRecipient",
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
  encodeFunctionData(functionFragment: "getVault", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, BigNumberish, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "payFees",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "payFeesETH",
    values: [BigNumberish, BigNumberish]
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

  decodeFunctionResult(
    functionFragment: "calculateManagementPayment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculatePerformancePayment",
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
    functionFragment: "changeVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getFeesRecipient",
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
  decodeFunctionResult(functionFragment: "getVault", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payFees", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "payFeesETH", data: BytesLike): Result;
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
    "AdminChanged(address,address)": EventFragment;
    "FeesETHSent(address,uint256,uint256)": EventFragment;
    "FeesReceipientChanged(address,address)": EventFragment;
    "FeesSent(address,address,uint256,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "ManagementFeeChanged(uint256,uint256)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "PerformanceFeeChanged(uint256,uint256)": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "VaultChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesETHSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesReceipientChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeesSent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ManagementFeeChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PerformanceFeeChanged"): EventFragment;
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

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

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

export interface VaultChangedEventObject {
  prevVaultAddress: string;
  newVaultAddress: string;
}
export type VaultChangedEvent = TypedEvent<
  [string, string],
  VaultChangedEventObject
>;

export type VaultChangedEventFilter = TypedEventFilter<VaultChangedEvent>;

export interface TestWrapperFeeManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TestWrapperFeeManagerInterface;

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
    calculateManagementPayment(
      principalAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    calculatePerformancePayment(
      earningsAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

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

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getFeesRecipient(overrides?: CallOverrides): Promise<[string]>;

    getManagementFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getPerformanceFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    getVault(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      owner: string,
      managementFee_: BigNumberish,
      performanceFee_: BigNumberish,
      feeReceipient_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    payFees(
      token: string,
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    payFeesETH(
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
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
  };

  calculateManagementPayment(
    principalAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  calculatePerformancePayment(
    earningsAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

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

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getFeesRecipient(overrides?: CallOverrides): Promise<string>;

  getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  getVault(overrides?: CallOverrides): Promise<string>;

  initialize(
    owner: string,
    managementFee_: BigNumberish,
    performanceFee_: BigNumberish,
    feeReceipient_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  payFees(
    token: string,
    principalAmount: BigNumberish,
    earningsAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  payFeesETH(
    principalAmount: BigNumberish,
    earningsAmount: BigNumberish,
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

  callStatic: {
    calculateManagementPayment(
      principalAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculatePerformancePayment(
      earningsAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getFeesRecipient(overrides?: CallOverrides): Promise<string>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    getVault(overrides?: CallOverrides): Promise<string>;

    initialize(
      owner: string,
      managementFee_: BigNumberish,
      performanceFee_: BigNumberish,
      feeReceipient_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    payFees(
      token: string,
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    payFeesETH(
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
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

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

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
    calculateManagementPayment(
      principalAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    calculatePerformancePayment(
      earningsAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

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

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getFeesRecipient(overrides?: CallOverrides): Promise<BigNumber>;

    getManagementFee(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getPerformanceFee(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      owner: string,
      managementFee_: BigNumberish,
      performanceFee_: BigNumberish,
      feeReceipient_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    payFees(
      token: string,
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    payFeesETH(
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
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
  };

  populateTransaction: {
    calculateManagementPayment(
      principalAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    calculatePerformancePayment(
      earningsAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

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

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getFeesRecipient(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getManagementFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPerformanceFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      owner: string,
      managementFee_: BigNumberish,
      performanceFee_: BigNumberish,
      feeReceipient_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    payFees(
      token: string,
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    payFeesETH(
      principalAmount: BigNumberish,
      earningsAmount: BigNumberish,
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
  };
}
