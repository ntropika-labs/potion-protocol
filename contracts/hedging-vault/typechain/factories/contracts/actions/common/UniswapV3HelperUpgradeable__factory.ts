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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdminAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdminAddress",
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
        name: "prevOperatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "OperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevStrategistAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "StrategistChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevVaultAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "VaultChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdminAddress",
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
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "changeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "changeStrategist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "changeVault",
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
    name: "getOperator",
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
    name: "getStrategist",
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
        internalType: "struct IUniswapV3Oracle.SwapInfo",
        name: "",
        type: "tuple",
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
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    name: "getSwapInputAmount",
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
        name: "amountIn",
        type: "uint256",
      },
    ],
    name: "getSwapOutputAmount",
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
    inputs: [],
    name: "getVault",
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
        internalType: "struct IUniswapV3Oracle.SwapInfo",
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
  "0x608060405234801561001057600080fd5b50610e41806100206000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806372eb05b91161008c578063ae39ecfc11610066578063ae39ecfc146101a0578063b1318f6f146101c0578063da52ea7a146101d3578063e7f43c68146101e657600080fd5b806372eb05b9146101695780638d928af81461017c5780638f2839701461018d57600080fd5b8063043292cb146100d457806306394c9b146100fa57806334d9b2dc1461010f57806360e232a9146101345780636e9960c314610147578063725c9c4914610158575b600080fd5b6100e76100e2366004610a7e565b6101f7565b6040519081526020015b60405180910390f35b61010d610108366004610abf565b61021f565b005b6034546001600160a01b03165b6040516001600160a01b0390911681526020016100f1565b61010d610142366004610abf565b610267565b6033546001600160a01b031661011c565b6066546001600160a01b031661011c565b61010d610177366004610abf565b6102a3565b6036546001600160a01b031661011c565b61010d61019b366004610abf565b6102df565b6101b36101ae366004610adc565b61031b565b6040516100f19190610b15565b6100e76101ce366004610a7e565b61042e565b61010d6101e1366004610b9c565b61044b565b6035546001600160a01b031661011c565b600080610204858561031b565b905061021481604001518461052e565b9150505b9392505050565b6033546001600160a01b0316336001600160a01b03161461025b5760405162461bcd60e51b815260040161025290610bd7565b60405180910390fd5b61026481610554565b50565b6033546001600160a01b0316336001600160a01b03161461029a5760405162461bcd60e51b815260040161025290610bd7565b61026481610614565b6033546001600160a01b0316336001600160a01b0316146102d65760405162461bcd60e51b815260040161025290610bd7565b610264816106d1565b6033546001600160a01b0316336001600160a01b0316146103125760405162461bcd60e51b815260040161025290610bd7565b61026481610793565b60408051608081018252600080825260208201819052918101919091526060808201526001600160a01b038084166000908152606560209081526040808320868516845282529182902082516080810184528154851681526001820154909416918401919091526002810154918301919091526003810180546060840191906103a390610c1c565b80601f01602080910402602001604051908101604052809291908181526020018280546103cf90610c1c565b801561041c5780601f106103f15761010080835404028352916020019161041c565b820191906000526020600020905b8154815290600101906020018083116103ff57829003601f168201915b50505050508152505090505b92915050565b60008061043b858561031b565b9050610214816040015184610850565b6035546001600160a01b0316336001600160a01b0316146104bf5760405162461bcd60e51b815260206004820152602860248201527f4f6e6c7920746865204f70657261746f722063616e2063616c6c207468697320604482015267333ab731ba34b7b760c11b6064820152608401610252565b80606560006104d16020840184610abf565b6001600160a01b03166001600160a01b0316815260200190815260200160002060008360200160208101906105069190610abf565b6001600160a01b0316815260208101919091526040016000206105298282610cc4565b505050565b60006102186105468461054085610868565b906108b5565b670de0b6b3a7640000900490565b6001600160a01b0381166105c25760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b6064820152608401610252565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b6001600160a01b03811661067f5760405162461bcd60e51b815260206004820152602c60248201527f4e6577205661756c7420616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610252565b603680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f16e2accad9173abff57b295b56993ec5d86b3cbf791fea02f02a6616463754ea90600090a35050565b6001600160a01b0381166107415760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b6064820152608401610252565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6001600160a01b0381166107fe5760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610252565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b600061021861054661086184610868565b85906108ca565b60007812725dd1d243aba0e75fe645cc4873f9e65afe688c928e1f218211156108a757604051633492ffd960e01b815260048101839052602401610252565b50670de0b6b3a76400000290565b600061021883670de0b6b3a7640000846108d6565b600061021883836109a3565b60008080600019858709858702925082811083820303915050806000036109105783828161090657610906610df5565b0492505050610218565b83811061093a57604051631dcf306360e21b81526004810182905260248101859052604401610252565b60008486880960026001871981018816978890046003810283188082028403028082028403028082028403028082028403028082028403029081029092039091026000889003889004909101858311909403939093029303949094049190911702949350505050565b60008080600019848609848602925082811083820303915050670de0b6b3a764000081106109e75760405163698d9a0160e11b815260048101829052602401610252565b600080670de0b6b3a764000086880991506706f05b59d3b1ffff8211905082600003610a255780670de0b6b3a7640000850401945050505050610428565b620400008285030493909111909103600160ee1b02919091177faccb18165bd6fe31ae1cf318dc5b51eee0e1ba569b88cd74c1773b91fac106690201905092915050565b6001600160a01b038116811461026457600080fd5b600080600060608486031215610a9357600080fd5b8335610a9e81610a69565b92506020840135610aae81610a69565b929592945050506040919091013590565b600060208284031215610ad157600080fd5b813561021881610a69565b60008060408385031215610aef57600080fd5b8235610afa81610a69565b91506020830135610b0a81610a69565b809150509250929050565b6000602080835260018060a01b03808551168285015280828601511660408501525060408401516060840152606084015160808085015280518060a086015260005b81811015610b735782810184015186820160c001528301610b57565b81811115610b8557600060c083880101525b50601f01601f19169390930160c001949350505050565b600060208284031215610bae57600080fd5b813567ffffffffffffffff811115610bc557600080fd5b82016080818503121561021857600080fd5b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b600181811c90821680610c3057607f821691505b602082108103610c5057634e487b7160e01b600052602260045260246000fd5b50919050565b80546001600160a01b0319166001600160a01b0392909216919091179055565b601f82111561052957600081815260208120601f850160051c81016020861015610c9d5750805b601f850160051c820191505b81811015610cbc57828155600101610ca9565b505050505050565b8135610ccf81610a69565b610cd98183610c56565b506001602080840135610ceb81610a69565b610cf781848601610c56565b5060408401356002840155600383016060850135601e19863603018112610d1d57600080fd5b8501803567ffffffffffffffff811115610d3657600080fd5b8036038483011315610d4757600080fd5b610d5b81610d558554610c1c565b85610c76565b6000601f821160018114610d915760008315610d7957508382018601355b600019600385901b1c1916600184901b178555610dea565b600085815260209020601f19841690835b82811015610dc157868501890135825593880193908901908801610da2565b5084821015610de05760001960f88660031b161c198885880101351681555b50508683881b0185555b505050505050505050565b634e487b7160e01b600052601260045260246000fdfea26469706673582212200b16e40380bcb1bd8b21bec1b9bee7b2340d7eb9f7c5beb31f72aa4b00f400de64736f6c634300080e0033";

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
