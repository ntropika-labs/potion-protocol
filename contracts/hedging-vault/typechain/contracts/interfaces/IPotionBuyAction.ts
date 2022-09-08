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

export type PotionBuyInfoStruct = {
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: BigNumberish;
  expirationTimestamp: BigNumberish;
  sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
  expectedPremiumInUSDC: BigNumberish;
  totalSizeInPotions: BigNumberish;
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

export declare namespace ICurveManager {
  export type CurveStruct = {
    a_59x18: BigNumberish;
    b_59x18: BigNumberish;
    c_59x18: BigNumberish;
    d_59x18: BigNumberish;
    max_util_59x18: BigNumberish;
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
    underlyingAsset: string;
    strikeAsset: string;
    isPut: boolean;
    maxStrikePercent: BigNumberish;
    maxDurationInDays: BigNumberish;
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
    lp: string;
    poolId: BigNumberish;
    curve: ICurveManager.CurveStruct;
    criteria: ICriteriaManager.CriteriaStruct;
    orderSizeInOtokens: BigNumberish;
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

export declare namespace IUniswapV3Oracle {
  export type SwapInfoStruct = {
    inputToken: string;
    outputToken: string;
    expectedPriceRate: BigNumberish;
    swapPath: BytesLike;
  };

  export type SwapInfoStructOutput = [string, string, BigNumber, string] & {
    inputToken: string;
    outputToken: string;
    expectedPriceRate: BigNumber;
    swapPath: string;
  };
}

export interface IPotionBuyActionInterface extends utils.Interface {
  functions: {
    "canPositionBeEntered(address)": FunctionFragment;
    "canPositionBeExited(address)": FunctionFragment;
    "enterPosition(address,uint256)": FunctionFragment;
    "exitPosition(address)": FunctionFragment;
    "getPotionBuyInfo(address,uint256)": FunctionFragment;
    "getSwapInfo(address,address)": FunctionFragment;
    "setPotionBuyInfo((address,address,uint256,uint256,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256,uint256))": FunctionFragment;
    "setSwapInfo((address,address,uint256,bytes))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "canPositionBeEntered"
      | "canPositionBeExited"
      | "enterPosition"
      | "exitPosition"
      | "getPotionBuyInfo"
      | "getSwapInfo"
      | "setPotionBuyInfo"
      | "setSwapInfo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canPositionBeEntered",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "canPositionBeExited",
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
  encodeFunctionData(
    functionFragment: "getPotionBuyInfo",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSwapInfo",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPotionBuyInfo",
    values: [PotionBuyInfoStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "setSwapInfo",
    values: [IUniswapV3Oracle.SwapInfoStruct]
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
    functionFragment: "getPotionBuyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSwapInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPotionBuyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSwapInfo",
    data: BytesLike
  ): Result;

  events: {
    "ActionPositionEntered(address,uint256)": EventFragment;
    "ActionPositionExited(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionPositionEntered"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ActionPositionExited"): EventFragment;
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

export interface IPotionBuyAction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPotionBuyActionInterface;

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

    enterPosition(
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getPotionBuyInfo(
      underlyingAsset: string,
      expirationTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[PotionBuyInfoStructOutput]>;

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<[IUniswapV3Oracle.SwapInfoStructOutput]>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSwapInfo(
      info: IUniswapV3Oracle.SwapInfoStruct,
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

  enterPosition(
    investmentAsset: string,
    amountToInvest: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    investmentAsset: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getPotionBuyInfo(
    underlyingAsset: string,
    expirationTimestamp: BigNumberish,
    overrides?: CallOverrides
  ): Promise<PotionBuyInfoStructOutput>;

  getSwapInfo(
    inputToken: string,
    outputToken: string,
    overrides?: CallOverrides
  ): Promise<IUniswapV3Oracle.SwapInfoStructOutput>;

  setPotionBuyInfo(
    info: PotionBuyInfoStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSwapInfo(
    info: IUniswapV3Oracle.SwapInfoStruct,
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

    enterPosition(
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    exitPosition(
      investmentAsset: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPotionBuyInfo(
      underlyingAsset: string,
      expirationTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PotionBuyInfoStructOutput>;

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<IUniswapV3Oracle.SwapInfoStructOutput>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setSwapInfo(
      info: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;
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

    enterPosition(
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getPotionBuyInfo(
      underlyingAsset: string,
      expirationTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSwapInfo(
      info: IUniswapV3Oracle.SwapInfoStruct,
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

    enterPosition(
      investmentAsset: string,
      amountToInvest: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      investmentAsset: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getPotionBuyInfo(
      underlyingAsset: string,
      expirationTimestamp: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSwapInfo(
      info: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
