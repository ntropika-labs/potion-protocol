/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MarginPool,
  MarginPoolInterface,
} from "../../../../gamma-protocol/contracts/core/MarginPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_addressBook",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AssetFarmed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "FarmerUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransferToPool",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TransferToUser",
    type: "event",
  },
  {
    inputs: [],
    name: "addressBook",
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
        internalType: "address[]",
        name: "_asset",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_user",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amount",
        type: "uint256[]",
      },
    ],
    name: "batchTransferToPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_asset",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_user",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amount",
        type: "uint256[]",
      },
    ],
    name: "batchTransferToUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "farm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "farmer",
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
        name: "_asset",
        type: "address",
      },
    ],
    name: "getStoredBalance",
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
    name: "owner",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_farmer",
        type: "address",
      },
    ],
    name: "setFarmer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferToPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferToUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161175e38038061175e8339818101604052602081101561003357600080fd5b505160006100486001600160e01b0361011216565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a3506001600160a01b0381166100ed576040805162461bcd60e51b815260206004820152601460248201527f496e76616c6964206164647265737320626f6f6b000000000000000000000000604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055610116565b3390565b611639806101256000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c8063d811fcf011610071578063d811fcf01461049f578063dd2c99f7146104a7578063e2ed781c146104dd578063f2fde38b14610503578063f5887cdd14610529578063fa93b2a514610531576100b4565b80634979cd14146100b9578063715018a61461026057806386a19c5e146102685780638da5cb5b1461040d578063baf46ba614610431578063c595b00714610467575b600080fd5b61025e600480360360608110156100cf57600080fd5b810190602081018135600160201b8111156100e957600080fd5b8201836020820111156100fb57600080fd5b803590602001918460208302840111600160201b8311171561011c57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561016b57600080fd5b82018360208201111561017d57600080fd5b803590602001918460208302840111600160201b8311171561019e57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b8111156101ed57600080fd5b8201836020820111156101ff57600080fd5b803590602001918460208302840111600160201b8311171561022057600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610567945050505050565b005b61025e6106d2565b61025e6004803603606081101561027e57600080fd5b810190602081018135600160201b81111561029857600080fd5b8201836020820111156102aa57600080fd5b803590602001918460208302840111600160201b831117156102cb57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561031a57600080fd5b82018360208201111561032c57600080fd5b803590602001918460208302840111600160201b8311171561034d57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295949360208101935035915050600160201b81111561039c57600080fd5b8201836020820111156103ae57600080fd5b803590602001918460208302840111600160201b831117156103cf57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610786945050505050565b6104156108eb565b604080516001600160a01b039092168252519081900360200190f35b61025e6004803603606081101561044757600080fd5b506001600160a01b038135811691602081013590911690604001356108fa565b61048d6004803603602081101561047d57600080fd5b50356001600160a01b0316610aea565b60408051918252519081900360200190f35b610415610b05565b61025e600480360360608110156104bd57600080fd5b506001600160a01b03813581169160208101359091169060400135610b14565b61025e600480360360208110156104f357600080fd5b50356001600160a01b0316610cba565b61025e6004803603602081101561051957600080fd5b50356001600160a01b0316610d80565b610415610e8a565b61025e6004803603606081101561054757600080fd5b506001600160a01b03813581169160208101359091169060400135610e99565b600160009054906101000a90046001600160a01b03166001600160a01b0316633018205f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156105b557600080fd5b505afa1580156105c9573d6000803e3d6000fd5b505050506040513d60208110156105df57600080fd5b50516001600160a01b031633146106275760405162461bcd60e51b81526004018080602001828103825260248152602001806114c76024913960400191505060405180910390fd5b81518351148015610639575080518251145b6106745760405162461bcd60e51b815260040180806020018281038252603b815260200180611540603b913960400191505060405180910390fd5b60005b83518110156106cc576106c484828151811061068f57fe5b60200260200101518483815181106106a357fe5b60200260200101518484815181106106b757fe5b6020026020010151610b14565b600101610677565b50505050565b6106da611047565b6000546001600160a01b0390811691161461073c576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b600160009054906101000a90046001600160a01b03166001600160a01b0316633018205f6040518163ffffffff1660e01b815260040160206040518083038186803b1580156107d457600080fd5b505afa1580156107e8573d6000803e3d6000fd5b505050506040513d60208110156107fe57600080fd5b50516001600160a01b031633146108465760405162461bcd60e51b81526004018080602001828103825260248152602001806114c76024913960400191505060405180910390fd5b81518351148015610858575080518251145b6108935760405162461bcd60e51b815260040180806020018281038252603b8152602001806115c9603b913960400191505060405180910390fd5b60005b83518110156106cc576108e38482815181106108ae57fe5b60200260200101518483815181106108c257fe5b60200260200101518484815181106108d657fe5b6020026020010151610e99565b600101610896565b6000546001600160a01b031690565b6002546001600160a01b03163314610959576040805162461bcd60e51b815260206004820181905260248201527f4d617267696e506f6f6c3a2053656e646572206973206e6f74206661726d6572604482015290519081900360640190fd5b6001600160a01b03821661099e5760405162461bcd60e51b815260040180806020018281038252602481526020018061157b6024913960400191505060405180910390fd5b604080516370a0823160e01b815230600482015290516000916001600160a01b038616916370a0823191602480820192602092909190829003018186803b1580156109e857600080fd5b505afa1580156109fc573d6000803e3d6000fd5b505050506040513d6020811015610a1257600080fd5b50516001600160a01b038516600090815260036020526040902054909150610a40828263ffffffff61104b16565b831115610a7e5760405162461bcd60e51b81526004018080602001828103825260288152602001806115186028913960400191505060405180910390fd5b610a986001600160a01b038616858563ffffffff61109416565b836001600160a01b0316856001600160a01b03167f2bfce9f5efc2d7cd579270748ddf9d23bc6c0af5193a2759314c2300af9956b1856040518082815260200191505060405180910390a35050505050565b6001600160a01b031660009081526003602052604090205490565b6002546001600160a01b031681565b600160009054906101000a90046001600160a01b03166001600160a01b0316633018205f6040518163ffffffff1660e01b815260040160206040518083038186803b158015610b6257600080fd5b505afa158015610b76573d6000803e3d6000fd5b505050506040513d6020811015610b8c57600080fd5b50516001600160a01b03163314610bd45760405162461bcd60e51b81526004018080602001828103825260248152602001806114c76024913960400191505060405180910390fd5b60008111610c135760405162461bcd60e51b815260040180806020018281038252602f815260200180611472602f913960400191505060405180910390fd5b6001600160a01b038316600090815260036020526040902054610c3c908263ffffffff6110eb16565b6001600160a01b038416600081815260036020526040902091909155610c6a9083308463ffffffff61114516565b816001600160a01b0316836001600160a01b03167f9b4f8cdd00ca1dad21e1b00707351fe747dd74738cf95f60f66518c52c35e645836040518082815260200191505060405180910390a3505050565b610cc2611047565b6000546001600160a01b03908116911614610d24576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6002546040516001600160a01b038084169216907fec2062989428d4fc69d3ba2664807361f4647daf215450588331bbe51efb6a6890600090a3600280546001600160a01b0319166001600160a01b0392909216919091179055565b610d88611047565b6000546001600160a01b03908116911614610dea576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038116610e2f5760405162461bcd60e51b81526004018080602001828103825260268152602001806114a16026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b6001546001600160a01b031681565b600160009054906101000a90046001600160a01b03166001600160a01b0316633018205f6040518163ffffffff1660e01b815260040160206040518083038186803b158015610ee757600080fd5b505afa158015610efb573d6000803e3d6000fd5b505050506040513d6020811015610f1157600080fd5b50516001600160a01b03163314610f595760405162461bcd60e51b81526004018080602001828103825260248152602001806114c76024913960400191505060405180910390fd5b6001600160a01b038216301415610fa15760405162461bcd60e51b815260040180806020018281038252602d8152602001806114eb602d913960400191505060405180910390fd5b6001600160a01b038316600090815260036020526040902054610fca908263ffffffff61104b16565b6001600160a01b038416600081815260036020526040902091909155610ff790838363ffffffff61109416565b816001600160a01b0316836001600160a01b03167f2d6ff46a316ec627f7677daafa6ad7d6f36bcf938c5f47bf6e671b09d27b415f836040518082815260200191505060405180910390a3505050565b3390565b600061108d83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525061119f565b9392505050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b1790526110e6908490611236565b505050565b60008282018381101561108d576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b604080516001600160a01b0380861660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b1790526106cc908590611236565b6000818484111561122e5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b838110156111f35781810151838201526020016111db565b50505050905090810190601f1680156112205780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b606061128b826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166112e79092919063ffffffff16565b8051909150156110e6578080602001905160208110156112aa57600080fd5b50516110e65760405162461bcd60e51b815260040180806020018281038252602a81526020018061159f602a913960400191505060405180910390fd5b60606112f684846000856112fe565b949350505050565b60606113098561146b565b61135a576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b60006060866001600160a01b031685876040518082805190602001908083835b602083106113995780518252601f19909201916020918201910161137a565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d80600081146113fb576040519150601f19603f3d011682016040523d82523d6000602084013e611400565b606091505b509150915081156114145791506112f69050565b8051156114245780518082602001fd5b60405162461bcd60e51b81526020600482018181528651602484015286518793919283926044019190850190808383600083156111f35781810151838201526020016111db565b3b15159056fe4d617267696e506f6f6c3a207472616e73666572546f506f6f6c20616d6f756e7420697320657175616c20746f20304f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734d617267696e506f6f6c3a2053656e646572206973206e6f7420436f6e74726f6c6c65724d617267696e506f6f6c3a2063616e6e6f74207472616e736665722061737365747320746f206f6e6573656c664d617267696e506f6f6c3a20616d6f756e7420746f206661726d2065786365656473206c696d69744d617267696e506f6f6c3a2062617463685472616e73666572546f506f6f6c206172726179206c656e6774687320617265206e6f7420657175616c4d617267696e506f6f6c3a20696e76616c696420726563656976657220616464726573735361666545524332303a204552433230206f7065726174696f6e20646964206e6f7420737563636565644d617267696e506f6f6c3a2062617463685472616e73666572546f55736572206172726179206c656e6774687320617265206e6f7420657175616ca264697066735822122093303553717c123567ee9b3768804f10e68c9b8e221c8640262bac4f1950886f64736f6c634300060a0033";

type MarginPoolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MarginPoolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MarginPool__factory extends ContractFactory {
  constructor(...args: MarginPoolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _addressBook: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MarginPool> {
    return super.deploy(_addressBook, overrides || {}) as Promise<MarginPool>;
  }
  override getDeployTransaction(
    _addressBook: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_addressBook, overrides || {});
  }
  override attach(address: string): MarginPool {
    return super.attach(address) as MarginPool;
  }
  override connect(signer: Signer): MarginPool__factory {
    return super.connect(signer) as MarginPool__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MarginPoolInterface {
    return new utils.Interface(_abi) as MarginPoolInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MarginPool {
    return new Contract(address, _abi, signerOrProvider) as MarginPool;
  }
}
