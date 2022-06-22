/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
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

export interface IActionInterface extends utils.Interface {
  functions: {
    "enterPosition()": FunctionFragment;
    "exitPosition()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "enterPosition" | "exitPosition"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "enterPosition",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "exitPosition",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "enterPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "exitPosition",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IAction extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IActionInterface;

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
    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  enterPosition(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  exitPosition(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    enterPosition(overrides?: CallOverrides): Promise<void>;

    exitPosition(overrides?: CallOverrides): Promise<void>;
  };

  filters: {};

  estimateGas: {
    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    enterPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    exitPosition(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}