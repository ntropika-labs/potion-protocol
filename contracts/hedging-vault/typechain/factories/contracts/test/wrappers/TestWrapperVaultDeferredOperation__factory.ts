/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperVaultDeferredOperation,
  TestWrapperVaultDeferredOperationInterface,
} from "../../../../contracts/test/wrappers/TestWrapperVaultDeferredOperation";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "DepositWithReceipt",
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
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RedeemReceipt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "RedeemReceiptBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [],
    name: "asset",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
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
    ],
    name: "balanceOfAll",
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
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
    ],
    name: "depositOnTarget",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "exists",
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
        name: "targetVault",
        type: "address",
      },
      {
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
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
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
        name: "",
        type: "address",
      },
    ],
    name: "maxDeposit",
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
    ],
    name: "maxRedeem",
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
    name: "mintId",
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
        name: "mintId_",
        type: "uint256",
      },
    ],
    name: "mockSetMintId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "redeemBatch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
    ],
    name: "redeemFromTarget",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
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
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
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
    name: "totalAssets",
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
        name: "id",
        type: "uint256",
      },
    ],
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
    inputs: [],
    name: "totalSupplyAll",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
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
    name: "vault",
    outputs: [
      {
        internalType: "address",
        name: "vaultAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612b5b806100206000396000f3fe608060405234801561001057600080fd5b50600436106101725760003560e01c80634f558e79116100de578063d905777e11610097578063f242432a11610071578063f242432a14610360578063fbfa77cf14610373578063fe90e5bc14610384578063fe992c981461038e57600080fd5b8063d905777e14610327578063e985e9c51461033a578063f0670dd31461034d57600080fd5b80634f558e79146102a45780636a79bad6146102c65780636e553f65146102d9578063a22cb465146102ec578063b42394f1146102ff578063bd85b0391461030757600080fd5b80632eb2c2d6116101305780632eb2c2d61461021157806338d52e0f14610224578063402d267d146102495780634571e3a61461025e578063490fb17c146102715780634e1273f41461028457600080fd5b8062fdd58e146101775780630169a9961461019d57806301e1d114146101b057806301ffc9a7146101b85780630e89341c146101db5780632304cd18146101fb575b600080fd5b61018a610185366004612031565b6103b7565b6040519081526020015b60405180910390f35b61018a6101ab36600461205b565b61044f565b61018a6104b6565b6101cb6101c63660046120b7565b610528565b6040519015158152602001610194565b6101ee6101e93660046120d4565b61057a565b6040516101949190612145565b61020f6102093660046120d4565b61012d55565b005b61020f61021f3660046122a4565b61060e565b60c9546001600160a01b03165b6040516001600160a01b039091168152602001610194565b61018a61025736600461234e565b5060001990565b61020f61026c366004612369565b61065a565b61018a61027f3660046120d4565b6107b7565b6102976102923660046123f7565b6107c2565b60405161019491906124fd565b6101cb6102b23660046120d4565b600090815260986020526040902054151590565b61018a6102d43660046120d4565b6108ec565b61018a6102e7366004612510565b6108f7565b61020f6102fa36600461254a565b610915565b60975461018a565b61018a6103153660046120d4565b60009081526098602052604090205490565b61018a61033536600461234e565b610924565b6101cb610348366004612581565b610942565b61018a61035b3660046125ab565b610970565b61020f61036e366004612617565b610a80565b60fb546001600160a01b0316610231565b61018a61012d5481565b61018a61039c36600461234e565b6001600160a01b031660009081526099602052604090205490565b60006001600160a01b0383166104275760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b60648201526084015b60405180910390fd5b5060009081526065602090815260408083206001600160a01b03949094168352929052205490565b600061045a82610924565b8411156104a05760405162461bcd60e51b81526020600482015260146024820152730e4cac8cacada40dadee4ca40e8d0c2dc40dac2f60631b604482015260640161041e565b6104ad3384848789610ac5565b50919392505050565b60c9546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156104ff573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610523919061267c565b905090565b60006001600160e01b03198216636cdb3d1360e11b148061055957506001600160e01b031982166303a24d0760e21b145b8061057457506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606067805461058990612695565b80601f01602080910402602001604051908101604052809291908181526020018280546105b590612695565b80156106025780601f106105d757610100808354040283529160200191610602565b820191906000526020600020905b8154815290600101906020018083116105e557829003601f168201915b50505050509050919050565b6001600160a01b03851633148061062a575061062a8533610942565b6106465760405162461bcd60e51b815260040161041e906126cf565b6106538585858585610bbd565b5050505050565b600054610100900460ff161580801561067a5750600054600160ff909116105b806106945750303b158015610694575060005460ff166001145b6106f75760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840161041e565b6000805460ff19166001179055801561071a576000805461ff0019166101001790555b61075983838080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610d6a92505050565b61076284610d9d565b61076b85610de6565b8015610653576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15050505050565b600061057482610e2f565b606081518351146108275760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b606482015260840161041e565b6000835167ffffffffffffffff81111561084357610843612158565b60405190808252806020026020018201604052801561086c578160200160208202803683370190505b50905060005b84518110156108e4576108b78582815181106108905761089061271e565b60200260200101518583815181106108aa576108aa61271e565b60200260200101516103b7565b8282815181106108c9576108c961271e565b60209081029190910101526108dd8161274a565b9050610872565b509392505050565b600061057482610ece565b600061090e33838561090961012d5490565b610f26565b5090919050565b610920338383610fb5565b5050565b6001600160a01b038116600090815260996020526040812054610574565b6001600160a01b03918216600090815260666020908152604080832093909416825291909152205460ff1690565b600083518551146109d35760405162461bcd60e51b815260206004820152602760248201527f6d69736d61746368207368617265732069647320616e6420616d6f756e7473206044820152666c656e6774687360c81b606482015260840161041e565b6000805b8651811015610a19578581815181106109f2576109f261271e565b602002602001015182610a059190612763565b915080610a118161274a565b9150506109d7565b50610a2383610924565b811115610a695760405162461bcd60e51b81526020600482015260146024820152730e4cac8cacada40dadee4ca40e8d0c2dc40dac2f60631b604482015260640161041e565b610a77338585848a8a611095565b95945050505050565b6001600160a01b038516331480610a9c5750610a9c8533610942565b610ab85760405162461bcd60e51b815260040161041e906126cf565b610653858585858561113b565b826001600160a01b0316856001600160a01b031614610b3457610ae88386610942565b610b345760405162461bcd60e51b815260206004820181905260248201527f63616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564604482015260640161041e565b610b3f838284611277565b60c954610b56906001600160a01b03168584611398565b826001600160a01b0316846001600160a01b0316866001600160a01b03167fbdd2ea7c6c746c4b10d827cdb6a2e1033cba355ab3d4a0c8d33ffbd6436f6e138486604051610bae929190918252602082015260400190565b60405180910390a45050505050565b8151835114610bde5760405162461bcd60e51b815260040161041e9061277b565b6001600160a01b038416610c045760405162461bcd60e51b815260040161041e906127c3565b33610c13818787878787611400565b60005b8451811015610cfc576000858281518110610c3357610c3361271e565b602002602001015190506000858381518110610c5157610c5161271e565b60209081029190910181015160008481526065835260408082206001600160a01b038e168352909352919091205490915081811015610ca25760405162461bcd60e51b815260040161041e90612808565b60008381526065602090815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610ce1908490612763565b9250508190555050505080610cf59061274a565b9050610c16565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610d4c929190612852565b60405180910390a4610d628187878787876116a5565b505050505050565b600054610100900460ff16610d915760405162461bcd60e51b815260040161041e90612877565b610d9a81611800565b50565b600054610100900460ff16610dc45760405162461bcd60e51b815260040161041e90612877565b60c980546001600160a01b0319166001600160a01b0392909216919091179055565b600054610100900460ff16610e0d5760405162461bcd60e51b815260040161041e90612877565b60fb80546001600160a01b0319166001600160a01b0392909216919091179055565b6000610e58610e4660c9546001600160a01b031690565b60fb546001600160a01b031684611813565b60fb54604051636e553f6560e01b8152600481018490523060248201526001600160a01b0390911690636e553f65906044015b6020604051808303816000875af1158015610eaa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610574919061267c565b60fb54600090610ee8906001600160a01b03168084611813565b60fb54604051635d043b2960e11b815260048101849052306024820181905260448201526001600160a01b039091169063ba08765290606401610e8b565b60c954610f3e906001600160a01b0316853085611928565b610f5983828460405180602001604052806000815250611966565b826001600160a01b0316846001600160a01b03167fd2e39d08f9cf06dc3751fbd36267ed7b6a0c4836f9d9d646c8995b1997ecafcb8385604051610fa7929190918252602082015260400190565b60405180910390a350505050565b816001600160a01b0316836001600160a01b0316036110285760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b606482015260840161041e565b6001600160a01b03838116600081815260666020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b836001600160a01b0316866001600160a01b0316146110ba576110b88487610942565b505b6110c5848383611a82565b60c9546110dc906001600160a01b03168685611398565b836001600160a01b0316856001600160a01b0316876001600160a01b03167f44e3fb37a3cbf629917f1152a90f697de0e902e3d25aa43cad6b7e3e7c1190b8858560405161112b929190612852565b60405180910390a4505050505050565b6001600160a01b0384166111615760405162461bcd60e51b815260040161041e906127c3565b33600061116d85611c21565b9050600061117a85611c21565b905061118a838989858589611400565b60008681526065602090815260408083206001600160a01b038c168452909152902054858110156111cd5760405162461bcd60e51b815260040161041e90612808565b60008781526065602090815260408083206001600160a01b038d8116855292528083208985039055908a1682528120805488929061120c908490612763565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461126c848a8a8a8a8a611c6c565b505050505050505050565b6001600160a01b03831661129d5760405162461bcd60e51b815260040161041e906128c2565b3360006112a984611c21565b905060006112b684611c21565b90506112d683876000858560405180602001604052806000815250611400565b60008581526065602090815260408083206001600160a01b038a168452909152902054848110156113195760405162461bcd60e51b815260040161041e90612905565b60008681526065602090815260408083206001600160a01b038b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a46040805160208101909152600090525b50505050505050565b6040516001600160a01b0383166024820152604481018290526113fb90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611d27565b505050565b6001600160a01b03851661150e5760005b835181101561150c5782818151811061142c5761142c61271e565b60200260200101516098600086848151811061144a5761144a61271e565b60200260200101518152602001908152602001600020600082825461146f9190612763565b925050819055508281815181106114885761148861271e565b602002602001015160996000876001600160a01b03166001600160a01b0316815260200190815260200160002060008282546114c49190612763565b925050819055508281815181106114dd576114dd61271e565b6020026020010151609760008282546114f69190612763565b9091555061150590508161274a565b9050611411565b505b6001600160a01b038416610d625760005b835181101561138f57600084828151811061153c5761153c61271e565b60200260200101519050600084838151811061155a5761155a61271e565b60200260200101519050600060986000848152602001908152602001600020549050818110156115dd5760405162461bcd60e51b815260206004820152602860248201527f455243313135353a206275726e20616d6f756e74206578636565647320746f74604482015267616c537570706c7960c01b606482015260840161041e565b6001600160a01b0389166000908152609960205260409020548281101561165a5760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a206275726e20616d6f756e7420657863656564732061636360448201526a1bdd5b9d08185b5bdd5b9d60aa1b606482015260840161041e565b6000938452609860209081526040808620938590039093556001600160a01b038b168552609990529220918190039091556097805491909103905561169e8161274a565b905061151f565b6001600160a01b0384163b15610d625760405163bc197c8160e01b81526001600160a01b0385169063bc197c81906116e99089908990889088908890600401612949565b6020604051808303816000875af1925050508015611724575060408051601f3d908101601f19168201909252611721918101906129a7565b60015b6117d0576117306129c4565b806308c379a00361176957506117446129e0565b8061174f575061176b565b8060405162461bcd60e51b815260040161041e9190612145565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b606482015260840161041e565b6001600160e01b0319811663bc197c8160e01b1461138f5760405162461bcd60e51b815260040161041e90612a6a565b8051610920906067906020840190611f7c565b80158061188d5750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa158015611867573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061188b919061267c565b155b6118f85760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b606482015260840161041e565b6040516001600160a01b0383166024820152604481018290526113fb90849063095ea7b360e01b906064016113c4565b6040516001600160a01b03808516602483015283166044820152606481018290526119609085906323b872dd60e01b906084016113c4565b50505050565b6001600160a01b0384166119c65760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b606482015260840161041e565b3360006119d285611c21565b905060006119df85611c21565b90506119f083600089858589611400565b60008681526065602090815260408083206001600160a01b038b16845290915281208054879290611a22908490612763565b909155505060408051878152602081018790526001600160a01b03808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461138f83600089898989611c6c565b6001600160a01b038316611aa85760405162461bcd60e51b815260040161041e906128c2565b8051825114611ac95760405162461bcd60e51b815260040161041e9061277b565b6000339050611aec81856000868660405180602001604052806000815250611400565b60005b8351811015611bb4576000848281518110611b0c57611b0c61271e565b602002602001015190506000848381518110611b2a57611b2a61271e565b60209081029190910181015160008481526065835260408082206001600160a01b038c168352909352919091205490915081811015611b7b5760405162461bcd60e51b815260040161041e90612905565b60009283526065602090815260408085206001600160a01b038b1686529091529092209103905580611bac8161274a565b915050611aef565b5060006001600160a01b0316846001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051611c05929190612852565b60405180910390a4604080516020810190915260009052611960565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110611c5b57611c5b61271e565b602090810291909101015292915050565b6001600160a01b0384163b15610d625760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190611cb09089908990889088908890600401612ab2565b6020604051808303816000875af1925050508015611ceb575060408051601f3d908101601f19168201909252611ce8918101906129a7565b60015b611cf7576117306129c4565b6001600160e01b0319811663f23a6e6160e01b1461138f5760405162461bcd60e51b815260040161041e90612a6a565b6000611d7c826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611df99092919063ffffffff16565b8051909150156113fb5780806020019051810190611d9a9190612aec565b6113fb5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161041e565b6060611e088484600085611e12565b90505b9392505050565b606082471015611e735760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161041e565b6001600160a01b0385163b611eca5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161041e565b600080866001600160a01b03168587604051611ee69190612b09565b60006040518083038185875af1925050503d8060008114611f23576040519150601f19603f3d011682016040523d82523d6000602084013e611f28565b606091505b5091509150611f38828286611f43565b979650505050505050565b60608315611f52575081611e0b565b825115611f625782518084602001fd5b8160405162461bcd60e51b815260040161041e9190612145565b828054611f8890612695565b90600052602060002090601f016020900481019282611faa5760008555611ff0565b82601f10611fc357805160ff1916838001178555611ff0565b82800160010185558215611ff0579182015b82811115611ff0578251825591602001919060010190611fd5565b50611ffc929150612000565b5090565b5b80821115611ffc5760008155600101612001565b80356001600160a01b038116811461202c57600080fd5b919050565b6000806040838503121561204457600080fd5b61204d83612015565b946020939093013593505050565b6000806000806080858703121561207157600080fd5b843593506020850135925061208860408601612015565b915061209660608601612015565b905092959194509250565b6001600160e01b031981168114610d9a57600080fd5b6000602082840312156120c957600080fd5b8135611e0b816120a1565b6000602082840312156120e657600080fd5b5035919050565b60005b838110156121085781810151838201526020016120f0565b838111156119605750506000910152565b600081518084526121318160208601602086016120ed565b601f01601f19169290920160200192915050565b602081526000611e0b6020830184612119565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff8111828210171561219457612194612158565b6040525050565b600067ffffffffffffffff8211156121b5576121b5612158565b5060051b60200190565b600082601f8301126121d057600080fd5b813560206121dd8261219b565b6040516121ea828261216e565b83815260059390931b850182019282810191508684111561220a57600080fd5b8286015b84811015612225578035835291830191830161220e565b509695505050505050565b600082601f83011261224157600080fd5b813567ffffffffffffffff81111561225b5761225b612158565b604051612272601f8301601f19166020018261216e565b81815284602083860101111561228757600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a086880312156122bc57600080fd5b6122c586612015565b94506122d360208701612015565b9350604086013567ffffffffffffffff808211156122f057600080fd5b6122fc89838a016121bf565b9450606088013591508082111561231257600080fd5b61231e89838a016121bf565b9350608088013591508082111561233457600080fd5b5061234188828901612230565b9150509295509295909350565b60006020828403121561236057600080fd5b611e0b82612015565b6000806000806060858703121561237f57600080fd5b61238885612015565b935061239660208601612015565b9250604085013567ffffffffffffffff808211156123b357600080fd5b818701915087601f8301126123c757600080fd5b8135818111156123d657600080fd5b8860208285010111156123e857600080fd5b95989497505060200194505050565b6000806040838503121561240a57600080fd5b823567ffffffffffffffff8082111561242257600080fd5b818501915085601f83011261243657600080fd5b813560206124438261219b565b604051612450828261216e565b83815260059390931b850182019282810191508984111561247057600080fd5b948201945b838610156124955761248686612015565b82529482019490820190612475565b965050860135925050808211156124ab57600080fd5b506124b8858286016121bf565b9150509250929050565b600081518084526020808501945080840160005b838110156124f2578151875295820195908201906001016124d6565b509495945050505050565b602081526000611e0b60208301846124c2565b6000806040838503121561252357600080fd5b8235915061253360208401612015565b90509250929050565b8015158114610d9a57600080fd5b6000806040838503121561255d57600080fd5b61256683612015565b915060208301356125768161253c565b809150509250929050565b6000806040838503121561259457600080fd5b61259d83612015565b915061253360208401612015565b600080600080608085870312156125c157600080fd5b843567ffffffffffffffff808211156125d957600080fd5b6125e5888389016121bf565b955060208701359150808211156125fb57600080fd5b50612608878288016121bf565b93505061208860408601612015565b600080600080600060a0868803121561262f57600080fd5b61263886612015565b945061264660208701612015565b93506040860135925060608601359150608086013567ffffffffffffffff81111561267057600080fd5b61234188828901612230565b60006020828403121561268e57600080fd5b5051919050565b600181811c908216806126a957607f821691505b6020821081036126c957634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602f908201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60408201526e195c881b9bdc88185c1c1c9bdd9959608a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b60006001820161275c5761275c612734565b5060010190565b6000821982111561277657612776612734565b500190565b60208082526028908201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206040820152670dad2e6dac2e8c6d60c31b606082015260800190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b60408152600061286560408301856124c2565b8281036020840152610a7781856124c2565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b60208082526023908201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526024908201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604082015263616e636560e01b606082015260800190565b6001600160a01b0386811682528516602082015260a060408201819052600090612975908301866124c2565b828103606084015261298781866124c2565b9050828103608084015261299b8185612119565b98975050505050505050565b6000602082840312156129b957600080fd5b8151611e0b816120a1565b600060033d11156129dd5760046000803e5060005160e01c5b90565b600060443d10156129ee5790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715612a1e57505050505090565b8285019150815181811115612a365750505050505090565b843d8701016020828501011115612a505750505050505090565b612a5f6020828601018761216e565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090611f3890830184612119565b600060208284031215612afe57600080fd5b8151611e0b8161253c565b60008251612b1b8184602087016120ed565b919091019291505056fea26469706673582212204235467bfe86c2fb5044080381d68700f801a59c14f46a22513b0409366b4c1264736f6c634300080e0033";

type TestWrapperVaultDeferredOperationConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperVaultDeferredOperationConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperVaultDeferredOperation__factory extends ContractFactory {
  constructor(...args: TestWrapperVaultDeferredOperationConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperVaultDeferredOperation> {
    return super.deploy(
      overrides || {}
    ) as Promise<TestWrapperVaultDeferredOperation>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperVaultDeferredOperation {
    return super.attach(address) as TestWrapperVaultDeferredOperation;
  }
  override connect(signer: Signer): TestWrapperVaultDeferredOperation__factory {
    return super.connect(signer) as TestWrapperVaultDeferredOperation__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperVaultDeferredOperationInterface {
    return new utils.Interface(
      _abi
    ) as TestWrapperVaultDeferredOperationInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperVaultDeferredOperation {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperVaultDeferredOperation;
  }
}
