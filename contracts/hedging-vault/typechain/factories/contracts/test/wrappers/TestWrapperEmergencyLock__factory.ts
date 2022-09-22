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
  "0x608060405234801561001057600080fd5b50610f5a806100206000396000f3fe608060405234801561001057600080fd5b50600436106101165760003560e01c80638456cb59116100a2578063a217fddf11610071578063a217fddf146101c2578063a378a3241461025e578063ca15c87314610285578063d547741f14610298578063f5b541a6146102ab57600080fd5b80638456cb59146101f15780639010d07c146101f957806391d148541461022457806398c4f1ac1461023757600080fd5b80633f4ba83a116100e95780633f4ba83a1461019c578063485cc955146101a45780635c975abb146101b757806375b238fc146101c257806376082a5e146101ca57600080fd5b806301ffc9a71461011b578063248a9ca3146101435780632f2ff15d1461017457806336568abe14610189575b600080fd5b61012e610129366004610c6d565b6102d2565b60405190151581526020015b60405180910390f35b610166610151366004610c97565b60009081526065602052604090206001015490565b60405190815260200161013a565b610187610182366004610ccc565b6102fd565b005b610187610197366004610ccc565b610327565b6101876103aa565b6101876101b2366004610cf8565b6103be565b60c95460ff1661012e565b610166600081565b6101667fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101876104da565b61020c610207366004610d22565b6104ec565b6040516001600160a01b03909116815260200161013a565b61012e610232366004610ccc565b61050b565b6101667f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b6101667f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b610166610293366004610c97565b610536565b6101876102a6366004610ccc565b61054d565b6101667f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b14806102f757506102f782610572565b92915050565b600082815260656020526040902060010154610318816105a7565b61032283836105b4565b505050565b6001600160a01b038116331461039c5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6103a682826105d6565b5050565b6103b460006105a7565b6103bc6105f8565b565b600054610100900460ff16158080156103de5750600054600160ff909116105b806103f85750303b1580156103f8575060005460ff166001145b61045b5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b6064820152608401610393565b6000805460ff19166001179055801561047e576000805461ff0019166101001790555b610488838361064a565b6104906106a6565b8015610322576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a1505050565b6104e460006105a7565b6103bc6106d5565b60008281526097602052604081206105049083610712565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60008181526097602052604081206102f79061071e565b600082815260656020526040902060010154610568816105a7565b61032283836105d6565b60006001600160e01b03198216637965db0b60e01b14806102f757506301ffc9a760e01b6001600160e01b03198316146102f7565b6105b18133610728565b50565b6105be828261078c565b60008281526097602052604090206103229082610812565b6105e08282610827565b6000828152609760205260409020610322908261088e565b6106006108a3565b60c9805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b600054610100900460ff166106715760405162461bcd60e51b815260040161039390610d44565b61067c6000836105b4565b6103a67f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929826105b4565b600054610100900460ff166106cd5760405162461bcd60e51b815260040161039390610d44565b6103bc6108ec565b6106dd61091f565b60c9805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a25861062d3390565b60006105048383610965565b60006102f7825490565b610732828261050b565b6103a65761074a816001600160a01b0316601461098f565b61075583602061098f565b604051602001610766929190610dbf565b60408051601f198184030181529082905262461bcd60e51b825261039391600401610e34565b610796828261050b565b6103a65760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556107ce3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610504836001600160a01b038416610b2b565b610831828261050b565b156103a65760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610504836001600160a01b038416610b7a565b60c95460ff166103bc5760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b6044820152606401610393565b600054610100900460ff166109135760405162461bcd60e51b815260040161039390610d44565b60c9805460ff19169055565b60c95460ff16156103bc5760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b6044820152606401610393565b600082600001828154811061097c5761097c610e67565b9060005260206000200154905092915050565b6060600061099e836002610e93565b6109a9906002610eb2565b67ffffffffffffffff8111156109c1576109c1610eca565b6040519080825280601f01601f1916602001820160405280156109eb576020820181803683370190505b509050600360fc1b81600081518110610a0657610a06610e67565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610a3557610a35610e67565b60200101906001600160f81b031916908160001a9053506000610a59846002610e93565b610a64906001610eb2565b90505b6001811115610adc576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610a9857610a98610e67565b1a60f81b828281518110610aae57610aae610e67565b60200101906001600160f81b031916908160001a90535060049490941c93610ad581610ee0565b9050610a67565b5083156105045760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610393565b6000818152600183016020526040812054610b72575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556102f7565b5060006102f7565b60008181526001830160205260408120548015610c63576000610b9e600183610ef7565b8554909150600090610bb290600190610ef7565b9050818114610c17576000866000018281548110610bd257610bd2610e67565b9060005260206000200154905080876000018481548110610bf557610bf5610e67565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610c2857610c28610f0e565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506102f7565b60009150506102f7565b600060208284031215610c7f57600080fd5b81356001600160e01b03198116811461050457600080fd5b600060208284031215610ca957600080fd5b5035919050565b80356001600160a01b0381168114610cc757600080fd5b919050565b60008060408385031215610cdf57600080fd5b82359150610cef60208401610cb0565b90509250929050565b60008060408385031215610d0b57600080fd5b610d1483610cb0565b9150610cef60208401610cb0565b60008060408385031215610d3557600080fd5b50508035926020909101359150565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60005b83811015610daa578181015183820152602001610d92565b83811115610db9576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351610df7816017850160208801610d8f565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610e28816028840160208801610d8f565b01602801949350505050565b6020815260008251806020840152610e53816040850160208701610d8f565b601f01601f19169190910160400192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610ead57610ead610e7d565b500290565b60008219821115610ec557610ec5610e7d565b500190565b634e487b7160e01b600052604160045260246000fd5b600081610eef57610eef610e7d565b506000190190565b600082821015610f0957610f09610e7d565b500390565b634e487b7160e01b600052603160045260246000fdfea264697066735822122089b56dd56544d4666ba88d2cf4e17744bd720247fd510402a21c9c78a86ad02664736f6c634300080e0033";

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
