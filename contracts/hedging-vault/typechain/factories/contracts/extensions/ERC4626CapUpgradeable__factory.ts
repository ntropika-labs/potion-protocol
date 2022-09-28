/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  ERC4626CapUpgradeable,
  ERC4626CapUpgradeableInterface,
} from "../../../contracts/extensions/ERC4626CapUpgradeable";

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
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Deposit",
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
        indexed: true,
        internalType: "uint256",
        name: "prevCap",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "newCap",
        type: "uint256",
      },
    ],
    name: "VaultCapChanged",
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
        name: "assets",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "shares",
        type: "uint256",
      },
    ],
    name: "Withdraw",
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
        name: "shares",
        type: "uint256",
      },
    ],
    name: "convertToAssets",
    outputs: [
      {
        internalType: "uint256",
        name: "assets",
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
        name: "assets",
        type: "uint256",
      },
    ],
    name: "convertToShares",
    outputs: [
      {
        internalType: "uint256",
        name: "shares",
        type: "uint256",
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
    inputs: [],
    name: "getVaultCap",
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
        name: "receiver",
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
        name: "receiver",
        type: "address",
      },
    ],
    name: "maxMint",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "maxWithdraw",
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
        name: "shares",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "mint",
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
        internalType: "uint256",
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewDeposit",
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
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewMint",
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
        name: "shares",
        type: "uint256",
      },
    ],
    name: "previewRedeem",
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
        name: "assets",
        type: "uint256",
      },
    ],
    name: "previewWithdraw",
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
        name: "shares",
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
        internalType: "uint256",
        name: "newCap",
        type: "uint256",
      },
    ],
    name: "setVaultCap",
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
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "withdraw",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506122e5806100206000396000f3fe608060405234801561001057600080fd5b50600436106102695760003560e01c806391d1485411610151578063ba087652116100c3578063d547741f11610087578063d547741f14610568578063d905777e1461057b578063dd62ed3e1461058e578063ef8b30f71461052f578063f0f5907d146105a1578063f5b541a6146105b457600080fd5b8063ba08765214610509578063c63d75b61461051c578063c6e6f5921461052f578063ca15c87314610542578063ce96cb771461055557600080fd5b8063a217fddf11610115578063a217fddf146103f6578063a378a32414610496578063a457c2d7146104bd578063a9059cbb146104d0578063b3d7f6b9146104e3578063b460af94146104f657600080fd5b806391d148541461043857806394bf804d1461044b57806395d89b411461045e57806398c4f1ac146104665780639f8a39341461048d57600080fd5b8063313ce567116101ea5780634cdad506116101ae5780634cdad506146102c15780636e553f65146103ba57806370a08231146103cd57806375b238fc146103f657806376082a5e146103fe5780639010d07c1461042557600080fd5b8063313ce5671461034d57806336568abe1461035c57806338d52e0f1461036f5780633950935114610394578063402d267d146103a757600080fd5b80630a28a477116102315780630a28a477146102e757806318160ddd146102fa57806323b872dd14610302578063248a9ca3146103155780632f2ff15d1461033857600080fd5b806301e1d1141461026e57806301ffc9a71461028957806306fdde03146102ac57806307a2d13a146102c1578063095ea7b3146102d4575b600080fd5b6102766105db565b6040519081526020015b60405180910390f35b61029c610297366004611db7565b61064d565b6040519015158152602001610280565b6102b4610678565b6040516102809190611e0d565b6102766102cf366004611e40565b61070a565b61029c6102e2366004611e75565b610717565b6102766102f5366004611e40565b61072f565b603554610276565b61029c610310366004611e9f565b61073c565b610276610323366004611e40565b600090815260c9602052604090206001015490565b61034b610346366004611edb565b610762565b005b60405160128152602001610280565b61034b61036a366004611edb565b61078c565b6065546001600160a01b03165b6040516001600160a01b039091168152602001610280565b61029c6103a2366004611e75565b61080f565b6102766103b5366004611f07565b610831565b6102766103c8366004611edb565b610875565b6102766103db366004611f07565b6001600160a01b031660009081526033602052604090205490565b610276600081565b6102767fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b61037c610433366004611f22565b6108e8565b61029c610446366004611edb565b610900565b610276610459366004611edb565b61092b565b6102b461099e565b6102767f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b61012d54610276565b6102767f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b61029c6104cb366004611e75565b6109ad565b61029c6104de366004611e75565b610a33565b6102766104f1366004611e40565b610a41565b610276610504366004611f44565b610a4e565b610276610517366004611f44565b610aca565b61027661052a366004611f07565b610b3e565b61027661053d366004611e40565b610b8a565b610276610550366004611e40565b610b97565b610276610563366004611f07565b610bae565b61034b610576366004611edb565b610bd2565b610276610589366004611f07565b610bf7565b61027661059c366004611f80565b610c15565b61034b6105af366004611e40565b610c40565b6102767f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b6065546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa158015610624573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106489190611faa565b905090565b60006001600160e01b03198216635a05180f60e01b1480610672575061067282610c56565b92915050565b60606036805461068790611fc3565b80601f01602080910402602001604051908101604052809291908181526020018280546106b390611fc3565b80156107005780601f106106d557610100808354040283529160200191610700565b820191906000526020600020905b8154815290600101906020018083116106e357829003601f168201915b5050505050905090565b6000610672826000610c8b565b600033610725818585610d49565b5060019392505050565b6000610672826001610e6d565b60003361074a858285610f1c565b610755858585610f96565b60019150505b9392505050565b600082815260c9602052604090206001015461077d81611164565b610787838361116e565b505050565b6001600160a01b03811633146108015760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61080b8282611190565b5050565b6000336107258185856108228383610c15565b61082c9190612013565b610d49565b600080610849610840846111b2565b61012d546111d0565b90506108536105db565b8110156108635750600092915050565b61086b6105db565b61075b908261202b565b600061088082610831565b8311156108cf5760405162461bcd60e51b815260206004820152601e60248201527f455243343632363a206465706f736974206d6f7265207468616e206d6178000060448201526064016107f8565b60006108da84610b8a565b905061075b338486846111e6565b600082815260fb6020526040812061075b9083611264565b600091825260c9602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600061093682610b3e565b8311156109855760405162461bcd60e51b815260206004820152601b60248201527f455243343632363a206d696e74206d6f7265207468616e206d6178000000000060448201526064016107f8565b600061099084610a41565b905061075b338483876111e6565b60606037805461068790611fc3565b600033816109bb8286610c15565b905083811015610a1b5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016107f8565b610a288286868403610d49565b506001949350505050565b600033610725818585610f96565b6000610672826001610c8b565b6000610a5982610bae565b841115610aa85760405162461bcd60e51b815260206004820152601f60248201527f455243343632363a207769746864726177206d6f7265207468616e206d61780060448201526064016107f8565b6000610ab38561072f565b9050610ac23385858885611270565b949350505050565b6000610ad582610bf7565b841115610b245760405162461bcd60e51b815260206004820152601d60248201527f455243343632363a2072656465656d206d6f7265207468616e206d617800000060448201526064016107f8565b6000610b2f8561070a565b9050610ac23385858489611270565b6000610b486105db565b61012d541015610b5a57506000919050565b6000610b7d600019610b6a6105db565b61012d54610b78919061202b565b6111d0565b905061075b816000610e6d565b6000610672826000610e6d565b600081815260fb602052604081206106729061131c565b6001600160a01b038116600090815260336020526040812054610672906000610c8b565b600082815260c96020526040902060010154610bed81611164565b6107878383611190565b6001600160a01b038116600090815260336020526040812054610672565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b610c4a6000611164565b610c5381611326565b50565b60006001600160e01b03198216637965db0b60e01b148061067257506301ffc9a760e01b6001600160e01b0319831614610672565b600080610c9760355490565b90508015610cb857610cb3610caa6105db565b85908386611360565b610ac2565b6065546040805163313ce56760e01b81529051610ac2926001600160a01b03169163313ce5679160048083019260209291908290030181865afa158015610d03573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d279190612042565b610d3290600a612149565b60125b610d4090600a612149565b86919086611360565b6001600160a01b038316610dab5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016107f8565b6001600160a01b038216610e0c5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016107f8565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600080610e7960355490565b9050831580610e86575080155b610e9657610cb381610d406105db565b610ac2610ea56012600a612149565b606560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ef8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d359190612042565b6000610f288484610c15565b90506000198114610f905781811015610f835760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016107f8565b610f908484848403610d49565b50505050565b6001600160a01b038316610ffa5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016107f8565b6001600160a01b03821661105c5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016107f8565b6001600160a01b038316600090815260336020526040902054818110156110d45760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016107f8565b6001600160a01b0380851660009081526033602052604080822085850390559185168152908120805484929061110b908490612013565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161115791815260200190565b60405180910390a3610f90565b610c5381336113bd565b6111788282611421565b600082815260fb6020526040902061078790826114a7565b61119a82826114bc565b600082815260fb602052604090206107879082611523565b60006111bc611538565b6111c7576000610672565b60001992915050565b60008183106111df578161075b565b5090919050565b6065546111fe906001600160a01b0316853085611552565b61120883826115bd565b826001600160a01b0316846001600160a01b03167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78484604051611256929190918252602082015260400190565b60405180910390a350505050565b600061075b838361169c565b826001600160a01b0316856001600160a01b03161461129457611294838683610f1c565b61129e83826116c6565b6065546112b5906001600160a01b03168584611814565b826001600160a01b0316846001600160a01b0316866001600160a01b03167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db858560405161130d929190918252602082015260400190565b60405180910390a45050505050565b6000610672825490565b61012d805490829055604051829082907f4d2401457be9e6122a73ae61656c5683178c9f48c9d3eef2de0542d09d35be7790600090a35050565b60008061136e868686611844565b9050600183600281111561138457611384612158565b1480156113a157506000848061139c5761139c61216e565b868809115b156113b4576113b1600182612013565b90505b95945050505050565b6113c78282610900565b61080b576113df816001600160a01b031660146118f3565b6113ea8360206118f3565b6040516020016113fb929190612184565b60408051601f198184030181529082905262461bcd60e51b82526107f891600401611e0d565b61142b8282610900565b61080b57600082815260c9602090815260408083206001600160a01b03851684529091529020805460ff191660011790556114633390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061075b836001600160a01b038416611a8f565b6114c68282610900565b1561080b57600082815260c9602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061075b836001600160a01b038416611ade565b6000806115436105db565b11806106485750506035541590565b6040516001600160a01b0380851660248301528316604482015260648101829052610f909085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611bd1565b6001600160a01b0382166116135760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016107f8565b80603560008282546116259190612013565b90915550506001600160a01b03821660009081526033602052604081208054839290611652908490612013565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b60008260000182815481106116b3576116b36121f9565b9060005260206000200154905092915050565b6001600160a01b0382166117265760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016107f8565b6001600160a01b0382166000908152603360205260409020548181101561179a5760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016107f8565b6001600160a01b03831660009081526033602052604081208383039055603580548492906117c990849061202b565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b6040516001600160a01b03831660248201526044810182905261078790849063a9059cbb60e01b90606401611586565b600080806000198587098587029250828110838203039150508060000361187e578382816118745761187461216e565b049250505061075b565b80841161188a57600080fd5b60008486880960026001871981018816978890046003810283188082028403028082028403028082028403028082028403028082028403029081029092039091026000889003889004909101858311909403939093029303949094049190911702949350505050565b6060600061190283600261220f565b61190d906002612013565b67ffffffffffffffff8111156119255761192561222e565b6040519080825280601f01601f19166020018201604052801561194f576020820181803683370190505b509050600360fc1b8160008151811061196a5761196a6121f9565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611999576119996121f9565b60200101906001600160f81b031916908160001a90535060006119bd84600261220f565b6119c8906001612013565b90505b6001811115611a40576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106119fc576119fc6121f9565b1a60f81b828281518110611a1257611a126121f9565b60200101906001600160f81b031916908160001a90535060049490941c93611a3981612244565b90506119cb565b50831561075b5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107f8565b6000818152600183016020526040812054611ad657508154600181810184556000848152602080822090930184905584548482528286019093526040902091909155610672565b506000610672565b60008181526001830160205260408120548015611bc7576000611b0260018361202b565b8554909150600090611b169060019061202b565b9050818114611b7b576000866000018281548110611b3657611b366121f9565b9060005260206000200154905080876000018481548110611b5957611b596121f9565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080611b8c57611b8c61225b565b600190038181906000526020600020016000905590558560010160008681526020019081526020016000206000905560019350505050610672565b6000915050610672565b6000611c26826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611ca39092919063ffffffff16565b8051909150156107875780806020019051810190611c449190612271565b6107875760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107f8565b6060610ac28484600085856001600160a01b0385163b611d055760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107f8565b600080866001600160a01b03168587604051611d219190612293565b60006040518083038185875af1925050503d8060008114611d5e576040519150601f19603f3d011682016040523d82523d6000602084013e611d63565b606091505b5091509150611d73828286611d7e565b979650505050505050565b60608315611d8d57508161075b565b825115611d9d5782518084602001fd5b8160405162461bcd60e51b81526004016107f89190611e0d565b600060208284031215611dc957600080fd5b81356001600160e01b03198116811461075b57600080fd5b60005b83811015611dfc578181015183820152602001611de4565b83811115610f905750506000910152565b6020815260008251806020840152611e2c816040850160208701611de1565b601f01601f19169190910160400192915050565b600060208284031215611e5257600080fd5b5035919050565b80356001600160a01b0381168114611e7057600080fd5b919050565b60008060408385031215611e8857600080fd5b611e9183611e59565b946020939093013593505050565b600080600060608486031215611eb457600080fd5b611ebd84611e59565b9250611ecb60208501611e59565b9150604084013590509250925092565b60008060408385031215611eee57600080fd5b82359150611efe60208401611e59565b90509250929050565b600060208284031215611f1957600080fd5b61075b82611e59565b60008060408385031215611f3557600080fd5b50508035926020909101359150565b600080600060608486031215611f5957600080fd5b83359250611f6960208501611e59565b9150611f7760408501611e59565b90509250925092565b60008060408385031215611f9357600080fd5b611f9c83611e59565b9150611efe60208401611e59565b600060208284031215611fbc57600080fd5b5051919050565b600181811c90821680611fd757607f821691505b602082108103611ff757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b6000821982111561202657612026611ffd565b500190565b60008282101561203d5761203d611ffd565b500390565b60006020828403121561205457600080fd5b815160ff8116811461075b57600080fd5b600181815b808511156120a057816000190482111561208657612086611ffd565b8085161561209357918102915b93841c939080029061206a565b509250929050565b6000826120b757506001610672565b816120c457506000610672565b81600181146120da57600281146120e457612100565b6001915050610672565b60ff8411156120f5576120f5611ffd565b50506001821b610672565b5060208310610133831016604e8410600b8410161715612123575081810a610672565b61212d8383612065565b806000190482111561214157612141611ffd565b029392505050565b600061075b60ff8416836120a8565b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516121bc816017850160208801611de1565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516121ed816028840160208801611de1565b01602801949350505050565b634e487b7160e01b600052603260045260246000fd5b600081600019048311821515161561222957612229611ffd565b500290565b634e487b7160e01b600052604160045260246000fd5b60008161225357612253611ffd565b506000190190565b634e487b7160e01b600052603160045260246000fd5b60006020828403121561228357600080fd5b8151801515811461075b57600080fd5b600082516122a5818460208701611de1565b919091019291505056fea2646970667358221220faca53894b9b334af8d85e6ca2cc569fe6c6a0d510d20a19816c925970cea81b64736f6c634300080e0033";

type ERC4626CapUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC4626CapUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC4626CapUpgradeable__factory extends ContractFactory {
  constructor(...args: ERC4626CapUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC4626CapUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ERC4626CapUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC4626CapUpgradeable {
    return super.attach(address) as ERC4626CapUpgradeable;
  }
  override connect(signer: Signer): ERC4626CapUpgradeable__factory {
    return super.connect(signer) as ERC4626CapUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC4626CapUpgradeableInterface {
    return new utils.Interface(_abi) as ERC4626CapUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC4626CapUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC4626CapUpgradeable;
  }
}
