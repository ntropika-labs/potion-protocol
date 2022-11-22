/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  MockUniswapV3Router,
  MockUniswapV3RouterInterface,
} from "../../../../contracts/test/mocks/MockUniswapV3Router";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets_",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "assets",
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "path",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutMinimum",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapRouter.ExactInputParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOutMinimum",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct ISwapRouter.ExactInputSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactInputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "path",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountInMaximum",
            type: "uint256",
          },
        ],
        internalType: "struct ISwapRouter.ExactOutputParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "uint24",
            name: "fee",
            type: "uint24",
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "deadline",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountOut",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amountInMaximum",
            type: "uint256",
          },
          {
            internalType: "uint160",
            name: "sqrtPriceLimitX96",
            type: "uint160",
          },
        ],
        internalType: "struct ISwapRouter.ExactOutputSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "exactOutputSingle",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "uniswapV3SwapCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610a92380380610a9283398101604081905261002f916100d5565b60005b815181101561009c57600082828151811061004f5761004f610199565b60209081029190910181015182546001810184556000938452919092200180546001600160a01b0319166001600160a01b0390921691909117905580610094816101af565b915050610032565b50506101d6565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146100d057600080fd5b919050565b600060208083850312156100e857600080fd5b82516001600160401b03808211156100ff57600080fd5b818501915085601f83011261011357600080fd5b815181811115610125576101256100a3565b8060051b604051601f19603f8301168101818110858211171561014a5761014a6100a3565b60405291825284820192508381018501918883111561016857600080fd5b938501935b8285101561018d5761017e856100b9565b8452938501939285019261016d565b98975050505050505050565b634e487b7160e01b600052603260045260246000fd5b6000600182016101cf57634e487b7160e01b600052601160045260246000fd5b5060010190565b6108ad806101e56000396000f3fe6080604052600436106100555760003560e01c8063414bf3891461005a578063c04b8d5914610080578063cf35bdd014610093578063db3e2198146100cb578063f28c0498146100de578063fa461e33146100f1575b600080fd5b61006d6100683660046106ac565b610114565b6040519081526020015b60405180910390f35b61006d61008e3660046106e2565b610230565b34801561009f57600080fd5b506100b36100ae36600461071f565b61037c565b6040516001600160a01b039091168152602001610077565b61006d6100d93660046106ac565b6103a6565b61006d6100ec3660046106e2565b61047a565b3480156100fd57600080fd5b5061011261010c366004610738565b50505050565b005b600061012360208301836107b8565b6040516323b872dd60e01b815233600482015230602482015260a084013560448201526001600160a01b0391909116906323b872dd906064016020604051808303816000875af115801561017b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061019f91906107e1565b506101b060408301602084016107b8565b60405163a9059cbb60e01b815233600482015260c084013560248201526001600160a01b03919091169063a9059cbb906044015b6020604051808303816000875af1158015610203573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061022791906107e1565b505060c0013590565b6000808061027b6102418580610803565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061054292505050565b506040516323b872dd60e01b81523360048201523060248201526060870135604482015291935091506001600160a01b038316906323b872dd906064016020604051808303816000875af11580156102d7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102fb91906107e1565b5060405163a9059cbb60e01b8152336004820152608085013560248201526001600160a01b0382169063a9059cbb906044015b6020604051808303816000875af115801561034d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061037191906107e1565b505050506080013590565b6000818154811061038c57600080fd5b6000918252602090912001546001600160a01b0316905081565b60006103b560208301836107b8565b6040516323b872dd60e01b815233600482015230602482015260c084013560448201526001600160a01b0391909116906323b872dd906064016020604051808303816000875af115801561040d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061043191906107e1565b5061044260408301602084016107b8565b60405163a9059cbb60e01b815233600482015260a084013560248201526001600160a01b03919091169063a9059cbb906044016101e4565b6000808061048b6102418580610803565b506040516323b872dd60e01b81523360048201523060248201526080870135604482015291935091506001600160a01b038316906323b872dd906064016020604051808303816000875af11580156104e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061050b91906107e1565b5060405163a9059cbb60e01b8152336004820152606085013560248201526001600160a01b0382169063a9059cbb9060440161032e565b60008080610550848261057e565b925061055d8460146105e8565b905061057561056e60036014610851565b859061057e565b91509193909250565b600061058b826014610851565b835110156105d85760405162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b60448201526064015b60405180910390fd5b500160200151600160601b900490565b6000816105f6816003610851565b10156106385760405162461bcd60e51b8152602060048201526011602482015270746f55696e7432345f6f766572666c6f7760781b60448201526064016105cf565b610643826003610851565b8351101561068a5760405162461bcd60e51b8152602060048201526014602482015273746f55696e7432345f6f75744f66426f756e647360601b60448201526064016105cf565b50016003015190565b600061010082840312156106a657600080fd5b50919050565b600061010082840312156106bf57600080fd5b6106c98383610693565b9392505050565b600060a082840312156106a657600080fd5b6000602082840312156106f457600080fd5b813567ffffffffffffffff81111561070b57600080fd5b610717848285016106d0565b949350505050565b60006020828403121561073157600080fd5b5035919050565b6000806000806060858703121561074e57600080fd5b8435935060208501359250604085013567ffffffffffffffff8082111561077457600080fd5b818701915087601f83011261078857600080fd5b81358181111561079757600080fd5b8860208285010111156107a957600080fd5b95989497505060200194505050565b6000602082840312156107ca57600080fd5b81356001600160a01b03811681146106c957600080fd5b6000602082840312156107f357600080fd5b815180151581146106c957600080fd5b6000808335601e1984360301811261081a57600080fd5b83018035915067ffffffffffffffff82111561083557600080fd5b60200191503681900382131561084a57600080fd5b9250929050565b6000821982111561087257634e487b7160e01b600052601160045260246000fd5b50019056fea2646970667358221220c396ed3e59a9644ba294004ed1a2effdcb8b6abeb49e484322362a2fa84e72c364736f6c634300080e0033";

type MockUniswapV3RouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockUniswapV3RouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockUniswapV3Router__factory extends ContractFactory {
  constructor(...args: MockUniswapV3RouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    assets_: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockUniswapV3Router> {
    return super.deploy(
      assets_,
      overrides || {}
    ) as Promise<MockUniswapV3Router>;
  }
  override getDeployTransaction(
    assets_: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(assets_, overrides || {});
  }
  override attach(address: string): MockUniswapV3Router {
    return super.attach(address) as MockUniswapV3Router;
  }
  override connect(signer: Signer): MockUniswapV3Router__factory {
    return super.connect(signer) as MockUniswapV3Router__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockUniswapV3RouterInterface {
    return new utils.Interface(_abi) as MockUniswapV3RouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockUniswapV3Router {
    return new Contract(address, _abi, signerOrProvider) as MockUniswapV3Router;
  }
}
