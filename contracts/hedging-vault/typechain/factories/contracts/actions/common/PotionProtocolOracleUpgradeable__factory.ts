/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PotionProtocolOracleUpgradeable,
  PotionProtocolOracleUpgradeableInterface,
} from "../../../../contracts/actions/common/PotionProtocolOracleUpgradeable";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "prevAdmin",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newAdmin",
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
        name: "prevKeeper",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "KeeperChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
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
        name: "newKeeper",
        type: "address",
      },
    ],
    name: "changeKeeper",
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
    name: "getKeeper",
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
        internalType: "contract IOtoken",
        name: "otoken",
        type: "address",
      },
    ],
    name: "getSwapInfo",
    outputs: [
      {
        components: [
          {
            internalType: "contract IOtoken",
            name: "otoken",
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
            name: "maxPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInOtokens",
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
    inputs: [
      {
        components: [
          {
            internalType: "contract IOtoken",
            name: "otoken",
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
            name: "maxPremium",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalSizeInOtokens",
            type: "uint256",
          },
        ],
        internalType: "struct PotionProtocolOracleUpgradeable.PotionBuyInfo",
        name: "info",
        type: "tuple",
      },
    ],
    name: "setSwapInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610993806100206000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c8063097798381461006757806336a1b2371461007c578063391b6f4e146100a55780636e9960c3146100ca5780638f283970146100db578063dd7ff429146100ee575b600080fd5b61007a6100753660046104f4565b610101565b005b61008f61008a3660046104f4565b6101fb565b60405161009c9190610518565b60405180910390f35b6034546001600160a01b03165b6040516001600160a01b03909116815260200161009c565b6033546001600160a01b03166100b2565b61007a6100e93660046104f4565b61037f565b61007a6100fc366004610622565b61046f565b6033546001600160a01b0316336001600160a01b03161461013d5760405162461bcd60e51b81526004016101349061065d565b60405180910390fd5b6001600160a01b0381166101a95760405162461bcd60e51b815260206004820152602d60248201527f4e6577206b656570657220616464726573732063616e6e6f742062652074686560448201526c206e756c6c206164647265737360981b6064820152608401610134565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f068b48a2fe7f498b57ff6da64f075ae658fde8d77124b092e62b3dc58d91ce3590600090a35050565b61022f604051806080016040528060006001600160a01b031681526020016060815260200160008152602001600081525090565b6001600160a01b03808316600090815260656020908152604080832081516080810183528154909516855260018101805483518186028101860190945280845291948685019491929184015b8282101561035c5760008481526020908190206040805160a08082018352600c870290930180546001600160a01b0390811683526001808301548488015284518087018652600284015481526003840154818901526004840154818701526005840154606080830191909152600685015460808084019190915286880192909252865197880187526007850154841688526008850154938416888a0152600160a01b90930460ff16151595870195909552600983015486830152600a8301548686015290830194909452600b0154918101919091528352909201910161027b565b505050508152602001600282015481526020016003820154815250509050919050565b6033546001600160a01b0316336001600160a01b0316146103b25760405162461bcd60e51b81526004016101349061065d565b6001600160a01b03811661041d5760405162461bcd60e51b815260206004820152602c60248201527f4e65772061646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b6064820152608401610134565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b6034546001600160a01b0316336001600160a01b0316146104a25760405162461bcd60e51b81526004016101349061065d565b80606560006104b460208401846104f4565b6001600160a01b0316815260208101919091526040016000206104d782826107f6565b505050565b6001600160a01b03811681146104f157600080fd5b50565b60006020828403121561050657600080fd5b8135610511816104dc565b9392505050565b6000602080835260a080840160018060a01b038087511684870152838701516080604081818a015284835180875260c09650868b019150888501945060005b818110156105fd5785518051881684528a8101518b85015284810151805186860152808c01516060808701919091528187015188870152808201518c870152908701518a8601528082015180516001600160a01b0390811660e0880152602082015116610100870152604081015115156101208701529081015161014086015260800151610160850152850151610180840152948901946101a090920191600101610557565b5050818b015160608b015260608b0151838b0152809850505050505050505092915050565b60006020828403121561063457600080fd5b813567ffffffffffffffff81111561064b57600080fd5b82016080818503121561051157600080fd5b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b80546001600160a01b0319166001600160a01b0392909216919091179055565b60007f155555555555555555555555555555555555555555555555555555555555555582116001161561070557634e487b7160e01b600052601160045260246000fd5b50600c0290565b8135610717816104dc565b61072181836106a2565b50600181016020830135610734816104dc565b61073e81836106a2565b50604083013580151580821461075357600080fd5b825460ff60a01b191660a09190911b60ff60a01b16179091555060608201356002820155608090910135600390910155565b8135610790816104dc565b61079a81836106a2565b506020820135600182015560408201356002820155606082013560038201556080820135600482015560a0820135600582015560c082013560068201556107e760e083016007830161070c565b610180820135600b8201555050565b8135610801816104dc565b61080b81836106a2565b5060018082016020840135601e1985360301811261082857600080fd5b8401803567ffffffffffffffff81111561084157600080fd5b6020820191506101a0808202360383131561085b57600080fd5b6801000000000000000082111561088257634e487b7160e01b600052604160045260246000fd5b83548285558083101561090f57610898816106c2565b6108a1846106c2565b6000878152602081209283019291909101905b8282101561090b57808255808983015580600283015580600383015580600483015580600583015580600683015580600783015580600883015580600983015580600a83015580600b830155600c820191506108b4565b5050505b50600093845260208420935b8281101561093f5761092d8486610785565b600c949094019392810192850161091b565b5050505050506040820135600282015560608201356003820155505056fea26469706673582212205ff948474561c57c3145d0bdd372aa5a3de7fea6f9d7e380958e329e1428be7c64736f6c634300080e0033";

type PotionProtocolOracleUpgradeableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PotionProtocolOracleUpgradeableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PotionProtocolOracleUpgradeable__factory extends ContractFactory {
  constructor(...args: PotionProtocolOracleUpgradeableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PotionProtocolOracleUpgradeable> {
    return super.deploy(
      overrides || {}
    ) as Promise<PotionProtocolOracleUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PotionProtocolOracleUpgradeable {
    return super.attach(address) as PotionProtocolOracleUpgradeable;
  }
  override connect(signer: Signer): PotionProtocolOracleUpgradeable__factory {
    return super.connect(signer) as PotionProtocolOracleUpgradeable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PotionProtocolOracleUpgradeableInterface {
    return new utils.Interface(
      _abi
    ) as PotionProtocolOracleUpgradeableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PotionProtocolOracleUpgradeable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PotionProtocolOracleUpgradeable;
  }
}
