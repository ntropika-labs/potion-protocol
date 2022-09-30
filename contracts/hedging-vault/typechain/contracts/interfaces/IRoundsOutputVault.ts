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

export interface IRoundsOutputVaultInterface extends utils.Interface {
  functions: {
    "asset()": FunctionFragment;
    "balanceOf(address,uint256)": FunctionFragment;
    "balanceOfAll(address)": FunctionFragment;
    "balanceOfBatch(address[],uint256[])": FunctionFragment;
    "deposit(uint256,address)": FunctionFragment;
    "exchangeAsset()": FunctionFragment;
    "exists(uint256)": FunctionFragment;
    "getCurrentRound()": FunctionFragment;
    "getExchangeRate(uint256)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "maxDeposit(address)": FunctionFragment;
    "maxRedeem(address)": FunctionFragment;
    "nextRound()": FunctionFragment;
    "redeem(uint256,uint256,address,address)": FunctionFragment;
    "redeemBatch(uint256[],uint256[],address,address)": FunctionFragment;
    "redeemExchangeAsset(uint256,uint256,address,address)": FunctionFragment;
    "redeemExchangeAssetBatch(uint256[],uint256[],address,address)": FunctionFragment;
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "totalAssets()": FunctionFragment;
    "totalSupply(uint256)": FunctionFragment;
    "totalSupplyAll()": FunctionFragment;
    "vault()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "asset"
      | "balanceOf"
      | "balanceOfAll"
      | "balanceOfBatch"
      | "deposit"
      | "exchangeAsset"
      | "exists"
      | "getCurrentRound"
      | "getExchangeRate"
      | "isApprovedForAll"
      | "maxDeposit"
      | "maxRedeem"
      | "nextRound"
      | "redeem"
      | "redeemBatch"
      | "redeemExchangeAsset"
      | "redeemExchangeAssetBatch"
      | "safeBatchTransferFrom"
      | "safeTransferFrom"
      | "setApprovalForAll"
      | "supportsInterface"
      | "totalAssets"
      | "totalSupply"
      | "totalSupplyAll"
      | "vault"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "asset", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfAll",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfBatch",
    values: [PromiseOrValue<string>[], PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "exchangeAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "exists",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getExchangeRate",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "maxDeposit",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "maxRedeem",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "nextRound", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemBatch",
    values: [
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemExchangeAsset",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "redeemExchangeAssetBatch",
    values: [
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "safeBatchTransferFrom",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BigNumberish>[],
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [PromiseOrValue<string>, PromiseOrValue<boolean>]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalAssets",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupplyAll",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "vault", values?: undefined): string;

  decodeFunctionResult(functionFragment: "asset", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBatch",
    data: BytesLike
  ): Result;
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
    functionFragment: "getExchangeRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxDeposit", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxRedeem", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "nextRound", data: BytesLike): Result;
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
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupplyAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "vault", data: BytesLike): Result;

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "DepositWithReceipt(address,address,uint256,uint256)": EventFragment;
    "NextRound(uint256)": EventFragment;
    "RedeemReceipt(address,address,address,uint256,uint256)": EventFragment;
    "RedeemReceiptBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "SharesRedeemed(uint256,address,uint256,uint256)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
    "WithdrawExchangeAsset(address,address,address,uint256,uint256,uint256)": EventFragment;
    "WithdrawExchangeAssetBatch(address,address,address,uint256,uint256[],uint256[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DepositWithReceipt"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "NextRound"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RedeemReceipt"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RedeemReceiptBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SharesRedeemed"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
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

export interface DepositWithReceiptEventObject {
  caller: string;
  owner: string;
  id: BigNumber;
  assets: BigNumber;
}
export type DepositWithReceiptEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  DepositWithReceiptEventObject
>;

export type DepositWithReceiptEventFilter =
  TypedEventFilter<DepositWithReceiptEvent>;

export interface NextRoundEventObject {
  newRoundNumber: BigNumber;
}
export type NextRoundEvent = TypedEvent<[BigNumber], NextRoundEventObject>;

export type NextRoundEventFilter = TypedEventFilter<NextRoundEvent>;

export interface RedeemReceiptEventObject {
  caller: string;
  receiver: string;
  owner: string;
  id: BigNumber;
  amount: BigNumber;
}
export type RedeemReceiptEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  RedeemReceiptEventObject
>;

export type RedeemReceiptEventFilter = TypedEventFilter<RedeemReceiptEvent>;

export interface RedeemReceiptBatchEventObject {
  caller: string;
  receiver: string;
  owner: string;
  ids: BigNumber[];
  amounts: BigNumber[];
}
export type RedeemReceiptBatchEvent = TypedEvent<
  [string, string, string, BigNumber[], BigNumber[]],
  RedeemReceiptBatchEventObject
>;

export type RedeemReceiptBatchEventFilter =
  TypedEventFilter<RedeemReceiptBatchEvent>;

export interface SharesRedeemedEventObject {
  roundId: BigNumber;
  account: string;
  shares: BigNumber;
  assets: BigNumber;
}
export type SharesRedeemedEvent = TypedEvent<
  [BigNumber, string, BigNumber, BigNumber],
  SharesRedeemedEventObject
>;

export type SharesRedeemedEventFilter = TypedEventFilter<SharesRedeemedEvent>;

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

export interface IRoundsOutputVault extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IRoundsOutputVaultInterface;

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

    balanceOf(
      account: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfAll(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfBatch(
      accounts: PromiseOrValue<string>[],
      ids: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    deposit(
      assets: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    exchangeAsset(overrides?: CallOverrides): Promise<[string]>;

    exists(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getCurrentRound(overrides?: CallOverrides): Promise<[BigNumber]>;

    getExchangeRate(
      round: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isApprovedForAll(
      account: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    maxDeposit(
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxAssets: BigNumber }>;

    maxRedeem(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { maxShares: BigNumber }>;

    nextRound(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeem(
      sharesId: PromiseOrValue<BigNumberish>,
      sharesAmount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeemBatch(
      sharesIds: PromiseOrValue<BigNumberish>[],
      sharesAmounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeemExchangeAsset(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    redeemExchangeAssetBatch(
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    safeBatchTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    totalAssets(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { totalManagedAssets: BigNumber }>;

    totalSupply(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    totalSupplyAll(overrides?: CallOverrides): Promise<[BigNumber]>;

    vault(
      overrides?: CallOverrides
    ): Promise<[string] & { vaultAddress: string }>;
  };

  asset(overrides?: CallOverrides): Promise<string>;

  balanceOf(
    account: PromiseOrValue<string>,
    id: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfAll(
    account: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfBatch(
    accounts: PromiseOrValue<string>[],
    ids: PromiseOrValue<BigNumberish>[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  deposit(
    assets: PromiseOrValue<BigNumberish>,
    receiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  exchangeAsset(overrides?: CallOverrides): Promise<string>;

  exists(
    id: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

  getExchangeRate(
    round: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isApprovedForAll(
    account: PromiseOrValue<string>,
    operator: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  maxDeposit(
    receiver: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  maxRedeem(
    owner: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  nextRound(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeem(
    sharesId: PromiseOrValue<BigNumberish>,
    sharesAmount: PromiseOrValue<BigNumberish>,
    receiver: PromiseOrValue<string>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeemBatch(
    sharesIds: PromiseOrValue<BigNumberish>[],
    sharesAmounts: PromiseOrValue<BigNumberish>[],
    receiver: PromiseOrValue<string>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeemExchangeAsset(
    id: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    receiver: PromiseOrValue<string>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  redeemExchangeAssetBatch(
    ids: PromiseOrValue<BigNumberish>[],
    amounts: PromiseOrValue<BigNumberish>[],
    receiver: PromiseOrValue<string>,
    owner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  safeBatchTransferFrom(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    ids: PromiseOrValue<BigNumberish>[],
    amounts: PromiseOrValue<BigNumberish>[],
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    id: PromiseOrValue<BigNumberish>,
    amount: PromiseOrValue<BigNumberish>,
    data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: PromiseOrValue<string>,
    approved: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

  totalSupply(
    id: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  totalSupplyAll(overrides?: CallOverrides): Promise<BigNumber>;

  vault(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    asset(overrides?: CallOverrides): Promise<string>;

    balanceOf(
      account: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfAll(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: PromiseOrValue<string>[],
      ids: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    deposit(
      assets: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    exchangeAsset(overrides?: CallOverrides): Promise<string>;

    exists(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

    getExchangeRate(
      round: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      account: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    maxDeposit(
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxRedeem(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nextRound(overrides?: CallOverrides): Promise<void>;

    redeem(
      sharesId: PromiseOrValue<BigNumberish>,
      sharesAmount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemBatch(
      sharesIds: PromiseOrValue<BigNumberish>[],
      sharesAmounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemExchangeAsset(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    redeemExchangeAssetBatch(
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    safeTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupplyAll(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ApprovalForAll(address,address,bool)"(
      account?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      account?: PromiseOrValue<string> | null,
      operator?: PromiseOrValue<string> | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "DepositWithReceipt(address,address,uint256,uint256)"(
      caller?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      id?: null,
      assets?: null
    ): DepositWithReceiptEventFilter;
    DepositWithReceipt(
      caller?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      id?: null,
      assets?: null
    ): DepositWithReceiptEventFilter;

    "NextRound(uint256)"(
      newRoundNumber?: PromiseOrValue<BigNumberish> | null
    ): NextRoundEventFilter;
    NextRound(
      newRoundNumber?: PromiseOrValue<BigNumberish> | null
    ): NextRoundEventFilter;

    "RedeemReceipt(address,address,address,uint256,uint256)"(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      id?: null,
      amount?: null
    ): RedeemReceiptEventFilter;
    RedeemReceipt(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      id?: null,
      amount?: null
    ): RedeemReceiptEventFilter;

    "RedeemReceiptBatch(address,address,address,uint256[],uint256[])"(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      ids?: null,
      amounts?: null
    ): RedeemReceiptBatchEventFilter;
    RedeemReceiptBatch(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      ids?: null,
      amounts?: null
    ): RedeemReceiptBatchEventFilter;

    "SharesRedeemed(uint256,address,uint256,uint256)"(
      roundId?: PromiseOrValue<BigNumberish> | null,
      account?: PromiseOrValue<string> | null,
      shares?: null,
      assets?: null
    ): SharesRedeemedEventFilter;
    SharesRedeemed(
      roundId?: PromiseOrValue<BigNumberish> | null,
      account?: PromiseOrValue<string> | null,
      shares?: null,
      assets?: null
    ): SharesRedeemedEventFilter;

    "TransferBatch(address,address,address,uint256[],uint256[])"(
      operator?: PromiseOrValue<string> | null,
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;
    TransferBatch(
      operator?: PromiseOrValue<string> | null,
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;

    "TransferSingle(address,address,address,uint256,uint256)"(
      operator?: PromiseOrValue<string> | null,
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;
    TransferSingle(
      operator?: PromiseOrValue<string> | null,
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;

    "URI(string,uint256)"(
      value?: null,
      id?: PromiseOrValue<BigNumberish> | null
    ): URIEventFilter;
    URI(value?: null, id?: PromiseOrValue<BigNumberish> | null): URIEventFilter;

    "WithdrawExchangeAsset(address,address,address,uint256,uint256,uint256)"(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawExchangeAssetEventFilter;
    WithdrawExchangeAsset(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      assets?: null,
      sharesId?: null,
      sharesAmount?: null
    ): WithdrawExchangeAssetEventFilter;

    "WithdrawExchangeAssetBatch(address,address,address,uint256,uint256[],uint256[])"(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawExchangeAssetBatchEventFilter;
    WithdrawExchangeAssetBatch(
      caller?: PromiseOrValue<string> | null,
      receiver?: PromiseOrValue<string> | null,
      owner?: PromiseOrValue<string> | null,
      assets?: null,
      sharesIds?: null,
      sharesAmounts?: null
    ): WithdrawExchangeAssetBatchEventFilter;
  };

  estimateGas: {
    asset(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      account: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfAll(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: PromiseOrValue<string>[],
      ids: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deposit(
      assets: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    exchangeAsset(overrides?: CallOverrides): Promise<BigNumber>;

    exists(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getCurrentRound(overrides?: CallOverrides): Promise<BigNumber>;

    getExchangeRate(
      round: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      account: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxDeposit(
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxRedeem(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    nextRound(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeem(
      sharesId: PromiseOrValue<BigNumberish>,
      sharesAmount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeemBatch(
      sharesIds: PromiseOrValue<BigNumberish>[],
      sharesAmounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeemExchangeAsset(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    redeemExchangeAssetBatch(
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    safeTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalAssets(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalSupplyAll(overrides?: CallOverrides): Promise<BigNumber>;

    vault(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    asset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      account: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfAll(
      account: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfBatch(
      accounts: PromiseOrValue<string>[],
      ids: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deposit(
      assets: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    exchangeAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    exists(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getCurrentRound(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getExchangeRate(
      round: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      account: PromiseOrValue<string>,
      operator: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxDeposit(
      receiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxRedeem(
      owner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    nextRound(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeem(
      sharesId: PromiseOrValue<BigNumberish>,
      sharesAmount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeemBatch(
      sharesIds: PromiseOrValue<BigNumberish>[],
      sharesAmounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeemExchangeAsset(
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    redeemExchangeAssetBatch(
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      receiver: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    safeBatchTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      ids: PromiseOrValue<BigNumberish>[],
      amounts: PromiseOrValue<BigNumberish>[],
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    safeTransferFrom(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      id: PromiseOrValue<BigNumberish>,
      amount: PromiseOrValue<BigNumberish>,
      data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: PromiseOrValue<string>,
      approved: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalAssets(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(
      id: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalSupplyAll(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    vault(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
