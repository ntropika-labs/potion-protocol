/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  HedgingVaultV0,
  HedgingVaultV0Interface,
} from "../../../contracts/versioning/HedgingVaultV0";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_cycleDurationSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cycleDurationSecondsExpected",
        type: "uint256",
      },
    ],
    name: "CycleDurationTooShort",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_principalPercentagesLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_principalPercentagesLengthExpected",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentagesMismatch",
    type: "error",
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
    inputs: [],
    name: "commitStrategy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cycleDurationSeconds",
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
    name: "enterPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exitPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "principalPercentages",
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
        name: "cycleDurationSeconds_",
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
        internalType: "uint256[]",
        name: "principalPercentages_",
        type: "uint256[]",
      },
    ],
    name: "setPrincipalPercentages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class HedgingVaultV0__factory {
  static readonly abi = _abi;
  static createInterface(): HedgingVaultV0Interface {
    return new utils.Interface(_abi) as HedgingVaultV0Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): HedgingVaultV0 {
    return new Contract(address, _abi, signerOrProvider) as HedgingVaultV0;
  }
}
