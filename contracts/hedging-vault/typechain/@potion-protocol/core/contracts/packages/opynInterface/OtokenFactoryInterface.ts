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
} from "../../../../../common";

export interface OtokenFactoryInterfaceInterface extends utils.Interface {
  functions: {
    "createOtoken(address,address,address,uint256,uint256,bool)": FunctionFragment;
    "getOtoken(address,address,address,uint256,uint256,bool)": FunctionFragment;
    "getTargetOtokenAddress(address,address,address,uint256,uint256,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createOtoken"
      | "getOtoken"
      | "getTargetOtokenAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createOtoken",
    values: [string, string, string, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getOtoken",
    values: [string, string, string, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "getTargetOtokenAddress",
    values: [string, string, string, BigNumberish, BigNumberish, boolean]
  ): string;

  decodeFunctionResult(
    functionFragment: "createOtoken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOtoken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTargetOtokenAddress",
    data: BytesLike
  ): Result;

  events: {};
}

export interface OtokenFactoryInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OtokenFactoryInterfaceInterface;

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
    createOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getTargetOtokenAddress(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  createOtoken(
    _underlyingAsset: string,
    _strikeAsset: string,
    _collateralAsset: string,
    _strikePrice: BigNumberish,
    _expiry: BigNumberish,
    _isPut: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getOtoken(
    _underlyingAsset: string,
    _strikeAsset: string,
    _collateralAsset: string,
    _strikePrice: BigNumberish,
    _expiry: BigNumberish,
    _isPut: boolean,
    overrides?: CallOverrides
  ): Promise<string>;

  getTargetOtokenAddress(
    _underlyingAsset: string,
    _strikeAsset: string,
    _collateralAsset: string,
    _strikePrice: BigNumberish,
    _expiry: BigNumberish,
    _isPut: boolean,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    createOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<string>;

    getOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<string>;

    getTargetOtokenAddress(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    createOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTargetOtokenAddress(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getOtoken(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTargetOtokenAddress(
      _underlyingAsset: string,
      _strikeAsset: string,
      _collateralAsset: string,
      _strikePrice: BigNumberish,
      _expiry: BigNumberish,
      _isPut: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}