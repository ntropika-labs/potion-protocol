/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperRolesManager,
  TestWrapperRolesManagerInterface,
} from "../../../../contracts/test/wrappers/TestWrapperRolesManager";

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
        name: "adminAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "operatorAddress",
        type: "address",
      },
    ],
    name: "initialize",
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
  "0x608060405234801561001057600080fd5b50610d69806100206000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80639010d07c11610097578063a378a32411610066578063a378a32414610222578063ca15c87314610249578063d547741f1461025c578063f5b541a61461026f57600080fd5b80639010d07c146101bd57806391d14854146101e857806398c4f1ac146101fb578063a217fddf1461018e57600080fd5b806336568abe116100d357806336568abe14610168578063485cc9551461017b57806375b238fc1461018e57806376082a5e1461019657600080fd5b806301ffc9a7146100fa578063248a9ca3146101225780632f2ff15d14610153575b600080fd5b61010d610108366004610ac7565b610296565b60405190151581526020015b60405180910390f35b610145610130366004610af1565b60009081526065602052604090206001015490565b604051908152602001610119565b610166610161366004610b26565b6102c1565b005b610166610176366004610b26565b6102eb565b610166610189366004610b52565b61036e565b610145600081565b6101457fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101d06101cb366004610b7c565b610482565b6040516001600160a01b039091168152602001610119565b61010d6101f6366004610b26565b6104a1565b6101457f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b6101457f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b610145610257366004610af1565b6104cc565b61016661026a366004610b26565b6104e3565b6101457f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b14806102bb57506102bb82610508565b92915050565b6000828152606560205260409020600101546102dc8161053d565b6102e6838361054a565b505050565b6001600160a01b03811633146103605760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61036a828261056c565b5050565b600054610100900460ff161580801561038e5750600054600160ff909116105b806103a85750303b1580156103a8575060005460ff166001145b61040b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610357565b6000805460ff19166001179055801561042e576000805461ff0019166101001790555b610438838361058e565b80156102e6576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b600082815260976020526040812061049a908361062e565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60008181526097602052604081206102bb9061063a565b6000828152606560205260409020600101546104fe8161053d565b6102e6838361056c565b60006001600160e01b03198216637965db0b60e01b14806102bb57506301ffc9a760e01b6001600160e01b03198316146102bb565b6105478133610644565b50565b61055482826106a8565b60008281526097602052604090206102e6908261072e565b6105768282610743565b60008281526097602052604090206102e690826107aa565b600054610100900460ff166105f95760405162461bcd60e51b815260206004820152602b60248201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960448201526a6e697469616c697a696e6760a81b6064820152608401610357565b61060460008361054a565b61036a7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9298261054a565b600061049a83836107bf565b60006102bb825490565b61064e82826104a1565b61036a57610666816001600160a01b031660146107e9565b6106718360206107e9565b604051602001610682929190610bce565b60408051601f198184030181529082905262461bcd60e51b825261035791600401610c43565b6106b282826104a1565b61036a5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556106ea3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061049a836001600160a01b038416610985565b61074d82826104a1565b1561036a5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061049a836001600160a01b0384166109d4565b60008260000182815481106107d6576107d6610c76565b9060005260206000200154905092915050565b606060006107f8836002610ca2565b610803906002610cc1565b67ffffffffffffffff81111561081b5761081b610cd9565b6040519080825280601f01601f191660200182016040528015610845576020820181803683370190505b509050600360fc1b8160008151811061086057610860610c76565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061088f5761088f610c76565b60200101906001600160f81b031916908160001a90535060006108b3846002610ca2565b6108be906001610cc1565b90505b6001811115610936576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106108f2576108f2610c76565b1a60f81b82828151811061090857610908610c76565b60200101906001600160f81b031916908160001a90535060049490941c9361092f81610cef565b90506108c1565b50831561049a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610357565b60008181526001830160205260408120546109cc575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556102bb565b5060006102bb565b60008181526001830160205260408120548015610abd5760006109f8600183610d06565b8554909150600090610a0c90600190610d06565b9050818114610a71576000866000018281548110610a2c57610a2c610c76565b9060005260206000200154905080876000018481548110610a4f57610a4f610c76565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610a8257610a82610d1d565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506102bb565b60009150506102bb565b600060208284031215610ad957600080fd5b81356001600160e01b03198116811461049a57600080fd5b600060208284031215610b0357600080fd5b5035919050565b80356001600160a01b0381168114610b2157600080fd5b919050565b60008060408385031215610b3957600080fd5b82359150610b4960208401610b0a565b90509250929050565b60008060408385031215610b6557600080fd5b610b6e83610b0a565b9150610b4960208401610b0a565b60008060408385031215610b8f57600080fd5b50508035926020909101359150565b60005b83811015610bb9578181015183820152602001610ba1565b83811115610bc8576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610c06816017850160208801610b9e565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610c37816028840160208801610b9e565b01602801949350505050565b6020815260008251806020840152610c62816040850160208701610b9e565b601f01601f19169190910160400192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610cbc57610cbc610c8c565b500290565b60008219821115610cd457610cd4610c8c565b500190565b634e487b7160e01b600052604160045260246000fd5b600081610cfe57610cfe610c8c565b506000190190565b600082821015610d1857610d18610c8c565b500390565b634e487b7160e01b600052603160045260246000fdfea264697066735822122024c318bf2ac9c85840edcd308ba54118dbb720947a06d0200e639841931f5ea364736f6c634300080e0033";

type TestWrapperRolesManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperRolesManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperRolesManager__factory extends ContractFactory {
  constructor(...args: TestWrapperRolesManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperRolesManager> {
    return super.deploy(overrides || {}) as Promise<TestWrapperRolesManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperRolesManager {
    return super.attach(address) as TestWrapperRolesManager;
  }
  override connect(signer: Signer): TestWrapperRolesManager__factory {
    return super.connect(signer) as TestWrapperRolesManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperRolesManagerInterface {
    return new utils.Interface(_abi) as TestWrapperRolesManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperRolesManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperRolesManager;
  }
}
