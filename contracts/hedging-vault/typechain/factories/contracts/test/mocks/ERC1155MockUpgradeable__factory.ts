/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  ERC1155MockUpgradeable,
  ERC1155MockUpgradeableInterface,
} from "../../../../contracts/test/mocks/ERC1155MockUpgradeable";

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
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "burnBatch",
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
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mint",
    outputs: [],
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "mintBatch",
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
        internalType: "string",
        name: "newuri",
        type: "string",
      },
    ],
    name: "setURI",
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
  "0x608060405234801561001057600080fd5b50611c98806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ce5760003560e01c80634e1273f41161008c578063a22cb46511610066578063a22cb465146101bd578063e985e9c5146101d0578063f242432a1461020c578063f5298aca1461021f57600080fd5b80634e1273f4146101775780636b20c45414610197578063731133e9146101aa57600080fd5b8062fdd58e146100d357806301ffc9a7146100f957806302fe53051461011c5780630e89341c146101315780631f7fdffa146101515780632eb2c2d614610164575b600080fd5b6100e66100e1366004611151565b610232565b6040519081526020015b60405180910390f35b61010c610107366004611191565b6102ca565b60405190151581526020016100f0565b61012f61012a366004611256565b61031c565b005b61014461013f3660046112a7565b610328565b6040516100f0919061130d565b61012f61015f3660046113d5565b6103bc565b61012f61017236600461146e565b6103ce565b61018a610185366004611518565b61041a565b6040516100f0919061161e565b61012f6101a5366004611631565b610544565b61012f6101b83660046116a5565b610554565b61012f6101cb3660046116fa565b610560565b61010c6101de366004611736565b6001600160a01b03918216600090815260666020908152604080832093909416825291909152205460ff1690565b61012f61021a366004611769565b61056f565b61012f61022d3660046117ce565b6105b4565b60006001600160a01b0383166102a25760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b60648201526084015b60405180910390fd5b5060009081526065602090815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b14806102fb57506001600160e01b031982166303a24d0760e21b145b8061031657506301ffc9a760e01b6001600160e01b03198316145b92915050565b610325816105bf565b50565b60606067805461033790611801565b80601f016020809104026020016040519081016040528092919081815260200182805461036390611801565b80156103b05780601f10610385576101008083540402835291602001916103b0565b820191906000526020600020905b81548152906001019060200180831161039357829003601f168201915b50505050509050919050565b6103c8848484846105d2565b50505050565b6001600160a01b0385163314806103ea57506103ea85336101de565b6104065760405162461bcd60e51b81526004016102999061183b565b610413858585858561071e565b5050505050565b6060815183511461047f5760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152608401610299565b6000835167ffffffffffffffff81111561049b5761049b6111b5565b6040519080825280602002602001820160405280156104c4578160200160208202803683370190505b50905060005b845181101561053c5761050f8582815181106104e8576104e861188a565b60200260200101518583815181106105025761050261188a565b6020026020010151610232565b8282815181106105215761052161188a565b6020908102919091010152610535816118b6565b90506104ca565b509392505050565b61054f8383836108bd565b505050565b6103c884848484610a4a565b61056b338383610b26565b5050565b6001600160a01b03851633148061058b575061058b85336101de565b6105a75760405162461bcd60e51b81526004016102999061183b565b6104138585858585610c06565b61054f838383610d34565b805161056b90606790602084019061109c565b6001600160a01b0384166105f85760405162461bcd60e51b8152600401610299906118cf565b81518351146106195760405162461bcd60e51b815260040161029990611910565b3360005b84518110156106b6578381815181106106385761063861188a565b6020026020010151606560008784815181106106565761065661188a565b602002602001015181526020019081526020016000206000886001600160a01b03166001600160a01b03168152602001908152602001600020600082825461069e9190611958565b909155508190506106ae816118b6565b91505061061d565b50846001600160a01b031660006001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610707929190611970565b60405180910390a461041381600087878787610e3b565b815183511461073f5760405162461bcd60e51b815260040161029990611910565b6001600160a01b0384166107655760405162461bcd60e51b81526004016102999061199e565b3360005b845181101561084f5760008582815181106107865761078661188a565b6020026020010151905060008583815181106107a4576107a461188a565b60209081029190910181015160008481526065835260408082206001600160a01b038e1683529093529190912054909150818110156107f55760405162461bcd60e51b8152600401610299906119e3565b60008381526065602090815260408083206001600160a01b038e8116855292528083208585039055908b16825281208054849290610834908490611958565b9250508190555050505080610848906118b6565b9050610769565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb878760405161089f929190611970565b60405180910390a46108b5818787878787610e3b565b505050505050565b6001600160a01b0383166108e35760405162461bcd60e51b815260040161029990611a2d565b80518251146109045760405162461bcd60e51b815260040161029990611910565b604080516020810190915260009081905233905b83518110156109dd5760008482815181106109355761093561188a565b6020026020010151905060008483815181106109535761095361188a565b60209081029190910181015160008481526065835260408082206001600160a01b038c1683529093529190912054909150818110156109a45760405162461bcd60e51b815260040161029990611a70565b60009283526065602090815260408085206001600160a01b038b16865290915290922091039055806109d5816118b6565b915050610918565b5060006001600160a01b0316846001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8686604051610a2e929190611970565b60405180910390a46040805160208101909152600090526103c8565b6001600160a01b038416610a705760405162461bcd60e51b8152600401610299906118cf565b336000610a7c85610f96565b90506000610a8985610f96565b905060008681526065602090815260408083206001600160a01b038b16845290915281208054879290610abd908490611958565b909155505060408051878152602081018790526001600160a01b03808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610b1d83600089898989610fe1565b50505050505050565b816001600160a01b0316836001600160a01b031603610b995760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b6064820152608401610299565b6001600160a01b03838116600081815260666020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b038416610c2c5760405162461bcd60e51b81526004016102999061199e565b336000610c3885610f96565b90506000610c4585610f96565b905060008681526065602090815260408083206001600160a01b038c16845290915290205485811015610c8a5760405162461bcd60e51b8152600401610299906119e3565b60008781526065602090815260408083206001600160a01b038d8116855292528083208985039055908a16825281208054889290610cc9908490611958565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610d29848a8a8a8a8a610fe1565b505050505050505050565b6001600160a01b038316610d5a5760405162461bcd60e51b815260040161029990611a2d565b336000610d6684610f96565b90506000610d7384610f96565b6040805160208082018352600091829052888252606581528282206001600160a01b038b1683529052205490915084811015610dc15760405162461bcd60e51b815260040161029990611a70565b60008681526065602090815260408083206001600160a01b038b81168086529184528285208a8703905582518b81529384018a90529092908816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4604080516020810190915260009052610b1d565b6001600160a01b0384163b156108b55760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610e7f9089908990889088908890600401611ab4565b6020604051808303816000875af1925050508015610eba575060408051601f3d908101601f19168201909252610eb791810190611b12565b60015b610f6657610ec6611b2f565b806308c379a003610eff5750610eda611b4b565b80610ee55750610f01565b8060405162461bcd60e51b8152600401610299919061130d565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e20455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b6064820152608401610299565b6001600160e01b0319811663bc197c8160e01b14610b1d5760405162461bcd60e51b815260040161029990611bd5565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610fd057610fd061188a565b602090810291909101015292915050565b6001600160a01b0384163b156108b55760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e61906110259089908990889088908890600401611c1d565b6020604051808303816000875af1925050508015611060575060408051601f3d908101601f1916820190925261105d91810190611b12565b60015b61106c57610ec6611b2f565b6001600160e01b0319811663f23a6e6160e01b14610b1d5760405162461bcd60e51b815260040161029990611bd5565b8280546110a890611801565b90600052602060002090601f0160209004810192826110ca5760008555611110565b82601f106110e357805160ff1916838001178555611110565b82800160010185558215611110579182015b828111156111105782518255916020019190600101906110f5565b5061111c929150611120565b5090565b5b8082111561111c5760008155600101611121565b80356001600160a01b038116811461114c57600080fd5b919050565b6000806040838503121561116457600080fd5b61116d83611135565b946020939093013593505050565b6001600160e01b03198116811461032557600080fd5b6000602082840312156111a357600080fd5b81356111ae8161117b565b9392505050565b634e487b7160e01b600052604160045260246000fd5b601f8201601f1916810167ffffffffffffffff811182821017156111f1576111f16111b5565b6040525050565b600067ffffffffffffffff831115611212576112126111b5565b604051611229601f8501601f1916602001826111cb565b80915083815284848401111561123e57600080fd5b83836020830137600060208583010152509392505050565b60006020828403121561126857600080fd5b813567ffffffffffffffff81111561127f57600080fd5b8201601f8101841361129057600080fd5b61129f848235602084016111f8565b949350505050565b6000602082840312156112b957600080fd5b5035919050565b6000815180845260005b818110156112e6576020818501810151868301820152016112ca565b818111156112f8576000602083870101525b50601f01601f19169290920160200192915050565b6020815260006111ae60208301846112c0565b600067ffffffffffffffff82111561133a5761133a6111b5565b5060051b60200190565b600082601f83011261135557600080fd5b8135602061136282611320565b60405161136f82826111cb565b83815260059390931b850182019282810191508684111561138f57600080fd5b8286015b848110156113aa5780358352918301918301611393565b509695505050505050565b600082601f8301126113c657600080fd5b6111ae838335602085016111f8565b600080600080608085870312156113eb57600080fd5b6113f485611135565b9350602085013567ffffffffffffffff8082111561141157600080fd5b61141d88838901611344565b9450604087013591508082111561143357600080fd5b61143f88838901611344565b9350606087013591508082111561145557600080fd5b50611462878288016113b5565b91505092959194509250565b600080600080600060a0868803121561148657600080fd5b61148f86611135565b945061149d60208701611135565b9350604086013567ffffffffffffffff808211156114ba57600080fd5b6114c689838a01611344565b945060608801359150808211156114dc57600080fd5b6114e889838a01611344565b935060808801359150808211156114fe57600080fd5b5061150b888289016113b5565b9150509295509295909350565b6000806040838503121561152b57600080fd5b823567ffffffffffffffff8082111561154357600080fd5b818501915085601f83011261155757600080fd5b8135602061156482611320565b60405161157182826111cb565b83815260059390931b850182019282810191508984111561159157600080fd5b948201945b838610156115b6576115a786611135565b82529482019490820190611596565b965050860135925050808211156115cc57600080fd5b506115d985828601611344565b9150509250929050565b600081518084526020808501945080840160005b83811015611613578151875295820195908201906001016115f7565b509495945050505050565b6020815260006111ae60208301846115e3565b60008060006060848603121561164657600080fd5b61164f84611135565b9250602084013567ffffffffffffffff8082111561166c57600080fd5b61167887838801611344565b9350604086013591508082111561168e57600080fd5b5061169b86828701611344565b9150509250925092565b600080600080608085870312156116bb57600080fd5b6116c485611135565b93506020850135925060408501359150606085013567ffffffffffffffff8111156116ee57600080fd5b611462878288016113b5565b6000806040838503121561170d57600080fd5b61171683611135565b91506020830135801515811461172b57600080fd5b809150509250929050565b6000806040838503121561174957600080fd5b61175283611135565b915061176060208401611135565b90509250929050565b600080600080600060a0868803121561178157600080fd5b61178a86611135565b945061179860208701611135565b93506040860135925060608601359150608086013567ffffffffffffffff8111156117c257600080fd5b61150b888289016113b5565b6000806000606084860312156117e357600080fd5b6117ec84611135565b95602085013595506040909401359392505050565b600181811c9082168061181557607f821691505b60208210810361183557634e487b7160e01b600052602260045260246000fd5b50919050565b6020808252602f908201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60408201526e195c881b9bdc88185c1c1c9bdd9959608a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016118c8576118c86118a0565b5060010190565b60208082526021908201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736040820152607360f81b606082015260800190565b60208082526028908201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206040820152670dad2e6dac2e8c6d60c31b606082015260800190565b6000821982111561196b5761196b6118a0565b500190565b60408152600061198360408301856115e3565b828103602084015261199581856115e3565b95945050505050565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b60208082526023908201527f455243313135353a206275726e2066726f6d20746865207a65726f206164647260408201526265737360e81b606082015260800190565b60208082526024908201527f455243313135353a206275726e20616d6f756e7420657863656564732062616c604082015263616e636560e01b606082015260800190565b6001600160a01b0386811682528516602082015260a060408201819052600090611ae0908301866115e3565b8281036060840152611af281866115e3565b90508281036080840152611b0681856112c0565b98975050505050505050565b600060208284031215611b2457600080fd5b81516111ae8161117b565b600060033d1115611b485760046000803e5060005160e01c5b90565b600060443d1015611b595790565b6040516003193d81016004833e81513d67ffffffffffffffff8160248401118184111715611b8957505050505090565b8285019150815181811115611ba15750505050505090565b843d8701016020828501011115611bbb5750505050505090565b611bca602082860101876111cb565b509095945050505050565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6001600160a01b03868116825285166020820152604081018490526060810183905260a060808201819052600090611c57908301846112c0565b97965050505050505056fea264697066735822122025897d7c4ec3ef8bf4caad509489decaa4d75709ee95b2644edad2f66ce3a68a64736f6c634300080e0033";

type ERC1155MockUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155MockUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155MockUpgradeable__factory extends ContractFactory {
  constructor(...args: ERC1155MockUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155MockUpgradeable> {
    return super.deploy(overrides || {}) as Promise<ERC1155MockUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC1155MockUpgradeable {
    return super.attach(address) as ERC1155MockUpgradeable;
  }
  override connect(signer: Signer): ERC1155MockUpgradeable__factory {
    return super.connect(signer) as ERC1155MockUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155MockUpgradeableInterface {
    return new utils.Interface(_abi) as ERC1155MockUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155MockUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as ERC1155MockUpgradeable;
  }
}
