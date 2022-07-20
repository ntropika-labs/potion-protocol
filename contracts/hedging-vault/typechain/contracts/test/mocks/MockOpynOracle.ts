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
} from "../../../common";

export interface MockOpynOracleInterface extends utils.Interface {
  functions: {
    "getPrice(address)": FunctionFragment;
    "pricePerAsset(address)": FunctionFragment;
    "setStablePrice(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "getPrice" | "pricePerAsset" | "setStablePrice"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "getPrice", values: [string]): string;
  encodeFunctionData(
    functionFragment: "pricePerAsset",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setStablePrice",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "getPrice", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pricePerAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setStablePrice",
    data: BytesLike
  ): Result;

  events: {};
}

export interface MockOpynOracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MockOpynOracleInterface;

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
    getPrice(asset: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    pricePerAsset(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    setStablePrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

  pricePerAsset(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  setStablePrice(
    asset: string,
    price: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    pricePerAsset(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setStablePrice(
      asset: string,
      price: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    pricePerAsset(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    setStablePrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getPrice(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    pricePerAsset(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setStablePrice(
      asset: string,
      price: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
