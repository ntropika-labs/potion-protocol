/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ERC20PresetMinterPauser,
  ERC20PresetMinterPauserInterface,
} from "../../../../../../@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
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
    name: "MINTER_ROLE",
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
    name: "PAUSER_ROLE",
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
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
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
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
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
        name: "to",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
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
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001d5b38038062001d5b8339810160408190526200003491620003b5565b8151829082906200004d90600590602085019062000242565b5080516200006390600690602084019062000242565b50506007805460ff19169055506200007d600033620000dd565b620000a97f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a633620000dd565b620000d57f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a33620000dd565b50506200045b565b620000e98282620000ed565b5050565b6200010482826200013060201b620009441760201c565b60008281526001602090815260409091206200012b918390620009c8620001d0821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620000e9576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556200018c3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000620001e7836001600160a01b038416620001f0565b90505b92915050565b60008181526001830160205260408120546200023957508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155620001ea565b506000620001ea565b82805462000250906200041f565b90600052602060002090601f016020900481019282620002745760008555620002bf565b82601f106200028f57805160ff1916838001178555620002bf565b82800160010185558215620002bf579182015b82811115620002bf578251825591602001919060010190620002a2565b50620002cd929150620002d1565b5090565b5b80821115620002cd5760008155600101620002d2565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200031057600080fd5b81516001600160401b03808211156200032d576200032d620002e8565b604051601f8301601f19908116603f01168101908282118183101715620003585762000358620002e8565b816040528381526020925086838588010111156200037557600080fd5b600091505b838210156200039957858201830151818301840152908201906200037a565b83821115620003ab5760008385830101525b9695505050505050565b60008060408385031215620003c957600080fd5b82516001600160401b0380821115620003e157600080fd5b620003ef86838701620002fe565b935060208501519150808211156200040657600080fd5b506200041585828601620002fe565b9150509250929050565b600181811c908216806200043457607f821691505b6020821081036200045557634e487b7160e01b600052602260045260246000fd5b50919050565b6118f0806200046b6000396000f3fe608060405234801561001057600080fd5b50600436106101c45760003560e01c806370a08231116100f9578063a457c2d711610097578063d539139311610071578063d5391393146103af578063d547741f146103d6578063dd62ed3e146103e9578063e63ab1e9146103fc57600080fd5b8063a457c2d714610376578063a9059cbb14610389578063ca15c8731461039c57600080fd5b80639010d07c116100d35780639010d07c1461032857806391d148541461035357806395d89b4114610366578063a217fddf1461036e57600080fd5b806370a08231146102e457806379cc67901461030d5780638456cb591461032057600080fd5b8063313ce567116101665780633f4ba83a116101405780633f4ba83a146102ab57806340c10f19146102b357806342966c68146102c65780635c975abb146102d957600080fd5b8063313ce5671461027657806336568abe14610285578063395093511461029857600080fd5b806318160ddd116101a257806318160ddd1461021957806323b872dd1461022b578063248a9ca31461023e5780632f2ff15d1461026157600080fd5b806301ffc9a7146101c957806306fdde03146101f1578063095ea7b314610206575b600080fd5b6101dc6101d7366004611597565b610423565b60405190151581526020015b60405180910390f35b6101f961044e565b6040516101e891906115ed565b6101dc61021436600461163c565b6104e0565b6004545b6040519081526020016101e8565b6101dc610239366004611666565b6104f8565b61021d61024c3660046116a2565b60009081526020819052604090206001015490565b61027461026f3660046116bb565b61051c565b005b604051601281526020016101e8565b6102746102933660046116bb565b610546565b6101dc6102a636600461163c565b6105c9565b6102746105eb565b6102746102c136600461163c565b610691565b6102746102d43660046116a2565b610737565b60075460ff166101dc565b61021d6102f23660046116e7565b6001600160a01b031660009081526002602052604090205490565b61027461031b36600461163c565b610744565b610274610759565b61033b610336366004611702565b6107fd565b6040516001600160a01b0390911681526020016101e8565b6101dc6103613660046116bb565b61081c565b6101f9610845565b61021d600081565b6101dc61038436600461163c565b610854565b6101dc61039736600461163c565b6108cf565b61021d6103aa3660046116a2565b6108dd565b61021d7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6102746103e43660046116bb565b6108f4565b61021d6103f7366004611724565b610919565b61021d7f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a81565b60006001600160e01b03198216635a05180f60e01b14806104485750610448826109dd565b92915050565b60606005805461045d9061174e565b80601f01602080910402602001604051908101604052809291908181526020018280546104899061174e565b80156104d65780601f106104ab576101008083540402835291602001916104d6565b820191906000526020600020905b8154815290600101906020018083116104b957829003601f168201915b5050505050905090565b6000336104ee818585610a12565b5060019392505050565b600033610506858285610b36565b610511858585610bb0565b506001949350505050565b60008281526020819052604090206001015461053781610d89565b6105418383610d93565b505050565b6001600160a01b03811633146105bb5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6105c58282610db5565b5050565b6000336104ee8185856105dc8383610919565b6105e6919061179e565b610a12565b6106157f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361081c565b6106875760405162461bcd60e51b815260206004820152603960248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20756e70617573650000000000000060648201526084016105b2565b61068f610dd7565b565b6106bb7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361081c565b61072d5760405162461bcd60e51b815260206004820152603660248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f7665206d696e74657220726f6c6520746f206d696e740000000000000000000060648201526084016105b2565b6105c58282610e6a565b6107413382610f55565b50565b61074f823383610b36565b6105c58282610f55565b6107837f65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a3361081c565b6107f55760405162461bcd60e51b815260206004820152603760248201527f45524332305072657365744d696e7465725061757365723a206d75737420686160448201527f76652070617573657220726f6c6520746f20706175736500000000000000000060648201526084016105b2565b61068f6110af565b6000828152600160205260408120610815908361112a565b9392505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60606006805461045d9061174e565b600033816108628286610919565b9050838110156108c25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016105b2565b6105118286868403610a12565b6000336104ee818585610bb0565b600081815260016020526040812061044890611136565b60008281526020819052604090206001015461090f81610d89565b6105418383610db5565b6001600160a01b03918216600090815260036020908152604080832093909416825291909152205490565b61094e828261081c565b6105c5576000828152602081815260408083206001600160a01b03851684529091529020805460ff191660011790556109843390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610815836001600160a01b038416611140565b60006001600160e01b03198216637965db0b60e01b148061044857506301ffc9a760e01b6001600160e01b0319831614610448565b6001600160a01b038316610a745760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016105b2565b6001600160a01b038216610ad55760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016105b2565b6001600160a01b0383811660008181526003602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6000610b428484610919565b90506000198114610baa5781811015610b9d5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016105b2565b610baa8484848403610a12565b50505050565b6001600160a01b038316610c145760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016105b2565b6001600160a01b038216610c765760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016105b2565b610c8183838361118f565b6001600160a01b03831660009081526002602052604090205481811015610cf95760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016105b2565b6001600160a01b03808516600090815260026020526040808220858503905591851681529081208054849290610d3090849061179e565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d7c91815260200190565b60405180910390a3610baa565b610741813361119a565b610d9d8282610944565b600082815260016020526040902061054190826109c8565b610dbf82826111fe565b60008281526001602052604090206105419082611263565b60075460ff16610e205760405162461bcd60e51b815260206004820152601460248201527314185d5cd8589b194e881b9bdd081c185d5cd95960621b60448201526064016105b2565b6007805460ff191690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b6040516001600160a01b03909116815260200160405180910390a1565b6001600160a01b038216610ec05760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016105b2565b610ecc6000838361118f565b8060046000828254610ede919061179e565b90915550506001600160a01b03821660009081526002602052604081208054839290610f0b90849061179e565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b038216610fb55760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016105b2565b610fc18260008361118f565b6001600160a01b038216600090815260026020526040902054818110156110355760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016105b2565b6001600160a01b03831660009081526002602052604081208383039055600480548492906110649084906117b6565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b60075460ff16156110f55760405162461bcd60e51b815260206004820152601060248201526f14185d5cd8589b194e881c185d5cd95960821b60448201526064016105b2565b6007805460ff191660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258610e4d3390565b60006108158383611278565b6000610448825490565b600081815260018301602052604081205461118757508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610448565b506000610448565b6105418383836112a2565b6111a4828261081c565b6105c5576111bc816001600160a01b03166014611308565b6111c7836020611308565b6040516020016111d89291906117cd565b60408051601f198184030181529082905262461bcd60e51b82526105b2916004016115ed565b611208828261081c565b156105c5576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610815836001600160a01b0384166114a4565b600082600001828154811061128f5761128f611842565b9060005260206000200154905092915050565b60075460ff16156105415760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b60648201526084016105b2565b60606000611317836002611858565b61132290600261179e565b67ffffffffffffffff81111561133a5761133a611877565b6040519080825280601f01601f191660200182016040528015611364576020820181803683370190505b509050600360fc1b8160008151811061137f5761137f611842565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106113ae576113ae611842565b60200101906001600160f81b031916908160001a90535060006113d2846002611858565b6113dd90600161179e565b90505b6001811115611455576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061141157611411611842565b1a60f81b82828151811061142757611427611842565b60200101906001600160f81b031916908160001a90535060049490941c9361144e8161188d565b90506113e0565b5083156108155760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016105b2565b6000818152600183016020526040812054801561158d5760006114c86001836117b6565b85549091506000906114dc906001906117b6565b90508181146115415760008660000182815481106114fc576114fc611842565b906000526020600020015490508087600001848154811061151f5761151f611842565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080611552576115526118a4565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610448565b6000915050610448565b6000602082840312156115a957600080fd5b81356001600160e01b03198116811461081557600080fd5b60005b838110156115dc5781810151838201526020016115c4565b83811115610baa5750506000910152565b602081526000825180602084015261160c8160408501602087016115c1565b601f01601f19169190910160400192915050565b80356001600160a01b038116811461163757600080fd5b919050565b6000806040838503121561164f57600080fd5b61165883611620565b946020939093013593505050565b60008060006060848603121561167b57600080fd5b61168484611620565b925061169260208501611620565b9150604084013590509250925092565b6000602082840312156116b457600080fd5b5035919050565b600080604083850312156116ce57600080fd5b823591506116de60208401611620565b90509250929050565b6000602082840312156116f957600080fd5b61081582611620565b6000806040838503121561171557600080fd5b50508035926020909101359150565b6000806040838503121561173757600080fd5b61174083611620565b91506116de60208401611620565b600181811c9082168061176257607f821691505b60208210810361178257634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600082198211156117b1576117b1611788565b500190565b6000828210156117c8576117c8611788565b500390565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516118058160178501602088016115c1565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516118368160288401602088016115c1565b01602801949350505050565b634e487b7160e01b600052603260045260246000fd5b600081600019048311821515161561187257611872611788565b500290565b634e487b7160e01b600052604160045260246000fd5b60008161189c5761189c611788565b506000190190565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220fe124b3c930c1b275861f7407829d6041825e49750b02b41fd5c0010494638a364736f6c634300080e0033";

type ERC20PresetMinterPauserConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC20PresetMinterPauserConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC20PresetMinterPauser__factory extends ContractFactory {
  constructor(...args: ERC20PresetMinterPauserConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC20PresetMinterPauser> {
    return super.deploy(
      name,
      symbol,
      overrides || {}
    ) as Promise<ERC20PresetMinterPauser>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override attach(address: string): ERC20PresetMinterPauser {
    return super.attach(address) as ERC20PresetMinterPauser;
  }
  override connect(signer: Signer): ERC20PresetMinterPauser__factory {
    return super.connect(signer) as ERC20PresetMinterPauser__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20PresetMinterPauserInterface {
    return new utils.Interface(_abi) as ERC20PresetMinterPauserInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20PresetMinterPauser {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC20PresetMinterPauser;
  }
}
