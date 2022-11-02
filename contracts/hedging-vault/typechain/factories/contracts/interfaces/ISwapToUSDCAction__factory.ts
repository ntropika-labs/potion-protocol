/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ISwapToUSDCAction,
  ISwapToUSDCActionInterface,
} from "../../../contracts/interfaces/ISwapToUSDCAction";

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

export class ISwapToUSDCAction__factory {
  static readonly abi = _abi;
  static createInterface(): ISwapToUSDCActionInterface {
    return new utils.Interface(_abi) as ISwapToUSDCActionInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ISwapToUSDCAction {
    return new Contract(address, _abi, signerOrProvider) as ISwapToUSDCAction;
  }
}