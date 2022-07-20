/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperPriceUtils,
  TestWrapperPriceUtilsInterface,
} from "../../../../contracts/test/wrappers/TestWrapperPriceUtils";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
    ],
    name: "PRBMathUD60x18__FromUintOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDivFixedPointOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDivOverflow",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "priceRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
    ],
    name: "toInputAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "priceRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
    ],
    name: "toOutputAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061034c806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633daac4f31461003b578063bb43e14414610060575b600080fd5b61004e6100493660046102de565b610073565b60405190815260200160405180910390f35b61004e61006e3660046102de565b610088565b600061007f8383610094565b90505b92915050565b600061007f83836100ba565b600061007f6100ac6100a5846100d2565b8590610124565b670de0b6b3a7640000900490565b600061007f6100ac846100cc856100d2565b90610130565b60007812725dd1d243aba0e75fe645cc4873f9e65afe688c928e1f2182111561011657604051633492ffd960e01b8152600481018390526024015b60405180910390fd5b50670de0b6b3a76400000290565b600061007f8383610145565b600061007f83670de0b6b3a76400008461020b565b60008080600019848609848602925082811083820303915050670de0b6b3a764000081106101895760405163698d9a0160e11b81526004810182905260240161010d565b600080670de0b6b3a764000086880991506706f05b59d3b1ffff82119050826000036101c75780670de0b6b3a7640000850401945050505050610082565b620400008285030493909111909103600160ee1b02919091177faccb18165bd6fe31ae1cf318dc5b51eee0e1ba569b88cd74c1773b91fac106690201905092915050565b60008080600019858709858702925082811083820303915050806000036102455783828161023b5761023b610300565b04925050506102d7565b83811061026f57604051631dcf306360e21b8152600481018290526024810185905260440161010d565b600084868809851960019081018716968790049682860381900495909211909303600082900391909104909201919091029190911760038402600290811880860282030280860282030280860282030280860282030280860282030280860290910302029150505b9392505050565b600080604083850312156102f157600080fd5b50508035926020909101359150565b634e487b7160e01b600052601260045260246000fdfea2646970667358221220c3cd7a157bfac328c065c0c9e91935a6fc92af0fb1951e6979f53531308b444164736f6c634300080e0033";

type TestWrapperPriceUtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperPriceUtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperPriceUtils__factory extends ContractFactory {
  constructor(...args: TestWrapperPriceUtilsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperPriceUtils> {
    return super.deploy(overrides || {}) as Promise<TestWrapperPriceUtils>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperPriceUtils {
    return super.attach(address) as TestWrapperPriceUtils;
  }
  override connect(signer: Signer): TestWrapperPriceUtils__factory {
    return super.connect(signer) as TestWrapperPriceUtils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperPriceUtilsInterface {
    return new utils.Interface(_abi) as TestWrapperPriceUtilsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperPriceUtils {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperPriceUtils;
  }
}
