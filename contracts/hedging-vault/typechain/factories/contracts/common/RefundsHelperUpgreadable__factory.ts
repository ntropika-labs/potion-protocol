/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  RefundsHelperUpgreadable,
  RefundsHelperUpgreadableInterface,
} from "../../../contracts/common/RefundsHelperUpgreadable";

const _abi = [
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
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "canRefund",
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
    inputs: [],
    name: "canRefundETH",
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
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
    ],
    name: "refundETH",
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
  "0x608060405234801561001057600080fd5b506111cf806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c806398c4f1ac116100a2578063d233e4eb11610071578063d233e4eb1461027d578063d547741f146102aa578063d869c75e146102bd578063e0933ff7146102d0578063f5b541a6146102dc57600080fd5b806398c4f1ac1461021c578063a217fddf146101af578063a378a32414610243578063ca15c8731461026a57600080fd5b80634154aede116100e95780634154aede1461019c57806375b238fc146101af57806376082a5e146101b75780639010d07c146101de57806391d148541461020957600080fd5b806301ffc9a71461011b578063248a9ca3146101435780632f2ff15d1461017457806336568abe14610189575b600080fd5b61012e610129366004610e71565b610303565b60405190151581526020015b60405180910390f35b610166610151366004610e9b565b60009081526065602052604090206001015490565b60405190815260200161013a565b610187610182366004610ec9565b61032e565b005b610187610197366004610ec9565b610358565b6101876101aa366004610ef9565b6103db565b610166600081565b6101667fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101f16101ec366004610f3b565b61047f565b6040516001600160a01b03909116815260200161013a565b61012e610217366004610ec9565b61049e565b6101667f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b6101667f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b610166610278366004610e9b565b6104c9565b61012e61028b366004610f5d565b6001600160a01b0316600090815260c9602052604090205460ff161590565b6101876102b8366004610ec9565b6104e0565b6101876102cb366004610ec9565b610505565b60ca5460ff161561012e565b6101667f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b1480610328575061032882610594565b92915050565b600082815260656020526040902060010154610349816105c9565b61035383836105d6565b505050565b6001600160a01b03811633146103cd5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6103d782826105f8565b5050565b6103e560006105c9565b6001600160a01b038316600090815260c9602052604090205460ff161561044e5760405162461bcd60e51b815260206004820152601860248201527f546f6b656e2063616e6e6f7420626520726566756e646564000000000000000060448201526064016103c4565b6001600160a01b0381166104745760405162461bcd60e51b81526004016103c490610f7a565b61035383828461061a565b6000828152609760205260408120610497908361066c565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600081815260976020526040812061032890610678565b6000828152606560205260409020600101546104fb816105c9565b61035383836105f8565b61050f60006105c9565b60ca5460ff161561055b5760405162461bcd60e51b81526020600482015260166024820152751155120818d85b9b9bdd081899481c99599d5b99195960521b60448201526064016103c4565b6001600160a01b0381166105815760405162461bcd60e51b81526004016103c490610f7a565b6103d76001600160a01b03821683610682565b60006001600160e01b03198216637965db0b60e01b148061032857506301ffc9a760e01b6001600160e01b0319831614610328565b6105d3813361079b565b50565b6105e082826107ff565b60008281526097602052604090206103539082610885565b610602828261089a565b60008281526097602052604090206103539082610901565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610353908490610916565b600061049783836109e8565b6000610328825490565b804710156106d25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016103c4565b6000826001600160a01b03168260405160006040518083038185875af1925050503d806000811461071f576040519150601f19603f3d011682016040523d82523d6000602084013e610724565b606091505b50509050806103535760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016103c4565b6107a5828261049e565b6103d7576107bd816001600160a01b03166014610a12565b6107c8836020610a12565b6040516020016107d9929190610ff6565b60408051601f198184030181529082905262461bcd60e51b82526103c49160040161106b565b610809828261049e565b6103d75760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556108413390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610497836001600160a01b038416610bae565b6108a4828261049e565b156103d75760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610497836001600160a01b038416610bfd565b600061096b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610cf09092919063ffffffff16565b8051909150156103535780806020019051810190610989919061109e565b6103535760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016103c4565b60008260000182815481106109ff576109ff6110c0565b9060005260206000200154905092915050565b60606000610a218360026110ec565b610a2c90600261110b565b67ffffffffffffffff811115610a4457610a44611123565b6040519080825280601f01601f191660200182016040528015610a6e576020820181803683370190505b509050600360fc1b81600081518110610a8957610a896110c0565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610ab857610ab86110c0565b60200101906001600160f81b031916908160001a9053506000610adc8460026110ec565b610ae790600161110b565b90505b6001811115610b5f576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610b1b57610b1b6110c0565b1a60f81b828281518110610b3157610b316110c0565b60200101906001600160f81b031916908160001a90535060049490941c93610b5881611139565b9050610aea565b5083156104975760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016103c4565b6000818152600183016020526040812054610bf557508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610328565b506000610328565b60008181526001830160205260408120548015610ce6576000610c21600183611150565b8554909150600090610c3590600190611150565b9050818114610c9a576000866000018281548110610c5557610c556110c0565b9060005260206000200154905080876000018481548110610c7857610c786110c0565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610cab57610cab611167565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610328565b6000915050610328565b6060610cff8484600085610d07565b949350505050565b606082471015610d685760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016103c4565b6001600160a01b0385163b610dbf5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016103c4565b600080866001600160a01b03168587604051610ddb919061117d565b60006040518083038185875af1925050503d8060008114610e18576040519150601f19603f3d011682016040523d82523d6000602084013e610e1d565b606091505b5091509150610e2d828286610e38565b979650505050505050565b60608315610e47575081610497565b825115610e575782518084602001fd5b8160405162461bcd60e51b81526004016103c4919061106b565b600060208284031215610e8357600080fd5b81356001600160e01b03198116811461049757600080fd5b600060208284031215610ead57600080fd5b5035919050565b6001600160a01b03811681146105d357600080fd5b60008060408385031215610edc57600080fd5b823591506020830135610eee81610eb4565b809150509250929050565b600080600060608486031215610f0e57600080fd5b8335610f1981610eb4565b9250602084013591506040840135610f3081610eb4565b809150509250925092565b60008060408385031215610f4e57600080fd5b50508035926020909101359150565b600060208284031215610f6f57600080fd5b813561049781610eb4565b6020808252602c908201527f526563697069656e7420616464726573732063616e6e6f74206265207468652060408201526b6e756c6c206164647265737360a01b606082015260800190565b60005b83811015610fe1578181015183820152602001610fc9565b83811115610ff0576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161102e816017850160208801610fc6565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161105f816028840160208801610fc6565b01602801949350505050565b602081526000825180602084015261108a816040850160208701610fc6565b601f01601f19169190910160400192915050565b6000602082840312156110b057600080fd5b8151801515811461049757600080fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615611106576111066110d6565b500290565b6000821982111561111e5761111e6110d6565b500190565b634e487b7160e01b600052604160045260246000fd5b600081611148576111486110d6565b506000190190565b600082821015611162576111626110d6565b500390565b634e487b7160e01b600052603160045260246000fd5b6000825161118f818460208701610fc6565b919091019291505056fea264697066735822122001ec3b7b1d7da44805145ef64ec5d65bd6a18a06c3e735b4a5c1d00d49ff9cd764736f6c634300080e0033";

type RefundsHelperUpgreadableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RefundsHelperUpgreadableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RefundsHelperUpgreadable__factory extends ContractFactory {
  constructor(...args: RefundsHelperUpgreadableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RefundsHelperUpgreadable> {
    return super.deploy(overrides || {}) as Promise<RefundsHelperUpgreadable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RefundsHelperUpgreadable {
    return super.attach(address) as RefundsHelperUpgreadable;
  }
  override connect(signer: Signer): RefundsHelperUpgreadable__factory {
    return super.connect(signer) as RefundsHelperUpgreadable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RefundsHelperUpgreadableInterface {
    return new utils.Interface(_abi) as RefundsHelperUpgreadableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RefundsHelperUpgreadable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RefundsHelperUpgreadable;
  }
}
