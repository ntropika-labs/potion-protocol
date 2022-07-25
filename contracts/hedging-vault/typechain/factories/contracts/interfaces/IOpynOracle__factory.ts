/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IOpynOracle,
  IOpynOracleInterface,
} from "../../../contracts/interfaces/IOpynOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
    ],
    name: "getPrice",
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
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setStablePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IOpynOracle__factory {
  static readonly abi = _abi;
  static createInterface(): IOpynOracleInterface {
    return new utils.Interface(_abi) as IOpynOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOpynOracle {
    return new Contract(address, _abi, signerOrProvider) as IOpynOracle;
  }
}
