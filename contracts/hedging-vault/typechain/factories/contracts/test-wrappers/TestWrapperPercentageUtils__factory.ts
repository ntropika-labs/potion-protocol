/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperPercentageUtils,
  TestWrapperPercentageUtilsInterface,
} from "../../../contracts/test-wrappers/TestWrapperPercentageUtils";

const _abi = [
  {
    inputs: [],
    name: "PERCENTAGE_100",
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
    name: "PERCENTAGE_DECIMALS",
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
    name: "PERCENTAGE_FACTOR",
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
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "addPercentage",
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
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "applyPercentage",
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
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "isPercentageInRange",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    name: "substractPercentage",
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
  "0x608060405260066000556006600a6100179190610142565b6001556100266006600a610142565b610031906064610155565b60025534801561004057600080fd5b50610174565b634e487b7160e01b600052601160045260246000fd5b600181815b8085111561009757816000190482111561007d5761007d610046565b8085161561008a57918102915b93841c9390800290610061565b509250929050565b6000826100ae5750600161013c565b816100bb5750600061013c565b81600181146100d157600281146100db576100f7565b600191505061013c565b60ff8411156100ec576100ec610046565b50506001821b61013c565b5060208310610133831016604e8410600b841016171561011a575081810a61013c565b610124838361005c565b806000190482111561013857610138610046565b0290505b92915050565b600061014e838361009f565b9392505050565b600081600019048311821515161561016f5761016f610046565b500290565b6103cf806101836000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063a0dabfcb1161005b578063a0dabfcb146100d4578063adf3bb5a146100e7578063cbf5a55e146100fa578063ee01e5e71461010357600080fd5b80634b6c69c81461008257806390706425146100a8578063955e5864146100b1575b600080fd5b6100956100903660046101e8565b61010c565b6040519081526020015b60405180910390f35b61009560005481565b6100c46100bf36600461020a565b610121565b604051901515815260200161009f565b6100956100e23660046101e8565b61012c565b6100956100f53660046101e8565b610138565b61009560025481565b61009560015481565b60006101188383610144565b90505b92915050565b600061011b82610171565b60006101188383610193565b600061011883836101c0565b600061011883836101576006600a61031d565b610162906064610329565b61016c9190610348565b610193565b600061017f6006600a61031d565b61018a906064610329565b90911115919050565b60006101a16006600a61031d565b6101ac906064610329565b6101b68385610329565b6101189190610360565b600061011883836101d36006600a61031d565b6101de906064610329565b61016c9190610382565b600080604083850312156101fb57600080fd5b50508035926020909101359150565b60006020828403121561021c57600080fd5b5035919050565b634e487b7160e01b600052601160045260246000fd5b600181815b8085111561027457816000190482111561025a5761025a610223565b8085161561026757918102915b93841c939080029061023e565b509250929050565b60008261028b5750600161011b565b816102985750600061011b565b81600181146102ae57600281146102b8576102d4565b600191505061011b565b60ff8411156102c9576102c9610223565b50506001821b61011b565b5060208310610133831016604e8410600b84101617156102f7575081810a61011b565b6103018383610239565b806000190482111561031557610315610223565b029392505050565b6000610118838361027c565b600081600019048311821515161561034357610343610223565b500290565b6000821982111561035b5761035b610223565b500190565b60008261037d57634e487b7160e01b600052601260045260246000fd5b500490565b60008282101561039457610394610223565b50039056fea2646970667358221220be4a1b145d59cdc9de89242b01b89b6376eb672bc93e1d080d8e0ae4e0b18c5b64736f6c634300080e0033";

type TestWrapperPercentageUtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperPercentageUtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperPercentageUtils__factory extends ContractFactory {
  constructor(...args: TestWrapperPercentageUtilsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperPercentageUtils> {
    return super.deploy(overrides || {}) as Promise<TestWrapperPercentageUtils>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperPercentageUtils {
    return super.attach(address) as TestWrapperPercentageUtils;
  }
  override connect(signer: Signer): TestWrapperPercentageUtils__factory {
    return super.connect(signer) as TestWrapperPercentageUtils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperPercentageUtilsInterface {
    return new utils.Interface(_abi) as TestWrapperPercentageUtilsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperPercentageUtils {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperPercentageUtils;
  }
}
