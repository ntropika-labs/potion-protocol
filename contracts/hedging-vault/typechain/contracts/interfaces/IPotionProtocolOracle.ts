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

export declare namespace IPotionProtocolOracle {
  export type PotionBuyInfoStruct = {
    potion: string;
    sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
    expectedPremiumInUSDC: BigNumberish;
    totalSizeInPotions: BigNumberish;
  };

  export type PotionBuyInfoStructOutput = [
    string,
    IPotionLiquidityPool.CounterpartyDetailsStructOutput[],
    BigNumber,
    BigNumber
  ] & {
    potion: string;
    sellers: IPotionLiquidityPool.CounterpartyDetailsStructOutput[];
    expectedPremiumInUSDC: BigNumber;
    totalSizeInPotions: BigNumber;
  };
}

export interface IPotionProtocolOracleInterface extends utils.Interface {
  functions: {
    "getPotionBuyInfo(address)": FunctionFragment;
    "setPotionBuyInfo((address,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256,uint256))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getPotionBuyInfo" | "setPotionBuyInfo"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getPotionBuyInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPotionBuyInfo",
    values: [IPotionProtocolOracle.PotionBuyInfoStruct]
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
      potion: string,
      overrides?: CallOverrides
    ): Promise<[IPotionProtocolOracle.PotionBuyInfoStructOutput]>;

    setPotionBuyInfo(
      info: IPotionProtocolOracle.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getPotionBuyInfo(
    potion: string,
    overrides?: CallOverrides
  ): Promise<IPotionProtocolOracle.PotionBuyInfoStructOutput>;

  setPotionBuyInfo(
    info: IPotionProtocolOracle.PotionBuyInfoStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<IPotionProtocolOracle.PotionBuyInfoStructOutput>;

    setPotionBuyInfo(
      info: IPotionProtocolOracle.PotionBuyInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPotionBuyInfo(
      info: IPotionProtocolOracle.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPotionBuyInfo(
      info: IPotionProtocolOracle.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
