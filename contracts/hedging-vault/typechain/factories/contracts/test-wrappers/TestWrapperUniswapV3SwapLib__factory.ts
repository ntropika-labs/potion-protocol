/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  TestWrapperUniswapV3SwapLib,
  TestWrapperUniswapV3SwapLibInterface,
} from "../../../contracts/test-wrappers/TestWrapperUniswapV3SwapLib";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ISwapRouter",
        name: "swapRouter",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "exactAmountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedAmountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slippage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapV3SwapLib.SwapInputParameters",
        name: "parameters",
        type: "tuple",
      },
    ],
    name: "swapInput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISwapRouter",
        name: "swapRouter",
        type: "address",
      },
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "exactAmountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expectedAmountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "slippage",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDuration",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapV3SwapLib.SwapOutputParameters",
        name: "parameters",
        type: "tuple",
      },
    ],
    name: "swapOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610869806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80630626a81f1461003b578063b1636de714610060575b600080fd5b61004e610049366004610567565b610073565b60405190815260200160405180910390f35b61004e61006e366004610567565b610088565b600061007f8383610094565b90505b92915050565b600061007f838361017f565b6000806100b28360600151846040015161027d90919063ffffffff16565b90506100c783600001518585602001516102aa565b6040805160a08082018352850151815230602082015260808501516000928201906100f290426105cd565b815260200185602001518152602001838152509050846001600160a01b031663c04b8d59826040518263ffffffff1660e01b8152600401610133919061067a565b6020604051808303816000875af1158015610152573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610176919061068d565b95945050505050565b60008061019d836060015184604001516103ae90919063ffffffff16565b90506101ae836000015185836102aa565b6040805160a08082018352850151815230602082015260808501516000928201906101d990426105cd565b815260200185602001518152602001838152509050846001600160a01b031663f28c0498826040518263ffffffff1660e01b815260040161021a919061067a565b6020604051808303816000875af1158015610239573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061025d919061068d565b925081831015610275578351610275908660006102aa565b505092915050565b600061007f83836102906006600a61078a565b61029b906064610796565b6102a591906107b5565b6103d6565b604080516001600160a01b038481166024830152604480830185905283518084039091018152606490920183526020820180516001600160e01b031663095ea7b360e01b179052915160009283929087169161030691906107cc565b6000604051808303816000865af19150503d8060008114610343576040519150601f19603f3d011682016040523d82523d6000602084013e610348565b606091505b509150915081801561037257508051158061037257508080602001905181019061037291906107e8565b6103a75760405162461bcd60e51b8152602060048201526002602482015261534160f01b604482015260640160405180910390fd5b5050505050565b600061007f83836103c16006600a61078a565b6103cc906064610796565b6102a591906105cd565b60006103e46006600a61078a565b6103ef906064610796565b6103f98385610796565b61007f9190610811565b6001600160a01b038116811461041857600080fd5b50565b634e487b7160e01b600052604160045260246000fd5b60405160c0810167ffffffffffffffff811182821017156104545761045461041b565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156104835761048361041b565b604052919050565b600060c0828403121561049d57600080fd5b6104a5610431565b905081356104b281610403565b808252506020808301358183015260408301356040830152606083013560608301526080830135608083015260a083013567ffffffffffffffff808211156104f957600080fd5b818501915085601f83011261050d57600080fd5b81358181111561051f5761051f61041b565b610531601f8201601f1916850161045a565b9150808252868482850101111561054757600080fd5b80848401858401376000848284010152508060a085015250505092915050565b6000806040838503121561057a57600080fd5b823561058581610403565b9150602083013567ffffffffffffffff8111156105a157600080fd5b6105ad8582860161048b565b9150509250929050565b634e487b7160e01b600052601160045260246000fd5b600082198211156105e0576105e06105b7565b500190565b60005b838110156106005781810151838201526020016105e8565b8381111561060f576000848401525b50505050565b6000815160a0845280518060a08601526106368160c08701602085016105e5565b6020848101516001600160a01b0316908601526040808501519086015260608085015190860152608093840151938501939093525050601f01601f19160160c00190565b60208152600061007f6020830184610615565b60006020828403121561069f57600080fd5b5051919050565b600181815b808511156106e15781600019048211156106c7576106c76105b7565b808516156106d457918102915b93841c93908002906106ab565b509250929050565b6000826106f857506001610082565b8161070557506000610082565b816001811461071b576002811461072557610741565b6001915050610082565b60ff841115610736576107366105b7565b50506001821b610082565b5060208310610133831016604e8410600b8410161715610764575081810a610082565b61076e83836106a6565b8060001904821115610782576107826105b7565b029392505050565b600061007f83836106e9565b60008160001904831182151516156107b0576107b06105b7565b500290565b6000828210156107c7576107c76105b7565b500390565b600082516107de8184602087016105e5565b9190910192915050565b6000602082840312156107fa57600080fd5b8151801515811461080a57600080fd5b9392505050565b60008261082e57634e487b7160e01b600052601260045260246000fd5b50049056fea2646970667358221220f2bd6f502a279940214e485c06ea84d38724cbcfa94f6862ca1f789a1732e80b64736f6c634300080e0033";

type TestWrapperUniswapV3SwapLibConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperUniswapV3SwapLibConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperUniswapV3SwapLib__factory extends ContractFactory {
  constructor(...args: TestWrapperUniswapV3SwapLibConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TestWrapperUniswapV3SwapLib> {
    return super.deploy(
      overrides || {}
    ) as Promise<TestWrapperUniswapV3SwapLib>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperUniswapV3SwapLib {
    return super.attach(address) as TestWrapperUniswapV3SwapLib;
  }
  override connect(signer: Signer): TestWrapperUniswapV3SwapLib__factory {
    return super.connect(signer) as TestWrapperUniswapV3SwapLib__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperUniswapV3SwapLibInterface {
    return new utils.Interface(_abi) as TestWrapperUniswapV3SwapLibInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperUniswapV3SwapLib {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperUniswapV3SwapLib;
  }
}
