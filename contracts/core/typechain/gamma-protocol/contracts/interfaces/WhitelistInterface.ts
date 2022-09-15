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
  PromiseOrValue,
} from "../../../common";

export interface WhitelistInterfaceInterface extends utils.Interface {
  functions: {
    "addressBook()": FunctionFragment;
    "blacklistCallee(address)": FunctionFragment;
    "blacklistCollateral(address)": FunctionFragment;
    "blacklistOtoken(address)": FunctionFragment;
    "blacklistProduct(address,address,address,bool)": FunctionFragment;
    "isWhitelistedCallee(address)": FunctionFragment;
    "isWhitelistedCollateral(address)": FunctionFragment;
    "isWhitelistedOtoken(address)": FunctionFragment;
    "isWhitelistedProduct(address,address,address,bool)": FunctionFragment;
    "whitelistCallee(address)": FunctionFragment;
    "whitelistCollateral(address)": FunctionFragment;
    "whitelistOtoken(address)": FunctionFragment;
    "whitelistProduct(address,address,address,bool)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addressBook"
      | "blacklistCallee"
      | "blacklistCollateral"
      | "blacklistOtoken"
      | "blacklistProduct"
      | "isWhitelistedCallee"
      | "isWhitelistedCollateral"
      | "isWhitelistedOtoken"
      | "isWhitelistedProduct"
      | "whitelistCallee"
      | "whitelistCollateral"
      | "whitelistOtoken"
      | "whitelistProduct"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addressBook",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistCallee",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistCollateral",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistOtoken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistProduct",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedCallee",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedCollateral",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedOtoken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isWhitelistedProduct",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistCallee",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistCollateral",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistOtoken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "whitelistProduct",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<boolean>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressBook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistCallee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistOtoken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blacklistProduct",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedCallee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedOtoken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isWhitelistedProduct",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistCallee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistOtoken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "whitelistProduct",
    data: BytesLike
  ): Result;

  events: {};
}

export interface WhitelistInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: WhitelistInterfaceInterface;

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
    addressBook(overrides?: CallOverrides): Promise<[string]>;

    blacklistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    blacklistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    blacklistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    blacklistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isWhitelistedCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isWhitelistedCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isWhitelistedOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isWhitelistedProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    whitelistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    whitelistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    whitelistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    whitelistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addressBook(overrides?: CallOverrides): Promise<string>;

  blacklistCallee(
    _callee: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  blacklistCollateral(
    _collateral: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  blacklistOtoken(
    _otoken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  blacklistProduct(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isWhitelistedCallee(
    _callee: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isWhitelistedCollateral(
    _collateral: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isWhitelistedOtoken(
    _otoken: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isWhitelistedProduct(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  whitelistCallee(
    _callee: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  whitelistCollateral(
    _collateral: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  whitelistOtoken(
    _otoken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  whitelistProduct(
    _underlying: PromiseOrValue<string>,
    _strike: PromiseOrValue<string>,
    _collateral: PromiseOrValue<string>,
    _isPut: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addressBook(overrides?: CallOverrides): Promise<string>;

    blacklistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    blacklistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    blacklistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    blacklistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    isWhitelistedCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isWhitelistedCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isWhitelistedOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isWhitelistedProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    whitelistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    whitelistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addressBook(overrides?: CallOverrides): Promise<BigNumber>;

    blacklistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    blacklistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    blacklistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    blacklistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isWhitelistedCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isWhitelistedCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isWhitelistedOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isWhitelistedProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    whitelistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    whitelistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    whitelistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    whitelistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressBook(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    blacklistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    blacklistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    blacklistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    blacklistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isWhitelistedCallee(
      _callee: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isWhitelistedCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isWhitelistedOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isWhitelistedProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    whitelistCallee(
      _callee: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    whitelistCollateral(
      _collateral: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    whitelistOtoken(
      _otoken: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    whitelistProduct(
      _underlying: PromiseOrValue<string>,
      _strike: PromiseOrValue<string>,
      _collateral: PromiseOrValue<string>,
      _isPut: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
