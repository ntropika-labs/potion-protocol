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

export declare namespace UniswapV3OracleUpgradeable {
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

export interface UniswapV3HelperUpgradeableInterface extends utils.Interface {
  functions: {
    "changeAdmin(address)": FunctionFragment;
    "changeKeeper(address)": FunctionFragment;
    "getAdmin()": FunctionFragment;
    "getKeeper()": FunctionFragment;
    "getSwapInfo(address,address)": FunctionFragment;
    "getSwapRouter()": FunctionFragment;
    "setSwapInfo((address,address,uint256,bytes))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "changeAdmin"
      | "changeKeeper"
      | "getAdmin"
      | "getKeeper"
      | "getSwapInfo"
      | "getSwapRouter"
      | "setSwapInfo"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "changeAdmin", values: [string]): string;
  encodeFunctionData(
    functionFragment: "changeKeeper",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getAdmin", values?: undefined): string;
  encodeFunctionData(functionFragment: "getKeeper", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getSwapInfo",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getSwapRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setSwapInfo",
    values: [UniswapV3OracleUpgradeable.SwapInfoStruct]
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
    functionFragment: "getSwapInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSwapRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSwapInfo",
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

export interface UniswapV3HelperUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: UniswapV3HelperUpgradeableInterface;

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

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<[UniswapV3OracleUpgradeable.SwapInfoStructOutput]>;

    getSwapRouter(overrides?: CallOverrides): Promise<[string]>;

    setSwapInfo(
      info: UniswapV3OracleUpgradeable.SwapInfoStruct,
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

  getSwapInfo(
    inputToken: string,
    outputToken: string,
    overrides?: CallOverrides
  ): Promise<UniswapV3OracleUpgradeable.SwapInfoStructOutput>;

  getSwapRouter(overrides?: CallOverrides): Promise<string>;

  setSwapInfo(
    info: UniswapV3OracleUpgradeable.SwapInfoStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    changeAdmin(newAdmin: string, overrides?: CallOverrides): Promise<void>;

    changeKeeper(newKeeper: string, overrides?: CallOverrides): Promise<void>;

    getAdmin(overrides?: CallOverrides): Promise<string>;

    getKeeper(overrides?: CallOverrides): Promise<string>;

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<UniswapV3OracleUpgradeable.SwapInfoStructOutput>;

    getSwapRouter(overrides?: CallOverrides): Promise<string>;

    setSwapInfo(
      info: UniswapV3OracleUpgradeable.SwapInfoStruct,
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

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getSwapRouter(overrides?: CallOverrides): Promise<BigNumber>;

    setSwapInfo(
      info: UniswapV3OracleUpgradeable.SwapInfoStruct,
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

    getSwapInfo(
      inputToken: string,
      outputToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getSwapRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setSwapInfo(
      info: UniswapV3OracleUpgradeable.SwapInfoStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
