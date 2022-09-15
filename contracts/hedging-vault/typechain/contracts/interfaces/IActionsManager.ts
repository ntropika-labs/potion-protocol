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

export interface IActionsManagerInterface extends utils.Interface {
  functions: {
    "getAction(uint256)": FunctionFragment;
    "getActionsLength()": FunctionFragment;
    "getPrincipalPercentage(uint256)": FunctionFragment;
    "getPrincipalPercentages()": FunctionFragment;
    "getTotalPrincipalPercentages()": FunctionFragment;
    "setPrincipalPercentages(uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getAction"
      | "getActionsLength"
      | "getPrincipalPercentage"
      | "getPrincipalPercentages"
      | "getTotalPrincipalPercentages"
      | "setPrincipalPercentages"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getAction",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getActionsLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPrincipalPercentage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPrincipalPercentages",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalPrincipalPercentages",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPrincipalPercentages",
    values: [PromiseOrValue<BigNumberish>[]]
  ): string;

  decodeFunctionResult(functionFragment: "getAction", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getActionsLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPrincipalPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPrincipalPercentages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalPrincipalPercentages",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPrincipalPercentages",
    data: BytesLike
  ): Result;

  events: {
    "ActionsAdded(address[])": EventFragment;
    "PrincipalPercentagesUpdated(uint256[])": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ActionsAdded"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "PrincipalPercentagesUpdated"
  ): EventFragment;
}

export interface ActionsAddedEventObject {
  actions: string[];
}
export type ActionsAddedEvent = TypedEvent<[string[]], ActionsAddedEventObject>;

export type ActionsAddedEventFilter = TypedEventFilter<ActionsAddedEvent>;

export interface PrincipalPercentagesUpdatedEventObject {
  _principalPercentages: BigNumber[];
}
export type PrincipalPercentagesUpdatedEvent = TypedEvent<
  [BigNumber[]],
  PrincipalPercentagesUpdatedEventObject
>;

export type PrincipalPercentagesUpdatedEventFilter =
  TypedEventFilter<PrincipalPercentagesUpdatedEvent>;

export interface IActionsManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IActionsManagerInterface;

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
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getActionsLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    getPrincipalPercentage(
      actionIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    getTotalPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setPrincipalPercentages(
      newPrincipalPercentages: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getAction(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

  getPrincipalPercentage(
    actionIndex: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber[]>;

  getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

  setPrincipalPercentages(
    newPrincipalPercentages: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getAction(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

    getPrincipalPercentage(
      actionIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber[]>;

    getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    setPrincipalPercentages(
      newPrincipalPercentages: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ActionsAdded(address[])"(actions?: null): ActionsAddedEventFilter;
    ActionsAdded(actions?: null): ActionsAddedEventFilter;

    "PrincipalPercentagesUpdated(uint256[])"(
      _principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;
    PrincipalPercentagesUpdated(
      _principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;
  };

  estimateGas: {
    getAction(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getActionsLength(overrides?: CallOverrides): Promise<BigNumber>;

    getPrincipalPercentage(
      actionIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    getTotalPrincipalPercentages(overrides?: CallOverrides): Promise<BigNumber>;

    setPrincipalPercentages(
      newPrincipalPercentages: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getAction(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getActionsLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPrincipalPercentage(
      actionIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalPrincipalPercentages(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setPrincipalPercentages(
      newPrincipalPercentages: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
