/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPotionBuyAction,
  IPotionBuyActionInterface,
} from "../../../contracts/interfaces/IPotionBuyAction";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "investmentAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountToInvest",
        type: "uint256",
      },
    ],
    name: "ActionPositionEntered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "investmentAsset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountReturned",
        type: "uint256",
      },
    ],
    name: "ActionPositionExited",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "investmentAsset",
        type: "address",
      },
    ],
    name: "canPositionBeEntered",
    outputs: [
      {
        internalType: "bool",
        name: "canEnter",
        type: "bool",
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
    name: "canPositionBeExited",
    outputs: [
      {
        internalType: "bool",
        name: "canExit",
        type: "bool",
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
      {
        internalType: "uint256",
        name: "amountToInvest",
        type: "uint256",
      },
    ],
    name: "enterPosition",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "exitPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "amountReturned",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "strikePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expirationTimestamp",
        type: "uint256",
      },
    ],
    name: "getPotionBuyInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "strikePriceInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimestamp",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "lp",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "int256",
                    name: "a_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "b_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "c_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "d_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "max_util_59x18",
                    type: "int256",
                  },
                ],
                internalType: "struct ICurveManager.Curve",
                name: "curve",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "underlyingAsset",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "strikeAsset",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "isPut",
                    type: "bool",
                  },
                  {
                    internalType: "uint256",
                    name: "maxStrikePercent",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxDurationInDays",
                    type: "uint256",
                  },
                ],
                internalType: "struct ICriteriaManager.Criteria",
                name: "criteria",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "orderSizeInOtokens",
                type: "uint256",
              },
            ],
            internalType: "struct IPotionLiquidityPool.CounterpartyDetails[]",
            name: "sellers",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInPotions",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
    ],
    name: "getSwapInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "strikePriceInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimestamp",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "lp",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "int256",
                    name: "a_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "b_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "c_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "d_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "max_util_59x18",
                    type: "int256",
                  },
                ],
                internalType: "struct ICurveManager.Curve",
                name: "curve",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "underlyingAsset",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "strikeAsset",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "isPut",
                    type: "bool",
                  },
                  {
                    internalType: "uint256",
                    name: "maxStrikePercent",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxDurationInDays",
                    type: "uint256",
                  },
                ],
                internalType: "struct ICriteriaManager.Criteria",
                name: "criteria",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "orderSizeInOtokens",
                type: "uint256",
              },
            ],
            internalType: "struct IPotionLiquidityPool.CounterpartyDetails[]",
            name: "sellers",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInPotions",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "setPotionBuyInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "setSwapInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IPotionBuyAction__factory {
  static readonly abi = _abi;
  static createInterface(): IPotionBuyActionInterface {
    return new utils.Interface(_abi) as IPotionBuyActionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPotionBuyAction {
    return new Contract(address, _abi, signerOrProvider) as IPotionBuyAction;
  }
}
