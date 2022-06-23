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
    inputs: [
      {
        internalType: "address",
        name: "hedgedAsset",
        type: "address",
      },
    ],
    name: "getPotion",
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
        name: "potion",
        type: "address",
      },
    ],
    name: "getPotionBuyInfo",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "potion",
            type: "address",
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
        internalType: "struct PotionProtocolOracleUpgradeable.PotionBuyInfo",
        name: "",
        type: "tuple",
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
        internalType: "contract IERC20",
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
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "potion",
            type: "address",
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
        internalType: "struct PotionProtocolOracleUpgradeable.PotionBuyInfo",
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
  "0x608060405234801561001057600080fd5b50610bdf806100206000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80636e9960c3116100715780636e9960c31461013257806372eb05b914610143578063787baae9146101565780638f283970146101825780639875196b14610195578063e7f43c68146101b557600080fd5b806306394c9b146100ae5780631bf01e9b146100c357806334d9b2dc146100ed5780634f66a9d6146100fe5780636802471714610111575b600080fd5b6100c16100bc3660046106d6565b6101c6565b005b6069546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b6035546001600160a01b03166100d0565b6100c161010c3660046106fa565b61027a565b61012461011f3660046106d6565b61032a565b6040519081526020016100e4565b6033546001600160a01b03166100d0565b6100c16101513660046106d6565b61039f565b6100d06101643660046106d6565b6001600160a01b039081166000908152606860205260409020541690565b6100c16101903660046106d6565b61044a565b6101a86101a33660046106d6565b61053a565b6040516100e49190610735565b6034546001600160a01b03166100d0565b6033546001600160a01b0316336001600160a01b0316146102025760405162461bcd60e51b81526004016101f99061083f565b60405180910390fd5b6001600160a01b0381166102285760405162461bcd60e51b81526004016101f990610884565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6035546001600160a01b0316336001600160a01b0316146102f05760405162461bcd60e51b815260206004820152602a60248201527f4f6e6c792074686520537472617465676973742063616e2063616c6c207468696044820152693990333ab731ba34b7b760b11b60648201526084016101f9565b806065600061030260208401846106d6565b6001600160a01b0316815260208101919091526040016000206103258282610a29565b505050565b6069546040516370a0823160e01b81526001600160a01b03838116600483015260009216906370a0823190602401602060405180830381865afa158015610375573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103999190610b90565b92915050565b6033546001600160a01b0316336001600160a01b0316146103d25760405162461bcd60e51b81526004016101f99061083f565b6001600160a01b0381166103f85760405162461bcd60e51b81526004016101f990610884565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6033546001600160a01b0316336001600160a01b03161461047d5760405162461bcd60e51b81526004016101f99061083f565b6001600160a01b0381166104e85760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b60648201526084016101f9565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b61056e604051806080016040528060006001600160a01b031681526020016060815260200160008152602001600081525090565b6001600160a01b03808316600090815260656020908152604080832081516080810183528154909516855260018101805483518186028101860190945280845291948685019491929184015b8282101561069b5760008481526020908190206040805160a08082018352600c870290930180546001600160a01b0390811683526001808301548488015284518087018652600284015481526003840154818901526004840154818701526005840154606080830191909152600685015460808084019190915286880192909252865197880187526007850154841688526008850154938416888a0152600160a01b90930460ff16151595870195909552600983015486830152600a8301548686015290830194909452600b015491810191909152835290920191016105ba565b505050508152602001600282015481526020016003820154815250509050919050565b6001600160a01b03811681146106d357600080fd5b50565b6000602082840312156106e857600080fd5b81356106f3816106be565b9392505050565b60006020828403121561070c57600080fd5b813567ffffffffffffffff81111561072357600080fd5b8201608081850312156106f357600080fd5b6000602080835260a080840160018060a01b038087511684870152838701516080604081818a015284835180875260c09650868b019150888501945060005b8181101561081a5785518051881684528a8101518b85015284810151805186860152808c01516060808701919091528187015188870152808201518c870152908701518a8601528082015180516001600160a01b0390811660e0880152602082015116610100870152604081015115156101208701529081015161014086015260800151610160850152850151610180840152948901946101a090920191600101610774565b5050818b015160608b015260608b0151838b0152809850505050505050505092915050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b60208082526031908201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560408201527020746865206e756c6c206164647265737360781b606082015260800190565b80546001600160a01b0319166001600160a01b0392909216919091179055565b60007f155555555555555555555555555555555555555555555555555555555555555582116001161561093857634e487b7160e01b600052601160045260246000fd5b50600c0290565b813561094a816106be565b61095481836108d5565b50600181016020830135610967816106be565b61097181836108d5565b50604083013580151580821461098657600080fd5b825460ff60a01b191660a09190911b60ff60a01b16179091555060608201356002820155608090910135600390910155565b81356109c3816106be565b6109cd81836108d5565b506020820135600182015560408201356002820155606082013560038201556080820135600482015560a0820135600582015560c08201356006820155610a1a60e083016007830161093f565b610180820135600b8201555050565b8135610a34816106be565b610a3e81836108d5565b5060018082016020840135601e19853603018112610a5b57600080fd5b8401803567ffffffffffffffff811115610a7457600080fd5b6020820191506101a08082023603831315610a8e57600080fd5b68010000000000000000821115610ab557634e487b7160e01b600052604160045260246000fd5b835482855580831015610b4257610acb816108f5565b610ad4846108f5565b6000878152602081209283019291909101905b82821015610b3e57808255808983015580600283015580600383015580600483015580600583015580600683015580600783015580600883015580600983015580600a83015580600b830155600c82019150610ae7565b5050505b50600093845260208420935b82811015610b7257610b6084866109b8565b600c9490940193928101928501610b4e565b50505050505060408201356002820155606082013560038201555050565b600060208284031215610ba257600080fd5b505191905056fea2646970667358221220e000ebee39e7d99735cde586ec3eab841ec827c8c75994bd25e68e381edeb39264736f6c634300080e0033";

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
