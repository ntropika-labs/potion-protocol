/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
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

export interface LifecycleStatesInterface extends utils.Interface {
  functions: {
    "currentState()": FunctionFragment;
    "getState()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "currentState" | "getState"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "currentState",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getState", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "currentState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getState", data: BytesLike): Result;

  events: {
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface LifecycleStates extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LifecycleStatesInterface;

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
    currentState(overrides?: CallOverrides): Promise<[number]>;

    getState(overrides?: CallOverrides): Promise<[number]>;
  };

  currentState(overrides?: CallOverrides): Promise<number>;

  getState(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    currentState(overrides?: CallOverrides): Promise<number>;

    getState(overrides?: CallOverrides): Promise<number>;
  };

  filters: {
    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    currentState(overrides?: CallOverrides): Promise<BigNumber>;

    getState(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    currentState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getState(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}