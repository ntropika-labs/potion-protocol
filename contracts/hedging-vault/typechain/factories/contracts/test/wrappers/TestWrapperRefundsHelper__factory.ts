/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperRefundsHelper,
  TestWrapperRefundsHelperInterface,
} from "../../../../contracts/test/wrappers/TestWrapperRefundsHelper";

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
      {
        internalType: "address[]",
        name: "_cannotRefundToken",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "cannotRefundETH_",
        type: "bool",
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
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611725806100206000396000f3fe6080604052600436106101185760003560e01c806398c4f1ac116100a0578063d547741f11610064578063d547741f1461035c578063d869c75e1461037c578063e0933ff71461039c578063f5b541a6146103b5578063fcc02532146103e957600080fd5b806398c4f1ac1461029a578063a217fddf146101f9578063a378a324146102ce578063ca15c87314610302578063d233e4eb1461032257600080fd5b80634154aede116100e75780634154aede146101d957806375b238fc146101f957806376082a5e1461020e5780639010d07c1461024257806391d148541461027a57600080fd5b806301ffc9a714610124578063248a9ca3146101595780632f2ff15d1461019757806336568abe146101b957600080fd5b3661011f57005b600080fd5b34801561013057600080fd5b5061014461013f3660046111e6565b610409565b60405190151581526020015b60405180910390f35b34801561016557600080fd5b50610189610174366004611210565b60009081526065602052604090206001015490565b604051908152602001610150565b3480156101a357600080fd5b506101b76101b2366004611249565b610434565b005b3480156101c557600080fd5b506101b76101d4366004611249565b61045e565b3480156101e557600080fd5b506101b76101f4366004611279565b6104e1565b34801561020557600080fd5b50610189600081565b34801561021a57600080fd5b506101897fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b34801561024e57600080fd5b5061026261025d3660046112bb565b610585565b6040516001600160a01b039091168152602001610150565b34801561028657600080fd5b50610144610295366004611249565b6105a4565b3480156102a657600080fd5b506101897f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b3480156102da57600080fd5b506101897f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b34801561030e57600080fd5b5061018961031d366004611210565b6105cf565b34801561032e57600080fd5b5061014461033d3660046112dd565b6001600160a01b0316600090815260c9602052604090205460ff161590565b34801561036857600080fd5b506101b7610377366004611249565b6105e6565b34801561038857600080fd5b506101b7610397366004611249565b61060b565b3480156103a857600080fd5b5060ca5460ff1615610144565b3480156103c157600080fd5b506101897f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b3480156103f557600080fd5b506101b7610404366004611329565b61069a565b60006001600160e01b03198216635a05180f60e01b148061042e575061042e82610721565b92915050565b60008281526065602052604090206001015461044f81610756565b6104598383610763565b505050565b6001600160a01b03811633146104d35760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6104dd8282610785565b5050565b6104eb6000610756565b6001600160a01b038316600090815260c9602052604090205460ff16156105545760405162461bcd60e51b815260206004820152601860248201527f546f6b656e2063616e6e6f7420626520726566756e646564000000000000000060448201526064016104ca565b6001600160a01b03811661057a5760405162461bcd60e51b81526004016104ca90611439565b6104598382846107a7565b600082815260976020526040812061059d90836107f9565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600081815260976020526040812061042e90610805565b60008281526065602052604090206001015461060181610756565b6104598383610785565b6106156000610756565b60ca5460ff16156106615760405162461bcd60e51b81526020600482015260166024820152751155120818d85b9b9bdd081899481c99599d5b99195960521b60448201526064016104ca565b6001600160a01b0381166106875760405162461bcd60e51b81526004016104ca90611439565b6104dd6001600160a01b0382168361080f565b60006106a66001610928565b905080156106be576000805461ff0019166101001790555b6106c98686866109b5565b6106d38383610a43565b8015610719576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b505050505050565b60006001600160e01b03198216637965db0b60e01b148061042e57506301ffc9a760e01b6001600160e01b031983161461042e565b6107608133610ae7565b50565b61076d8282610b4b565b60008281526097602052604090206104599082610bd1565b61078f8282610be6565b60008281526097602052604090206104599082610c4d565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b179052610459908490610c62565b600061059d8383610d34565b600061042e825490565b8047101561085f5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016104ca565b6000826001600160a01b03168260405160006040518083038185875af1925050503d80600081146108ac576040519150601f19603f3d011682016040523d82523d6000602084013e6108b1565b606091505b50509050806104595760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016104ca565b60008054610100900460ff161561096f578160ff16600114801561094b5750303b155b6109675760405162461bcd60e51b81526004016104ca90611485565b506000919050565b60005460ff8084169116106109965760405162461bcd60e51b81526004016104ca90611485565b506000805460ff191660ff92909216919091179055600190565b919050565b600054610100900460ff166109dc5760405162461bcd60e51b81526004016104ca906114d3565b6109e4610d5e565b6109ef600084610763565b610a197f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb083610763565b6104597f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92982610763565b600054610100900460ff16610a6a5760405162461bcd60e51b81526004016104ca906114d3565b60005b8251811015610ad257600160c96000858481518110610a8e57610a8e61151e565b6020908102919091018101516001600160a01b03168252810191909152604001600020805460ff191691151591909117905580610aca8161154a565b915050610a6d565b5060ca805460ff191691151591909117905550565b610af182826105a4565b6104dd57610b09816001600160a01b03166014610d87565b610b14836020610d87565b604051602001610b25929190611593565b60408051601f198184030181529082905262461bcd60e51b82526104ca91600401611608565b610b5582826105a4565b6104dd5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610b8d3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061059d836001600160a01b038416610f23565b610bf082826105a4565b156104dd5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061059d836001600160a01b038416610f72565b6000610cb7826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166110659092919063ffffffff16565b8051909150156104595780806020019051810190610cd5919061163b565b6104595760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016104ca565b6000826000018281548110610d4b57610d4b61151e565b9060005260206000200154905092915050565b600054610100900460ff16610d855760405162461bcd60e51b81526004016104ca906114d3565b565b60606000610d96836002611658565b610da1906002611677565b67ffffffffffffffff811115610db957610db96112fa565b6040519080825280601f01601f191660200182016040528015610de3576020820181803683370190505b509050600360fc1b81600081518110610dfe57610dfe61151e565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110610e2d57610e2d61151e565b60200101906001600160f81b031916908160001a9053506000610e51846002611658565b610e5c906001611677565b90505b6001811115610ed4576f181899199a1a9b1b9c1cb0b131b232b360811b85600f1660108110610e9057610e9061151e565b1a60f81b828281518110610ea657610ea661151e565b60200101906001600160f81b031916908160001a90535060049490941c93610ecd8161168f565b9050610e5f565b50831561059d5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016104ca565b6000818152600183016020526040812054610f6a5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561042e565b50600061042e565b6000818152600183016020526040812054801561105b576000610f966001836116a6565b8554909150600090610faa906001906116a6565b905081811461100f576000866000018281548110610fca57610fca61151e565b9060005260206000200154905080876000018481548110610fed57610fed61151e565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080611020576110206116bd565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061042e565b600091505061042e565b6060611074848460008561107c565b949350505050565b6060824710156110dd5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016104ca565b6001600160a01b0385163b6111345760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016104ca565b600080866001600160a01b0316858760405161115091906116d3565b60006040518083038185875af1925050503d806000811461118d576040519150601f19603f3d011682016040523d82523d6000602084013e611192565b606091505b50915091506111a28282866111ad565b979650505050505050565b606083156111bc57508161059d565b8251156111cc5782518084602001fd5b8160405162461bcd60e51b81526004016104ca9190611608565b6000602082840312156111f857600080fd5b81356001600160e01b03198116811461059d57600080fd5b60006020828403121561122257600080fd5b5035919050565b6001600160a01b038116811461076057600080fd5b80356109b081611229565b6000806040838503121561125c57600080fd5b82359150602083013561126e81611229565b809150509250929050565b60008060006060848603121561128e57600080fd5b833561129981611229565b92506020840135915060408401356112b081611229565b809150509250925092565b600080604083850312156112ce57600080fd5b50508035926020909101359150565b6000602082840312156112ef57600080fd5b813561059d81611229565b634e487b7160e01b600052604160045260246000fd5b801515811461076057600080fd5b80356109b081611310565b600080600080600060a0868803121561134157600080fd5b853561134c81611229565b945060208681013561135d81611229565b9450604087013561136d81611229565b9350606087013567ffffffffffffffff8082111561138a57600080fd5b818901915089601f83011261139e57600080fd5b8135818111156113b0576113b06112fa565b8060051b604051601f19603f830116810181811085821117156113d5576113d56112fa565b60405291825284820192508381018501918c8311156113f357600080fd5b938501935b82851015611418576114098561123e565b845293850193928501926113f8565b80975050505050505061142d6080870161131e565b90509295509295909350565b6020808252602c908201527f526563697069656e7420616464726573732063616e6e6f74206265207468652060408201526b6e756c6c206164647265737360a01b606082015260800190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001820161155c5761155c611534565b5060010190565b60005b8381101561157e578181015183820152602001611566565b8381111561158d576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516115cb816017850160208801611563565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516115fc816028840160208801611563565b01602801949350505050565b6020815260008251806020840152611627816040850160208701611563565b601f01601f19169190910160400192915050565b60006020828403121561164d57600080fd5b815161059d81611310565b600081600019048311821515161561167257611672611534565b500290565b6000821982111561168a5761168a611534565b500190565b60008161169e5761169e611534565b506000190190565b6000828210156116b8576116b8611534565b500390565b634e487b7160e01b600052603160045260246000fd5b600082516116e5818460208701611563565b919091019291505056fea2646970667358221220668254673054f4a50aaf7f17ce0109798aed498e3443cb266288ff471effe0c864736f6c634300080e0033";

type TestWrapperRefundsHelperConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperRefundsHelperConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperRefundsHelper__factory extends ContractFactory {
  constructor(...args: TestWrapperRefundsHelperConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperRefundsHelper> {
    return super.deploy(overrides || {}) as Promise<TestWrapperRefundsHelper>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperRefundsHelper {
    return super.attach(address) as TestWrapperRefundsHelper;
  }
  override connect(signer: Signer): TestWrapperRefundsHelper__factory {
    return super.connect(signer) as TestWrapperRefundsHelper__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperRefundsHelperInterface {
    return new utils.Interface(_abi) as TestWrapperRefundsHelperInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperRefundsHelper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperRefundsHelper;
  }
}