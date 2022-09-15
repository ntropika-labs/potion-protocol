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

export type PotionBuyInfoStruct = {
  targetPotionAddress: PromiseOrValue<string>;
  underlyingAsset: PromiseOrValue<string>;
  strikePriceInUSDC: PromiseOrValue<BigNumberish>;
  expirationTimestamp: PromiseOrValue<BigNumberish>;
  sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
  expectedPremiumInUSDC: PromiseOrValue<BigNumberish>;
  totalSizeInPotions: PromiseOrValue<BigNumberish>;
};

export type PotionBuyInfoStructOutput = [
  string,
  string,
  BigNumber,
  BigNumber,
  IPotionLiquidityPool.CounterpartyDetailsStructOutput[],
  BigNumber,
  BigNumber
] & {
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: BigNumber;
  expirationTimestamp: BigNumber;
  sellers: IPotionLiquidityPool.CounterpartyDetailsStructOutput[];
  expectedPremiumInUSDC: BigNumber;
  totalSizeInPotions: BigNumber;
};

export declare namespace IUniswapV3Oracle {
  export type SwapInfoStruct = {
    inputToken: PromiseOrValue<string>;
    outputToken: PromiseOrValue<string>;
    expectedPriceRate: PromiseOrValue<BigNumberish>;
    swapPath: PromiseOrValue<BytesLike>;
  };

  export type SwapInfoStructOutput = [string, string, BigNumber, string] & {
    inputToken: string;
    outputToken: string;
    expectedPriceRate: BigNumber;
    swapPath: string;
  };
}

export declare namespace ICurveManager {
  export type CurveStruct = {
    a_59x18: PromiseOrValue<BigNumberish>;
    b_59x18: PromiseOrValue<BigNumberish>;
    c_59x18: PromiseOrValue<BigNumberish>;
    d_59x18: PromiseOrValue<BigNumberish>;
    max_util_59x18: PromiseOrValue<BigNumberish>;
  };

  export type CurveStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    a_59x18: BigNumber;
    b_59x18: BigNumber;
    c_59x18: BigNumber;
    d_59x18: BigNumber;
    max_util_59x18: BigNumber;
  };
}

export declare namespace ICriteriaManager {
  export type CriteriaStruct = {
    underlyingAsset: PromiseOrValue<string>;
    strikeAsset: PromiseOrValue<string>;
    isPut: PromiseOrValue<boolean>;
    maxStrikePercent: PromiseOrValue<BigNumberish>;
    maxDurationInDays: PromiseOrValue<BigNumberish>;
  };

  export type CriteriaStructOutput = [
    string,
    string,
    boolean,
    BigNumber,
    BigNumber
  ] & {
    underlyingAsset: string;
    strikeAsset: string;
    isPut: boolean;
    maxStrikePercent: BigNumber;
    maxDurationInDays: BigNumber;
  };
}

export declare namespace IPotionLiquidityPool {
  export type CounterpartyDetailsStruct = {
    lp: PromiseOrValue<string>;
    poolId: PromiseOrValue<BigNumberish>;
    curve: ICurveManager.CurveStruct;
    criteria: ICriteriaManager.CriteriaStruct;
    orderSizeInOtokens: PromiseOrValue<BigNumberish>;
  };

  export type CounterpartyDetailsStructOutput = [
    string,
    BigNumber,
    ICurveManager.CurveStructOutput,
    ICriteriaManager.CriteriaStructOutput,
    BigNumber
  ] & {
    lp: string;
    poolId: BigNumber;
    curve: ICurveManager.CurveStructOutput;
    criteria: ICriteriaManager.CriteriaStructOutput;
    orderSizeInOtokens: BigNumber;
  };
}

export interface HedgingVaultOperatorHelperInterface extends utils.Interface {
  functions: {
    "canPositionBeEntered()": FunctionFragment;
    "canPositionBeExited()": FunctionFragment;
    "enterPosition((address,address,uint256,bytes),(address,address,uint256,uint256,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256,uint256))": FunctionFragment;
    "exitPosition((address,address,uint256,bytes))": FunctionFragment;
    "hedgingVault()": FunctionFragment;
    "owner()": FunctionFragment;
    "potionBuyAction()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "canPositionBeEntered"
      | "canPositionBeExited"
      | "enterPosition"
      | "exitPosition"
      | "hedgingVault"
      | "owner"
      | "potionBuyAction"
      | "renounceOwnership"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canPositionBeEntered",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "canPositionBeExited",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "enterPosition",
    values: [IUniswapV3Oracle.SwapInfoStruct, PotionBuyInfoStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "exitPosition",
    values: [IUniswapV3Oracle.SwapInfoStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "hedgingVault",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "potionBuyAction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "canPositionBeEntered",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canPositionBeExited",
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
  decodeFunctionResult(
    functionFragment: "hedgingVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "potionBuyAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface HedgingVaultOperatorHelper extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: HedgingVaultOperatorHelperInterface;

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
    canPositionBeEntered(overrides?: CallOverrides): Promise<[boolean]>;

    canPositionBeExited(overrides?: CallOverrides): Promise<[boolean]>;

    enterPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      potionBuyInfo: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    hedgingVault(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    potionBuyAction(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

  canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

  enterPosition(
    swapInfo: IUniswapV3Oracle.SwapInfoStruct,
    potionBuyInfo: PotionBuyInfoStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    swapInfo: IUniswapV3Oracle.SwapInfoStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  hedgingVault(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  potionBuyAction(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canPositionBeEntered(overrides?: CallOverrides): Promise<boolean>;

    canPositionBeExited(overrides?: CallOverrides): Promise<boolean>;

    enterPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      potionBuyInfo: PotionBuyInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    exitPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    hedgingVault(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    potionBuyAction(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    canPositionBeEntered(overrides?: CallOverrides): Promise<BigNumber>;

    canPositionBeExited(overrides?: CallOverrides): Promise<BigNumber>;

    enterPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      potionBuyInfo: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    exitPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    hedgingVault(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    potionBuyAction(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canPositionBeEntered(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canPositionBeExited(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    enterPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      potionBuyInfo: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      swapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    hedgingVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    potionBuyAction(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
