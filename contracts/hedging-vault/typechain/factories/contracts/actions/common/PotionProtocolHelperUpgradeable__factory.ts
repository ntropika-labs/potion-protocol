/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PotionProtocolHelperUpgradeable,
  PotionProtocolHelperUpgradeableInterface,
} from "../../../../contracts/actions/common/PotionProtocolHelperUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdminAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdminAddress",
        type: "address",
      },
    ],
    name: "AdminChanged",
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
        name: "prevOperatorAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "OperatorChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevStrategistAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "StrategistChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevVaultAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "VaultChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdminAddress",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOperatorAddress",
        type: "address",
      },
    ],
    name: "changeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newStrategistAddress",
        type: "address",
      },
    ],
    name: "changeStrategist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newVaultAddress",
        type: "address",
      },
    ],
    name: "changeVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAdmin",
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
    name: "getOperator",
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
    name: "getOpynController",
    outputs: [
      {
        internalType: "contract IOpynController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOpynFactory",
    outputs: [
      {
        internalType: "contract IOpynFactory",
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
        name: "underlyingAsset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "strikePrice",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expirationTimestamp",
        type: "uint256",
      },
    ],
    name: "getPotionBuyInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "strikePriceInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimestamp",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "lp",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "int256",
                    name: "a_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "b_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "c_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "d_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "max_util_59x18",
                    type: "int256",
                  },
                ],
                internalType: "struct ICurveManager.Curve",
                name: "curve",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "underlyingAsset",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "strikeAsset",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "isPut",
                    type: "bool",
                  },
                  {
                    internalType: "uint256",
                    name: "maxStrikePercent",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxDurationInDays",
                    type: "uint256",
                  },
                ],
                internalType: "struct ICriteriaManager.Criteria",
                name: "criteria",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "orderSizeInOtokens",
                type: "uint256",
              },
            ],
            internalType: "struct IPotionLiquidityPool.CounterpartyDetails[]",
            name: "sellers",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInPotions",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPotionLiquidityManager",
    outputs: [
      {
        internalType: "contract IPotionLiquidityPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStrategist",
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
    name: "getUSDC",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
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
    name: "getUSDCBalance",
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
    name: "getVault",
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
        components: [
          {
            internalType: "address",
            name: "targetPotionAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "underlyingAsset",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "strikePriceInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimestamp",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "address",
                name: "lp",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "poolId",
                type: "uint256",
              },
              {
                components: [
                  {
                    internalType: "int256",
                    name: "a_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "b_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "c_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "d_59x18",
                    type: "int256",
                  },
                  {
                    internalType: "int256",
                    name: "max_util_59x18",
                    type: "int256",
                  },
                ],
                internalType: "struct ICurveManager.Curve",
                name: "curve",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "address",
                    name: "underlyingAsset",
                    type: "address",
                  },
                  {
                    internalType: "address",
                    name: "strikeAsset",
                    type: "address",
                  },
                  {
                    internalType: "bool",
                    name: "isPut",
                    type: "bool",
                  },
                  {
                    internalType: "uint256",
                    name: "maxStrikePercent",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "maxDurationInDays",
                    type: "uint256",
                  },
                ],
                internalType: "struct ICriteriaManager.Criteria",
                name: "criteria",
                type: "tuple",
              },
              {
                internalType: "uint256",
                name: "orderSizeInOtokens",
                type: "uint256",
              },
            ],
            internalType: "struct IPotionLiquidityPool.CounterpartyDetails[]",
            name: "sellers",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "expectedPremiumInUSDC",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInPotions",
            type: "uint256",
          },
        ],
        internalType: "struct PotionBuyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "setPotionBuyInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610efa806100206000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c806368024717116100975780638f283970116100665780638f283970146101f5578063a33e00a414610208578063db8cc73a14610219578063e7f43c681461022c57600080fd5b8063680247171461019f5780636e9960c3146101c057806372eb05b9146101d15780638d928af8146101e457600080fd5b8063273951de116100d3578063273951de1461014a57806334d9b2dc1461015b57806357e9da181461016c57806360e232a91461018c57600080fd5b806306394c9b146100fa57806310c68ce81461010f5780631bf01e9b14610139575b600080fd5b61010d61010836600461099b565b61023d565b005b6068546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b606a546001600160a01b031661011c565b6067546001600160a01b031661011c565b6034546001600160a01b031661011c565b61017f61017a3660046109bf565b610285565b60405161013091906109f4565b61010d61019a36600461099b565b610457565b6101b26101ad36600461099b565b610493565b604051908152602001610130565b6033546001600160a01b031661011c565b61010d6101df36600461099b565b610508565b6036546001600160a01b031661011c565b61010d61020336600461099b565b610544565b6066546001600160a01b031661011c565b61010d610227366004610b2d565b610580565b6035546001600160a01b031661011c565b6033546001600160a01b0316336001600160a01b0316146102795760405162461bcd60e51b815260040161027090610b68565b60405180910390fd5b6102828161063b565b50565b6102d76040518060e0016040528060006001600160a01b0316815260200160006001600160a01b0316815260200160008152602001600081526020016060815260200160008152602001600081525090565b60006102e48585856106fb565b6000818152606560209081526040808320815160e08101835281546001600160a01b039081168252600183015416818501526002820154818401526003820154606082015260048201805484518187028101870190955280855296975090959194608087019491929184015b828210156104315760008481526020908190206040805160a08082018352600c870290930180546001600160a01b0390811683526001808301548488015284518087018652600284015481526003840154818901526004840154818701526005840154606080830191909152600685015460808084019190915286880192909252865197880187526007850154841688526008850154938416888a0152600160a01b90930460ff16151595870195909552600983015486830152600a8301548686015290830194909452600b01549181019190915283529092019101610350565b505050508152602001600582015481526020016006820154815250509150509392505050565b6033546001600160a01b0316336001600160a01b03161461048a5760405162461bcd60e51b815260040161027090610b68565b6102828161074a565b606a546040516370a0823160e01b81526001600160a01b03838116600483015260009216906370a0823190602401602060405180830381865afa1580156104de573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105029190610bad565b92915050565b6033546001600160a01b0316336001600160a01b03161461053b5760405162461bcd60e51b815260040161027090610b68565b61028281610807565b6033546001600160a01b0316336001600160a01b0316146105775760405162461bcd60e51b815260040161027090610b68565b610282816108c9565b6035546001600160a01b0316336001600160a01b0316146105f45760405162461bcd60e51b815260206004820152602860248201527f4f6e6c7920746865204f70657261746f722063616e2063616c6c207468697320604482015267333ab731ba34b7b760c11b6064820152608401610270565b6000610618610609604084016020850161099b565b836040013584606001356106fb565b600081815260656020526040902090915082906106358282610e0d565b50505050565b6001600160a01b0381166106a95760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b6064820152608401610270565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b6040516bffffffffffffffffffffffff19606085901b16602082015260348101839052605481018290526000906074016040516020818303038152906040528051906020012090509392505050565b6001600160a01b0381166107b55760405162461bcd60e51b815260206004820152602c60248201527f4e6577205661756c7420616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610270565b603680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f16e2accad9173abff57b295b56993ec5d86b3cbf791fea02f02a6616463754ea90600090a35050565b6001600160a01b0381166108775760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b6064820152608401610270565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6001600160a01b0381166109345760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610270565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b6001600160a01b038116811461028257600080fd5b6000602082840312156109ad57600080fd5b81356109b881610986565b9392505050565b6000806000606084860312156109d457600080fd5b83356109df81610986565b95602085013595506040909401359392505050565b60006020808352610100830160018060a01b0380865116838601528286015160408282168188015280880151915060608281890152808901519250608083818a0152808a0151935060e060a081818c0152878651808a526101208d0191508a88019950600097505b80881015610b0757895180518a1683528b8101518c84015287810151805189850152808d0151888501528089015187850152878101518585015286015160c084015286810151610ae68685018280516001600160a01b0390811683526020808301519091169083015260408082015115159083015260608082015190830152608090810151910152565b50850151610180830152988a0198600197909701966101a090910190610a5c565b50818d015160c08d015260c08d0151838d0152809a505050505050505050505092915050565b600060208284031215610b3f57600080fd5b813567ffffffffffffffff811115610b5657600080fd5b820160e081850312156109b857600080fd5b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b600060208284031215610bbf57600080fd5b5051919050565b80546001600160a01b0319166001600160a01b0392909216919091179055565b60007f1555555555555555555555555555555555555555555555555555555555555555821160011615610c2957634e487b7160e01b600052601160045260246000fd5b50600c0290565b8135610c3b81610986565b610c458183610bc6565b50600181016020830135610c5881610986565b610c628183610bc6565b506040830135801515808214610c7757600080fd5b825460ff60a01b191660a09190911b60ff60a01b16179091555060608201356002820155608090910135600390910155565b8135610cb481610986565b610cbe8183610bc6565b506020820135600182015560408201356002820155606082013560038201556080820135600482015560a0820135600582015560c08201356006820155610d0b60e0830160078301610c30565b610180820135600b8201555050565b68010000000000000000831115610d4157634e487b7160e01b600052604160045260246000fd5b805483825580841015610dcf57610d5781610be6565b610d6085610be6565b6000848152602081209283019291909101905b82821015610dcb5780825580600183015580600283015580600383015580600483015580600583015580600683015580600783015580600883015580600983015580600a83015580600b830155600c82019150610d73565b5050505b5060008181526020812083915b85811015610e0557610dee8383610ca9565b6101a09290920191600c9190910190600101610ddc565b505050505050565b8135610e1881610986565b610e228183610bc6565b506020820135610e3181610986565b610e3e8160018401610bc6565b5060408201356002820155606082013560038201556080820135601e19833603018112610e6a57600080fd5b8201803567ffffffffffffffff811115610e8357600080fd5b6020820191506101a081023603821315610e9c57600080fd5b610eaa818360048601610d1a565b505060a0820135600582015560c08201356006820155505056fea2646970667358221220c5ccf8289bce7ac38cf63676efbbefb0088514f9e24151323e2d85d6c2eaa11464736f6c634300080e0033";

type PotionProtocolHelperUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PotionProtocolHelperUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PotionProtocolHelperUpgradeable__factory extends ContractFactory {
  constructor(...args: PotionProtocolHelperUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PotionProtocolHelperUpgradeable> {
    return super.deploy(
      overrides || {}
    ) as Promise<PotionProtocolHelperUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PotionProtocolHelperUpgradeable {
    return super.attach(address) as PotionProtocolHelperUpgradeable;
  }
  override connect(signer: Signer): PotionProtocolHelperUpgradeable__factory {
    return super.connect(signer) as PotionProtocolHelperUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PotionProtocolHelperUpgradeableInterface {
    return new utils.Interface(
      _abi
    ) as PotionProtocolHelperUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PotionProtocolHelperUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PotionProtocolHelperUpgradeable;
  }
}
