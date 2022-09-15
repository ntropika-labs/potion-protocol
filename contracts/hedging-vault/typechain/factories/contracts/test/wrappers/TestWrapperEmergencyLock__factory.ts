/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperEmergencyLock,
  TestWrapperEmergencyLockInterface,
} from "../../../../contracts/test/wrappers/TestWrapperEmergencyLock";

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
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
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
        name: "strategistAddress",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610ff5806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80639010d07c116100a2578063a378a32411610071578063a378a3241461024b578063c0c53b8b14610272578063ca15c87314610285578063d547741f14610298578063f5b541a6146102ab57600080fd5b80639010d07c146101e657806391d148541461021157806398c4f1ac14610224578063a217fddf146101af57600080fd5b80633f4ba83a116100e95780633f4ba83a1461019c5780635c975abb146101a457806375b238fc146101af57806376082a5e146101b75780638456cb59146101de57600080fd5b806301ffc9a71461011b578063248a9ca3146101435780632f2ff15d1461017457806336568abe14610189575b600080fd5b61012e610129366004610caa565b6102d2565b60405190151581526020015b60405180910390f35b610166610151366004610cd4565b60009081526065602052604090206001015490565b60405190815260200161013a565b610187610182366004610d04565b6102fd565b005b610187610197366004610d04565b610327565b6101876103aa565b60c95460ff1661012e565b610166600081565b6101667fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101876103be565b6101f96101f4366004610d30565b6103d0565b6040516001600160a01b03909116815260200161013a565b61012e61021f366004610d04565b6103ef565b6101667f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b6101667f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b610187610280366004610d52565b61041a565b610166610293366004610cd4565b61049d565b6101876102a6366004610d04565b6104b4565b6101667f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b14806102f757506102f7826104d9565b92915050565b6000828152606560205260409020600101546103188161050e565b610322838361051b565b505050565b6001600160a01b038116331461039c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6103a6828261053d565b5050565b6103b4600061050e565b6103bc61055f565b565b6103c8600061050e565b6103bc6105f2565b60008281526097602052604081206103e8908361066d565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60006104266001610679565b9050801561043e576000805461ff0019166101001790555b610449848484610706565b610451610794565b8015610497576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b50505050565b60008181526097602052604081206102f7906107c3565b6000828152606560205260409020600101546104cf8161050e565b610322838361053d565b60006001600160e01b03198216637965db0b60e01b14806102f757506301ffc9a760e01b6001600160e01b03198316146102f7565b61051881336107cd565b50565b6105258282610831565b600082815260976020526040902061032290826108b7565b61054782826108cc565b60008281526097602052604090206103229082610933565b60c95460ff166105a85760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610393565b60c9805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b60c95460ff16156106385760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610393565b60c9805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586105d53390565b60006103e88383610948565b60008054610100900460ff16156106c0578160ff16600114801561069c5750303b155b6106b85760405162461bcd60e51b815260040161039390610d95565b506000919050565b60005460ff8084169116106106e75760405162461bcd60e51b815260040161039390610d95565b506000805460ff191660ff92909216919091179055600190565b919050565b600054610100900460ff1661072d5760405162461bcd60e51b815260040161039390610de3565b610735610972565b61074060008461051b565b61076a7f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb08361051b565b6103227f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9298261051b565b600054610100900460ff166107bb5760405162461bcd60e51b815260040161039390610de3565b6103bc610999565b60006102f7825490565b6107d782826103ef565b6103a6576107ef816001600160a01b031660146109cc565b6107fa8360206109cc565b60405160200161080b929190610e5a565b60408051601f198184030181529082905262461bcd60e51b825261039391600401610ecf565b61083b82826103ef565b6103a65760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556108733390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006103e8836001600160a01b038416610b68565b6108d682826103ef565b156103a65760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60006103e8836001600160a01b038416610bb7565b600082600001828154811061095f5761095f610f02565b9060005260206000200154905092915050565b600054610100900460ff166103bc5760405162461bcd60e51b815260040161039390610de3565b600054610100900460ff166109c05760405162461bcd60e51b815260040161039390610de3565b60c9805460ff19169055565b606060006109db836002610f2e565b6109e6906002610f4d565b67ffffffffffffffff8111156109fe576109fe610f65565b6040519080825280601f01601f191660200182016040528015610a28576020820181803683370190505b509050600360fc1b81600081518110610a4357610a43610f02565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610a7257610a72610f02565b60200101906001600160f81b031916908160001a9053506000610a96846002610f2e565b610aa1906001610f4d565b90505b6001811115610b19576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610ad557610ad5610f02565b1a60f81b828281518110610aeb57610aeb610f02565b60200101906001600160f81b031916908160001a90535060049490941c93610b1281610f7b565b9050610aa4565b5083156103e85760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610393565b6000818152600183016020526040812054610baf575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556102f7565b5060006102f7565b60008181526001830160205260408120548015610ca0576000610bdb600183610f92565b8554909150600090610bef90600190610f92565b9050818114610c54576000866000018281548110610c0f57610c0f610f02565b9060005260206000200154905080876000018481548110610c3257610c32610f02565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610c6557610c65610fa9565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506102f7565b60009150506102f7565b600060208284031215610cbc57600080fd5b81356001600160e01b0319811681146103e857600080fd5b600060208284031215610ce657600080fd5b5035919050565b80356001600160a01b038116811461070157600080fd5b60008060408385031215610d1757600080fd5b82359150610d2760208401610ced565b90509250929050565b60008060408385031215610d4357600080fd5b50508035926020909101359150565b600080600060608486031215610d6757600080fd5b610d7084610ced565b9250610d7e60208501610ced565b9150610d8c60408501610ced565b90509250925092565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60005b83811015610e49578181015183820152602001610e31565b838111156104975750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610e92816017850160208801610e2e565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610ec3816028840160208801610e2e565b01602801949350505050565b6020815260008251806020840152610eee816040850160208701610e2e565b601f01601f19169190910160400192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610f4857610f48610f18565b500290565b60008219821115610f6057610f60610f18565b500190565b634e487b7160e01b600052604160045260246000fd5b600081610f8a57610f8a610f18565b506000190190565b600082821015610fa457610fa4610f18565b500390565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220135793ba6f57dd96fed497a8018b9552735797d8be8a12dfdd71946a3305ab3d64736f6c634300080e0033";

type TestWrapperEmergencyLockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperEmergencyLockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperEmergencyLock__factory extends ContractFactory {
  constructor(...args: TestWrapperEmergencyLockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperEmergencyLock> {
    return super.deploy(overrides || {}) as Promise<TestWrapperEmergencyLock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperEmergencyLock {
    return super.attach(address) as TestWrapperEmergencyLock;
  }
  override connect(signer: Signer): TestWrapperEmergencyLock__factory {
    return super.connect(signer) as TestWrapperEmergencyLock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperEmergencyLockInterface {
    return new utils.Interface(_abi) as TestWrapperEmergencyLockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperEmergencyLock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperEmergencyLock;
  }
}
