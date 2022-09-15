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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface TimeUtilsInterface extends utils.Interface {
  functions: {
    "SECONDS_IN_DAY()": FunctionFragment;
    "SECONDS_IN_HOUR()": FunctionFragment;
    "SECONDS_TO_0800_UTC()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "SECONDS_IN_DAY"
      | "SECONDS_IN_HOUR"
      | "SECONDS_TO_0800_UTC"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "SECONDS_IN_DAY",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SECONDS_IN_HOUR",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "SECONDS_TO_0800_UTC",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "SECONDS_IN_DAY",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SECONDS_IN_HOUR",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "SECONDS_TO_0800_UTC",
    data: BytesLike
  ): Result;

  events: {};
}

export interface TimeUtils extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TimeUtilsInterface;

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
    SECONDS_IN_DAY(overrides?: CallOverrides): Promise<[BigNumber]>;

    SECONDS_IN_HOUR(overrides?: CallOverrides): Promise<[BigNumber]>;

    SECONDS_TO_0800_UTC(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  SECONDS_IN_DAY(overrides?: CallOverrides): Promise<BigNumber>;

  SECONDS_IN_HOUR(overrides?: CallOverrides): Promise<BigNumber>;

  SECONDS_TO_0800_UTC(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    SECONDS_IN_DAY(overrides?: CallOverrides): Promise<BigNumber>;

    SECONDS_IN_HOUR(overrides?: CallOverrides): Promise<BigNumber>;

    SECONDS_TO_0800_UTC(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    SECONDS_IN_DAY(overrides?: CallOverrides): Promise<BigNumber>;

    SECONDS_IN_HOUR(overrides?: CallOverrides): Promise<BigNumber>;

    SECONDS_TO_0800_UTC(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    SECONDS_IN_DAY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    SECONDS_IN_HOUR(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    SECONDS_TO_0800_UTC(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
