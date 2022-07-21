/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ActionsManagerUpgradeable,
  ActionsManagerUpgradeableInterface,
} from "../../../contracts/vault/ActionsManagerUpgradeable";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentageOutOfRange",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_principalPercentagesLength",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_principalPercentagesLengthExpected",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentagesMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "totalSumOfPercentages",
        type: "uint256",
      },
    ],
    name: "PrincipalPercentagesSumMoreThan100",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IAction[]",
        name: "actions",
        type: "address[]",
      },
    ],
    name: "ActionsAdded",
    type: "event",
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
        indexed: false,
        internalType: "uint256[]",
        name: "_principalPercentages",
        type: "uint256[]",
      },
    ],
    name: "PrincipalPercentagesUpdated",
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
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getAction",
    outputs: [
      {
        internalType: "contract IAction",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getActionsLength",
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
    inputs: [
      {
        internalType: "uint256",
        name: "actionIndex",
        type: "uint256",
      },
    ],
    name: "getPrincipalPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "percentage",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPrincipalPercentages",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
    inputs: [],
    name: "getTotalPrincipalPercentages",
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
        internalType: "uint256[]",
        name: "newPrincipalPercentages",
        type: "uint256[]",
      },
    ],
    name: "setPrincipalPercentages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610d12806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80638d928af81161008c578063b6e7687311610066578063b6e76873146101c7578063e78c65aa146101da578063e7f43c68146101e2578063ee280e04146101f357600080fd5b80638d928af81461019b5780638f283970146101ac578063939007f8146101bf57600080fd5b80635eed6848116100c85780635eed68481461014f57806360e232a9146101645780636e9960c31461017757806372eb05b91461018857600080fd5b806306394c9b146100ef5780632b6e68181461010457806334d9b2dc1461012a575b600080fd5b6101026100fd3660046109d5565b610206565b005b610117610112366004610a05565b61024e565b6040519081526020015b60405180910390f35b6034546001600160a01b03165b6040516001600160a01b039091168152602001610121565b610157610281565b6040516101219190610a1e565b6101026101723660046109d5565b6102d9565b6033546001600160a01b0316610137565b6101026101963660046109d5565b610315565b6036546001600160a01b0316610137565b6101026101ba3660046109d5565b610351565b606754610117565b6101376101d5366004610a05565b61038d565b606554610117565b6035546001600160a01b0316610137565b610102610201366004610a62565b6103bd565b6033546001600160a01b0316336001600160a01b0316146102425760405162461bcd60e51b815260040161023990610ad7565b60405180910390fd5b61024b81610441565b50565b60665460009082101561027c576066828154811061026e5761026e610b1c565b906000526020600020015490505b919050565b606060668054806020026020016040519081016040528092919081815260200182805480156102cf57602002820191906000526020600020905b8154815260200190600101908083116102bb575b5050505050905090565b6033546001600160a01b0316336001600160a01b03161461030c5760405162461bcd60e51b815260040161023990610ad7565b61024b81610501565b6033546001600160a01b0316336001600160a01b0316146103485760405162461bcd60e51b815260040161023990610ad7565b61024b816105be565b6033546001600160a01b0316336001600160a01b0316146103845760405162461bcd60e51b815260040161023990610ad7565b61024b81610680565b6000606582815481106103a2576103a2610b1c565b6000918252602090912001546001600160a01b031692915050565b6034546001600160a01b0316336001600160a01b0316146104335760405162461bcd60e51b815260206004820152602a60248201527f4f6e6c792074686520537472617465676973742063616e2063616c6c207468696044820152693990333ab731ba34b7b760b11b6064820152608401610239565b61043d828261073d565b5050565b6001600160a01b0381166104af5760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b6064820152608401610239565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b6001600160a01b03811661056c5760405162461bcd60e51b815260206004820152602c60248201527f4e6577205661756c7420616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610239565b603680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f16e2accad9173abff57b295b56993ec5d86b3cbf791fea02f02a6616463754ea90600090a35050565b6001600160a01b03811661062e5760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b6064820152608401610239565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6001600160a01b0381166106eb5760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610239565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b600061074860655490565b90508181146107745760405163acbc4ec560e01b81526004810183905260248101829052604401610239565b60665481146107d6578167ffffffffffffffff81111561079657610796610b32565b6040519080825280602002602001820160405280156107bf578160200160208202803683370190505b5080516107d491606691602090910190610975565b505b600060678190555b828110156108f7578383828181106107f8576107f8610b1c565b905060200201356000148061083a57506108146006600a610c44565b61081f906064610c50565b84848381811061083157610831610b1c565b90506020020135115b1561087d578084848381811061085257610852610b1c565b9050602002013560405163e16a8e8160e01b8152600401610239929190918252602082015260400190565b83838281811061088f5761088f610b1c565b90506020020135606682815481106108a9576108a9610b1c565b6000918252602090912001558383828181106108c7576108c7610b1c565b90506020020135606760008282546108df9190610c6f565b909155508190506108ef81610c87565b9150506107de565b506109046006600a610c44565b61090f906064610c50565b606754111561093757606754604051634515cbdf60e11b815260040161023991815260200190565b7f6f37dd052475dc2feae9dda23934528d00eddb02c392df86f7027192c8e962708383604051610968929190610ca0565b60405180910390a1505050565b8280548282559060005260206000209081019282156109b0579160200282015b828111156109b0578251825591602001919060010190610995565b506109bc9291506109c0565b5090565b5b808211156109bc57600081556001016109c1565b6000602082840312156109e757600080fd5b81356001600160a01b03811681146109fe57600080fd5b9392505050565b600060208284031215610a1757600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b81811015610a5657835183529284019291840191600101610a3a565b50909695505050505050565b60008060208385031215610a7557600080fd5b823567ffffffffffffffff80821115610a8d57600080fd5b818501915085601f830112610aa157600080fd5b813581811115610ab057600080fd5b8660208260051b8501011115610ac557600080fd5b60209290920196919550909350505050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600181815b80851115610b99578160001904821115610b7f57610b7f610b48565b80851615610b8c57918102915b93841c9390800290610b63565b509250929050565b600082610bb057506001610c3e565b81610bbd57506000610c3e565b8160018114610bd35760028114610bdd57610bf9565b6001915050610c3e565b60ff841115610bee57610bee610b48565b50506001821b610c3e565b5060208310610133831016604e8410600b8410161715610c1c575081810a610c3e565b610c268383610b5e565b8060001904821115610c3a57610c3a610b48565b0290505b92915050565b60006109fe8383610ba1565b6000816000190483118215151615610c6a57610c6a610b48565b500290565b60008219821115610c8257610c82610b48565b500190565b600060018201610c9957610c99610b48565b5060010190565b6020808252810182905260006001600160fb1b03831115610cc057600080fd5b8260051b8085604085013760009201604001918252509291505056fea2646970667358221220c2d44d891409a70737bad88bffb6a7389bc802820c9ae645e4560b619bb1379c64736f6c634300080e0033";

type ActionsManagerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ActionsManagerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ActionsManagerUpgradeable__factory extends ContractFactory {
  constructor(...args: ActionsManagerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ActionsManagerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ActionsManagerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ActionsManagerUpgradeable {
    return super.attach(address) as ActionsManagerUpgradeable;
  }
  override connect(signer: Signer): ActionsManagerUpgradeable__factory {
    return super.connect(signer) as ActionsManagerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ActionsManagerUpgradeableInterface {
    return new utils.Interface(_abi) as ActionsManagerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ActionsManagerUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ActionsManagerUpgradeable;
  }
}