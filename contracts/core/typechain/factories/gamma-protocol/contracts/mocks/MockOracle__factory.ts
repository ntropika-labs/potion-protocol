/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockOracle,
  MockOracleInterface,
} from "../../../../gamma-protocol/contracts/mocks/MockOracle";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
    ],
    name: "getChainlinkRoundData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
    ],
    name: "getExpiryPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "_asset",
        type: "address",
      },
    ],
    name: "getPrice",
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
        name: "_asset",
        type: "address",
      },
    ],
    name: "getPricer",
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
        name: "_pricer",
        type: "address",
      },
    ],
    name: "getPricerDisputePeriod",
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
        name: "_pricer",
        type: "address",
      },
    ],
    name: "getPricerLockingPeriod",
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
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
    ],
    name: "isDisputePeriodOver",
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
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "isFinalized",
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
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
    ],
    name: "isLockingPeriodOver",
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
    name: "realTimePrice",
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
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_pricer",
        type: "address",
      },
    ],
    name: "setAssetPricer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint80",
        name: "_roundId",
        type: "uint80",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timestamp",
        type: "uint256",
      },
    ],
    name: "setChainlinkRoundData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "_pricer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_disputePeriod",
        type: "uint256",
      },
    ],
    name: "setDisputePeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setExpiryPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isFinalized",
        type: "bool",
      },
    ],
    name: "setExpiryPriceFinalizedAllPeiodOver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_result",
        type: "bool",
      },
    ],
    name: "setIsDisputePeriodOver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isFinalized",
        type: "bool",
      },
    ],
    name: "setIsFinalized",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expiryTimestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_result",
        type: "bool",
      },
    ],
    name: "setIsLockingPeriodOver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_pricer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_lockingPeriod",
        type: "uint256",
      },
    ],
    name: "setLockingPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setRealTimePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "setStablePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "storedPrice",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610a13806100206000396000f3fe608060405234801561001057600080fd5b50600436106101425760003560e01c8063854a5bdf116100b8578063b06206321161007c578063b0620632146104a9578063b7e1d145146104d5578063d2f3b4e8146104fb578063d9e800cd14610527578063ee5314091461055b578063f19ae7341461058d57610142565b8063854a5bdf146103bd5780638b3cddaf146103f15780639933cc451461041d5780639a4c9dfb146104575780639c7fe9d61461048357610142565b80632ecd88571161010a5780632ecd8857146102955780633fd3ec8f146102d757806341976e091461030557806355a5bc7c1461032b5780635fdc714914610351578063601407eb1461039157610142565b806301957f81146101475780630701c0211461018c578063098a03d1146101ca5780631379b23a146102275780631b85462d1461025d575b600080fd5b6101736004803603604081101561015d57600080fd5b506001600160a01b0381351690602001356105b9565b6040805192835290151560208301528051918290030190f35b6101b8600480360360408110156101a257600080fd5b506001600160a01b038135169060200135610623565b60408051918252519081900360200190f35b61020e600480360360808110156101e057600080fd5b506001600160a01b038135169069ffffffffffffffffffff6020820135169060408101359060600135610640565b6040805192835260208301919091528051918290030190f35b61025b6004803603606081101561023d57600080fd5b506001600160a01b0381351690602081013590604001351515610692565b005b61020e6004803603604081101561027357600080fd5b5080356001600160a01b0316906020013569ffffffffffffffffffff166106c7565b6102bb600480360360208110156102ab57600080fd5b50356001600160a01b0316610713565b604080516001600160a01b039092168252519081900360200190f35b61025b600480360360408110156102ed57600080fd5b506001600160a01b0381358116916020013516610731565b6101b86004803603602081101561031b57600080fd5b50356001600160a01b031661075f565b6101b86004803603602081101561034157600080fd5b50356001600160a01b031661079e565b61037d6004803603604081101561036757600080fd5b506001600160a01b0381351690602001356107b0565b604080519115158252519081900360200190f35b61025b600480360360408110156103a757600080fd5b506001600160a01b0381351690602001356107db565b61025b600480360360608110156103d357600080fd5b506001600160a01b03813516906020810135906040013515156107f7565b61025b6004803603604081101561040757600080fd5b506001600160a01b03813516906020013561082c565b61025b6004803603608081101561043357600080fd5b506001600160a01b0381351690602081013590604081013590606001351515610848565b61037d6004803603604081101561046d57600080fd5b506001600160a01b0381351690602001356108c9565b6101b86004803603602081101561049957600080fd5b50356001600160a01b03166108e9565b61025b600480360360408110156104bf57600080fd5b506001600160a01b038135169060200135610904565b6101b8600480360360208110156104eb57600080fd5b50356001600160a01b0316610920565b61037d6004803603604081101561051157600080fd5b506001600160a01b03813516906020013561093b565b61025b6004803603606081101561053d57600080fd5b506001600160a01b0381351690602081013590604001351515610966565b61025b6004803603606081101561057157600080fd5b506001600160a01b03813516906020810135906040013561099b565b61025b600480360360408110156105a357600080fd5b506001600160a01b0381351690602001356109c1565b6001600160a01b03821660009081526002602052604081205481906001816106185750506001600160a01b03841660008181526001602090815260408083208784528252808320549383526003825280832087845290915290205460ff165b909590945092505050565b600160209081526000928352604080842090915290825290205481565b6001600160a01b03909316600081815260096020908152604080832069ffffffffffffffffffff90961680845295825280832094909455918152600a8252828120938152929052812091909155908190565b6001600160a01b0392909216600090815260086020908152604080832093835292905220805460ff1916911515919091179055565b6001600160a01b038216600081815260096020908152604080832069ffffffffffffffffffff861680855290835281842054948452600a83528184209084529091529020549250929050565b6001600160a01b039081166000908152600660205260409020541690565b6001600160a01b03918216600090815260066020526040902080546001600160a01b03191691909216179055565b6001600160a01b0381166000908152600260205260408120548061079857506001600160a01b0382166000908152602081905260409020545b92915050565b60006020819052908152604090205481565b6001600160a01b03919091166000908152600760209081526040808320938352929052205460ff1690565b6001600160a01b03909116600090815260026020526040902055565b6001600160a01b0392909216600090815260076020908152604080832093835292905220805460ff1916911515919091179055565b6001600160a01b03909116600090815260056020526040902055565b6001600160a01b039093166000818152600160209081526040808320868452825280832094909455828252600381528382208583528152838220805496151560ff1997881681179091558383526007825284832086845282528483208054881682179055928252600881528382209482529390935291208054909216179055565b600360209081526000928352604080842090915290825290205460ff1681565b6001600160a01b031660009081526005602052604090205490565b6001600160a01b03909116600090815260208190526040902055565b6001600160a01b031660009081526004602052604090205490565b6001600160a01b03919091166000908152600860209081526040808320938352929052205460ff1690565b6001600160a01b0392909216600090815260036020908152604080832093835292905220805460ff1916911515919091179055565b6001600160a01b0390921660009081526001602090815260408083209383529290522055565b6001600160a01b0390911660009081526004602052604090205556fea2646970667358221220c8938088b3727a0ac5cab2e6358a6b4896cc1fbaa55b2aa95c0e076b17e4c04a64736f6c634300060a0033";

type MockOracleConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockOracleConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockOracle__factory extends ContractFactory {
  constructor(...args: MockOracleConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockOracle> {
    return super.deploy(overrides || {}) as Promise<MockOracle>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockOracle {
    return super.attach(address) as MockOracle;
  }
  override connect(signer: Signer): MockOracle__factory {
    return super.connect(signer) as MockOracle__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockOracleInterface {
    return new utils.Interface(_abi) as MockOracleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockOracle {
    return new Contract(address, _abi, signerOrProvider) as MockOracle;
  }
}
