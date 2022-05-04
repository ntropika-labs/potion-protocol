/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  MarginCalculatorInterface,
  MarginCalculatorInterfaceInterface,
} from "../../../../contracts/packages/opynInterface/MarginCalculatorInterface";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "shortOtokens",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "longOtokens",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "collateralAssets",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "shortAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "longAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "collateralAmounts",
            type: "uint256[]",
          },
        ],
        internalType: "struct MarginVaultInterface.Vault",
        name: "_vault",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_vaultType",
        type: "uint256",
      },
    ],
    name: "getExcessCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "netValue",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isExcess",
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
        name: "_otoken",
        type: "address",
      },
    ],
    name: "getExpiredPayoutRate",
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
        components: [
          {
            internalType: "address[]",
            name: "shortOtokens",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "longOtokens",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "collateralAssets",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "shortAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "longAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "collateralAmounts",
            type: "uint256[]",
          },
        ],
        internalType: "struct MarginVaultInterface.Vault",
        name: "_vault",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_vaultType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_vaultLatestUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_roundId",
        type: "uint256",
      },
    ],
    name: "isLiquidatable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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

export class MarginCalculatorInterface__factory {
  static readonly abi = _abi;
  static createInterface(): MarginCalculatorInterfaceInterface {
    return new utils.Interface(_abi) as MarginCalculatorInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MarginCalculatorInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MarginCalculatorInterface;
  }
}
