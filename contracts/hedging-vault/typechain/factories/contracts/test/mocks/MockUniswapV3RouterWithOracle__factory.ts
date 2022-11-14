/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  MockUniswapV3RouterWithOracle,
  MockUniswapV3RouterWithOracleInterface,
} from "../../../../contracts/test/mocks/MockUniswapV3RouterWithOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "assets_",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "oracles_",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "oracles",
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
        internalType: "address",
        name: "assetIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "assetOut",
        type: "address",
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
    name: "swap",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x60806040523480156200001157600080fd5b50604051620013f4380380620013f4833981016040819052620000349162000256565b8051825114620000c95760405162461bcd60e51b815260206004820152605060248201527f4d6f636b556e69737761705633526f75746572576974684f7261636c653a206160448201527f737365747320616e64206f7261636c657320617272617973206d75737420626560648201526f040e8d0ca40e6c2daca40d8cadccee8d60831b608482015260a40160405180910390fd5b60005b82518110156200016d57818181518110620000eb57620000eb620002c0565b60200260200101516000808584815181106200010b576200010b620002c0565b60200260200101516001600160a01b03166001600160a01b0316815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b0316021790555080806200016490620002d6565b915050620000cc565b505050620002fe565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b0381168114620001a457600080fd5b919050565b600082601f830112620001bb57600080fd5b815160206001600160401b0380831115620001da57620001da62000176565b8260051b604051601f19603f8301168101818110848211171562000202576200020262000176565b6040529384528581018301938381019250878511156200022157600080fd5b83870191505b848210156200024b576200023b826200018c565b8352918301919083019062000227565b979650505050505050565b600080604083850312156200026a57600080fd5b82516001600160401b03808211156200028257600080fd5b6200029086838701620001a9565b93506020850151915080821115620002a757600080fd5b50620002b685828601620001a9565b9150509250929050565b634e487b7160e01b600052603260045260246000fd5b600060018201620002f757634e487b7160e01b600052601160045260246000fd5b5060010190565b6110e6806200030e6000396000f3fe60806040526004361061007b5760003560e01c8063db3e21981161004e578063db3e219814610127578063f28c04981461013a578063fa461e331461014d578063fe0291561461017057600080fd5b8063414bf3891461008057806370a08231146100a6578063addd5099146100c6578063c04b8d5914610114575b600080fd5b61009361008e366004610bfe565b610190565b6040519081526020015b60405180910390f35b3480156100b257600080fd5b506100936100c1366004610c3e565b6101c9565b3480156100d257600080fd5b506100fc6100e1366004610c3e565b6000602081905290815260409020546001600160a01b031681565b6040516001600160a01b03909116815260200161009d565b610093610122366004610c6b565b61023a565b610093610135366004610bfe565b6102a8565b610093610148366004610c6b565b6102d9565b34801561015957600080fd5b5061016e610168366004610ca8565b50505050565b005b34801561017c57600080fd5b5061016e61018b366004610d28565b610303565b60006101c16101a26020840184610c3e565b6101b26040850160208601610c3e565b8460a001358560c0013561030b565b5060c0013590565b6040516370a0823160e01b81523060048201526000906001600160a01b038316906370a0823190602401602060405180830381865afa158015610210573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102349190610d6a565b92915050565b6000808061028561024b8580610d83565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506106a492505050565b509150915061029e82828660600135876080013561030b565b5050506080013590565b60006101c16102ba6020840184610c3e565b6102ca6040850160208601610c3e565b8460c001358560a001356106e0565b600080806102ea61024b8580610d83565b509150915061029e8282866080013587606001356106e0565b610168848484845b6001600160a01b038085166000908152602081905260408082205486841683529120549082169116816103595760405162461bcd60e51b815260040161035090610dd1565b60405180910390fd5b6001600160a01b03811661037f5760405162461bcd60e51b815260040161035090610e2e565b6000826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa1580156103bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103e39190610ea5565b5050509150506000826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa158015610429573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061044d9190610ea5565b5050509150506000886001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610493573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b79190610ef5565b90506000886001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061051d9190610ef5565b905060006105348360ff168360ff168b8789610a23565b9050878110156105ac5760405162461bcd60e51b815260206004820152603b60248201527f4d6f636b556e69737761705633526f75746572576974684f7261636c653a206160448201527f6d6f756e744f7574203c20616d6f756e744f75744d696e696d756d00000000006064820152608401610350565b6040516323b872dd60e01b8152336004820152306024820152604481018a90526001600160a01b038c16906323b872dd906064016020604051808303816000875af11580156105ff573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106239190610f18565b5060405163a9059cbb60e01b8152336004820152602481018290526001600160a01b038b169063a9059cbb906044015b6020604051808303816000875af1158015610672573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106969190610f18565b505050505050505050505050565b600080806106b28482610ad5565b92506106bf846014610b3a565b90506106d76106d060036014610f50565b8590610ad5565b91509193909250565b6001600160a01b038085166000908152602081905260408082205486841683529120549082169116816107255760405162461bcd60e51b815260040161035090610dd1565b6001600160a01b03811661074b5760405162461bcd60e51b815260040161035090610e2e565b6000826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa15801561078b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107af9190610ea5565b5050509150506000826001600160a01b031663feaf968c6040518163ffffffff1660e01b815260040160a060405180830381865afa1580156107f5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108199190610ea5565b5050509150506000886001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa15801561085f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108839190610ef5565b90506000886001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156108c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108e99190610ef5565b905060006109008260ff168460ff168a8888610a23565b9050888111156109785760405162461bcd60e51b815260206004820152603960248201527f4d6f636b556e69737761705633526f75746572576974684f7261636c653a206160448201527f6d6f756e74496e203e20616d6f756e74496e4d6178696d756d000000000000006064820152608401610350565b6040516323b872dd60e01b8152336004820152306024820152604481018290526001600160a01b038c16906323b872dd906064016020604051808303816000875af11580156109cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ef9190610f18565b5060405163a9059cbb60e01b8152336004820152602481018990526001600160a01b038b169063a9059cbb90604401610653565b6000848603610a485781610a378486610f68565b610a419190610f87565b9050610acc565b84861115610a90576000610a5c8688610fa9565b9050610a6981600a6110a4565b83610a748688610f68565b610a7e9190610f87565b610a889190610f87565b915050610acc565b6000610a9c8787610fa9565b905082610aaa82600a6110a4565b610ab48688610f68565b610abe9190610f68565b610ac89190610f87565b9150505b95945050505050565b6000610ae2826014610f50565b83511015610b2a5760405162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b6044820152606401610350565b500160200151600160601b900490565b600081610b48816003610f50565b1015610b8a5760405162461bcd60e51b8152602060048201526011602482015270746f55696e7432345f6f766572666c6f7760781b6044820152606401610350565b610b95826003610f50565b83511015610bdc5760405162461bcd60e51b8152602060048201526014602482015273746f55696e7432345f6f75744f66426f756e647360601b6044820152606401610350565b50016003015190565b60006101008284031215610bf857600080fd5b50919050565b60006101008284031215610c1157600080fd5b610c1b8383610be5565b9392505050565b80356001600160a01b0381168114610c3957600080fd5b919050565b600060208284031215610c5057600080fd5b610c1b82610c22565b600060a08284031215610bf857600080fd5b600060208284031215610c7d57600080fd5b813567ffffffffffffffff811115610c9457600080fd5b610ca084828501610c59565b949350505050565b60008060008060608587031215610cbe57600080fd5b8435935060208501359250604085013567ffffffffffffffff80821115610ce457600080fd5b818701915087601f830112610cf857600080fd5b813581811115610d0757600080fd5b886020828501011115610d1957600080fd5b95989497505060200194505050565b60008060008060808587031215610d3e57600080fd5b610d4785610c22565b9350610d5560208601610c22565b93969395505050506040820135916060013590565b600060208284031215610d7c57600080fd5b5051919050565b6000808335601e19843603018112610d9a57600080fd5b83018035915067ffffffffffffffff821115610db557600080fd5b602001915036819003821315610dca57600080fd5b9250929050565b6020808252603b908201527f4d6f636b556e69737761705633526f75746572576974684f7261636c653a206f60408201527f7261636c6520666f72206173736574496e206e6f7420666f756e640000000000606082015260800190565b6020808252603c908201527f4d6f636b556e69737761705633526f75746572576974684f7261636c653a206f60408201527f7261636c6520666f722061737365744f7574206e6f7420666f756e6400000000606082015260800190565b805169ffffffffffffffffffff81168114610c3957600080fd5b600080600080600060a08688031215610ebd57600080fd5b610ec686610e8b565b9450602086015193506040860151925060608601519150610ee960808701610e8b565b90509295509295909350565b600060208284031215610f0757600080fd5b815160ff81168114610c1b57600080fd5b600060208284031215610f2a57600080fd5b81518015158114610c1b57600080fd5b634e487b7160e01b600052601160045260246000fd5b60008219821115610f6357610f63610f3a565b500190565b6000816000190483118215151615610f8257610f82610f3a565b500290565b600082610fa457634e487b7160e01b600052601260045260246000fd5b500490565b600082821015610fbb57610fbb610f3a565b500390565b600181815b80851115610ffb578160001904821115610fe157610fe1610f3a565b80851615610fee57918102915b93841c9390800290610fc5565b509250929050565b60008261101257506001610234565b8161101f57506000610234565b8160018114611035576002811461103f5761105b565b6001915050610234565b60ff84111561105057611050610f3a565b50506001821b610234565b5060208310610133831016604e8410600b841016171561107e575081810a610234565b6110888383610fc0565b806000190482111561109c5761109c610f3a565b029392505050565b6000610c1b838361100356fea26469706673582212200a3736ec298720612ae1bc647cc897726f7fb5827cbb6458eca0807b33de99bb64736f6c634300080e0033";

type MockUniswapV3RouterWithOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockUniswapV3RouterWithOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockUniswapV3RouterWithOracle__factory extends ContractFactory {
  constructor(...args: MockUniswapV3RouterWithOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    assets_: PromiseOrValue<string>[],
    oracles_: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockUniswapV3RouterWithOracle> {
    return super.deploy(
      assets_,
      oracles_,
      overrides || {}
    ) as Promise<MockUniswapV3RouterWithOracle>;
  }
  override getDeployTransaction(
    assets_: PromiseOrValue<string>[],
    oracles_: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(assets_, oracles_, overrides || {});
  }
  override attach(address: string): MockUniswapV3RouterWithOracle {
    return super.attach(address) as MockUniswapV3RouterWithOracle;
  }
  override connect(signer: Signer): MockUniswapV3RouterWithOracle__factory {
    return super.connect(signer) as MockUniswapV3RouterWithOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockUniswapV3RouterWithOracleInterface {
    return new utils.Interface(_abi) as MockUniswapV3RouterWithOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockUniswapV3RouterWithOracle {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockUniswapV3RouterWithOracle;
  }
}
