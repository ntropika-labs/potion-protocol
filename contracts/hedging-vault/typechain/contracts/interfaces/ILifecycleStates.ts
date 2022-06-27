/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
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
} from "../../common";

export interface ILifecycleStatesInterface extends utils.Interface {
  functions: {
    "getLifecycleState()": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "getLifecycleState"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getLifecycleState",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getLifecycleState",
    data: BytesLike
  ): Result;

  events: {
    "LifecycleStateChanged(uint8,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LifecycleStateChanged"): EventFragment;
}

export interface LifecycleStateChangedEventObject {
  prevState: number;
  newState: number;
}
export type LifecycleStateChangedEvent = TypedEvent<
  [number, number],
  LifecycleStateChangedEventObject
>;

export type LifecycleStateChangedEventFilter =
  TypedEventFilter<LifecycleStateChangedEvent>;

export interface ILifecycleStates extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ILifecycleStatesInterface;

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
    getLifecycleState(overrides?: CallOverrides): Promise<[number]>;
  };

  getLifecycleState(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    getLifecycleState(overrides?: CallOverrides): Promise<number>;
  };

  filters: {
    "LifecycleStateChanged(uint8,uint8)"(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;
    LifecycleStateChanged(
      prevState?: BigNumberish | null,
      newState?: BigNumberish | null
    ): LifecycleStateChangedEventFilter;
  };

  estimateGas: {
    getLifecycleState(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getLifecycleState(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
