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
} from "../../../common";

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

export declare namespace PotionProtocolOracleUpgradeable {
  export type PotionBuyInfoStruct = {
    potion: string;
    sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
    expectedPremium: BigNumberish;
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
    expectedPremium: BigNumber;
    totalSizeInPotions: BigNumber;
  };
}

export interface PotionProtocolOracleUpgradeableInterface
  extends utils.Interface {
  functions: {
    "changeAdmin(address)": FunctionFragment;
    "changeKeeper(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getKeeper()": FunctionFragment;
    "getPotionBuyInfo(address)": FunctionFragment;
    "setPotionBuyInfo((address,(address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],uint256,uint256))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeAdmin"
      | "changeKeeper"
      | "getAdmin"
      | "getKeeper"
      | "getPotionBuyInfo"
      | "setPotionBuyInfo"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "changeKeeper",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(functionFragment: "getKeeper", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getPotionBuyInfo",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setPotionBuyInfo",
    values: [PotionProtocolOracleUpgradeable.PotionBuyInfoStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "changeAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeKeeper",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getKeeper", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getPotionBuyInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPotionBuyInfo",
    data: BytesLike
  ): Result;

  events: {
    "AdminChanged(address,address)": EventFragment;
    "Initialized(uint8)": EventFragment;
    "KeeperChanged(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "KeeperChanged"): EventFragment;
}

export interface AdminChangedEventObject {
  prevAdmin: string;
  newAdmin: string;
}
export type AdminChangedEvent = TypedEvent<
  [string, string],
  AdminChangedEventObject
>;

export type AdminChangedEventFilter = TypedEventFilter<AdminChangedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface KeeperChangedEventObject {
  prevKeeper: string;
  newKeeper: string;
}
export type KeeperChangedEvent = TypedEvent<
  [string, string],
  KeeperChangedEventObject
>;

export type KeeperChangedEventFilter = TypedEventFilter<KeeperChangedEvent>;

export interface PotionProtocolOracleUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: PotionProtocolOracleUpgradeableInterface;

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
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    changeKeeper(
      newKeeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<[string]>;

    getKeeper(overrides?: CallOverrides): Promise<[string]>;

    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<[PotionProtocolOracleUpgradeable.PotionBuyInfoStructOutput]>;

    setPotionBuyInfo(
      info: PotionProtocolOracleUpgradeable.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  changeAdmin(
    newAdmin: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  changeKeeper(
    newKeeper: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getAdmin(overrides?: CallOverrides): Promise<string>;

  getKeeper(overrides?: CallOverrides): Promise<string>;

  getPotionBuyInfo(
    potion: string,
    overrides?: CallOverrides
  ): Promise<PotionProtocolOracleUpgradeable.PotionBuyInfoStructOutput>;

  setPotionBuyInfo(
    info: PotionProtocolOracleUpgradeable.PotionBuyInfoStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    changeAdmin(newAdmin: string, overrides?: CallOverrides): Promise<void>;

    changeKeeper(newKeeper: string, overrides?: CallOverrides): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getKeeper(overrides?: CallOverrides): Promise<string>;

    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<PotionProtocolOracleUpgradeable.PotionBuyInfoStructOutput>;

    setPotionBuyInfo(
      info: PotionProtocolOracleUpgradeable.PotionBuyInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "AdminChanged(address,address)"(
      prevAdmin?: string | null,
      newAdmin?: string | null
    ): AdminChangedEventFilter;
    AdminChanged(
      prevAdmin?: string | null,
      newAdmin?: string | null
    ): AdminChangedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "KeeperChanged(address,address)"(
      prevKeeper?: string | null,
      newKeeper?: string | null
    ): KeeperChangedEventFilter;
    KeeperChanged(
      prevKeeper?: string | null,
      newKeeper?: string | null
    ): KeeperChangedEventFilter;
  };

  estimateGas: {
    changeAdmin(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    changeKeeper(
      newKeeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    getKeeper(overrides?: CallOverrides): Promise<BigNumber>;

    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setPotionBuyInfo(
      info: PotionProtocolOracleUpgradeable.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    changeAdmin(
      newAdmin: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    changeKeeper(
      newKeeper: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getKeeper(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPotionBuyInfo(
      potion: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPotionBuyInfo(
      info: PotionProtocolOracleUpgradeable.PotionBuyInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
