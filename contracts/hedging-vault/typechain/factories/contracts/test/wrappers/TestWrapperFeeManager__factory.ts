/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  TestWrapperFeeManager,
  TestWrapperFeeManagerInterface,
} from "../../../../contracts/test/wrappers/TestWrapperFeeManager";

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
        indexed: true,
        internalType: "address",
        name: "receipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "managementAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "performanceAmount",
        type: "uint256",
      },
    ],
    name: "FeesETHSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldFeeReceipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newFeeReceipient",
        type: "address",
      },
    ],
    name: "FeesReceipientChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "receipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "managementAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "performanceAmount",
        type: "uint256",
      },
    ],
    name: "FeesSent",
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
        indexed: false,
        internalType: "uint256",
        name: "oldManagementFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newManagementFee",
        type: "uint256",
      },
    ],
    name: "ManagementFeeChanged",
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
        indexed: false,
        internalType: "uint256",
        name: "oldPerformanceFee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newPerformanceFee",
        type: "uint256",
      },
    ],
    name: "PerformanceFeeChanged",
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
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
    ],
    name: "calculateManagementPayment",
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
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "calculatePerformancePayment",
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
    name: "getFeesRecipient",
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
    name: "getManagementFee",
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
    name: "getPerformanceFee",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "managementFee_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "performanceFee_",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "feeReceipient_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Upgradeable",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "payFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "principalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "earningsAmount",
        type: "uint256",
      },
    ],
    name: "payFeesETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newFeesRecipient",
        type: "address",
      },
    ],
    name: "setFeesRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newManagementFee",
        type: "uint256",
      },
    ],
    name: "setManagementFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newPerformanceFee",
        type: "uint256",
      },
    ],
    name: "setPerformanceFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611574806100206000396000f3fe6080604052600436106101185760003560e01c80636e9960c3116100a05780638f283970116100645780638f283970146102f65780639c2b1a95146103165780639e3d87cd1461032b578063e7f43c681461034b578063fe56e2321461036957600080fd5b80636e9960c31461025a57806370897b231461027857806372eb05b91461029857806384b7719a146102b85780638d928af8146102d857600080fd5b806334d9b2dc116100e757806334d9b2dc146101bc57806344ff7d28146101da5780634abd2b8c146101fa5780635ebc75071461021a57806360e232a91461023a57600080fd5b806306394c9b14610124578063235c3603146101465780632374f6fb1461016a57806328a8317a1461018a57600080fd5b3661011f57005b600080fd5b34801561013057600080fd5b5061014461013f36600461118d565b610389565b005b34801561015257600080fd5b506066545b6040519081526020015b60405180910390f35b34801561017657600080fd5b506101446101853660046111aa565b6103d1565b34801561019657600080fd5b506067546001600160a01b03165b6040516001600160a01b039091168152602001610161565b3480156101c857600080fd5b506034546001600160a01b03166101a4565b3480156101e657600080fd5b506101576101f53660046111df565b6103e1565b34801561020657600080fd5b506101576102153660046111df565b6103f2565b34801561022657600080fd5b506101446102353660046111f8565b6103fd565b34801561024657600080fd5b5061014461025536600461118d565b61040b565b34801561026657600080fd5b506033546001600160a01b03166101a4565b34801561028457600080fd5b506101446102933660046111df565b610447565b3480156102a457600080fd5b506101446102b336600461118d565b610483565b3480156102c457600080fd5b506101446102d336600461118d565b6104bf565b3480156102e457600080fd5b506036546001600160a01b03166101a4565b34801561030257600080fd5b5061014461031136600461118d565b6104fb565b34801561032257600080fd5b50606554610157565b34801561033757600080fd5b5061014461034636600461121a565b610537565b34801561035757600080fd5b506035546001600160a01b03166101a4565b34801561037557600080fd5b506101446103843660046111df565b6105be565b6033546001600160a01b0316336001600160a01b0316146103c55760405162461bcd60e51b81526004016103bc90611264565b60405180910390fd5b6103ce816105fa565b50565b6103dc8383836106ba565b505050565b60006103ec8261074b565b92915050565b60006103ec82610762565b6104078282610779565b5050565b6033546001600160a01b0316336001600160a01b03161461043e5760405162461bcd60e51b81526004016103bc90611264565b6103ce81610801565b6033546001600160a01b0316336001600160a01b03161461047a5760405162461bcd60e51b81526004016103bc90611264565b6103ce816108be565b6033546001600160a01b0316336001600160a01b0316146104b65760405162461bcd60e51b81526004016103bc90611264565b6103ce81610973565b6033546001600160a01b0316336001600160a01b0316146104f25760405162461bcd60e51b81526004016103bc90611264565b6103ce81610a35565b6033546001600160a01b0316336001600160a01b03161461052e5760405162461bcd60e51b81526004016103bc90611264565b6103ce81610aef565b60006105436001610bac565b9050801561055b576000805461ff0019166101001790555b610566858687610c34565b610571848484610c76565b80156105b7576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050505050565b6033546001600160a01b0316336001600160a01b0316146105f15760405162461bcd60e51b81526004016103bc90611264565b6103ce81610cb8565b6001600160a01b0381166106685760405162461bcd60e51b815260206004820152602f60248201527f4e6577204f70657261746f7220616464726573732063616e6e6f74206265207460448201526e6865206e756c6c206164647265737360881b60648201526084016103bc565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907fd58299b712891143e76310d5e664c4203c940a67db37cf856bdaa3c5c76a802c90600090a35050565b60006106c58361074b565b905060006106d283610762565b60675460408051858152602081018490529293506001600160a01b03888116939216917f5241d2cb58e4448964f455d109aca8b485a5301cb9d9a0dc4da3ec6cc70e67c9910160405180910390a36067546105b7906001600160a01b031661073a83856112bf565b6001600160a01b0388169190610d64565b60006103ec60655483610db690919063ffffffff16565b60006103ec60665483610db690919063ffffffff16565b60006107848361074b565b9050600061079183610762565b60675460408051858152602081018490529293506001600160a01b03909116917f59f1b1b83406dc43f1ae9ce3dbdcfdd582378575079233e1e22543938fa55afa910160405180910390a26107fb6107e982846112bf565b6067546001600160a01b031690610dea565b50505050565b6001600160a01b03811661086c5760405162461bcd60e51b815260206004820152602c60248201527f4e6577205661756c7420616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b60648201526084016103bc565b603680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f16e2accad9173abff57b295b56993ec5d86b3cbf791fea02f02a6616463754ea90600090a35050565b6108c781610f03565b61092d5760405162461bcd60e51b815260206004820152603160248201527f506572666f726d616e636520666565206d757374206265206c6573732074686160448201527006e206f7220657175616c20746f2031303607c1b60648201526084016103bc565b606680549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd91015b60405180910390a15050565b6001600160a01b0381166109e35760405162461bcd60e51b815260206004820152603160248201527f4e6577205374726174656769737420616464726573732063616e6e6f7420626560448201527020746865206e756c6c206164647265737360781b60648201526084016103bc565b603480546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f3a76e21b656d08e1747e6decb6c6dcb819ace8e654b6582f4fcc50875ff9f85490600090a35050565b6067546001600160a01b0390811690821603610a9f5760405162461bcd60e51b8152602060048201526024808201527f4665657320726563697069656e74206973207468652073616d65206173206265604482015263666f726560e01b60648201526084016103bc565b606780546001600160a01b0319166001600160a01b03831690811790915560405182919081907fc5d8512a1ce98ff41b33712f195414dde7fd3a1a996a15dafab8933d9d32084490600090a35050565b6001600160a01b038116610b5a5760405162461bcd60e51b815260206004820152602c60248201527f4e65772041646d696e20616464726573732063616e6e6f74206265207468652060448201526b6e756c6c206164647265737360a01b60648201526084016103bc565b603380546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f7e644d79422f17c01e4894b5f4f588d331ebfa28653d42ae832dc59e38c9798f90600090a35050565b60008054610100900460ff1615610bf3578160ff166001148015610bcf5750303b155b610beb5760405162461bcd60e51b81526004016103bc906112d7565b506000919050565b60005460ff808416911610610c1a5760405162461bcd60e51b81526004016103bc906112d7565b506000805460ff191660ff92909216919091179055600190565b600054610100900460ff16610c5b5760405162461bcd60e51b81526004016103bc90611325565b610c6483610aef565b610c6d82610973565b6103dc816105fa565b600054610100900460ff16610c9d5760405162461bcd60e51b81526004016103bc90611325565b610ca683610cb8565b610caf826108be565b6103dc81610a35565b610cc181610f03565b610d265760405162461bcd60e51b815260206004820152603060248201527f4d616e6167656d656e7420666565206d757374206265206c657373207468616e60448201526f0206f7220657175616c20746f203130360841b60648201526084016103bc565b606580549082905560408051828152602081018490527ffac39c9265fbab8fd6b4293b3f584cb3b1c0c39fb315acbcd4d1bef067c340cd9101610967565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b1790526103dc908490610f25565b6000610dc46006600a611454565b610dcf906064611460565b610dd98385611460565b610de3919061147f565b9392505050565b80471015610e3a5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e636500000060448201526064016103bc565b6000826001600160a01b03168260405160006040518083038185875af1925050503d8060008114610e87576040519150601f19603f3d011682016040523d82523d6000602084013e610e8c565b606091505b50509050806103dc5760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d6179206861766520726576657274656400000000000060648201526084016103bc565b6000610f116006600a611454565b610f1c906064611460565b90911115919050565b6000610f7a826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316610ff79092919063ffffffff16565b8051909150156103dc5780806020019051810190610f9891906114a1565b6103dc5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016103bc565b6060611006848460008561100e565b949350505050565b60608247101561106f5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b60648201526084016103bc565b6001600160a01b0385163b6110c65760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016103bc565b600080866001600160a01b031685876040516110e291906114ef565b60006040518083038185875af1925050503d806000811461111f576040519150601f19603f3d011682016040523d82523d6000602084013e611124565b606091505b509150915061113482828661113f565b979650505050505050565b6060831561114e575081610de3565b82511561115e5782518084602001fd5b8160405162461bcd60e51b81526004016103bc919061150b565b6001600160a01b03811681146103ce57600080fd5b60006020828403121561119f57600080fd5b8135610de381611178565b6000806000606084860312156111bf57600080fd5b83356111ca81611178565b95602085013595506040909401359392505050565b6000602082840312156111f157600080fd5b5035919050565b6000806040838503121561120b57600080fd5b50508035926020909101359150565b6000806000806080858703121561123057600080fd5b843561123b81611178565b93506020850135925060408501359150606085013561125981611178565b939692955090935050565b60208082526025908201527f4f6e6c79207468652041646d696e2063616e2063616c6c20746869732066756e60408201526431ba34b7b760d91b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b600082198211156112d2576112d26112a9565b500190565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b606082015260800190565b600181815b808511156113ab578160001904821115611391576113916112a9565b8085161561139e57918102915b93841c9390800290611375565b509250929050565b6000826113c2575060016103ec565b816113cf575060006103ec565b81600181146113e557600281146113ef5761140b565b60019150506103ec565b60ff841115611400576114006112a9565b50506001821b6103ec565b5060208310610133831016604e8410600b841016171561142e575081810a6103ec565b6114388383611370565b806000190482111561144c5761144c6112a9565b029392505050565b6000610de383836113b3565b600081600019048311821515161561147a5761147a6112a9565b500290565b60008261149c57634e487b7160e01b600052601260045260246000fd5b500490565b6000602082840312156114b357600080fd5b81518015158114610de357600080fd5b60005b838110156114de5781810151838201526020016114c6565b838111156107fb5750506000910152565b600082516115018184602087016114c3565b9190910192915050565b602081526000825180602084015261152a8160408501602087016114c3565b601f01601f1916919091016040019291505056fea2646970667358221220aed54c6f89fad0d47a445662bd7e156cce5c70089ebf964bc646f1b7d7395e5064736f6c634300080e0033";

type TestWrapperFeeManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestWrapperFeeManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestWrapperFeeManager__factory extends ContractFactory {
  constructor(...args: TestWrapperFeeManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestWrapperFeeManager> {
    return super.deploy(overrides || {}) as Promise<TestWrapperFeeManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): TestWrapperFeeManager {
    return super.attach(address) as TestWrapperFeeManager;
  }
  override connect(signer: Signer): TestWrapperFeeManager__factory {
    return super.connect(signer) as TestWrapperFeeManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestWrapperFeeManagerInterface {
    return new utils.Interface(_abi) as TestWrapperFeeManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestWrapperFeeManager {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TestWrapperFeeManager;
  }
}
