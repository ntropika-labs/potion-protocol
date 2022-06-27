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
} from "../../common";

export interface IInvestmentVaultV0Interface extends utils.Interface {
  functions: {
    "setPrincipalPercentages(uint256[])": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "setPrincipalPercentages"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "setPrincipalPercentages",
    values: [BigNumberish[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "setPrincipalPercentages",
    data: BytesLike
  ): Result;

  events: {
    "PrincipalPercentagesUpdated(uint256[])": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "PrincipalPercentagesUpdated"
  ): EventFragment;
}

export interface PrincipalPercentagesUpdatedEventObject {
  principalPercentages: BigNumber[];
}
export type PrincipalPercentagesUpdatedEvent = TypedEvent<
  [BigNumber[]],
  PrincipalPercentagesUpdatedEventObject
>;

export type PrincipalPercentagesUpdatedEventFilter =
  TypedEventFilter<PrincipalPercentagesUpdatedEvent>;

export interface IInvestmentVaultV0 extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IInvestmentVaultV0Interface;

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
    setPrincipalPercentages(
      principalPercentages_: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  setPrincipalPercentages(
    principalPercentages_: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    setPrincipalPercentages(
      principalPercentages_: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "PrincipalPercentagesUpdated(uint256[])"(
      principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;
    PrincipalPercentagesUpdated(
      principalPercentages?: null
    ): PrincipalPercentagesUpdatedEventFilter;
  };

  estimateGas: {
    setPrincipalPercentages(
      principalPercentages_: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    setPrincipalPercentages(
      principalPercentages_: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
