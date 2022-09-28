/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  RolesManagerUpgradeable,
  RolesManagerUpgradeableInterface,
} from "../../../contracts/common/RolesManagerUpgradeable";

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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610b61806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806391d148541161008c578063a378a32411610066578063a378a32414610204578063ca15c8731461022b578063d547741f1461023e578063f5b541a61461025157600080fd5b806391d14854146101ca57806398c4f1ac146101dd578063a217fddf1461017057600080fd5b806336568abe116100c857806336568abe1461015d57806375b238fc1461017057806376082a5e146101785780639010d07c1461019f57600080fd5b806301ffc9a7146100ef578063248a9ca3146101175780632f2ff15d14610148575b600080fd5b6101026100fd3660046108f5565b610278565b60405190151581526020015b60405180910390f35b61013a61012536600461091f565b60009081526065602052604090206001015490565b60405190815260200161010e565b61015b610156366004610938565b6102a3565b005b61015b61016b366004610938565b6102cd565b61013a600081565b61013a7fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101b26101ad366004610974565b610350565b6040516001600160a01b03909116815260200161010e565b6101026101d8366004610938565b61036f565b61013a7f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b61013a7f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b61013a61023936600461091f565b61039a565b61015b61024c366004610938565b6103b1565b61013a7f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b148061029d575061029d826103d6565b92915050565b6000828152606560205260409020600101546102be8161040b565b6102c88383610418565b505050565b6001600160a01b03811633146103425760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61034c828261043a565b5050565b6000828152609760205260408120610368908361045c565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b600081815260976020526040812061029d90610468565b6000828152606560205260409020600101546103cc8161040b565b6102c8838361043a565b60006001600160e01b03198216637965db0b60e01b148061029d57506301ffc9a760e01b6001600160e01b031983161461029d565b6104158133610472565b50565b61042282826104d6565b60008281526097602052604090206102c8908261055c565b6104448282610571565b60008281526097602052604090206102c890826105d8565b600061036883836105ed565b600061029d825490565b61047c828261036f565b61034c57610494816001600160a01b03166014610617565b61049f836020610617565b6040516020016104b09291906109c6565b60408051601f198184030181529082905262461bcd60e51b825261033991600401610a3b565b6104e0828261036f565b61034c5760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556105183390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610368836001600160a01b0384166107b3565b61057b828261036f565b1561034c5760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610368836001600160a01b038416610802565b600082600001828154811061060457610604610a6e565b9060005260206000200154905092915050565b60606000610626836002610a9a565b610631906002610ab9565b67ffffffffffffffff81111561064957610649610ad1565b6040519080825280601f01601f191660200182016040528015610673576020820181803683370190505b509050600360fc1b8160008151811061068e5761068e610a6e565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106106bd576106bd610a6e565b60200101906001600160f81b031916908160001a90535060006106e1846002610a9a565b6106ec906001610ab9565b90505b6001811115610764576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061072057610720610a6e565b1a60f81b82828151811061073657610736610a6e565b60200101906001600160f81b031916908160001a90535060049490941c9361075d81610ae7565b90506106ef565b5083156103685760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610339565b60008181526001830160205260408120546107fa5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561029d565b50600061029d565b600081815260018301602052604081205480156108eb576000610826600183610afe565b855490915060009061083a90600190610afe565b905081811461089f57600086600001828154811061085a5761085a610a6e565b906000526020600020015490508087600001848154811061087d5761087d610a6e565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806108b0576108b0610b15565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061029d565b600091505061029d565b60006020828403121561090757600080fd5b81356001600160e01b03198116811461036857600080fd5b60006020828403121561093157600080fd5b5035919050565b6000806040838503121561094b57600080fd5b8235915060208301356001600160a01b038116811461096957600080fd5b809150509250929050565b6000806040838503121561098757600080fd5b50508035926020909101359150565b60005b838110156109b1578181015183820152602001610999565b838111156109c0576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516109fe816017850160208801610996565b7001034b99036b4b9b9b4b733903937b6329607d1b6017918401918201528351610a2f816028840160208801610996565b01602801949350505050565b6020815260008251806020840152610a5a816040850160208701610996565b601f01601f19169190910160400192915050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610ab457610ab4610a84565b500290565b60008219821115610acc57610acc610a84565b500190565b634e487b7160e01b600052604160045260246000fd5b600081610af657610af6610a84565b506000190190565b600082821015610b1057610b10610a84565b500390565b634e487b7160e01b600052603160045260246000fdfea2646970667358221220e215129e08405826063865f572f3b9f30e297f819973eb05a5a837939bd5581764736f6c634300080e0033";

type RolesManagerUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RolesManagerUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RolesManagerUpgradeable__factory extends ContractFactory {
  constructor(...args: RolesManagerUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RolesManagerUpgradeable> {
    return super.deploy(overrides || {}) as Promise<RolesManagerUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RolesManagerUpgradeable {
    return super.attach(address) as RolesManagerUpgradeable;
  }
  override connect(signer: Signer): RolesManagerUpgradeable__factory {
    return super.connect(signer) as RolesManagerUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RolesManagerUpgradeableInterface {
    return new utils.Interface(_abi) as RolesManagerUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RolesManagerUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RolesManagerUpgradeable;
  }
}
