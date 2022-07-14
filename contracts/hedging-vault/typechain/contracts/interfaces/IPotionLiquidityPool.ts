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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

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

export interface IPotionLiquidityPoolInterface extends utils.Interface {
  functions: {
    "buyOtokens(address,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256)": FunctionFragment;
    "createAndBuyOtokens(address,address,address,uint256,uint256,bool,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256)": FunctionFragment;
    "settleAfterExpiry(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "buyOtokens"
      | "createAndBuyOtokens"
      | "settleAfterExpiry"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "buyOtokens",
    values: [
      string,
      IPotionLiquidityPool.CounterpartyDetailsStruct[],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createAndBuyOtokens",
    values: [
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      boolean,
      IPotionLiquidityPool.CounterpartyDetailsStruct[],
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "settleAfterExpiry",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "buyOtokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createAndBuyOtokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settleAfterExpiry",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPotionLiquidityPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPotionLiquidityPoolInterface;

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
    buyOtokens(
      _otoken: string,
      _sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      _maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    createAndBuyOtokens(
      underlyingAsset: string,
      strikeAsset: string,
      collateralAsset: string,
      strikePrice: BigNumberish,
      expiry: BigNumberish,
      isPut: boolean,
      sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settleAfterExpiry(
      _otoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  buyOtokens(
    _otoken: string,
    _sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
    _maxPremium: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  createAndBuyOtokens(
    underlyingAsset: string,
    strikeAsset: string,
    collateralAsset: string,
    strikePrice: BigNumberish,
    expiry: BigNumberish,
    isPut: boolean,
    sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
    maxPremium: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settleAfterExpiry(
    _otoken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    buyOtokens(
      _otoken: string,
      _sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      _maxPremium: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createAndBuyOtokens(
      underlyingAsset: string,
      strikeAsset: string,
      collateralAsset: string,
      strikePrice: BigNumberish,
      expiry: BigNumberish,
      isPut: boolean,
      sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      maxPremium: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    settleAfterExpiry(
      _otoken: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    buyOtokens(
      _otoken: string,
      _sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      _maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    createAndBuyOtokens(
      underlyingAsset: string,
      strikeAsset: string,
      collateralAsset: string,
      strikePrice: BigNumberish,
      expiry: BigNumberish,
      isPut: boolean,
      sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settleAfterExpiry(
      _otoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    buyOtokens(
      _otoken: string,
      _sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      _maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    createAndBuyOtokens(
      underlyingAsset: string,
      strikeAsset: string,
      collateralAsset: string,
      strikePrice: BigNumberish,
      expiry: BigNumberish,
      isPut: boolean,
      sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[],
      maxPremium: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settleAfterExpiry(
      _otoken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}