/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { BaseContract, BigNumber, Signer, utils } from "ethers";
import type {
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
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
} from "../common";

export declare namespace ICurveManager {
  export type CurveStruct = {
    a_59x18: PromiseOrValue<BigNumberish>;
    b_59x18: PromiseOrValue<BigNumberish>;
    c_59x18: PromiseOrValue<BigNumberish>;
    d_59x18: PromiseOrValue<BigNumberish>;
    max_util_59x18: PromiseOrValue<BigNumberish>;
  };

  export type CurveStructOutput = [
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    a_59x18: BigNumber;
    b_59x18: BigNumber;
    c_59x18: BigNumber;
    d_59x18: BigNumber;
    max_util_59x18: BigNumber;
  };
}

export interface CurveManagerInterface extends utils.Interface {
  functions: {
    "addCurve((int256,int256,int256,int256,int256))": FunctionFragment;
    "cosh(int256)": FunctionFragment;
    "hashCurve((int256,int256,int256,int256,int256))": FunctionFragment;
    "hyperbolicCurve((int256,int256,int256,int256,int256),int256)": FunctionFragment;
    "isKnownCurveHash(bytes32)": FunctionFragment;
    "powerDecimal(int256,int256)": FunctionFragment;
    "registeredCurves(bytes32)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addCurve"
      | "cosh"
      | "hashCurve"
      | "hyperbolicCurve"
      | "isKnownCurveHash"
      | "powerDecimal"
      | "registeredCurves"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addCurve",
    values: [ICurveManager.CurveStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "cosh",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "hashCurve",
    values: [ICurveManager.CurveStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "hyperbolicCurve",
    values: [ICurveManager.CurveStruct, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isKnownCurveHash",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "powerDecimal",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registeredCurves",
    values: [PromiseOrValue<BytesLike>]
  ): string;

  decodeFunctionResult(functionFragment: "addCurve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "cosh", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hashCurve", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hyperbolicCurve",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isKnownCurveHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "powerDecimal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registeredCurves",
    data: BytesLike
  ): Result;

  events: {
    "CurveAdded(bytes32,tuple)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CurveAdded"): EventFragment;
}

export interface CurveAddedEventObject {
  curveHash: string;
  curveParams: ICurveManager.CurveStructOutput;
}
export type CurveAddedEvent = TypedEvent<
  [string, ICurveManager.CurveStructOutput],
  CurveAddedEventObject
>;

export type CurveAddedEventFilter = TypedEventFilter<CurveAddedEvent>;

export interface CurveManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CurveManagerInterface;

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
    addCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    cosh(
      _input59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { output59x18: BigNumber }>;

    hashCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    hyperbolicCurve(
      _curve: ICurveManager.CurveStruct,
      _x_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { output59x18: BigNumber }>;

    isKnownCurveHash(
      _hash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { valid: boolean }>;

    powerDecimal(
      _x_59x18: PromiseOrValue<BigNumberish>,
      _y_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    registeredCurves(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  addCurve(
    _curve: ICurveManager.CurveStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  cosh(
    _input59x18: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  hashCurve(
    _curve: ICurveManager.CurveStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  hyperbolicCurve(
    _curve: ICurveManager.CurveStruct,
    _x_59x18: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isKnownCurveHash(
    _hash: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  powerDecimal(
    _x_59x18: PromiseOrValue<BigNumberish>,
    _y_59x18: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  registeredCurves(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    addCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    cosh(
      _input59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hashCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    hyperbolicCurve(
      _curve: ICurveManager.CurveStruct,
      _x_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isKnownCurveHash(
      _hash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    powerDecimal(
      _x_59x18: PromiseOrValue<BigNumberish>,
      _y_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registeredCurves(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "CurveAdded(bytes32,tuple)"(
      curveHash?: PromiseOrValue<BytesLike> | null,
      curveParams?: null
    ): CurveAddedEventFilter;
    CurveAdded(
      curveHash?: PromiseOrValue<BytesLike> | null,
      curveParams?: null
    ): CurveAddedEventFilter;
  };

  estimateGas: {
    addCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    cosh(
      _input59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hashCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    hyperbolicCurve(
      _curve: ICurveManager.CurveStruct,
      _x_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isKnownCurveHash(
      _hash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    powerDecimal(
      _x_59x18: PromiseOrValue<BigNumberish>,
      _y_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registeredCurves(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    cosh(
      _input59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hashCurve(
      _curve: ICurveManager.CurveStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    hyperbolicCurve(
      _curve: ICurveManager.CurveStruct,
      _x_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isKnownCurveHash(
      _hash: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    powerDecimal(
      _x_59x18: PromiseOrValue<BigNumberish>,
      _y_59x18: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registeredCurves(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
