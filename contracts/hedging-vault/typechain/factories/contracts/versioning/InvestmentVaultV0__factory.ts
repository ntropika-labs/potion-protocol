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
        name: "totalInvestment",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expectedMaxInvestment",
        type: "uint256",
      },
    ],
    name: "InvestmentTotalTooHigh",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentageOutOfRange",
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
    inputs: [
      {
        internalType: "uint256",
        name: "totalSumOfPercentages",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentagesSumMoreThan100",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256[]",
        name: "principalPercentages",
        type: "uint256[]",
      },
    ],
    name: "PrincipalPercentagesUpdated",
    type: "event",
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
  {
    inputs: [],
    name: "totalPrincipalPercentages",
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
