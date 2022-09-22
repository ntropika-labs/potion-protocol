/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERC1155Upgradeable,
  ERC1155UpgradeableInterface,
} from "../../../../../@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable";

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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506113d1806100206000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f41461010a578063a22cb4651461012a578063e985e9c51461013d578063f242432a1461017957600080fd5b8062fdd58e1461008c57806301ffc9a7146100b25780630e89341c146100d55780632eb2c2d6146100f5575b600080fd5b61009f61009a366004610bd6565b61018c565b6040519081526020015b60405180910390f35b6100c56100c0366004610c19565b610225565b60405190151581526020016100a9565b6100e86100e3366004610c3d565b610277565b6040516100a99190610ca3565b610108610103366004610e02565b61030b565b005b61011d610118366004610eac565b6103a2565b6040516100a99190610fb2565b610108610138366004610fc5565b6104cc565b6100c561014b366004611001565b6001600160a01b03918216600090815260666020908152604080832093909416825291909152205460ff1690565b610108610187366004611034565b6104db565b60006001600160a01b0383166101fd5760405162461bcd60e51b815260206004820152602b60248201527f455243313135353a2062616c616e636520717565727920666f7220746865207a60448201526a65726f206164647265737360a81b60648201526084015b60405180910390fd5b5060009081526065602090815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061025657506001600160e01b031982166303a24d0760e21b145b8061027157506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606067805461028690611099565b80601f01602080910402602001604051908101604052809291908181526020018280546102b290611099565b80156102ff5780601f106102d4576101008083540402835291602001916102ff565b820191906000526020600020905b8154815290600101906020018083116102e257829003601f168201915b50505050509050919050565b6001600160a01b0385163314806103275750610327853361014b565b61038e5760405162461bcd60e51b815260206004820152603260248201527f455243313135353a207472616e736665722063616c6c6572206973206e6f74206044820152711bdddb995c881b9bdc88185c1c1c9bdd995960721b60648201526084016101f4565b61039b8585858585610562565b5050505050565b606081518351146104075760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b60648201526084016101f4565b6000835167ffffffffffffffff81111561042357610423610cb6565b60405190808252806020026020018201604052801561044c578160200160208202803683370190505b50905060005b84518110156104c457610497858281518110610470576104706110d3565b602002602001015185838151811061048a5761048a6110d3565b602002602001015161018c565b8282815181106104a9576104a96110d3565b60209081029190910101526104bd816110ff565b9050610452565b509392505050565b6104d7338383610742565b5050565b6001600160a01b0385163314806104f757506104f7853361014b565b6105555760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7260448201526808185c1c1c9bdd995960ba1b60648201526084016101f4565b61039b8585858585610822565b81518351146105c45760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b60648201526084016101f4565b6001600160a01b0384166105ea5760405162461bcd60e51b81526004016101f490611118565b3360005b84518110156106d457600085828151811061060b5761060b6110d3565b602002602001015190506000858381518110610629576106296110d3565b60209081029190910181015160008481526065835260408082206001600160a01b038e16835290935291909120549091508181101561067a5760405162461bcd60e51b81526004016101f49061115d565b60008381526065602090815260408083206001600160a01b038e8116855292528083208585039055908b168252812080548492906106b99084906111a7565b92505081905550505050806106cd906110ff565b90506105ee565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb87876040516107249291906111bf565b60405180910390a461073a818787878787610950565b505050505050565b816001600160a01b0316836001600160a01b0316036107b55760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b60648201526084016101f4565b6001600160a01b03838116600081815260666020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166108485760405162461bcd60e51b81526004016101f490611118565b33600061085485610ab4565b9050600061086185610ab4565b905060008681526065602090815260408083206001600160a01b038c168452909152902054858110156108a65760405162461bcd60e51b81526004016101f49061115d565b60008781526065602090815260408083206001600160a01b038d8116855292528083208985039055908a168252812080548892906108e59084906111a7565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610945848a8a8a8a8a610aff565b505050505050505050565b6001600160a01b0384163b1561073a5760405163bc197c8160e01b81526001600160a01b0385169063bc197c819061099490899089908890889088906004016111ed565b6020604051808303816000875af19250505080156109cf575060408051601f3d908101601f191682019092526109cc9181019061124b565b60015b610a7b576109db611268565b806308c379a003610a1457506109ef611284565b806109fa5750610a16565b8060405162461bcd60e51b81526004016101f49190610ca3565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b60648201526084016101f4565b6001600160e01b0319811663bc197c8160e01b14610aab5760405162461bcd60e51b81526004016101f49061130e565b50505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610aee57610aee6110d3565b602090810291909101015292915050565b6001600160a01b0384163b1561073a5760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610b439089908990889088908890600401611356565b6020604051808303816000875af1925050508015610b7e575060408051601f3d908101601f19168201909252610b7b9181019061124b565b60015b610b8a576109db611268565b6001600160e01b0319811663f23a6e6160e01b14610aab5760405162461bcd60e51b81526004016101f49061130e565b80356001600160a01b0381168114610bd157600080fd5b919050565b60008060408385031215610be957600080fd5b610bf283610bba565b946020939093013593505050565b6001600160e01b031981168114610c1657600080fd5b50565b600060208284031215610c2b57600080fd5b8135610c3681610c00565b9392505050565b600060208284031215610c4f57600080fd5b5035919050565b6000815180845260005b81811015610c7c57602081850181015186830182015201610c60565b81811115610c8e576000602083870101525b50601f01601f19169290920160200192915050565b602081526000610c366020830184610c56565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff81118282101715610cf257610cf2610cb6565b6040525050565b600067ffffffffffffffff821115610d1357610d13610cb6565b5060051b60200190565b600082601f830112610d2e57600080fd5b81356020610d3b82610cf9565b604051610d488282610ccc565b83815260059390931b8501820192828101915086841115610d6857600080fd5b8286015b84811015610d835780358352918301918301610d6c565b509695505050505050565b600082601f830112610d9f57600080fd5b813567ffffffffffffffff811115610db957610db9610cb6565b604051610dd0601f8301601f191660200182610ccc565b818152846020838601011115610de557600080fd5b816020850160208301376000918101602001919091529392505050565b600080600080600060a08688031215610e1a57600080fd5b610e2386610bba565b9450610e3160208701610bba565b9350604086013567ffffffffffffffff80821115610e4e57600080fd5b610e5a89838a01610d1d565b94506060880135915080821115610e7057600080fd5b610e7c89838a01610d1d565b93506080880135915080821115610e9257600080fd5b50610e9f88828901610d8e565b9150509295509295909350565b60008060408385031215610ebf57600080fd5b823567ffffffffffffffff80821115610ed757600080fd5b818501915085601f830112610eeb57600080fd5b81356020610ef882610cf9565b604051610f058282610ccc565b83815260059390931b8501820192828101915089841115610f2557600080fd5b948201945b83861015610f4a57610f3b86610bba565b82529482019490820190610f2a565b96505086013592505080821115610f6057600080fd5b50610f6d85828601610d1d565b9150509250929050565b600081518084526020808501945080840160005b83811015610fa757815187529582019590820190600101610f8b565b509495945050505050565b602081526000610c366020830184610f77565b60008060408385031215610fd857600080fd5b610fe183610bba565b915060208301358015158114610ff657600080fd5b809150509250929050565b6000806040838503121561101457600080fd5b61101d83610bba565b915061102b60208401610bba565b90509250929050565b600080600080600060a0868803121561104c57600080fd5b61105586610bba565b945061106360208701610bba565b93506040860135925060608601359150608086013567ffffffffffffffff81111561108d57600080fd5b610e9f88828901610d8e565b600181811c908216806110ad57607f821691505b6020821081036110cd57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060018201611111576111116110e9565b5060010190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b600082198211156111ba576111ba6110e9565b500190565b6040815260006111d26040830185610f77565b82810360208401526111e48185610f77565b95945050505050565b6001600160a01b0386811682528516602082015260a06040820181905260009061121990830186610f77565b828103606084015261122b8186610f77565b9050828103608084015261123f8185610c56565b98975050505050505050565b60006020828403121561125d57600080fd5b8151610c3681610c00565b600060033d11156112815760046000803e5060005160e01c5b90565b600060443d10156112925790565b6040516003193d81016004833e81513d67ffffffffffffffff81602484011181841117156112c257505050505090565b82850191508151818111156112da5750505050505090565b843d87010160208285010111156112f45750505050505090565b61130360208286010187610ccc565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a06080820181905260009061139090830184610c56565b97965050505050505056fea2646970667358221220ded8b97fb78eb7a85d85ba57340496472688e43b71748b7622c9dc0473d2edc964736f6c634300080e0033";

type ERC1155UpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155UpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155Upgradeable__factory extends ContractFactory {
  constructor(...args: ERC1155UpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155Upgradeable> {
    return super.deploy(overrides || {}) as Promise<ERC1155Upgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC1155Upgradeable {
    return super.attach(address) as ERC1155Upgradeable;
  }
  override connect(signer: Signer): ERC1155Upgradeable__factory {
    return super.connect(signer) as ERC1155Upgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155UpgradeableInterface {
    return new utils.Interface(_abi) as ERC1155UpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155Upgradeable {
    return new Contract(address, _abi, signerOrProvider) as ERC1155Upgradeable;
  }
}
