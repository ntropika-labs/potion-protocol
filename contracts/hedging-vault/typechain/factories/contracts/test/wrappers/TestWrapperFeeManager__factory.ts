/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperFeeManager,
  TestWrapperFeeManagerInterface,
} from "../../../../contracts/test/wrappers/TestWrapperFeeManager";

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
    inputs: [
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
    ],
    name: "calculateManagementPayment",
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
        internalType: "uint256",
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "calculatePerformancePayment",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "managementFee_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "performanceFee_",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "feeReceipient_",
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
        internalType: "contract IERC20Upgradeable",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "payFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "payFeesETH",
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
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506119a0806100206000396000f3fe60806040526004361061016a5760003560e01c806376082a5e116100d15780639e3d87cd1161008a578063ca15c87311610064578063ca15c87314610454578063d547741f14610474578063f5b541a614610494578063fe56e232146104c857600080fd5b80639e3d87cd14610400578063a217fddf1461030e578063a378a3241461042057600080fd5b806376082a5e1461032357806384b7719a146103575780639010d07c1461037757806391d148541461039757806398c4f1ac146103b75780639c2b1a95146103eb57600080fd5b806336568abe1161012357806336568abe1461026e57806344ff7d281461028e5780634abd2b8c146102ae5780635ebc7507146102ce57806370897b23146102ee57806375b238fc1461030e57600080fd5b806301ffc9a714610176578063235c3603146101ab5780632374f6fb146101ca578063248a9ca3146101ec57806328a8317a1461021c5780632f2ff15d1461024e57600080fd5b3661017157005b600080fd5b34801561018257600080fd5b506101966101913660046114f8565b6104e8565b60405190151581526020015b60405180910390f35b3480156101b757600080fd5b5060ca545b6040519081526020016101a2565b3480156101d657600080fd5b506101ea6101e5366004611537565b610513565b005b3480156101f857600080fd5b506101bc61020736600461156c565b60009081526065602052604090206001015490565b34801561022857600080fd5b5060cb546001600160a01b03165b6040516001600160a01b0390911681526020016101a2565b34801561025a57600080fd5b506101ea610269366004611585565b610523565b34801561027a57600080fd5b506101ea610289366004611585565b610548565b34801561029a57600080fd5b506101bc6102a936600461156c565b6105cb565b3480156102ba57600080fd5b506101bc6102c936600461156c565b6105d6565b3480156102da57600080fd5b506101ea6102e93660046115b5565b6105e1565b3480156102fa57600080fd5b506101ea61030936600461156c565b6105eb565b34801561031a57600080fd5b506101bc600081565b34801561032f57600080fd5b506101bc7fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b34801561036357600080fd5b506101ea6103723660046115d7565b610601565b34801561038357600080fd5b506102366103923660046115b5565b610614565b3480156103a357600080fd5b506101966103b2366004611585565b610633565b3480156103c357600080fd5b506101bc7f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b3480156103f757600080fd5b5060c9546101bc565b34801561040c57600080fd5b506101ea61041b3660046115f4565b61065e565b34801561042c57600080fd5b506101bc7f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b34801561046057600080fd5b506101bc61046f36600461156c565b610780565b34801561048057600080fd5b506101ea61048f366004611585565b610797565b3480156104a057600080fd5b506101bc7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b3480156104d457600080fd5b506101ea6104e336600461156c565b6107bc565b60006001600160e01b03198216635a05180f60e01b148061050d575061050d826107cf565b92915050565b61051e838383610804565b505050565b60008281526065602052604090206001015461053e81610895565b61051e838361089f565b6001600160a01b03811633146105bd5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105c782826108c1565b5050565b600061050d826108e3565b600061050d826108fa565b6105c78282610911565b6105f56000610895565b6105fe81610999565b50565b61060b6000610895565b6105fe81610a4e565b600082815260976020526040812061062c9083610b08565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600054610100900460ff161580801561067e5750600054600160ff909116105b806106985750303b158015610698575060005460ff166001145b6106fb5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084016105b4565b6000805460ff19166001179055801561071e576000805461ff0019166101001790555b6107288586610b14565b610733848484610b70565b8015610779576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b600081815260976020526040812061050d90610bb2565b6000828152606560205260409020600101546107b281610895565b61051e83836108c1565b6107c66000610895565b6105fe81610bbc565b60006001600160e01b03198216637965db0b60e01b148061050d57506301ffc9a760e01b6001600160e01b031983161461050d565b600061080f836108e3565b9050600061081c836108fa565b60cb5460408051858152602081018490529293506001600160a01b03888116939216917f5241d2cb58e4448964f455d109aca8b485a5301cb9d9a0dc4da3ec6cc70e67c9910160405180910390a360cb54610779906001600160a01b03166108848385611654565b6001600160a01b0388169190610c68565b6105fe8133610cba565b6108a98282610d1e565b600082815260976020526040902061051e9082610da4565b6108cb8282610db9565b600082815260976020526040902061051e9082610e20565b600061050d60c95483610e3590919063ffffffff16565b600061050d60ca5483610e3590919063ffffffff16565b600061091c836108e3565b90506000610929836108fa565b60cb5460408051858152602081018490529293506001600160a01b03909116917f59f1b1b83406dc43f1ae9ce3dbdcfdd582378575079233e1e22543938fa55afa910160405180910390a26109936109818284611654565b60cb546001600160a01b031690610e62565b50505050565b6109a281610f7b565b610a085760405162461bcd60e51b815260206004820152603160248201527f506572666f726d616e636520666565206d757374206265206c6573732074686160448201527006e206f7220657175616c20746f2031303607c1b60648201526084016105b4565b60ca80549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd91015b60405180910390a15050565b60cb546001600160a01b0390811690821603610ab85760405162461bcd60e51b8152602060048201526024808201527f4665657320726563697069656e74206973207468652073616d65206173206265604482015263666f726560e01b60648201526084016105b4565b60cb80546001600160a01b0319166001600160a01b03831690811790915560405182919081907fc5d8512a1ce98ff41b33712f195414dde7fd3a1a996a15dafab8933d9d32084490600090a35050565b600061062c8383610f9d565b600054610100900460ff16610b3b5760405162461bcd60e51b81526004016105b49061166c565b610b4660008361089f565b6105c77f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b9298261089f565b600054610100900460ff16610b975760405162461bcd60e51b81526004016105b49061166c565b610ba083610bbc565b610ba982610999565b61051e81610a4e565b600061050d825490565b610bc581610f7b565b610c2a5760405162461bcd60e51b815260206004820152603060248201527f4d616e6167656d656e7420666565206d757374206265206c657373207468616e60448201526f0206f7220657175616c20746f203130360841b60648201526084016105b4565b60c980549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd9101610a42565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b17905261051e908490610fc7565b610cc48282610633565b6105c757610cdc816001600160a01b03166014611099565b610ce7836020611099565b604051602001610cf89291906116e3565b60408051601f198184030181529082905262461bcd60e51b82526105b491600401611758565b610d288282610633565b6105c75760008281526065602090815260408083206001600160a01b03851684529091529020805460ff19166001179055610d603390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061062c836001600160a01b038416611235565b610dc38282610633565b156105c75760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061062c836001600160a01b038416611284565b6000610e436006600a61186f565b610e4e90606461187b565b610e58838561187b565b61062c919061189a565b80471015610eb25760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016105b4565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610eff576040519150601f19603f3d011682016040523d82523d6000602084013e610f04565b606091505b505090508061051e5760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016105b4565b6000610f896006600a61186f565b610f9490606461187b565b90911115919050565b6000826000018281548110610fb457610fb46118bc565b9060005260206000200154905092915050565b600061101c826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166113779092919063ffffffff16565b80519091501561051e578080602001905181019061103a91906118d2565b61051e5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105b4565b606060006110a883600261187b565b6110b3906002611654565b67ffffffffffffffff8111156110cb576110cb6118f4565b6040519080825280601f01601f1916602001820160405280156110f5576020820181803683370190505b509050600360fc1b81600081518110611110576111106118bc565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061113f5761113f6118bc565b60200101906001600160f81b031916908160001a905350600061116384600261187b565b61116e906001611654565b90505b60018111156111e6576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106111a2576111a26118bc565b1a60f81b8282815181106111b8576111b86118bc565b60200101906001600160f81b031916908160001a90535060049490941c936111df8161190a565b9050611171565b50831561062c5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105b4565b600081815260018301602052604081205461127c5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561050d565b50600061050d565b6000818152600183016020526040812054801561136d5760006112a8600183611921565b85549091506000906112bc90600190611921565b90508181146113215760008660000182815481106112dc576112dc6118bc565b90600052602060002001549050808760000184815481106112ff576112ff6118bc565b6000918252602080832090910192909255918252600188019052604090208390555b855486908061133257611332611938565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061050d565b600091505061050d565b6060611386848460008561138e565b949350505050565b6060824710156113ef5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016105b4565b6001600160a01b0385163b6114465760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105b4565b600080866001600160a01b03168587604051611462919061194e565b60006040518083038185875af1925050503d806000811461149f576040519150601f19603f3d011682016040523d82523d6000602084013e6114a4565b606091505b50915091506114b48282866114bf565b979650505050505050565b606083156114ce57508161062c565b8251156114de5782518084602001fd5b8160405162461bcd60e51b81526004016105b49190611758565b60006020828403121561150a57600080fd5b81356001600160e01b03198116811461062c57600080fd5b6001600160a01b03811681146105fe57600080fd5b60008060006060848603121561154c57600080fd5b833561155781611522565b95602085013595506040909401359392505050565b60006020828403121561157e57600080fd5b5035919050565b6000806040838503121561159857600080fd5b8235915060208301356115aa81611522565b809150509250929050565b600080604083850312156115c857600080fd5b50508035926020909101359150565b6000602082840312156115e957600080fd5b813561062c81611522565b6000806000806080858703121561160a57600080fd5b843561161581611522565b93506020850135925060408501359150606085013561163381611522565b939692955090935050565b634e487b7160e01b600052601160045260246000fd5b600082198211156116675761166761163e565b500190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60005b838110156116d25781810151838201526020016116ba565b838111156109935750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161171b8160178501602088016116b7565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161174c8160288401602088016116b7565b01602801949350505050565b60208152600082518060208401526117778160408501602087016116b7565b601f01601f19169190910160400192915050565b600181815b808511156117c65781600019048211156117ac576117ac61163e565b808516156117b957918102915b93841c9390800290611790565b509250929050565b6000826117dd5750600161050d565b816117ea5750600061050d565b8160018114611800576002811461180a57611826565b600191505061050d565b60ff84111561181b5761181b61163e565b50506001821b61050d565b5060208310610133831016604e8410600b8410161715611849575081810a61050d565b611853838361178b565b80600019048211156118675761186761163e565b029392505050565b600061062c83836117ce565b60008160001904831182151516156118955761189561163e565b500290565b6000826118b757634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052603260045260246000fd5b6000602082840312156118e457600080fd5b8151801515811461062c57600080fd5b634e487b7160e01b600052604160045260246000fd5b6000816119195761191961163e565b506000190190565b6000828210156119335761193361163e565b500390565b634e487b7160e01b600052603160045260246000fd5b600082516119608184602087016116b7565b919091019291505056fea2646970667358221220ff93ab68ae58ac1cf28ab29cc0c8ff7688c597c6b74bc9c5fda3bf00c15aa5a664736f6c634300080e0033";

type TestWrapperFeeManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperFeeManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperFeeManager__factory extends ContractFactory {
  constructor(...args: TestWrapperFeeManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperFeeManager> {
    return super.deploy(overrides || {}) as Promise<TestWrapperFeeManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperFeeManager {
    return super.attach(address) as TestWrapperFeeManager;
  }
  override connect(signer: Signer): TestWrapperFeeManager__factory {
    return super.connect(signer) as TestWrapperFeeManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperFeeManagerInterface {
    return new utils.Interface(_abi) as TestWrapperFeeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperFeeManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperFeeManager;
  }
}
