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
  PromiseOrValue,
} from "../../common";

export type PotionBuyInfoStruct = {
  sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
  targetPotionAddress: PromiseOrValue<string>;
  underlyingAsset: PromiseOrValue<string>;
  strikePriceInUSDC: PromiseOrValue<BigNumberish>;
  expirationTimestamp: PromiseOrValue<BigNumberish>;
  expectedPremiumInUSDC: PromiseOrValue<BigNumberish>;
};

export type PotionBuyInfoStructOutput = [
  IPotionLiquidityPool.CounterpartyDetailsStructOutput[],
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  sellers: IPotionLiquidityPool.CounterpartyDetailsStructOutput[];
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: BigNumber;
  expirationTimestamp: BigNumber;
  expectedPremiumInUSDC: BigNumber;
};

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

export interface IPotionProtocolOracleInterface extends utils.Interface {
  functions: {
    "getPotionBuyInfo(address,uint256)": FunctionFragment;
    "setPotionBuyInfo(((address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],address,address,uint256,uint256,uint256))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getPotionBuyInfo" | "setPotionBuyInfo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPotionBuyInfo",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPotionBuyInfo",
    values: [PotionBuyInfoStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "getPotionBuyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPotionBuyInfo",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPotionProtocolOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPotionProtocolOracleInterface;

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
    getPotionBuyInfo(
      underlyingAsset: PromiseOrValue<string>,
      expirationTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[PotionBuyInfoStructOutput]>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getPotionBuyInfo(
    underlyingAsset: PromiseOrValue<string>,
    expirationTimestamp: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<PotionBuyInfoStructOutput>;

  setPotionBuyInfo(
    info: PotionBuyInfoStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getPotionBuyInfo(
      underlyingAsset: PromiseOrValue<string>,
      expirationTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PotionBuyInfoStructOutput>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getPotionBuyInfo(
      underlyingAsset: PromiseOrValue<string>,
      expirationTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPotionBuyInfo(
      underlyingAsset: PromiseOrValue<string>,
      expirationTimestamp: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPotionBuyInfo(
      info: PotionBuyInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
