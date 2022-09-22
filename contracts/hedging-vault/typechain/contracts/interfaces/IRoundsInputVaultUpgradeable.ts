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

export interface IRoundsInputVaultUpgradeableInterface extends utils.Interface {
  functions: {
    "asset()": FunctionFragment;
    "balanceOf(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balanceOfBatch(address[],uint256[])": FunctionFragment;
    "convertToAssets(uint256)": FunctionFragment;
    "convertToShares(uint256)": FunctionFragment;
    "decimals()": FunctionFragment;
    "deposit(uint256,address)": FunctionFragment;
    "exchangeAsset()": FunctionFragment;
    "exists(uint256)": FunctionFragment;
    "getCurrentRound()": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "maxDeposit(address)": FunctionFragment;
    "maxMint(address)": FunctionFragment;
    "maxRedeem(address)": FunctionFragment;
    "mint(uint256,address)": FunctionFragment;
    "nextRound()": FunctionFragment;
    "previewDeposit(uint256)": FunctionFragment;
    "previewMint(uint256)": FunctionFragment;
    "previewRedeem(uint256)": FunctionFragment;
    "redeem(uint256,uint256,address,address)": FunctionFragment;
    "redeemBatch(uint256[],uint256[],address,address)": FunctionFragment;
    "redeemExchangeAsset(uint256,uint256,address,address)": FunctionFragment;
    "redeemExchangeAssetBatch(uint256[],uint256[],address,address)": FunctionFragment;
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "totalAssets()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "totalSupply(uint256)": FunctionFragment;
    "vault()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "asset"
      | "balanceOf(address,uint256)"
      | "balanceOf(address)"
      | "balanceOfBatch"
      | "convertToAssets"
      | "convertToShares"
      | "decimals"
      | "deposit"
      | "exchangeAsset"
      | "exists"
      | "getCurrentRound"
      | "isApprovedForAll"
      | "maxDeposit"
      | "maxMint"
      | "maxRedeem"
      | "mint"
      | "nextRound"
      | "previewDeposit"
      | "previewMint"
      | "previewRedeem"
      | "redeem"
      | "redeemBatch"
      | "redeemExchangeAsset"
      | "redeemExchangeAssetBatch"
      | "safeBatchTransferFrom"
      | "safeTransferFrom"
      | "setApprovalForAll"
      | "supportsInterface"
      | "totalAssets"
      | "totalSupply()"
      | "totalSupply(uint256)"
      | "vault"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOf(address,uint256)",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf(address)",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfBatch",
    values: [string[], BigNumberish[]]
  ): string;
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
    functionFragment: "deposit",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "exchangeAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "exists",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "maxDeposit", values: [string]): string;
  encodeFunctionData(functionFragment: "maxMint", values: [string]): string;
  encodeFunctionData(functionFragment: "maxRedeem", values: [string]): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "nextRound", values?: undefined): string;
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
    functionFragment: "redeem",
    values: [BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemBatch",
    values: [BigNumberish[], BigNumberish[], string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemExchangeAsset",
    values: [BigNumberish, BigNumberish, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemExchangeAssetBatch",
    values: [BigNumberish[], BigNumberish[], string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "safeBatchTransferFrom",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply()",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply(uint256)",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;

  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOf(address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOf(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBatch",
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
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "exchangeAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "exists", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxMint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxRedeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nextRound", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "redeemBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemExchangeAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "redeemExchangeAssetBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeBatchTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply()",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply(uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "AssetsDeposited(address,uint256,uint256)": EventFragment;
    "Deposit(address,address,uint256,uint256)": EventFragment;
    "NextRound(uint256)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
    "Withdraw(address,address,address,uint256,uint256,uint256)": EventFragment;
    "WithdrawBatch(address,address,address,uint256,uint256[],uint256[])": EventFragment;
    "WithdrawExchangeAsset(address,address,address,uint256,uint256,uint256)": EventFragment;
    "WithdrawExchangeAssetBatch(address,address,address,uint256,uint256[],uint256[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AssetsDeposited"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NextRound"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawExchangeAsset"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawExchangeAssetBatch"): EventFragment;
}

export interface ApprovalForAllEventObject {
  account: string;
  operator: string;
  approved: boolean;
}
export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  ApprovalForAllEventObject
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export interface AssetsDepositedEventObject {
  account: string;
  assets: BigNumber;
  shares: BigNumber;
}
export type AssetsDepositedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  AssetsDepositedEventObject
>;

export type AssetsDepositedEventFilter = TypedEventFilter<AssetsDepositedEvent>;

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

export interface NextRoundEventObject {
  newRoundNumber: BigNumber;
}
export type NextRoundEvent = TypedEvent<[BigNumber], NextRoundEventObject>;

export type NextRoundEventFilter = TypedEventFilter<NextRoundEvent>;

export interface TransferBatchEventObject {
  operator: string;
  from: string;
  to: string;
  ids: BigNumber[];
  values: BigNumber[];
}
export type TransferBatchEvent = TypedEvent<
  [string, string, string, BigNumber[], BigNumber[]],
  TransferBatchEventObject
>;

export type TransferBatchEventFilter = TypedEventFilter<TransferBatchEvent>;

export interface TransferSingleEventObject {
  operator: string;
  from: string;
  to: string;
  id: BigNumber;
  value: BigNumber;
}
export type TransferSingleEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  TransferSingleEventObject
>;

export type TransferSingleEventFilter = TypedEventFilter<TransferSingleEvent>;

export interface URIEventObject {
  value: string;
  id: BigNumber;
}
export type URIEvent = TypedEvent<[string, BigNumber], URIEventObject>;

export type URIEventFilter = TypedEventFilter<URIEvent>;

export interface WithdrawEventObject {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  sharesId: BigNumber;
  sharesAmount: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface WithdrawBatchEventObject {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  sharesIds: BigNumber[];
  sharesAmounts: BigNumber[];
}
export type WithdrawBatchEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber[], BigNumber[]],
  WithdrawBatchEventObject
>;

export type WithdrawBatchEventFilter = TypedEventFilter<WithdrawBatchEvent>;

export interface WithdrawExchangeAssetEventObject {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  sharesId: BigNumber;
  sharesAmount: BigNumber;
}
export type WithdrawExchangeAssetEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber, BigNumber],
  WithdrawExchangeAssetEventObject
>;

export type WithdrawExchangeAssetEventFilter =
  TypedEventFilter<WithdrawExchangeAssetEvent>;

export interface WithdrawExchangeAssetBatchEventObject {
  caller: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  sharesIds: BigNumber[];
  sharesAmounts: BigNumber[];
}
export type WithdrawExchangeAssetBatchEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber[], BigNumber[]],
  WithdrawExchangeAssetBatchEventObject
>;

export type WithdrawExchangeAssetBatchEventFilter =
  TypedEventFilter<WithdrawExchangeAssetBatchEvent>;

export interface IRoundsInputVaultUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRoundsInputVaultUpgradeableInterface;

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
    asset(
      overrides?: CallOverrides
    ): Promise<[string] & { assetTokenAddress: string }>;

    "balanceOf(address,uint256)"(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { assets: BigNumber }>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { shares: BigNumber }>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exchangeAsset(overrides?: CallOverrides): Promise<[string]>;

    exists(id: BigNumberish, overrides?: CallOverrides): Promise<[boolean]>;

    getCurrentRound(overrides?: CallOverrides): Promise<[BigNumber]>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    maxDeposit(
      receiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxAssets: BigNumber }>;

    maxMint(
      receiver: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxShares: BigNumber }>;

    maxRedeem(
      owner: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxShares: BigNumber }>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    nextRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    previewDeposit(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { shares: BigNumber }>;

    previewMint(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { assets: BigNumber }>;

    previewRedeem(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { assets: BigNumber }>;

    redeem(
      sharesId: BigNumberish,
      sharesAmount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemBatch(
      sharesIds: BigNumberish[],
      sharesAmounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemExchangeAsset(
      id: BigNumberish,
      amount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    redeemExchangeAssetBatch(
      ids: BigNumberish[],
      amounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    totalAssets(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { totalManagedAssets: BigNumber }>;

    "totalSupply()"(overrides?: CallOverrides): Promise<[BigNumber]>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    vault(
      overrides?: CallOverrides
    ): Promise<[string] & { vaultAddress: string }>;
  };

  asset(overrides?: CallOverrides): Promise<string>;

  "balanceOf(address,uint256)"(
    account: string,
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "balanceOf(address)"(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  convertToAssets(
    shares: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  convertToShares(
    assets: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<number>;

  deposit(
    assets: BigNumberish,
    receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exchangeAsset(overrides?: CallOverrides): Promise<string>;

  exists(id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

  getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  mint(
    shares: BigNumberish,
    receiver: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  nextRound(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

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

  redeem(
    sharesId: BigNumberish,
    sharesAmount: BigNumberish,
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemBatch(
    sharesIds: BigNumberish[],
    sharesAmounts: BigNumberish[],
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemExchangeAsset(
    id: BigNumberish,
    amount: BigNumberish,
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  redeemExchangeAssetBatch(
    ids: BigNumberish[],
    amounts: BigNumberish[],
    receiver: string,
    owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply(uint256)"(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  vault(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    asset(overrides?: CallOverrides): Promise<string>;

    "balanceOf(address,uint256)"(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    convertToAssets(
      shares: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    convertToShares(
      assets: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<number>;

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exchangeAsset(overrides?: CallOverrides): Promise<string>;

    exists(id: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nextRound(overrides?: CallOverrides): Promise<void>;

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

    redeem(
      sharesId: BigNumberish,
      sharesAmount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemBatch(
      sharesIds: BigNumberish[],
      sharesAmounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemExchangeAsset(
      id: BigNumberish,
      amount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemExchangeAssetBatch(
      ids: BigNumberish[],
      amounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ApprovalForAll(address,address,bool)"(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "AssetsDeposited(address,uint256,uint256)"(
      account?: string | null,
      assets?: null,
      shares?: null
    ): AssetsDepositedEventFilter;
    AssetsDeposited(
      account?: string | null,
      assets?: null,
      shares?: null
    ): AssetsDepositedEventFilter;

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

    "NextRound(uint256)"(
      newRoundNumber?: BigNumberish | null
    ): NextRoundEventFilter;
    NextRound(newRoundNumber?: BigNumberish | null): NextRoundEventFilter;

    "TransferBatch(address,address,address,uint256[],uint256[])"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;
    TransferBatch(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;

    "TransferSingle(address,address,address,uint256,uint256)"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;
    TransferSingle(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;

    "URI(string,uint256)"(
      value?: null,
      id?: BigNumberish | null
    ): URIEventFilter;
    URI(value?: null, id?: BigNumberish | null): URIEventFilter;

    "Withdraw(address,address,address,uint256,uint256,uint256)"(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawEventFilter;
    Withdraw(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawEventFilter;

    "WithdrawBatch(address,address,address,uint256,uint256[],uint256[])"(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawBatchEventFilter;
    WithdrawBatch(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawBatchEventFilter;

    "WithdrawExchangeAsset(address,address,address,uint256,uint256,uint256)"(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawExchangeAssetEventFilter;
    WithdrawExchangeAsset(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawExchangeAssetEventFilter;

    "WithdrawExchangeAssetBatch(address,address,address,uint256,uint256[],uint256[])"(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawExchangeAssetBatchEventFilter;
    WithdrawExchangeAssetBatch(
      caller?: string | null,
      receiver?: string | null,
      owner?: string | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawExchangeAssetBatchEventFilter;
  };

  estimateGas: {
    asset(overrides?: CallOverrides): Promise<BigNumber>;

    "balanceOf(address,uint256)"(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
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

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exchangeAsset(overrides?: CallOverrides): Promise<BigNumber>;

    exists(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxDeposit(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxMint(receiver: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxRedeem(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    nextRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

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

    redeem(
      sharesId: BigNumberish,
      sharesAmount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemBatch(
      sharesIds: BigNumberish[],
      sharesAmounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemExchangeAsset(
      id: BigNumberish,
      amount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    redeemExchangeAssetBatch(
      ids: BigNumberish[],
      amounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    asset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "balanceOf(address,uint256)"(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "balanceOf(address)"(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
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

    deposit(
      assets: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exchangeAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exists(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCurrentRound(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
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

    mint(
      shares: BigNumberish,
      receiver: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    nextRound(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

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

    redeem(
      sharesId: BigNumberish,
      sharesAmount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemBatch(
      sharesIds: BigNumberish[],
      sharesAmounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemExchangeAsset(
      id: BigNumberish,
      amount: BigNumberish,
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    redeemExchangeAssetBatch(
      ids: BigNumberish[],
      amounts: BigNumberish[],
      receiver: string,
      owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalSupply()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
