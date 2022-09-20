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
  "0x608060405234801561001057600080fd5b506121aa806100206000396000f3fe608060405234801561001057600080fd5b50600436106102695760003560e01c806391d1485411610151578063ba087652116100c3578063d547741f11610087578063d547741f14610542578063d905777e14610555578063dd62ed3e14610568578063ef8b30f7146102e7578063f0f5907d1461057b578063f5b541a61461058e57600080fd5b8063ba087652146104f6578063c63d75b614610509578063c6e6f592146102e7578063ca15c8731461051c578063ce96cb771461052f57600080fd5b8063a217fddf11610115578063a217fddf146103f6578063a378a32414610496578063a457c2d7146104bd578063a9059cbb146104d0578063b3d7f6b9146102c1578063b460af94146104e357600080fd5b806391d148541461043857806394bf804d1461044b57806395d89b411461045e57806398c4f1ac146104665780639f8a39341461048d57600080fd5b8063313ce567116101ea5780634cdad506116101ae5780634cdad506146102c15780636e553f65146103ba57806370a08231146103cd57806375b238fc146103f657806376082a5e146103fe5780639010d07c1461042557600080fd5b8063313ce5671461034d57806336568abe1461035c57806338d52e0f1461036f5780633950935114610394578063402d267d146103a757600080fd5b80630a28a477116102315780630a28a477146102e757806318160ddd146102fa57806323b872dd14610302578063248a9ca3146103155780632f2ff15d1461033857600080fd5b806301e1d1141461026e57806301ffc9a71461028957806306fdde03146102ac57806307a2d13a146102c1578063095ea7b3146102d4575b600080fd5b6102766105b5565b6040519081526020015b60405180910390f35b61029c610297366004611c86565b610627565b6040519015158152602001610280565b6102b4610652565b6040516102809190611cdc565b6102766102cf366004611d0f565b6106e4565b61029c6102e2366004611d44565b6106ef565b6102766102f5366004611d0f565b610707565b603554610276565b61029c610310366004611d6e565b610712565b610276610323366004611d0f565b600090815260c9602052604090206001015490565b61034b610346366004611daa565b610738565b005b60405160128152602001610280565b61034b61036a366004611daa565b610762565b6065546001600160a01b03165b6040516001600160a01b039091168152602001610280565b61029c6103a2366004611d44565b6107e5565b6102766103b5366004611dd6565b610807565b6102766103c8366004611daa565b61084b565b6102766103db366004611dd6565b6001600160a01b031660009081526033602052604090205490565b610276600081565b6102767fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b61037c610433366004611df1565b6108be565b61029c610446366004611daa565b6108d6565b610276610459366004611daa565b610901565b6102b4610974565b6102767f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b61012d54610276565b6102767f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b61029c6104cb366004611d44565b610983565b61029c6104de366004611d44565b610a09565b6102766104f1366004611e13565b610a17565b610276610504366004611e13565b610a93565b610276610517366004611dd6565b610b07565b61027661052a366004611d0f565b610b51565b61027661053d366004611dd6565b610b68565b61034b610550366004611daa565b610b8a565b610276610563366004611dd6565b610baf565b610276610576366004611e4f565b610bcd565b61034b610589366004611d0f565b610bf8565b6102767f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b6065546040516370a0823160e01b81523060048201526000916001600160a01b0316906370a0823190602401602060405180830381865afa1580156105fe573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106229190611e79565b905090565b60006001600160e01b03198216635a05180f60e01b148061064c575061064c82610c0e565b92915050565b60606036805461066190611e92565b80601f016020809104026020016040519081016040528092919081815260200182805461068d90611e92565b80156106da5780601f106106af576101008083540402835291602001916106da565b820191906000526020600020905b8154815290600101906020018083116106bd57829003601f168201915b5050505050905090565b600061064c82610c43565b6000336106fd818585610d1b565b5060019392505050565b600061064c82610e3f565b600033610720858285610ef7565b61072b858585610f71565b60019150505b9392505050565b600082815260c960205260409020600101546107538161113f565b61075d8383611149565b505050565b6001600160a01b03811633146107d75760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6107e1828261116b565b5050565b6000336106fd8185856107f88383610bcd565b6108029190611ee2565b610d1b565b60008061081f6108168461118d565b61012d546111ab565b90506108296105b5565b8110156108395750600092915050565b6108416105b5565b6107319082611efa565b600061085682610807565b8311156108a55760405162461bcd60e51b815260206004820152601e60248201527f455243343632363a206465706f736974206d6f7265207468616e206d6178000060448201526064016107ce565b60006108b084610707565b9050610731338486846111c1565b600082815260fb60205260408120610731908361123f565b600091825260c9602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600061090c82610b07565b83111561095b5760405162461bcd60e51b815260206004820152601b60248201527f455243343632363a206d696e74206d6f7265207468616e206d6178000000000060448201526064016107ce565b6000610966846106e4565b9050610731338483876111c1565b60606037805461066190611e92565b600033816109918286610bcd565b9050838110156109f15760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084016107ce565b6109fe8286868403610d1b565b506001949350505050565b6000336106fd818585610f71565b6000610a2282610b68565b841115610a715760405162461bcd60e51b815260206004820152601f60248201527f455243343632363a207769746864726177206d6f7265207468616e206d61780060448201526064016107ce565b6000610a7c85610707565b9050610a8b338585888561124b565b949350505050565b6000610a9e82610baf565b841115610aed5760405162461bcd60e51b815260206004820152601d60248201527f455243343632363a2072656465656d206d6f7265207468616e206d617800000060448201526064016107ce565b6000610af8856106e4565b9050610a8b338585848961124b565b6000610b116105b5565b61012d541015610b2357506000919050565b6000610b46600019610b336105b5565b61012d54610b419190611efa565b6111ab565b905061073181610e3f565b600081815260fb6020526040812061064c906112f7565b6001600160a01b03811660009081526033602052604081205461064c90610c43565b600082815260c96020526040902060010154610ba58161113f565b61075d838361116b565b6001600160a01b03811660009081526033602052604081205461064c565b6001600160a01b03918216600090815260346020908152604080832093909416825291909152205490565b610c02600061113f565b610c0b81611301565b50565b60006001600160e01b03198216637965db0b60e01b148061064c57506301ffc9a760e01b6001600160e01b031983161461064c565b600080610c4f60355490565b90508015610c795780610c606105b5565b610c6a9085611f11565b610c749190611f30565b610731565b610c856012600a612036565b606560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cd8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cfc9190612045565b610d0790600a612036565b610d119085611f11565b6107319190611f30565b6001600160a01b038316610d7d5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016107ce565b6001600160a01b038216610dde5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016107ce565b6001600160a01b0383811660008181526034602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600080610e4b60355490565b9050821580610e58575080155b610e6e57610e646105b5565b610c6a8285611f11565b606560009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ec1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ee59190612045565b610ef090600a612036565b6012610cfc565b6000610f038484610bcd565b90506000198114610f6b5781811015610f5e5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016107ce565b610f6b8484848403610d1b565b50505050565b6001600160a01b038316610fd55760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016107ce565b6001600160a01b0382166110375760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016107ce565b6001600160a01b038316600090815260336020526040902054818110156110af5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016107ce565b6001600160a01b038085166000908152603360205260408082208585039055918516815290812080548492906110e6908490611ee2565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161113291815260200190565b60405180910390a3610f6b565b610c0b813361133b565b611153828261139f565b600082815260fb6020526040902061075d9082611425565b611175828261143a565b600082815260fb6020526040902061075d90826114a1565b60006111976114b6565b6111a257600061064c565b60001992915050565b60008183106111ba5781610731565b5090919050565b6065546111d9906001600160a01b03168530856114d0565b6111e3838261153b565b826001600160a01b0316846001600160a01b03167fdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d78484604051611231929190918252602082015260400190565b60405180910390a350505050565b6000610731838361161a565b826001600160a01b0316856001600160a01b03161461126f5761126f838683610ef7565b6112798382611644565b606554611290906001600160a01b03168584611792565b826001600160a01b0316846001600160a01b0316866001600160a01b03167ffbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db85856040516112e8929190918252602082015260400190565b60405180910390a45050505050565b600061064c825490565b61012d805490829055604051829082907f4d2401457be9e6122a73ae61656c5683178c9f48c9d3eef2de0542d09d35be7790600090a35050565b61134582826108d6565b6107e15761135d816001600160a01b031660146117c2565b6113688360206117c2565b604051602001611379929190612068565b60408051601f198184030181529082905262461bcd60e51b82526107ce91600401611cdc565b6113a982826108d6565b6107e157600082815260c9602090815260408083206001600160a01b03851684529091529020805460ff191660011790556113e13390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610731836001600160a01b03841661195e565b61144482826108d6565b156107e157600082815260c9602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610731836001600160a01b0384166119ad565b6000806114c16105b5565b11806106225750506035541590565b6040516001600160a01b0380851660248301528316604482015260648101829052610f6b9085906323b872dd60e01b906084015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611aa0565b6001600160a01b0382166115915760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016107ce565b80603560008282546115a39190611ee2565b90915550506001600160a01b038216600090815260336020526040812080548392906115d0908490611ee2565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6000826000018281548110611631576116316120dd565b9060005260206000200154905092915050565b6001600160a01b0382166116a45760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016107ce565b6001600160a01b038216600090815260336020526040902054818110156117185760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016107ce565b6001600160a01b0383166000908152603360205260408120838303905560358054849290611747908490611efa565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a3505050565b6040516001600160a01b03831660248201526044810182905261075d90849063a9059cbb60e01b90606401611504565b606060006117d1836002611f11565b6117dc906002611ee2565b67ffffffffffffffff8111156117f4576117f46120f3565b6040519080825280601f01601f19166020018201604052801561181e576020820181803683370190505b509050600360fc1b81600081518110611839576118396120dd565b60200101906001600160f81b031916908160001a905350600f60fb1b81600181518110611868576118686120dd565b60200101906001600160f81b031916908160001a905350600061188c846002611f11565b611897906001611ee2565b90505b600181111561190f576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106118cb576118cb6120dd565b1a60f81b8282815181106118e1576118e16120dd565b60200101906001600160f81b031916908160001a90535060049490941c9361190881612109565b905061189a565b5083156107315760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016107ce565b60008181526001830160205260408120546119a55750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561064c565b50600061064c565b60008181526001830160205260408120548015611a965760006119d1600183611efa565b85549091506000906119e590600190611efa565b9050818114611a4a576000866000018281548110611a0557611a056120dd565b9060005260206000200154905080876000018481548110611a2857611a286120dd565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080611a5b57611a5b612120565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061064c565b600091505061064c565b6000611af5826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611b729092919063ffffffff16565b80519091501561075d5780806020019051810190611b139190612136565b61075d5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107ce565b6060610a8b8484600085856001600160a01b0385163b611bd45760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107ce565b600080866001600160a01b03168587604051611bf09190612158565b60006040518083038185875af1925050503d8060008114611c2d576040519150601f19603f3d011682016040523d82523d6000602084013e611c32565b606091505b5091509150611c42828286611c4d565b979650505050505050565b60608315611c5c575081610731565b825115611c6c5782518084602001fd5b8160405162461bcd60e51b81526004016107ce9190611cdc565b600060208284031215611c9857600080fd5b81356001600160e01b03198116811461073157600080fd5b60005b83811015611ccb578181015183820152602001611cb3565b83811115610f6b5750506000910152565b6020815260008251806020840152611cfb816040850160208701611cb0565b601f01601f19169190910160400192915050565b600060208284031215611d2157600080fd5b5035919050565b80356001600160a01b0381168114611d3f57600080fd5b919050565b60008060408385031215611d5757600080fd5b611d6083611d28565b946020939093013593505050565b600080600060608486031215611d8357600080fd5b611d8c84611d28565b9250611d9a60208501611d28565b9150604084013590509250925092565b60008060408385031215611dbd57600080fd5b82359150611dcd60208401611d28565b90509250929050565b600060208284031215611de857600080fd5b61073182611d28565b60008060408385031215611e0457600080fd5b50508035926020909101359150565b600080600060608486031215611e2857600080fd5b83359250611e3860208501611d28565b9150611e4660408501611d28565b90509250925092565b60008060408385031215611e6257600080fd5b611e6b83611d28565b9150611dcd60208401611d28565b600060208284031215611e8b57600080fd5b5051919050565b600181811c90821680611ea657607f821691505b602082108103611ec657634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b60008219821115611ef557611ef5611ecc565b500190565b600082821015611f0c57611f0c611ecc565b500390565b6000816000190483118215151615611f2b57611f2b611ecc565b500290565b600082611f4d57634e487b7160e01b600052601260045260246000fd5b500490565b600181815b80851115611f8d578160001904821115611f7357611f73611ecc565b80851615611f8057918102915b93841c9390800290611f57565b509250929050565b600082611fa45750600161064c565b81611fb15750600061064c565b8160018114611fc75760028114611fd157611fed565b600191505061064c565b60ff841115611fe257611fe2611ecc565b50506001821b61064c565b5060208310610133831016604e8410600b8410161715612010575081810a61064c565b61201a8383611f52565b806000190482111561202e5761202e611ecc565b029392505050565b600061073160ff841683611f95565b60006020828403121561205757600080fd5b815160ff8116811461073157600080fd5b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516120a0816017850160208801611cb0565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516120d1816028840160208801611cb0565b01602801949350505050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b60008161211857612118611ecc565b506000190190565b634e487b7160e01b600052603160045260246000fd5b60006020828403121561214857600080fd5b8151801515811461073157600080fd5b6000825161216a818460208701611cb0565b919091019291505056fea2646970667358221220dee7c449fdb0acbe534bbbd088e97ccf4b42f52b1003ff73826bb3f5b9ccf61464736f6c634300080e0033";

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
