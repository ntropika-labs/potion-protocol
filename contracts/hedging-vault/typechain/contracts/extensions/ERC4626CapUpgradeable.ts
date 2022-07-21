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

export interface ERC4626CapUpgradeableInterface extends utils.Interface {
  functions: {
    "allowance(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "asset()": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "changeAdmin(address)": FunctionFragment;
    "changeOperator(address)": FunctionFragment;
    "changeStrategist(address)": FunctionFragment;
    "changeVault(address)": FunctionFragment;
    "convertToAssets(uint256)": FunctionFragment;
    "convertToShares(uint256)": FunctionFragment;
    "decimals()": FunctionFragment;
    "decreaseAllowance(address,uint256)": FunctionFragment;
    "deposit(uint256,address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getOperator()": FunctionFragment;
    "getStrategist()": FunctionFragment;
    "getVault()": FunctionFragment;
    "getVaultCap()": FunctionFragment;
    "increaseAllowance(address,uint256)": FunctionFragment;
    "maxDeposit(address)": FunctionFragment;
    "maxMint(address)": FunctionFragment;
    "maxRedeem(address)": FunctionFragment;
    "maxWithdraw(address)": FunctionFragment;
    "mint(uint256,address)": FunctionFragment;
    "name()": FunctionFragment;
    "previewDeposit(uint256)": FunctionFragment;
    "previewMint(uint256)": FunctionFragment;
    "previewRedeem(uint256)": FunctionFragment;
    "previewWithdraw(uint256)": FunctionFragment;
    "redeem(uint256,address,address)": FunctionFragment;
    "setVaultCap(uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalAssets()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "withdraw(uint256,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "allowance"
      | "approve"
      | "asset"
      | "balanceOf"
      | "changeAdmin"
      | "changeOperator"
      | "changeStrategist"
      | "changeVault"
      | "convertToAssets"
      | "convertToShares"
      | "decimals"
      | "decreaseAllowance"
      | "deposit"
      | "getAdmin"
      | "getOperator"
      | "getStrategist"
      | "getVault"
      | "getVaultCap"
      | "increaseAllowance"
      | "maxDeposit"
      | "maxMint"
      | "maxRedeem"
      | "maxWithdraw"
      | "mint"
      | "name"
      | "previewDeposit"
      | "previewMint"
      | "previewRedeem"
      | "previewWithdraw"
      | "redeem"
      | "setVaultCap"
      | "symbol"
      | "totalAssets"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "allowance",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
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
    functionFragment: "convertToAssets",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "convertToShares",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "decreaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [BigNumberish, string]
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
  encodeFunctionData(
    functionFragment: "getVaultCap",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAllowance",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "maxDeposit", values: [string]): string;
  encodeFunctionData(functionFragment: "maxMint", values: [string]): string;
  encodeFunctionData(functionFragment: "maxRedeem", values: [string]): string;
  encodeFunctionData(functionFragment: "maxWithdraw", values: [string]): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "previewDeposit",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewMint",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewRedeem",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "previewWithdraw",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setVaultCap",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish, string, string]
  ): string;

  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
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
  decodeFunctionResult(
    functionFragment: "convertToAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "convertToShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
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
  decodeFunctionResult(
    functionFragment: "getVaultCap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAllowance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxRedeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "previewDeposit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewMint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewRedeem",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "previewWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setVaultCap",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "Deposit(address,address,uint256,uint256)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "OperatorChanged(address,address)": EventFragment;
    "StrategistChanged(address,address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "VaultCapChanged(uint256,uint256)": EventFragment;
    "VaultChanged(address,address)": EventFragment;
    "Withdraw(address,address,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OperatorChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "StrategistChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultCapChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VaultChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
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

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface DepositEventObject {
  caller: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

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

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface VaultCapChangedEventObject {
  prevCap: BigNumber;
  newCap: BigNumber;
}
export type VaultCapChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  VaultCapChangedEventObject
>;

export type VaultCapChangedEventFilter = TypedEventFilter<VaultCapChangedEvent>;

export interface VaultChangedEventObject {
  prevVaultAddress: string;
  newVaultAddress: string;
}
export type VaultChangedEvent = TypedEvent<
  [string, string],
  VaultChangedEventObject
>;

export type VaultChangedEventFilter = TypedEventFilter<VaultChangedEvent>;

export interface WithdrawEventObject {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface ERC4626CapUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ERC4626CapUpgradeableInterface;

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
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    asset(overrides?: CallOverrides): Promise<[string]>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<[BigNumber]>;

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

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { assets: BigNumber }>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { shares: BigNumber }>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getOperator(overrides?: CallOverrides): Promise<[string]>;

    getStrategist(overrides?: CallOverrides): Promise<[string]>;

    getVault(overrides?: CallOverrides): Promise<[string]>;

    getVaultCap(overrides?: CallOverrides): Promise<[BigNumber]>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    maxDeposit(
      receiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    maxMint(receiver: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxRedeem(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxWithdraw(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    name(overrides?: CallOverrides): Promise<[string]>;

    previewDeposit(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    previewMint(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    previewRedeem(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    previewWithdraw(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    redeem(
      shares: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setVaultCap(
      newCap: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalAssets(overrides?: CallOverrides): Promise<[BigNumber]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      assets: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  allowance(
    owner: string,
    spender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    spender: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  asset(overrides?: CallOverrides): Promise<string>;

  balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

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

  convertToAssets(
    shares: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  convertToShares(
    assets: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<number>;

  decreaseAllowance(
    spender: string,
    subtractedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deposit(
    assets: BigNumberish,
    receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getOperator(overrides?: CallOverrides): Promise<string>;

  getStrategist(overrides?: CallOverrides): Promise<string>;

  getVault(overrides?: CallOverrides): Promise<string>;

  getVaultCap(overrides?: CallOverrides): Promise<BigNumber>;

  increaseAllowance(
    spender: string,
    addedValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxWithdraw(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  mint(
    shares: BigNumberish,
    receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  name(overrides?: CallOverrides): Promise<string>;

  previewDeposit(
    assets: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  previewMint(
    shares: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  previewRedeem(
    shares: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  previewWithdraw(
    assets: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  redeem(
    shares: BigNumberish,
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setVaultCap(
    newCap: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    from: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    assets: BigNumberish,
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    asset(overrides?: CallOverrides): Promise<string>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

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

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<number>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getOperator(overrides?: CallOverrides): Promise<string>;

    getStrategist(overrides?: CallOverrides): Promise<string>;

    getVault(overrides?: CallOverrides): Promise<string>;

    getVaultCap(overrides?: CallOverrides): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxWithdraw(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    previewDeposit(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewMint(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewRedeem(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewWithdraw(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      shares: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setVaultCap(newCap: BigNumberish, overrides?: CallOverrides): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    withdraw(
      assets: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
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

    "Approval(address,address,uint256)"(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: string | null,
      spender?: string | null,
      value?: null
    ): ApprovalEventFilter;

    "Deposit(address,address,uint256,uint256)"(
      caller?: string | null,
      owner?: string | null,
      assets?: null,
      shares?: null
    ): DepositEventFilter;
    Deposit(
      caller?: string | null,
      owner?: string | null,
      assets?: null,
      shares?: null
    ): DepositEventFilter;

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

    "StrategistChanged(address,address)"(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;
    StrategistChanged(
      prevStrategistAddress?: string | null,
      newStrategistAddress?: string | null
    ): StrategistChangedEventFilter;

    "Transfer(address,address,uint256)"(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: string | null,
      to?: string | null,
      value?: null
    ): TransferEventFilter;

    "VaultCapChanged(uint256,uint256)"(
      prevCap?: BigNumberish | null,
      newCap?: BigNumberish | null
    ): VaultCapChangedEventFilter;
    VaultCapChanged(
      prevCap?: BigNumberish | null,
      newCap?: BigNumberish | null
    ): VaultCapChangedEventFilter;

    "VaultChanged(address,address)"(
      prevVaultAddress?: string | null,
      newVaultAddress?: string | null
    ): VaultChangedEventFilter;
    VaultChanged(
      prevVaultAddress?: string | null,
      newVaultAddress?: string | null
    ): VaultChangedEventFilter;

    "Withdraw(address,address,address,uint256,uint256)"(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      shares?: null
    ): WithdrawEventFilter;
    Withdraw(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      shares?: null
    ): WithdrawEventFilter;
  };

  estimateGas: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    asset(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(account: string, overrides?: CallOverrides): Promise<BigNumber>;

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

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getOperator(overrides?: CallOverrides): Promise<BigNumber>;

    getStrategist(overrides?: CallOverrides): Promise<BigNumber>;

    getVault(overrides?: CallOverrides): Promise<BigNumber>;

    getVaultCap(overrides?: CallOverrides): Promise<BigNumber>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxWithdraw(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    previewDeposit(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewMint(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewRedeem(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    previewWithdraw(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeem(
      shares: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setVaultCap(
      newCap: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      assets: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    allowance(
      owner: string,
      spender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      spender: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    asset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
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

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decreaseAllowance(
      spender: string,
      subtractedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOperator(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getStrategist(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVaultCap(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseAllowance(
      spender: string,
      addedValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    maxDeposit(
      receiver: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxMint(
      receiver: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxRedeem(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxWithdraw(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    previewDeposit(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    previewMint(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    previewRedeem(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    previewWithdraw(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    redeem(
      shares: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setVaultCap(
      newCap: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      assets: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}