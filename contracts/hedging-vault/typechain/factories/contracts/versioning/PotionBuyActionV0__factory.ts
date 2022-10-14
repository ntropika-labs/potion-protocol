/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  PotionBuyActionV0,
  PotionBuyActionV0Interface,
} from "../../../contracts/versioning/PotionBuyActionV0";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cycleDurationSecs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minCycleDurationSecs",
        type: "uint256",
      },
    ],
    name: "CycleDurationTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "HedgingRateIsZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expectedHedgingRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actualHedgingRate",
        type: "uint256",
      },
    ],
    name: "HedgingRateOutOfRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxPremiumPercentage",
        type: "uint256",
      },
    ],
    name: "MaxPremiumPercentageOutOfRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPremium",
        type: "uint256",
      },
    ],
    name: "PremiumExceedsMaxPremium",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "premiumSlippage",
        type: "uint256",
      },
    ],
    name: "PremiumSlippageOutOfRange",
    type: "error",
  },
  {
    inputs: [],
    name: "StrikePercentageIsZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "swapSlippage",
        type: "uint256",
      },
    ],
    name: "SwapSlippageOutOfRange",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cycleDurationSecs",
        type: "uint256",
      },
    ],
    name: "CycleDurationChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "hedgingRate",
        type: "uint256",
      },
    ],
    name: "HedgingRateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxPremiumPercentage",
        type: "uint256",
      },
    ],
    name: "MaxPremiumPercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "maxSwapDurationSecs",
        type: "uint256",
      },
    ],
    name: "MaxSwapDurationChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "premiumSlippage",
        type: "uint256",
      },
    ],
    name: "PremiumSlippageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "strikePercentage",
        type: "uint256",
      },
    ],
    name: "StrikePercentageChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "swapSlippage",
        type: "uint256",
      },
    ],
    name: "SwapSlippageChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "MIN_CYCLE_DURATION",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investmentAsset",
        type: "address",
      },
    ],
    name: "calculateCurrentPayout",
    outputs: [
      {
        internalType: "bool",
        name: "isFinal",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "payout",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "orderSize",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cycleDurationSecs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hedgingRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxPremiumPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxSwapDurationSecs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextCycleStartTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "premiumSlippage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "durationSeconds",
        type: "uint256",
      },
    ],
    name: "setCycleDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "hedgingRate_",
        type: "uint256",
      },
    ],
    name: "setHedgingRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxPremiumPercentage_",
        type: "uint256",
      },
    ],
    name: "setMaxPremiumPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "durationSeconds",
        type: "uint256",
      },
    ],
    name: "setMaxSwapDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "premiumSlippage_",
        type: "uint256",
      },
    ],
    name: "setPremiumSlippage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "strikePercentage",
        type: "uint256",
      },
    ],
    name: "setStrikePercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "swapSlippage_",
        type: "uint256",
      },
    ],
    name: "setSwapSlippage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strikePercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapSlippage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class PotionBuyActionV0__factory {
  static readonly abi = _abi;
  static createInterface(): PotionBuyActionV0Interface {
    return new utils.Interface(_abi) as PotionBuyActionV0Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PotionBuyActionV0 {
    return new Contract(address, _abi, signerOrProvider) as PotionBuyActionV0;
  }
}
