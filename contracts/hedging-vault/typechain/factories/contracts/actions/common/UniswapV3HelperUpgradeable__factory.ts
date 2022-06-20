/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  UniswapV3HelperUpgradeable,
  UniswapV3HelperUpgradeableInterface,
} from "../../../../contracts/actions/common/UniswapV3HelperUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdmin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevKeeper",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "KeeperChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "changeKeeper",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdmin",
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
    name: "getKeeper",
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
        name: "inputToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
    ],
    name: "getSwapInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapV3OracleUpgradeable.SwapInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSwapRouter",
    outputs: [
      {
        internalType: "contract ISwapRouter",
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
            internalType: "address",
            name: "inputToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "outputToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "expectedPriceRate",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "swapPath",
            type: "bytes",
          },
        ],
        internalType: "struct UniswapV3OracleUpgradeable.SwapInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "setSwapInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610852806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063725c9c491161005b578063725c9c49146100d25780638f283970146100e3578063ae39ecfc146100f6578063da52ea7a1461011657600080fd5b80630977983814610082578063391b6f4e146100975780636e9960c3146100c1575b600080fd5b6100956100903660046104df565b610129565b005b6034546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b6033546001600160a01b03166100a4565b6066546001600160a01b03166100a4565b6100956100f13660046104df565b610223565b610109610104366004610503565b610313565b6040516100b8919061053c565b6100956101243660046105c3565b610425565b6033546001600160a01b0316336001600160a01b0316146101655760405162461bcd60e51b815260040161015c906105fe565b60405180910390fd5b6001600160a01b0381166101d15760405162461bcd60e51b815260206004820152602d60248201527f4e6577206b656570657220616464726573732063616e6e6f742062652074686560448201526c206e756c6c206164647265737360981b606482015260840161015c565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f068b48a2fe7f498b57ff6da64f075ae658fde8d77124b092e62b3dc58d91ce3590600090a35050565b6033546001600160a01b0316336001600160a01b0316146102565760405162461bcd60e51b815260040161015c906105fe565b6001600160a01b0381166102c15760405162461bcd60e51b815260206004820152602c60248201527f4e65772061646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b606482015260840161015c565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b60408051608081018252600080825260208201819052918101919091526060808201526001600160a01b0380841660009081526065602090815260408083208685168452825291829020825160808101845281548516815260018201549094169184019190915260028101549183019190915260038101805460608401919061039b90610643565b80601f01602080910402602001604051908101604052809291908181526020018280546103c790610643565b80156104145780601f106103e957610100808354040283529160200191610414565b820191906000526020600020905b8154815290600101906020018083116103f757829003601f168201915b505050505081525050905092915050565b6034546001600160a01b0316336001600160a01b0316146104585760405162461bcd60e51b815260040161015c906105fe565b806065600061046a60208401846104df565b6001600160a01b03166001600160a01b03168152602001908152602001600020600083602001602081019061049f91906104df565b6001600160a01b0316815260208101919091526040016000206104c282826106eb565b505050565b6001600160a01b03811681146104dc57600080fd5b50565b6000602082840312156104f157600080fd5b81356104fc816104c7565b9392505050565b6000806040838503121561051657600080fd5b8235610521816104c7565b91506020830135610531816104c7565b809150509250929050565b6000602080835260018060a01b03808551168285015280828601511660408501525060408401516060840152606084015160808085015280518060a086015260005b8181101561059a5782810184015186820160c00152830161057e565b818111156105ac57600060c083880101525b50601f01601f19169390930160c001949350505050565b6000602082840312156105d557600080fd5b813567ffffffffffffffff8111156105ec57600080fd5b8201608081850312156104fc57600080fd5b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b600181811c9082168061065757607f821691505b60208210810361067757634e487b7160e01b600052602260045260246000fd5b50919050565b80546001600160a01b0319166001600160a01b0392909216919091179055565b601f8211156104c257600081815260208120601f850160051c810160208610156106c45750805b601f850160051c820191505b818110156106e3578281556001016106d0565b505050505050565b81356106f6816104c7565b610700818361067d565b506001602080840135610712816104c7565b61071e8184860161067d565b5060408401356002840155600383016060850135601e1986360301811261074457600080fd5b8501803567ffffffffffffffff81111561075d57600080fd5b803603848301131561076e57600080fd5b6107828161077c8554610643565b8561069d565b6000601f8211600181146107b857600083156107a057508382018601355b600019600385901b1c1916600184901b178555610811565b600085815260209020601f19841690835b828110156107e8578685018901358255938801939089019088016107c9565b50848210156108075760001960f88660031b161c198885880101351681555b50508683881b0185555b50505050505050505056fea26469706673582212207b0622854f00c4ae9e4d21052667e232b93523f41c6e0507f40709c37b8fb57264736f6c634300080e0033";

type UniswapV3HelperUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: UniswapV3HelperUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class UniswapV3HelperUpgradeable__factory extends ContractFactory {
  constructor(...args: UniswapV3HelperUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<UniswapV3HelperUpgradeable> {
    return super.deploy(overrides || {}) as Promise<UniswapV3HelperUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): UniswapV3HelperUpgradeable {
    return super.attach(address) as UniswapV3HelperUpgradeable;
  }
  override connect(signer: Signer): UniswapV3HelperUpgradeable__factory {
    return super.connect(signer) as UniswapV3HelperUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): UniswapV3HelperUpgradeableInterface {
    return new utils.Interface(_abi) as UniswapV3HelperUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): UniswapV3HelperUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as UniswapV3HelperUpgradeable;
  }
}
