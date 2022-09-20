/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  PotionProtocolOracleUpgradeable,
  PotionProtocolOracleUpgradeableInterface,
} from "../../../../contracts/actions/common/PotionProtocolOracleUpgradeable";

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
        internalType: "address",
        name: "underlyingAsset",
        type: "address",
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
  "0x608060405234801561001057600080fd5b506112dd806100206000396000f3fe608060405234801561001057600080fd5b50600436106101005760003560e01c806391d1485411610097578063ca15c87311610066578063ca15c87314610261578063d547741f14610274578063db8cc73a14610287578063f5b541a61461029a57600080fd5b806391d148541461020057806398c4f1ac14610213578063a217fddf14610186578063a378a3241461023a57600080fd5b806375b238fc116100d357806375b238fc1461018657806376082a5e1461018e57806386ffce40146101b55780639010d07c146101d557600080fd5b806301ffc9a714610105578063248a9ca31461012d5780632f2ff15d1461015e57806336568abe14610173575b600080fd5b610118610113366004610bc0565b6102c1565b60405190151581526020015b60405180910390f35b61015061013b366004610bea565b60009081526065602052604090206001015490565b604051908152602001610124565b61017161016c366004610c18565b6102ec565b005b610171610181366004610c18565b610316565b610150600081565b6101507fb165298935924f540e4181c03493a5d686c54a0aaeb3f6216de85b7ffbba773881565b6101c86101c3366004610c48565b610399565b6040516101249190610c74565b6101e86101e3366004610dad565b610569565b6040516001600160a01b039091168152602001610124565b61011861020e366004610c18565b610588565b6101507f31e0210044b4f6757ce6aa31f9c6e8d4896d24a755014887391a926c5224d95981565b6101507f17a8e30262c1f919c33056d877a3c22b95c2f5e4dac44683c1c2323cd79fbdb081565b61015061026f366004610bea565b6105b3565b610171610282366004610c18565b6105ca565b610171610295366004610dcf565b6105ef565b6101507f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92981565b60006001600160e01b03198216635a05180f60e01b14806102e657506102e68261065a565b92915050565b6000828152606560205260409020600101546103078161068f565b610311838361069c565b505050565b6001600160a01b038116331461038b5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b61039582826106be565b5050565b6103eb6040518060e0016040528060006001600160a01b0316815260200160006001600160a01b0316815260200160008152602001600081526020016060815260200160008152602001600081525090565b60006103f784846106e0565b600081815260c960209081526040808320815160e08101835281546001600160a01b039081168252600183015416818501526002820154818401526003820154606082015260048201805484518187028101870190955280855296975090959194608087019491929184015b828210156105445760008481526020908190206040805160a08082018352600c870290930180546001600160a01b0390811683526001808301548488015284518087018652600284015481526003840154818901526004840154818701526005840154606080830191909152600685015460808084019190915286880192909252865197880187526007850154841688526008850154938416888a0152600160a01b90930460ff16151595870195909552600983015486830152600a8301548686015290830194909452600b01549181019190915283529092019101610463565b5050505081526020016005820154815260200160068201548152505091505092915050565b60008281526097602052604081206105819083610727565b9392505050565b60009182526065602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60008181526097602052604081206102e690610733565b6000828152606560205260409020600101546105e58161068f565b61031183836106be565b6106187f97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b92961068f565b600061063761062d6040840160208501610e0a565b83606001356106e0565b600081815260c960205260409020909150829061065482826110aa565b50505050565b60006001600160e01b03198216637965db0b60e01b14806102e657506301ffc9a760e01b6001600160e01b03198316146102e6565b610699813361073d565b50565b6106a682826107a1565b60008281526097602052604090206103119082610827565b6106c8828261083c565b600082815260976020526040902061031190826108a3565b6040516bffffffffffffffffffffffff19606084901b1660208201526034810182905260009060540160405160208183030381529060405280519060200120905092915050565b600061058183836108b8565b60006102e6825490565b6107478282610588565b6103955761075f816001600160a01b031660146108e2565b61076a8360206108e2565b60405160200161077b92919061118d565b60408051601f198184030181529082905262461bcd60e51b825261038291600401611202565b6107ab8282610588565b6103955760008281526065602090815260408083206001600160a01b03851684529091529020805460ff191660011790556107e33390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000610581836001600160a01b038416610a7e565b6108468282610588565b156103955760008281526065602090815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b6000610581836001600160a01b038416610acd565b60008260000182815481106108cf576108cf611235565b9060005260206000200154905092915050565b606060006108f1836002610e73565b6108fc90600261124b565b67ffffffffffffffff81111561091457610914610e47565b6040519080825280601f01601f19166020018201604052801561093e576020820181803683370190505b509050600360fc1b8160008151811061095957610959611235565b60200101906001600160f81b031916908160001a905350600f60fb1b8160018151811061098857610988611235565b60200101906001600160f81b031916908160001a90535060006109ac846002610e73565b6109b790600161124b565b90505b6001811115610a2f576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106109eb576109eb611235565b1a60f81b828281518110610a0157610a01611235565b60200101906001600160f81b031916908160001a90535060049490941c93610a2881611263565b90506109ba565b5083156105815760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610382565b6000818152600183016020526040812054610ac5575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556102e6565b5060006102e6565b60008181526001830160205260408120548015610bb6576000610af160018361127a565b8554909150600090610b059060019061127a565b9050818114610b6a576000866000018281548110610b2557610b25611235565b9060005260206000200154905080876000018481548110610b4857610b48611235565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080610b7b57610b7b611291565b6001900381819060005260206000200160009055905585600101600086815260200190815260200160002060009055600193505050506102e6565b60009150506102e6565b600060208284031215610bd257600080fd5b81356001600160e01b03198116811461058157600080fd5b600060208284031215610bfc57600080fd5b5035919050565b6001600160a01b038116811461069957600080fd5b60008060408385031215610c2b57600080fd5b823591506020830135610c3d81610c03565b809150509250929050565b60008060408385031215610c5b57600080fd5b8235610c6681610c03565b946020939093013593505050565b60006020808352610100830160018060a01b0380865116838601528286015160408282168188015280880151915060608281890152808901519250608083818a0152808a0151935060e060a081818c0152878651808a526101208d0191508a88019950600097505b80881015610d8757895180518a1683528b8101518c84015287810151805189850152808d0151888501528089015187850152878101518585015286015160c084015286810151610d668685018280516001600160a01b0390811683526020808301519091169083015260408082015115159083015260608082015190830152608090810151910152565b50850151610180830152988a0198600197909701966101a090910190610cdc565b50818d015160c08d015260c08d0151838d0152809a505050505050505050505092915050565b60008060408385031215610dc057600080fd5b50508035926020909101359150565b600060208284031215610de157600080fd5b813567ffffffffffffffff811115610df857600080fd5b820160e0818503121561058157600080fd5b600060208284031215610e1c57600080fd5b813561058181610c03565b80546001600160a01b0319166001600160a01b0392909216919091179055565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610e8d57610e8d610e5d565b500290565b8135610e9d81610c03565b610ea78183610e27565b50600181016020830135610eba81610c03565b610ec48183610e27565b506040830135801515808214610ed957600080fd5b825460ff60a01b191660a09190911b60ff60a01b16179091555060608201356002820155608090910135600390910155565b8135610f1681610c03565b610f208183610e27565b506020820135600182015560408201356002820155606082013560038201556080820135600482015560a0820135600582015560c08201356006820155610f6d60e0830160078301610e92565b610180820135600b8201555050565b68010000000000000000831115610fa357634e487b7160e01b600052604160045260246000fd5b80548382558084101561106c577f15555555555555555555555555555555555555555555555555555555555555556001818311811615610fe557610fe5610e5d565b600c828711821615610ff957610ff9610e5d565b600085815260208120909350878202810190828602015b8082101561106657848255848483015584600283015584600383015584600483015584600583015584600683015584600783015584600883015584600983015584600a83015584600b8301558282019150611010565b50505050505b5060008181526020812083915b858110156110a25761108b8383610f0b565b6101a09290920191600c9190910190600101611079565b505050505050565b81356110b581610c03565b6110bf8183610e27565b5060208201356110ce81610c03565b6110db8160018401610e27565b5060408201356002820155606082013560038201556080820135601e1983360301811261110757600080fd5b8201803567ffffffffffffffff81111561112057600080fd5b6020820191506101a08102360382131561113957600080fd5b611147818360048601610f7c565b505060a0820135600582015560c082013560068201555050565b60005b8381101561117c578181015183820152602001611164565b838111156106545750506000910152565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516111c5816017850160208801611161565b7001034b99036b4b9b9b4b733903937b6329607d1b60179184019182015283516111f6816028840160208801611161565b01602801949350505050565b6020815260008251806020840152611221816040850160208701611161565b601f01601f19169190910160400192915050565b634e487b7160e01b600052603260045260246000fd5b6000821982111561125e5761125e610e5d565b500190565b60008161127257611272610e5d565b506000190190565b60008282101561128c5761128c610e5d565b500390565b634e487b7160e01b600052603160045260246000fdfea264697066735822122001fdd0fdcaf45961f49a9cfcdd75fd3594b7748e2a6204a3769994ae8bc02e8164736f6c634300080e0033";

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
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<PotionProtocolOracleUpgradeable> {
    return super.deploy(
      overrides || {}
    ) as Promise<PotionProtocolOracleUpgradeable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
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
