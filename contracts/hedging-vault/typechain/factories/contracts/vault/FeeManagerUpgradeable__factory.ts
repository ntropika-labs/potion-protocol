/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  FeeManagerUpgradeable,
  FeeManagerUpgradeableInterface,
} from "../../../contracts/vault/FeeManagerUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "managementAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "performanceAmount",
        type: "uint256",
      },
    ],
    name: "FeesETHSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldFeeReceipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newFeeReceipient",
        type: "address",
      },
    ],
    name: "FeesReceipientChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "managementAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "performanceAmount",
        type: "uint256",
      },
    ],
    name: "FeesSent",
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
        indexed: false,
        internalType: "uint256",
        name: "oldManagementFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newManagementFee",
        type: "uint256",
      },
    ],
    name: "ManagementFeeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldPerformanceFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPerformanceFee",
        type: "uint256",
      },
    ],
    name: "PerformanceFeeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVESTOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPERATOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STRATEGIST_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VAULT_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeesRecipient",
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
    name: "getManagementFee",
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
    name: "getPerformanceFee",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newFeesRecipient",
        type: "address",
      },
    ],
    name: "setFeesRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newManagementFee",
        type: "uint256",
      },
    ],
    name: "setManagementFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPerformanceFee",
        type: "uint256",
      },
    ],
    name: "setPerformanceFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610f81806100206000396000f3fe608060405234801561001057600080fd5b506004361061012c5760003560e01c80639010d07c116100ad578063a378a32411610071578063a378a32414610285578063ca15c873146102ac578063d547741f146102bf578063f5b541a6146102d2578063fe56e232146102f957600080fd5b80639010d07c1461023057806391d148541461024357806398c4f1ac146102565780639c2b1a951461027d578063a217fddf146101ee57600080fd5b806336568abe116100f457806336568abe146101c857806370897b23146101db57806375b238fc146101ee57806376082a5e146101f657806384b7719a1461021d57600080fd5b806301ffc9a714610131578063235c360314610159578063248a9ca31461016b57806328a8317a1461018e5780632f2ff15d146101b3575b600080fd5b61014461013f366004610bff565b61030c565b60405190151581526020015b60405180910390f35b60ca545b604051908152602001610150565b61015d610179366004610c29565b60009081526065602052604090206001015490565b60cb546001600160a01b03165b6040516001600160a01b039091168152602001610150565b6101c66101c1366004610c57565b610337565b005b6101c66101d6366004610c57565b610361565b6101c66101e9366004610c29565b6103e4565b61015d600081565b61015d7fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101c661022b366004610c87565b6103fa565b61019b61023e366004610ca4565b61040d565b610144610251366004610c57565b61042c565b61015d7f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b60c95461015d565b61015d7f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b61015d6102ba366004610c29565b610457565b6101c66102cd366004610c57565b61046e565b61015d7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b6101c6610307366004610c29565b610493565b60006001600160e01b03198216635a05180f60e01b14806103315750610331826104a6565b92915050565b600082815260656020526040902060010154610352816104db565b61035c83836104e5565b505050565b6001600160a01b03811633146103d65760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6103e08282610507565b5050565b6103ee60006104db565b6103f781610529565b50565b61040460006104db565b6103f7816105de565b60008281526097602052604081206104259083610698565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b6000818152609760205260408120610331906106a4565b600082815260656020526040902060010154610489816104db565b61035c8383610507565b61049d60006104db565b6103f7816106ae565b60006001600160e01b03198216637965db0b60e01b148061033157506301ffc9a760e01b6001600160e01b0319831614610331565b6103f7813361075a565b6104ef82826107be565b600082815260976020526040902061035c9082610844565b6105118282610859565b600082815260976020526040902061035c90826108c0565b610532816108d5565b6105985760405162461bcd60e51b815260206004820152603160248201527f506572666f726d616e636520666565206d757374206265206c6573732074686160448201527006e206f7220657175616c20746f2031303607c1b60648201526084016103cd565b60ca80549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd91015b60405180910390a15050565b60cb546001600160a01b03908116908216036106485760405162461bcd60e51b8152602060048201526024808201527f4665657320726563697069656e74206973207468652073616d65206173206265604482015263666f726560e01b60648201526084016103cd565b60cb80546001600160a01b0319166001600160a01b03831690811790915560405182919081907fc5d8512a1ce98ff41b33712f195414dde7fd3a1a996a15dafab8933d9d32084490600090a35050565b600061042583836108f7565b6000610331825490565b6106b7816108d5565b61071c5760405162461bcd60e51b815260206004820152603060248201527f4d616e6167656d656e7420666565206d757374206265206c657373207468616e60448201526f0206f7220657175616c20746f203130360841b60648201526084016103cd565b60c980549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd91016105d2565b610764828261042c565b6103e05761077c816001600160a01b03166014610921565b610787836020610921565b604051602001610798929190610cf6565b60408051601f198184030181529082905262461bcd60e51b82526103cd91600401610d6b565b6107c8828261042c565b6103e05760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556108003390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610425836001600160a01b038416610abd565b610863828261042c565b156103e05760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610425836001600160a01b038416610b0c565b60006108e36006600a610e98565b6108ee906064610ea4565b90911115919050565b600082600001828154811061090e5761090e610ec3565b9060005260206000200154905092915050565b60606000610930836002610ea4565b61093b906002610ed9565b67ffffffffffffffff81111561095357610953610ef1565b6040519080825280601f01601f19166020018201604052801561097d576020820181803683370190505b509050600360fc1b8160008151811061099857610998610ec3565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106109c7576109c7610ec3565b60200101906001600160f81b031916908160001a90535060006109eb846002610ea4565b6109f6906001610ed9565b90505b6001811115610a6e576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610a2a57610a2a610ec3565b1a60f81b828281518110610a4057610a40610ec3565b60200101906001600160f81b031916908160001a90535060049490941c93610a6781610f07565b90506109f9565b5083156104255760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016103cd565b6000818152600183016020526040812054610b0457508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610331565b506000610331565b60008181526001830160205260408120548015610bf5576000610b30600183610f1e565b8554909150600090610b4490600190610f1e565b9050818114610ba9576000866000018281548110610b6457610b64610ec3565b9060005260206000200154905080876000018481548110610b8757610b87610ec3565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610bba57610bba610f35565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610331565b6000915050610331565b600060208284031215610c1157600080fd5b81356001600160e01b03198116811461042557600080fd5b600060208284031215610c3b57600080fd5b5035919050565b6001600160a01b03811681146103f757600080fd5b60008060408385031215610c6a57600080fd5b823591506020830135610c7c81610c42565b809150509250929050565b600060208284031215610c9957600080fd5b813561042581610c42565b60008060408385031215610cb757600080fd5b50508035926020909101359150565b60005b83811015610ce1578181015183820152602001610cc9565b83811115610cf0576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610d2e816017850160208801610cc6565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610d5f816028840160208801610cc6565b01602801949350505050565b6020815260008251806020840152610d8a816040850160208701610cc6565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115610def578160001904821115610dd557610dd5610d9e565b80851615610de257918102915b93841c9390800290610db9565b509250929050565b600082610e0657506001610331565b81610e1357506000610331565b8160018114610e295760028114610e3357610e4f565b6001915050610331565b60ff841115610e4457610e44610d9e565b50506001821b610331565b5060208310610133831016604e8410600b8410161715610e72575081810a610331565b610e7c8383610db4565b8060001904821115610e9057610e90610d9e565b029392505050565b60006104258383610df7565b6000816000190483118215151615610ebe57610ebe610d9e565b500290565b634e487b7160e01b600052603260045260246000fd5b60008219821115610eec57610eec610d9e565b500190565b634e487b7160e01b600052604160045260246000fd5b600081610f1657610f16610d9e565b506000190190565b600082821015610f3057610f30610d9e565b500390565b634e487b7160e01b600052603160045260246000fdfea26469706673582212203309eefd5cddf749b852a44f970618288477492e6c2fcc948f4eae38e6385ba964736f6c634300080e0033";

type FeeManagerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FeeManagerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class FeeManagerUpgradeable__factory extends ContractFactory {
  constructor(...args: FeeManagerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<FeeManagerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<FeeManagerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): FeeManagerUpgradeable {
    return super.attach(address) as FeeManagerUpgradeable;
  }
  override connect(signer: Signer): FeeManagerUpgradeable__factory {
    return super.connect(signer) as FeeManagerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FeeManagerUpgradeableInterface {
    return new utils.Interface(_abi) as FeeManagerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): FeeManagerUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as FeeManagerUpgradeable;
  }
}
