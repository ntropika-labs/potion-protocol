/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IOpynAddressBook,
  IOpynAddressBookInterface,
} from "../../../contracts/interfaces/IOpynAddressBook";

const _abi = [
  {
    inputs: [],
    name: "getController",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOtokenFactory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IOpynAddressBook__factory {
  static readonly abi = _abi;
  static createInterface(): IOpynAddressBookInterface {
    return new utils.Interface(_abi) as IOpynAddressBookInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOpynAddressBook {
    return new Contract(address, _abi, signerOrProvider) as IOpynAddressBook;
  }
}