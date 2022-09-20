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
  PromiseOrValue,
} from "../../common";

export interface IOtokenInterface extends utils.Interface {
  functions: {
    "burnOtoken(address,uint256)": FunctionFragment;
    "collateralAsset()": FunctionFragment;
    "expiryTimestamp()": FunctionFragment;
    "getOtokenDetails()": FunctionFragment;
    "init(address,address,address,address,uint256,uint256,bool)": FunctionFragment;
    "isPut()": FunctionFragment;
    "mintOtoken(address,uint256)": FunctionFragment;
    "strikeAsset()": FunctionFragment;
    "strikePrice()": FunctionFragment;
    "underlyingAsset()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "burnOtoken"
      | "collateralAsset"
      | "expiryTimestamp"
      | "getOtokenDetails"
      | "init"
      | "isPut"
      | "mintOtoken"
      | "strikeAsset"
      | "strikePrice"
      | "underlyingAsset"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "burnOtoken",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "collateralAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "expiryTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getOtokenDetails",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(functionFragment: "isPut", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mintOtoken",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "strikeAsset",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "strikePrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "underlyingAsset",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "burnOtoken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "collateralAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "expiryTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOtokenDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isPut", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mintOtoken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "strikeAsset",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "strikePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "underlyingAsset",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IOtoken extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IOtokenInterface;

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
    burnOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    collateralAsset(overrides?: CallOverrides): Promise<[string]>;

    expiryTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    getOtokenDetails(
      overrides?: CallOverrides
    ): Promise<[string, string, string, BigNumber, BigNumber, boolean]>;

    init(
      _addressBook: PromiseOrValue<string>,
      _underlyingAsset: PromiseOrValue<string>,
      _strikeAsset: PromiseOrValue<string>,
      _collateralAsset: PromiseOrValue<string>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _expiry: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isPut(overrides?: CallOverrides): Promise<[boolean]>;

    mintOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    strikeAsset(overrides?: CallOverrides): Promise<[string]>;

    strikePrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    underlyingAsset(overrides?: CallOverrides): Promise<[string]>;
  };

  burnOtoken(
    account: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  collateralAsset(overrides?: CallOverrides): Promise<string>;

  expiryTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  getOtokenDetails(
    overrides?: CallOverrides
  ): Promise<[string, string, string, BigNumber, BigNumber, boolean]>;

  init(
    _addressBook: PromiseOrValue<string>,
    _underlyingAsset: PromiseOrValue<string>,
    _strikeAsset: PromiseOrValue<string>,
    _collateralAsset: PromiseOrValue<string>,
    _strikePrice: PromiseOrValue<BigNumberish>,
    _expiry: PromiseOrValue<BigNumberish>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isPut(overrides?: CallOverrides): Promise<boolean>;

  mintOtoken(
    account: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  strikeAsset(overrides?: CallOverrides): Promise<string>;

  strikePrice(overrides?: CallOverrides): Promise<BigNumber>;

  underlyingAsset(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    burnOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    collateralAsset(overrides?: CallOverrides): Promise<string>;

    expiryTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    getOtokenDetails(
      overrides?: CallOverrides
    ): Promise<[string, string, string, BigNumber, BigNumber, boolean]>;

    init(
      _addressBook: PromiseOrValue<string>,
      _underlyingAsset: PromiseOrValue<string>,
      _strikeAsset: PromiseOrValue<string>,
      _collateralAsset: PromiseOrValue<string>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _expiry: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    isPut(overrides?: CallOverrides): Promise<boolean>;

    mintOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    strikeAsset(overrides?: CallOverrides): Promise<string>;

    strikePrice(overrides?: CallOverrides): Promise<BigNumber>;

    underlyingAsset(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    burnOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    collateralAsset(overrides?: CallOverrides): Promise<BigNumber>;

    expiryTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    getOtokenDetails(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      _addressBook: PromiseOrValue<string>,
      _underlyingAsset: PromiseOrValue<string>,
      _strikeAsset: PromiseOrValue<string>,
      _collateralAsset: PromiseOrValue<string>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _expiry: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isPut(overrides?: CallOverrides): Promise<BigNumber>;

    mintOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    strikeAsset(overrides?: CallOverrides): Promise<BigNumber>;

    strikePrice(overrides?: CallOverrides): Promise<BigNumber>;

    underlyingAsset(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    burnOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    collateralAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    expiryTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getOtokenDetails(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    init(
      _addressBook: PromiseOrValue<string>,
      _underlyingAsset: PromiseOrValue<string>,
      _strikeAsset: PromiseOrValue<string>,
      _collateralAsset: PromiseOrValue<string>,
      _strikePrice: PromiseOrValue<BigNumberish>,
      _expiry: PromiseOrValue<BigNumberish>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isPut(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mintOtoken(
      account: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    strikeAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    strikePrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    underlyingAsset(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}