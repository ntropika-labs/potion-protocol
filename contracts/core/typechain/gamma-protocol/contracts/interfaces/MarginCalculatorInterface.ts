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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../../common";

export declare namespace MarginVault {
  export type VaultStruct = {
    shortOtokens: string[];
    longOtokens: string[];
    collateralAssets: string[];
    shortAmounts: BigNumberish[];
    longAmounts: BigNumberish[];
    collateralAmounts: BigNumberish[];
  };

  export type VaultStructOutput = [
    string[],
    string[],
    string[],
    BigNumber[],
    BigNumber[],
    BigNumber[]
  ] & {
    shortOtokens: string[];
    longOtokens: string[];
    collateralAssets: string[];
    shortAmounts: BigNumber[];
    longAmounts: BigNumber[];
    collateralAmounts: BigNumber[];
  };
}

export interface MarginCalculatorInterfaceInterface extends utils.Interface {
  functions: {
    "addressBook()": FunctionFragment;
    "getExcessCollateral((address[],address[],address[],uint256[],uint256[],uint256[]),uint256)": FunctionFragment;
    "getExpiredPayoutRate(address)": FunctionFragment;
    "isLiquidatable((address[],address[],address[],uint256[],uint256[],uint256[]),uint256,uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addressBook"
      | "getExcessCollateral"
      | "getExpiredPayoutRate"
      | "isLiquidatable"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addressBook",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getExcessCollateral",
    values: [MarginVault.VaultStruct, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getExpiredPayoutRate",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isLiquidatable",
    values: [MarginVault.VaultStruct, BigNumberish, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addressBook",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExcessCollateral",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getExpiredPayoutRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLiquidatable",
    data: BytesLike
  ): Result;

  events: {};
}

export interface MarginCalculatorInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: MarginCalculatorInterfaceInterface;

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

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { netValue: BigNumber; isExcess: boolean }
    >;

    getExpiredPayoutRate(
      _otoken: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      _vaultLatestUpdate: BigNumberish,
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber, BigNumber]>;
  };

  addressBook(overrides?: CallOverrides): Promise<string>;

  getExcessCollateral(
    _vault: MarginVault.VaultStruct,
    _vaultType: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[BigNumber, boolean] & { netValue: BigNumber; isExcess: boolean }>;

  getExpiredPayoutRate(
    _otoken: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  isLiquidatable(
    _vault: MarginVault.VaultStruct,
    _vaultType: BigNumberish,
    _vaultLatestUpdate: BigNumberish,
    _roundId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber, BigNumber]>;

  callStatic: {
    addressBook(overrides?: CallOverrides): Promise<string>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, boolean] & { netValue: BigNumber; isExcess: boolean }
    >;

    getExpiredPayoutRate(
      _otoken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      _vaultLatestUpdate: BigNumberish,
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber, BigNumber]>;
  };

  filters: {};

  estimateGas: {
    addressBook(overrides?: CallOverrides): Promise<BigNumber>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getExpiredPayoutRate(
      _otoken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      _vaultLatestUpdate: BigNumberish,
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addressBook(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getExcessCollateral(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getExpiredPayoutRate(
      _otoken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isLiquidatable(
      _vault: MarginVault.VaultStruct,
      _vaultType: BigNumberish,
      _vaultLatestUpdate: BigNumberish,
      _roundId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
