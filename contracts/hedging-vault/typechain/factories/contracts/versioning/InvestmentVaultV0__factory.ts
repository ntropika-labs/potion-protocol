/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  InvestmentVaultV0,
  InvestmentVaultV0Interface,
} from "../../../contracts/versioning/InvestmentVaultV0";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "actualAmountInvested",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAmountToInvest",
        type: "uint256",
      },
    ],
    name: "InvestmentTotalTooHigh",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPrincipalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "principalAmountInvested",
        type: "uint256",
      },
    ],
    name: "VaultPositionEntered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrincipalAmount",
        type: "uint256",
      },
    ],
    name: "VaultPositionExited",
    type: "event",
  },
  {
    inputs: [],
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
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "strategy",
        type: "tuple",
      },
    ],
    name: "canPositionBeEnteredWith",
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
    inputs: [],
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
    inputs: [],
    name: "enterPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256[]",
            name: "actionsIndexes",
            type: "uint256[]",
          },
        ],
        internalType: "struct IVaultV0.Strategy",
        name: "strategy",
        type: "tuple",
      },
    ],
    name: "enterPositionWith",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exitPosition",
    outputs: [
      {
        internalType: "uint256",
        name: "newPrincipalAmount",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class InvestmentVaultV0__factory {
  static readonly abi = _abi;
  static createInterface(): InvestmentVaultV0Interface {
    return new utils.Interface(_abi) as InvestmentVaultV0Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InvestmentVaultV0 {
    return new Contract(address, _abi, signerOrProvider) as InvestmentVaultV0;
  }
}
