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

export interface ActionsContainerUpgradeableInterface extends utils.Interface {
  functions: {
    "getAction(uint256)": FunctionFragment;
    "getActionsLength()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getAction" | "getActionsLength"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAction",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getActionsLength",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "getAction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getActionsLength",
    data: BytesLike
  ): Result;

  events: {
    "ActionsAdded(address[])": EventFragment;
    "Initialized(uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionsAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
}

export interface ActionsAddedEventObject {
  actions: string[];
}
export type ActionsAddedEvent = TypedEvent<[string[]], ActionsAddedEventObject>;

export type ActionsAddedEventFilter = TypedEventFilter<ActionsAddedEvent>;

export interface InitializedEventObject {
  version: number;
}
export type InitializedEvent = TypedEvent<[number], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface ActionsContainerUpgradeable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ActionsContainerUpgradeableInterface;

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
    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getActionsLength(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  getAction(index: BigNumberish, overrides?: CallOverrides): Promise<string>;

  getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    getAction(index: BigNumberish, overrides?: CallOverrides): Promise<string>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "ActionsAdded(address[])"(actions?: null): ActionsAddedEventFilter;
    ActionsAdded(actions?: null): ActionsAddedEventFilter;

    "Initialized(uint8)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;
  };

  estimateGas: {
    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getAction(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getActionsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
