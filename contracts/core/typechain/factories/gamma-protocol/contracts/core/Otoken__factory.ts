/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Otoken,
  OtokenInterface,
} from "../../../../gamma-protocol/contracts/core/Otoken";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnOtoken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "collateralAsset",
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
    name: "controller",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "expiryTimestamp",
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
    name: "getOtokenDetails",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addressBook",
        type: "address",
      },
      {
        internalType: "address",
        name: "_underlyingAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_strikeAsset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_collateralAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_strikePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isPut",
        type: "bool",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isPut",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mintOtoken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
    ],
    name: "nonces",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strikeAsset",
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
    name: "strikePrice",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "underlyingAsset",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612f89806100206000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c80637ecebe00116100de578063af0968fc11610097578063dd62ed3e11610071578063dd62ed3e146104bc578063f3c274a6146104ea578063f630df34146104f2578063f77c47911461054657610173565b8063af0968fc14610419578063c52987cf14610463578063d505accf1461046b57610173565b80637ecebe001461038357806395d89b41146103a9578063a457c2d7146103b1578063a9059cbb146103dd578063aabaecd614610409578063ade6e2aa1461041157610173565b80633644e515116101305780633644e515146102c757806339509351146102cf57806351b0a410146102fb57806356d878f71461032957806370a08231146103555780637158da7c1461037b57610173565b806306fdde0314610178578063095ea7b3146101f557806317d69bc81461023557806318160ddd1461025957806323b872dd14610273578063313ce567146102a9575b600080fd5b61018061054e565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101ba5781810151838201526020016101a2565b50505050905090810190601f1680156101e75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6102216004803603604081101561020b57600080fd5b506001600160a01b0381351690602001356105e5565b604080519115158252519081900360200190f35b61023d610602565b604080516001600160a01b039092168252519081900360200190f35b610261610612565b60408051918252519081900360200190f35b6102216004803603606081101561028957600080fd5b506001600160a01b03813581169160208101359091169060400135610618565b6102b16106a5565b6040805160ff9092168252519081900360200190f35b6102616106ae565b610221600480360360408110156102e557600080fd5b506001600160a01b0381351690602001356106bd565b6103276004803603604081101561031157600080fd5b506001600160a01b038135169060200135610711565b005b6103276004803603604081101561033f57600080fd5b506001600160a01b038135169060200135610768565b6102616004803603602081101561036b57600080fd5b50356001600160a01b03166107bb565b61023d6107da565b6102616004803603602081101561039957600080fd5b50356001600160a01b03166107e9565b610180610810565b610221600480360360408110156103c757600080fd5b506001600160a01b038135169060200135610871565b610221600480360360408110156103f357600080fd5b506001600160a01b0381351690602001356108df565b61023d6108f3565b610261610903565b61042161090a565b604080516001600160a01b039788168152958716602087015293909516848401526060840191909152608083015291151560a082015290519081900360c00190f35b610261610940565b610327600480360360e081101561048157600080fd5b506001600160a01b03813581169160208101359091169060408101359060608101359060ff6080820135169060a08101359060c00135610947565b610261600480360360408110156104d257600080fd5b506001600160a01b0381358116916020013516610adf565b610221610b0a565b610327600480360360e081101561050857600080fd5b506001600160a01b0381358116916020810135821691604082013581169160608101359091169060808101359060a08101359060c001351515610b14565b61023d610cb4565b60688054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105da5780601f106105af576101008083540402835291602001916105da565b820191906000526020600020905b8154815290600101906020018083116105bd57829003601f168201915b505050505090505b90565b60006105f96105f2610cc3565b8484610cc7565b50600192915050565b610100546001600160a01b031681565b60675490565b6000610625848484610db3565b61069b84610631610cc3565b61069685604051806060016040528060288152602001612e6f602891396001600160a01b038a1660009081526066602052604081209061066f610cc3565b6001600160a01b03168152602081019190915260400160002054919063ffffffff610f1c16565b610cc7565b5060019392505050565b606a5460ff1690565b60006106b8610fb3565b905090565b60006105f96106ca610cc3565b8461069685606660006106db610cc3565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff610fe616565b60fe546001600160a01b0316331461075a5760405162461bcd60e51b8152600401808060200182810382526028815260200180612df56028913960400191505060405180910390fd5b6107648282611047565b5050565b60fe546001600160a01b031633146107b15760405162461bcd60e51b8152600401808060200182810382526028815260200180612d596028913960400191505060405180910390fd5b6107648282611145565b6001600160a01b0381166000908152606560205260409020545b919050565b60ff546001600160a01b031681565b6001600160a01b038116600090815260cb6020526040812061080a9061124d565b92915050565b60698054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105da5780601f106105af576101008083540402835291602001916105da565b60006105f961087e610cc3565b8461069685604051806060016040528060258152602001612f2f60259139606660006108a8610cc3565b6001600160a01b03908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff610f1c16565b60006105f96108ec610cc3565b8484610db3565b610101546001600160a01b031681565b6101035481565b6101015460ff8054610100546101025461010354610104546001600160a01b039687169794871696909316949193909290911690565b6101025481565b8342111561099c576040805162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e65000000604482015290519081900360640190fd5b600060cc548888886109d160cb60008e6001600160a01b03166001600160a01b0316815260200190815260200160002061124d565b604080516020808201979097526001600160a01b0395861681830152939094166060840152608083019190915260a082015260c08082018990528251808303909101815260e0909101909152805191012090506000610a2f82611251565b90506000610a3f8287878761129d565b9050896001600160a01b0316816001600160a01b031614610aa7576040805162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e61747572650000604482015290519081900360640190fd5b6001600160a01b038a16600090815260cb60205260409020610ac890611417565b610ad38a8a8a610cc7565b50505050505050505050565b6001600160a01b03918216600090815260666020908152604080832093909416825291909152205490565b6101045460ff1681565b600054610100900460ff1680610b2d5750610b2d611420565b80610b3b575060005460ff16155b610b765760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff16158015610ba1576000805460ff1961ff0019909116610100171660011790555b876001600160a01b0316633018205f6040518163ffffffff1660e01b815260040160206040518083038186803b158015610bda57600080fd5b505afa158015610bee573d6000803e3d6000fd5b505050506040513d6020811015610c0457600080fd5b505160fe80546001600160a01b03199081166001600160a01b039384161790915560ff805482168a8416179055610100805482168984161790556101018054909116918716919091179055610102849055610103839055610104805460ff1916831515179055606080610c75611426565b91509150610c838282611dd9565b610c8c82611eb2565b610c966008611f88565b50508015610caa576000805461ff00191690555b5050505050505050565b60fe546001600160a01b031681565b3390565b6001600160a01b038316610d0c5760405162461bcd60e51b8152600401808060200182810382526024815260200180612f0b6024913960400191505060405180910390fd5b6001600160a01b038216610d515760405162461bcd60e51b8152600401808060200182810382526022815260200180612cef6022913960400191505060405180910390fd5b6001600160a01b03808416600081815260666020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b038316610df85760405162461bcd60e51b8152600401808060200182810382526025815260200180612ee66025913960400191505060405180910390fd5b6001600160a01b038216610e3d5760405162461bcd60e51b8152600401808060200182810382526023815260200180612caa6023913960400191505060405180910390fd5b610e48838383611ead565b610e8b81604051806060016040528060268152602001612d11602691396001600160a01b038616600090815260656020526040902054919063ffffffff610f1c16565b6001600160a01b038085166000908152606560205260408082209390935590841681522054610ec0908263ffffffff610fe616565b6001600160a01b0380841660008181526065602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610fab5760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610f70578181015183820152602001610f58565b50505050905090810190601f168015610f9d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b60006106b86040518080612e1d6052913960520190506040518091039020610fd9611f9e565b610fe1611fa4565b611faa565b600082820183811015611040576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b6001600160a01b0382166110a2576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b6110ae60008383611ead565b6067546110c1908263ffffffff610fe616565b6067556001600160a01b0382166000908152606560205260409020546110ed908263ffffffff610fe616565b6001600160a01b03831660008181526065602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b6001600160a01b03821661118a5760405162461bcd60e51b8152600401808060200182810382526021815260200180612ec56021913960400191505060405180910390fd5b61119682600083611ead565b6111d981604051806060016040528060228152602001612ccd602291396001600160a01b038516600090815260656020526040902054919063ffffffff610f1c16565b6001600160a01b038316600090815260656020526040902055606754611205908263ffffffff61200016565b6067556040805182815290516000916001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a35050565b5490565b600061125b610fb3565b82604051602001808061190160f01b81525060020183815260200182815260200192505050604051602081830303815290604052805190602001209050919050565b60007f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08211156112fe5760405162461bcd60e51b8152600401808060200182810382526022815260200180612d376022913960400191505060405180910390fd5b8360ff16601b148061131357508360ff16601c145b61134e5760405162461bcd60e51b8152600401808060200182810382526022815260200180612dd36022913960400191505060405180910390fd5b604080516000808252602080830180855289905260ff88168385015260608301879052608083018690529251909260019260a080820193601f1981019281900390910190855afa1580156113a6573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661140e576040805162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015290519081900360640190fd5b95945050505050565b80546001019055565b303b1590565b606080606060ff60009054906101000a90046001600160a01b03166001600160a01b03166395d89b416040518163ffffffff1660e01b815260040160006040518083038186803b15801561147957600080fd5b505afa15801561148d573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405260208110156114b657600080fd5b81019080805160405193929190846401000000008211156114d657600080fd5b9083019060208201858111156114eb57600080fd5b825164010000000081118282018810171561150557600080fd5b82525081516020918201929091019080838360005b8381101561153257818101518382015260200161151a565b50505050905090810190601f16801561155f5780820380516001836020036101000a031916815260200191505b506040818152610100546395d89b4160e01b835290519596506060956001600160a01b0390911694506395d89b41935060048083019350600092829003018186803b1580156115ad57600080fd5b505afa1580156115c1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405260208110156115ea57600080fd5b810190808051604051939291908464010000000082111561160a57600080fd5b90830190602082018581111561161f57600080fd5b825164010000000081118282018810171561163957600080fd5b82525081516020918201929091019080838360005b8381101561166657818101518382015260200161164e565b50505050905090810190601f1680156116935780820380516001836020036101000a031916815260200191505b506040818152610101546395d89b4160e01b835290519596506060956001600160a01b0390911694506395d89b41935060048083019350600092829003018186803b1580156116e157600080fd5b505afa1580156116f5573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052602081101561171e57600080fd5b810190808051604051939291908464010000000082111561173e57600080fd5b90830190602082018581111561175357600080fd5b825164010000000081118282018810171561176d57600080fd5b82525081516020918201929091019080838360005b8381101561179a578181015183820152602001611782565b50505050905090810190601f1680156117c75780820380516001836020036101000a031916815260200191505b50604052505050905060606117de61010254612042565b905060008060006117f1610103546121b4565b610104549295509093509150606090819061180e9060ff166121d3565b9150915060608061181e8661225c565b915091508a8a61182d876125f4565b836118378b612697565b8c888f6040516020018089805190602001908083835b6020831061186c5780518252601f19909201916020918201910161184d565b51815160209384036101000a60001901801990921691161790528b5191909301928b0191508083835b602083106118b45780518252601f199092019160209182019101611895565b6001836020036101000a03801982511681845116808217855250505050505090500180600160fd1b81525060010187805190602001908083835b6020831061190d5780518252601f1990920191602091820191016118ee565b6001836020036101000a03801982511681845116808217855250505050505090500180602d60f81b81525060010186805190602001908083835b602083106119665780518252601f199092019160209182019101611947565b6001836020036101000a03801982511681845116808217855250505050505090500180602d60f81b81525060010185805190602001908083835b602083106119bf5780518252601f1990920191602091820191016119a0565b6001836020036101000a03801982511681845116808217855250505050505090500180600160fd1b81525060010184805190602001908083835b60208310611a185780518252601f1990920191602091820191016119f9565b51815160209384036101000a600019018019909216911617905286519190930192860191508083835b60208310611a605780518252601f199092019160209182019101611a41565b6001836020036101000a03801982511681845116808217855250505050505090500180600160fd1b81525060010182805190602001908083835b60208310611ab95780518252601f199092019160209182019101611a9a565b6001836020036101000a038019825116818451168082178552505050505050905001806a0810dbdb1b185d195c985b60aa1b815250600b01985050505050505050506040516020818303038152906040529c508a8a8a611b18886125f4565b85611b228c6125f4565b8d8a6040516020018080606f60f81b81525060010189805190602001908083835b60208310611b625780518252601f199092019160209182019101611b43565b51815160209384036101000a60001901801990921691161790528b5191909301928b0191508083835b60208310611baa5780518252601f199092019160209182019101611b8b565b6001836020036101000a03801982511681845116808217855250505050505090500180602f60f81b81525060010187805190602001908083835b60208310611c035780518252601f199092019160209182019101611be4565b6001836020036101000a03801982511681845116808217855250505050505090500180602d60f81b81525060010186805190602001908083835b60208310611c5c5780518252601f199092019160209182019101611c3d565b51815160209384036101000a600019018019909216911617905288519190930192880191508083835b60208310611ca45780518252601f199092019160209182019101611c85565b51815160209384036101000a600019018019909216911617905287519190930192870191508083835b60208310611cec5780518252601f199092019160209182019101611ccd565b6001836020036101000a03801982511681845116808217855250505050505090500180602d60f81b81525060010183805190602001908083835b60208310611d455780518252601f199092019160209182019101611d26565b51815160209384036101000a600019018019909216911617905285519190930192850191508083835b60208310611d8d5780518252601f199092019160209182019101611d6e565b6001836020036101000a038019825116818451168082178552505050505050905001985050505050505050506040516020818303038152906040529b5050505050505050505050509091565b600054610100900460ff1680611df25750611df2611420565b80611e00575060005460ff16155b611e3b5760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff16158015611e66576000805460ff1961ff0019909116610100171660011790555b8251611e79906068906020860190612c11565b508151611e8d906069906020850190612c11565b50606a805460ff191660121790558015611ead576000805461ff00191690555b505050565b600054610100900460ff1680611ecb5750611ecb611420565b80611ed9575060005460ff16155b611f145760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff16158015611f3f576000805460ff1961ff0019909116610100171660011790555b611f47612772565b611f6a82604051806040016040528060018152602001603160f81b815250612814565b611f73826128d4565b8015610764576000805461ff00191690555050565b606a805460ff191660ff92909216919091179055565b60975490565b60985490565b6000838383611fb7612991565b6040805160208082019690965280820194909452606084019290925260808301523060a0808401919091528151808403909101815260c090920190528051910120949350505050565b600061104083836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610f1c565b6060600061205a836305f5e10063ffffffff61299516565b90506000612072846305f5e10063ffffffff6129d716565b9050606061207f82612697565b9050826120905792506107d5915050565b60005b6120a484600a63ffffffff61299516565b6120b657600a84049350600101612093565b80600803600a0a8401935060606120cc85612697565b90506120de8160016009859003612a19565b9050606083826040516020018083805190602001908083835b602083106121165780518252601f1990920191602091820191016120f7565b6001836020036101000a03801982511681845116808217855250505050505090500180601760f91b81525060010182805190602001908083835b6020831061216f5780518252601f199092019160209182019101612150565b6001836020036101000a038019825116818451168082178552505050505050905001925050506040516020818303038152906040529050809650505050505050919050565b600080806121c6620151808504612ab4565b9196909550909350915050565b606080821561221b57604051806040016040528060018152602001600560fc1b81525060405180604001604052806003815260200162141d5d60ea1b81525091509150612257565b604051806040016040528060018152602001604360f81b8152506040518060400160405280600481526020016310d85b1b60e21b815250915091505b915091565b60608082600114156122ad57604051806040016040528060038152602001622520a760e91b815250604051806040016040528060078152602001664a616e7561727960c81b81525091509150612257565b82600214156122fc57604051806040016040528060038152602001622322a160e91b81525060405180604001604052806008815260200167466562727561727960c01b81525091509150612257565b8260031415612348576040518060400160405280600381526020016226a0a960e91b8152506040518060400160405280600581526020016409ac2e4c6d60db1b81525091509150612257565b8260041415612394576040518060400160405280600381526020016220a82960e91b81525060405180604001604052806005815260200164105c1c9a5b60da1b81525091509150612257565b82600514156123de57604051806040016040528060038152602001624d415960e81b815250604051806040016040528060038152602001624d617960e81b81525091509150612257565b82600614156124295760405180604001604052806003815260200162252aa760e91b815250604051806040016040528060048152602001634a756e6560e01b81525091509150612257565b8260071415612474576040518060400160405280600381526020016212955360ea1b815250604051806040016040528060048152602001634a756c7960e01b81525091509150612257565b82600814156124c1576040518060400160405280600381526020016241554760e81b81525060405180604001604052806006815260200165105d59dd5cdd60d21b81525091509150612257565b8260091415612511576040518060400160405280600381526020016205345560ec1b8152506040518060400160405280600981526020016829b2b83a32b6b132b960b91b81525091509150612257565b82600a141561255f576040518060400160405280600381526020016213d0d560ea1b8152506040518060400160405280600781526020016627b1ba37b132b960c91b81525091509150612257565b82600b14156125ae57604051806040016040528060038152602001622727ab60e91b815250604051806040016040528060088152602001672737bb32b6b132b960c11b81525091509150612257565b6040518060400160405280600381526020016244454360e81b815250604051806040016040528060088152602001672232b1b2b6b132b960c11b81525091509150612257565b60606063821115612606576064820691505b606061261183612697565b9050600a83101561080a57806040516020018080600360fc1b81525060010182805190602001908083835b6020831061265b5780518252601f19909201916020918201910161263c565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040529150506107d5565b6060816126bc57506040805180820190915260018152600360fc1b60208201526107d5565b8160005b81156126d457600101600a820491506126c0565b60608167ffffffffffffffff811180156126ed57600080fd5b506040519080825280601f01601f191660200182016040528015612718576020820181803683370190505b50859350905060001982015b831561276957600a840660300160f81b8282806001900393508151811061274757fe5b60200101906001600160f81b031916908160001a905350600a84049350612724565b50949350505050565b600054610100900460ff168061278b575061278b611420565b80612799575060005460ff16155b6127d45760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff161580156127ff576000805460ff1961ff0019909116610100171660011790555b8015612811576000805461ff00191690555b50565b600054610100900460ff168061282d575061282d611420565b8061283b575060005460ff16155b6128765760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff161580156128a1576000805460ff1961ff0019909116610100171660011790555b82516020808501919091208351918401919091206097919091556098558015611ead576000805461ff0019169055505050565b600054610100900460ff16806128ed57506128ed611420565b806128fb575060005460ff16155b6129365760405162461bcd60e51b815260040180806020018281038252602e815260200180612e97602e913960400191505060405180910390fd5b600054610100900460ff16158015612961576000805460ff1961ff0019909116610100171660011790555b604051806052612d81823960405190819003605201902060cc55508015610764576000805461ff00191690555050565b4690565b600061104083836040518060400160405280601881526020017f536166654d6174683a206d6f64756c6f206279207a65726f0000000000000000815250612b4a565b600061104083836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250612bac565b60608083830367ffffffffffffffff81118015612a3557600080fd5b506040519080825280601f01601f191660200182016040528015612a60576020820181803683370190505b50905060005b848403811015612769578581860181518110612a7e57fe5b602001015160f81c60f81b828281518110612a9557fe5b60200101906001600160f81b031916908160001a905350600101612a66565b60008080836226496581018262023ab1600483020590506004600362023ab18302010590910390600062164b09610fa0600185010205905060046105b58202058303601f019250600061098f8460500281612b0b57fe5b0590506000605061098f83020585039050600b820560301994909401606402929092018301996002600c90940290910392909201975095509350505050565b60008183612b995760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610f70578181015183820152602001610f58565b50828481612ba357fe5b06949350505050565b60008183612bfb5760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610f70578181015183820152602001610f58565b506000838581612c0757fe5b0495945050505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10612c5257805160ff1916838001178555612c7f565b82800160010185558215612c7f579182015b82811115612c7f578251825591602001919060010190612c64565b50612c8b929150612c8f565b5090565b6105e291905b80821115612c8b5760008155600101612c9556fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545434453413a20696e76616c6964207369676e6174757265202773272076616c75654f746f6b656e3a204f6e6c7920436f6e74726f6c6c65722063616e206275726e204f746f6b656e735065726d69742861646472657373206f776e65722c61646472657373207370656e6465722c75696e743235362076616c75652c75696e74323536206e6f6e63652c75696e7432353620646561646c696e652945434453413a20696e76616c6964207369676e6174757265202776272076616c75654f746f6b656e3a204f6e6c7920436f6e74726f6c6c65722063616e206d696e74204f746f6b656e73454950373132446f6d61696e28737472696e67206e616d652c737472696e672076657273696f6e2c75696e7432353620636861696e49642c6164647265737320766572696679696e67436f6e74726163742945524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e6365436f6e747261637420696e7374616e63652068617320616c7265616479206265656e20696e697469616c697a656445524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa264697066735822122077281833aee9495714ce0d1b1b3c529d5344a5904e38f7ca68956c3c5ce5ff6564736f6c634300060a0033";

type OtokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OtokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Otoken__factory extends ContractFactory {
  constructor(...args: OtokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Otoken> {
    return super.deploy(overrides || {}) as Promise<Otoken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Otoken {
    return super.attach(address) as Otoken;
  }
  override connect(signer: Signer): Otoken__factory {
    return super.connect(signer) as Otoken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OtokenInterface {
    return new utils.Interface(_abi) as OtokenInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Otoken {
    return new Contract(address, _abi, signerOrProvider) as Otoken;
  }
}
