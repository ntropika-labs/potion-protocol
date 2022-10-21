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

export type PotionBuyInfoStruct = {
  sellers: IPotionLiquidityPool.CounterpartyDetailsStruct[];
  targetPotionAddress: PromiseOrValue<string>;
  underlyingAsset: PromiseOrValue<string>;
  strikePriceInUSDC: PromiseOrValue<BigNumberish>;
  expirationTimestamp: PromiseOrValue<BigNumberish>;
  expectedPremiumInUSDC: PromiseOrValue<BigNumberish>;
};

export type PotionBuyInfoStructOutput = [
  IPotionLiquidityPool.CounterpartyDetailsStructOutput[],
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber
] & {
  sellers: IPotionLiquidityPool.CounterpartyDetailsStructOutput[];
  targetPotionAddress: string;
  underlyingAsset: string;
  strikePriceInUSDC: BigNumber;
  expirationTimestamp: BigNumber;
  expectedPremiumInUSDC: BigNumber;
};

export declare namespace IUniswapV3Oracle {
  export type SwapInfoStruct = {
    inputToken: PromiseOrValue<string>;
    outputToken: PromiseOrValue<string>;
    expectedPriceRate: PromiseOrValue<BigNumberish>;
    swapPath: PromiseOrValue<BytesLike>;
  };

  export type SwapInfoStructOutput = [string, string, BigNumber, string] & {
    inputToken: string;
    outputToken: string;
    expectedPriceRate: BigNumber;
    swapPath: string;
  };
}

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

export declare namespace ICriteriaManager {
  export type CriteriaStruct = {
    underlyingAsset: PromiseOrValue<string>;
    strikeAsset: PromiseOrValue<string>;
    isPut: PromiseOrValue<boolean>;
    maxStrikePercent: PromiseOrValue<BigNumberish>;
    maxDurationInDays: PromiseOrValue<BigNumberish>;
  };

  export type CriteriaStructOutput = [
    string,
    string,
    boolean,
    BigNumber,
    BigNumber
  ] & {
    underlyingAsset: string;
    strikeAsset: string;
    isPut: boolean;
    maxStrikePercent: BigNumber;
    maxDurationInDays: BigNumber;
  };
}

export declare namespace IPotionLiquidityPool {
  export type CounterpartyDetailsStruct = {
    lp: PromiseOrValue<string>;
    poolId: PromiseOrValue<BigNumberish>;
    curve: ICurveManager.CurveStruct;
    criteria: ICriteriaManager.CriteriaStruct;
    orderSizeInOtokens: PromiseOrValue<BigNumberish>;
  };

  export type CounterpartyDetailsStructOutput = [
    string,
    BigNumber,
    ICurveManager.CurveStructOutput,
    ICriteriaManager.CriteriaStructOutput,
    BigNumber
  ] & {
    lp: string;
    poolId: BigNumber;
    curve: ICurveManager.CurveStructOutput;
    criteria: ICriteriaManager.CriteriaStructOutput;
    orderSizeInOtokens: BigNumber;
  };
}

export interface IHedgingVaultOrchestratorInterface extends utils.Interface {
  functions: {
    "canEnterNextRound()": FunctionFragment;
    "nextRound((address,address,uint256,bytes),((address,uint256,(int256,int256,int256,int256,int256),(address,address,bool,uint256,uint256),uint256)[],address,address,uint256,uint256,uint256),(address,address,uint256,bytes),(address,address,uint256,bytes),(address,address,uint256,bytes))": FunctionFragment;
    "setSystemAddresses(address,address,address,address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "canEnterNextRound"
      | "nextRound"
      | "setSystemAddresses"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "canEnterNextRound",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextRound",
    values: [
      IUniswapV3Oracle.SwapInfoStruct,
      PotionBuyInfoStruct,
      IUniswapV3Oracle.SwapInfoStruct,
      IUniswapV3Oracle.SwapInfoStruct,
      IUniswapV3Oracle.SwapInfoStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setSystemAddresses",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "canEnterNextRound",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "nextRound", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setSystemAddresses",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IHedgingVaultOrchestrator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IHedgingVaultOrchestratorInterface;

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
    canEnterNextRound(overrides?: CallOverrides): Promise<[boolean]>;

    nextRound(
      prevRoundExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      nextRoundPotionBuyInfo: PotionBuyInfoStruct,
      nextRoundEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setSystemAddresses(
      hedgingVault: PromiseOrValue<string>,
      potionBuyAction: PromiseOrValue<string>,
      swapToUSDCAction: PromiseOrValue<string>,
      roundsInputVault: PromiseOrValue<string>,
      roundsOutputVault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  canEnterNextRound(overrides?: CallOverrides): Promise<boolean>;

  nextRound(
    prevRoundExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
    nextRoundPotionBuyInfo: PotionBuyInfoStruct,
    nextRoundEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
    swapToUSDCExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
    swapToUSDCEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setSystemAddresses(
    hedgingVault: PromiseOrValue<string>,
    potionBuyAction: PromiseOrValue<string>,
    swapToUSDCAction: PromiseOrValue<string>,
    roundsInputVault: PromiseOrValue<string>,
    roundsOutputVault: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    canEnterNextRound(overrides?: CallOverrides): Promise<boolean>;

    nextRound(
      prevRoundExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      nextRoundPotionBuyInfo: PotionBuyInfoStruct,
      nextRoundEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    setSystemAddresses(
      hedgingVault: PromiseOrValue<string>,
      potionBuyAction: PromiseOrValue<string>,
      swapToUSDCAction: PromiseOrValue<string>,
      roundsInputVault: PromiseOrValue<string>,
      roundsOutputVault: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    canEnterNextRound(overrides?: CallOverrides): Promise<BigNumber>;

    nextRound(
      prevRoundExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      nextRoundPotionBuyInfo: PotionBuyInfoStruct,
      nextRoundEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setSystemAddresses(
      hedgingVault: PromiseOrValue<string>,
      potionBuyAction: PromiseOrValue<string>,
      swapToUSDCAction: PromiseOrValue<string>,
      roundsInputVault: PromiseOrValue<string>,
      roundsOutputVault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    canEnterNextRound(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nextRound(
      prevRoundExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      nextRoundPotionBuyInfo: PotionBuyInfoStruct,
      nextRoundEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCExitSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      swapToUSDCEnterSwapInfo: IUniswapV3Oracle.SwapInfoStruct,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setSystemAddresses(
      hedgingVault: PromiseOrValue<string>,
      potionBuyAction: PromiseOrValue<string>,
      swapToUSDCAction: PromiseOrValue<string>,
      roundsInputVault: PromiseOrValue<string>,
      roundsOutputVault: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
