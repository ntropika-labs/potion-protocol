/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  CurveManager,
  CurveManagerInterface,
} from "../../contracts/CurveManager";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "curveHash",
        type: "bytes32",
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
        indexed: false,
        internalType: "struct ICurveManager.Curve",
        name: "curveParams",
        type: "tuple",
      },
    ],
    name: "CurveAdded",
    type: "event",
  },
  {
    inputs: [
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
        name: "_curve",
        type: "tuple",
      },
    ],
    name: "addCurve",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "_input59x18",
        type: "int256",
      },
    ],
    name: "cosh",
    outputs: [
      {
        internalType: "int256",
        name: "output59x18",
        type: "int256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
        name: "_curve",
        type: "tuple",
      },
    ],
    name: "hashCurve",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
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
        name: "_curve",
        type: "tuple",
      },
      {
        internalType: "int256",
        name: "_x_59x18",
        type: "int256",
      },
    ],
    name: "hyperbolicCurve",
    outputs: [
      {
        internalType: "int256",
        name: "output59x18",
        type: "int256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_hash",
        type: "bytes32",
      },
    ],
    name: "isKnownCurveHash",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "_x_59x18",
        type: "int256",
      },
      {
        internalType: "int256",
        name: "_y_59x18",
        type: "int256",
      },
    ],
    name: "powerDecimal",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "registeredCurves",
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
  "0x608060405234801561001057600080fd5b50611710806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063aa13e96a1161005b578063aa13e96a146100ee578063c9de2d7314610101578063e4b6a42f14610124578063f5537cd91461013757600080fd5b806350f395a9146100825780635568e565146100a8578063a27bfced146100db575b600080fd5b61009561009036600461160c565b61014a565b6040519081526020015b60405180910390f35b6100cb6100b63660046115d3565b60009081526020819052604090205460ff1690565b604051901515815260200161009f565b6100956100e936600461160c565b6103e0565b6100956100fc3660046115d3565b61043a565b6100cb61010f3660046115d3565b60006020819052908152604090205460ff1681565b610095610132366004611627565b61051a565b6100956101453660046115eb565b6105f9565b600081803582138015906101675750678ac7230489e80000813513155b6101aa5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420412076616c756560881b60448201526064015b60405180910390fd5b60008160200135121580156101cc57506801158e460913d00000816020013513155b61020a5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420422076616c756560881b60448201526064016101a1565b600081604001351215801561022c5750683635c9adc5dea00000816040013513155b61026a5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420432076616c756560881b60448201526064016101a1565b600081606001351215801561028c57506801158e460913d00000816060013513155b6102ca5760405162461bcd60e51b815260206004820152600f60248201526e496e76616c696420442076616c756560881b60448201526064016101a1565b600081608001351380156102ea5750670de0b6b3a7640000816080013513155b61032f5760405162461bcd60e51b8152602060048201526016602482015275496e76616c6964204d6178207574696c2076616c756560501b60448201526064016101a1565b610338836103e0565b60008181526020819052604090205490925060ff166103da5760008281526020819052604090819020805460ff191660011790555182907fde3786bb2e5a7a38e4a190d03489f87f7705db82da7683a2dd6ca3301e68f985906103d1908690600060a082019050823582526020830135602083015260408301356040830152606083013560608301526080830135608083015292915050565b60405180910390a25b50919050565b604080518235602082810191909152830135818301529082013560608281019190915282013560808281019190915282013560a082015260009060c001604051602081830303815290604052805190602001209050919050565b60008082121561047d5760405162461bcd60e51b815260206004820152600e60248201526d0436f736820696e707574203c20360941b60448201526064016101a1565b6801158e460913d000008213156104cc5760405162461bcd60e51b8152602060048201526013602482015272086dee6d040d2dce0eae840e8dede40d0d2ced606b1b60448201526064016101a1565b60006104fd6104ee6104e96104e2600019610695565b86906106f1565b61078c565b6104f78561078c565b906107e5565b905061051361050c6002610695565b82906107f1565b9392505050565b60008082121561055e5760405162461bcd60e51b815260206004820152600f60248201526e7820696e70757420746f6f206c6f7760881b60448201526064016101a1565b670de0b6b3a76400008213156105a95760405162461bcd60e51b815260206004820152601060248201526f0f040d2dce0eae840e8dede40d0d2ced60831b60448201526064016101a1565b60006105ca6100fc6105bf85876040013561088d565b6020870135906106f1565b90506105ef6105e4846105de8488356106f1565b906106f1565b6060860135906107e5565b9150505b92915050565b60008083121561064b5760405162461bcd60e51b815260206004820152601f60248201527f706f776572446563696d616c3a2062617365206d757374206265203e3d20300060448201526064016101a1565b82158015610657575081155b1561066b5750670de0b6b3a76400006105f3565b82610678575060006105f3565b61068e6104e9610687856108ca565b84906106f1565b90506105f3565b60007809392ee8e921d5d073aff322e62439fcf32d7f344649470f8f1982128015906106da57507809392ee8e921d5d073aff322e62439fcf32d7f344649470f908213155b6106e357600080fd5b50670de0b6b3a76400000290565b6000600160ff1b831361070357600080fd5b600160ff1b821361071357600080fd5b600080600085126107245784610729565b846000035b915060008412610739578361073e565b836000035b9050600061074c838361090a565b90506001600160ff1b0381111561076257600080fd5b60001980871390861380821860011461077b5782610780565b826000035b98975050505050505050565b600068023f2fa8f6da5b9d31198212156107a857506000919050565b6804cf46d8192b672ecc82126107bd57600080fd5b6714057b7ef767814f8202610513670de0b6b3a76400006706f05b59d3b200008301056109b5565b60006105138284611651565b6000600160ff1b831361080357600080fd5b600160ff1b821361081357600080fd5b600080600085126108245784610829565b846000035b915060008412610839578361083e565b836000035b9050600061085583670de0b6b3a764000084610a42565b90506001600160ff1b0381111561086b57600080fd5b6000198087139086138082186001146108845782610780565b610780836116aa565b6000826108b05781156108a157600061068e565b50670de0b6b3a76400006105f3565b6105136108c56108bf85610af0565b846106f1565b6109b5565b60006714057b7ef767814f670de0b6b3a76400006108e784610af0565b028161090357634e487b7160e01b600052601260045260246000fd5b0592915050565b60008080600019848609848602925082811083820303915050600080670de0b6b3a76400008688099150506706f05b59d3b1ffff81118261095d5780670de0b6b3a76400008504019450505050506105f3565b82670de0b6b3a76400001161097157600080fd5b620400008285030493909111909103600160ee1b02919091177faccb18165bd6fe31ae1cf318dc5b51eee0e1ba569b88cd74c1773b91fac106690201905092915050565b600080821215610a105768033dd1780914b97114198212156109d957506000919050565b6109e5826000036109b5565b6ec097ce7bc90715b34b9f10000000008161090357634e487b7160e01b600052601260045260246000fd5b6806f05b59d3b20000008212610a2557600080fd5b670de0b6b3a7640000608083901b0461051381610bb8565b919050565b600080806000198587098587029250828110838203039150508060001415610a7c5760008411610a7157600080fd5b508290049050610513565b808411610a8857600080fd5b600084868809600260036001881981018916988990049182028318808302840302808302840302808302840302808302840302808302840302918202909203026000889003889004909101858311909403939093029303949094049190911702949350505050565b6000808213610afe57600080fd5b6000670de0b6b3a76400008312610b1757506001610b31565b6000199050826ec097ce7bc90715b34b9f10000000000492505b6000610b46670de0b6b3a764000085056114e3565b670de0b6b3a7640000808202945090915084821d90811415610b6a57505002919050565b6706f05b59d3b200005b6000811315610baf57670de0b6b3a7640000828002059150671bc16d674ec800008212610ba7579384019360019190911d905b60011d610b74565b50505002919050565b6001607f1b81811615610bdc5770016a09e667f3bcc908b2fb1366ea957d3e0260801c5b6001607e1b821615610bff577001306fe0a31b7152de8d5a46305c85eded0260801c5b6001607d1b821615610c22577001172b83c7d517adcdf7c8c50eb14a79200260801c5b6001607c1b821615610c455770010b5586cf9890f6298b92b71842a983640260801c5b6001607b1b821615610c68577001059b0d31585743ae7c548eb68ca417fe0260801c5b6001607a1b821615610c8b57700102c9a3e778060ee6f7caca4f7a29bde90260801c5b600160791b821615610cae5770010163da9fb33356d84a66ae336dcdfa400260801c5b600160781b821615610cd157700100b1afa5abcbed6129ab13ec11dc95440260801c5b600160771b821615610cf45770010058c86da1c09ea1ff19d294cf2f679c0260801c5b600160761b821615610d17577001002c605e2e8cec506d21bfc89a23a0110260801c5b600160751b821615610d3a57700100162f3904051fa128bca9c55c31e5e00260801c5b600160741b821615610d5d577001000b175effdc76ba38e31671ca9397260260801c5b600160731b821615610d8057700100058ba01fb9f96d6cacd4b180917c3e0260801c5b600160721b821615610da35770010002c5cc37da9491d0985c348c68e7b40260801c5b600160711b821615610dc6577001000162e525ee054754457d59952920270260801c5b600160701b821615610de95770010000b17255775c040618bf4a4ade83fd0260801c5b6001606f1b821615610e0c577001000058b91b5bc9ae2eed81e9b7d4cfac0260801c5b6001606e1b821615610e2f57700100002c5c89d5ec6ca4d7c8acc017b7ca0260801c5b6001606d1b821615610e525770010000162e43f4f831060e02d839a9d16d0260801c5b6001606c1b821615610e7557700100000b1721bcfc99d9f890ea069117630260801c5b6001606b1b821615610e985770010000058b90cf1e6d97f9ca14dbcc16290260801c5b6001606a1b821615610ebb577001000002c5c863b73f016468f6bac5ca2c0260801c5b600160691b821615610ede57700100000162e430e5a18f6119e3c02282a60260801c5b600160681b821615610f01577001000000b1721835514b86e6d96efd1bff0260801c5b600160671b821615610f2457700100000058b90c0b48c6be5df846c5b2f00260801c5b600160661b821615610f475770010000002c5c8601cc6b9e94213c72737b0260801c5b600160651b821615610f6a577001000000162e42fff037df38aa2b219f070260801c5b600160641b821615610f8d5770010000000b17217fba9c739aa5819f44fa0260801c5b600160631b821615610fb0577001000000058b90bfcdee5acd3c1cedc8240260801c5b600160621b821615610fd357700100000002c5c85fe31f35a6a30da1be510260801c5b600160611b821615610ff65770010000000162e42ff0999ce3541b9fffd00260801c5b600160601b82161561101957700100000000b17217f80f4ef5aadda455540260801c5b6001605f1b82161561103c5770010000000058b90bfbf8479bd5a81b51ae0260801c5b6001605e1b82161561105f577001000000002c5c85fdf84bd62ae30a74cd0260801c5b6001605d1b82161561108257700100000000162e42fefb2fed257559bdaa0260801c5b6001605c1b8216156110a5577001000000000b17217f7d5a7716bba4a9af0260801c5b6001605b1b8216156110c857700100000000058b90bfbe9ddbac5e109ccf0260801c5b6001605a1b8216156110eb5770010000000002c5c85fdf4b15de6f17eb0e0260801c5b600160591b82161561110e577001000000000162e42fefa494f1478fde050260801c5b600160581b8216156111315770010000000000b17217f7d20cf927c8e94d0260801c5b600160571b821615611154577001000000000058b90bfbe8f71cb4e4b33e0260801c5b600160561b82161561117757700100000000002c5c85fdf477b662b269460260801c5b600160551b82161561119a5770010000000000162e42fefa3ae53369388d0260801c5b600160541b8216156111bd57700100000000000b17217f7d1d351a389d410260801c5b600160531b8216156111e05770010000000000058b90bfbe8e8b2d3d4edf0260801c5b600160521b821615611203577001000000000002c5c85fdf4741bea6e77f0260801c5b600160511b82161561122657700100000000000162e42fefa39fe95583c30260801c5b600160501b821615611249577001000000000000b17217f7d1cfb72b45e30260801c5b698000000000000000000082161561127257700100000000000058b90bfbe8e7cc35c3f20260801c5b694000000000000000000082161561129b5770010000000000002c5c85fdf473e242ea390260801c5b69200000000000000000008216156112c4577001000000000000162e42fefa39f02b772c0260801c5b69100000000000000000008216156112ed5770010000000000000b17217f7d1cf7d83c1a0260801c5b6908000000000000000000821615611316577001000000000000058b90bfbe8e7bdcbe2e0260801c5b690400000000000000000082161561133f57700100000000000002c5c85fdf473dea871f0260801c5b69020000000000000000008216156113685770010000000000000162e42fefa39ef44d920260801c5b690100000000000000000082161561139157700100000000000000b17217f7d1cf79e9490260801c5b688000000000000000008216156113b95770010000000000000058b90bfbe8e7bce5450260801c5b684000000000000000008216156113e1577001000000000000002c5c85fdf473de6eca0260801c5b6820000000000000000082161561140957700100000000000000162e42fefa39ef366f0260801c5b68100000000000000000821615611431577001000000000000000b17217f7d1cf79afa0260801c5b6808000000000000000082161561145957700100000000000000058b90bfbe8e7bcd6e0260801c5b680400000000000000008216156114815770010000000000000002c5c85fdf473de6b30260801c5b680200000000000000008216156114a9577001000000000000000162e42fefa39ef3590260801c5b600160401b8216156114cc5770010000000000000000b17217f7d1cf79ac0260801c5b670de0b6b3a76400000260809190911c607f031c90565b6000600160801b821061150357608091821c916115009082611692565b90505b600160401b821061152157604091821c9161151e9082611692565b90505b640100000000821061154057602091821c9161153d9082611692565b90505b62010000821061155d57601091821c9161155a9082611692565b90505b610100821061157957600891821c916115769082611692565b90505b6010821061159457600491821c916115919082611692565b90505b600482106115af57600291821c916115ac9082611692565b90505b60028210610a3d576105f3600182611692565b600060a082840312156103da578081fd5b6000602082840312156115e4578081fd5b5035919050565b600080604083850312156115fd578081fd5b50508035926020909101359150565b600060a0828403121561161d578081fd5b61051383836115c2565b60008060c08385031215611639578182fd5b61164384846115c2565b9460a0939093013593505050565b600080821280156001600160ff1b0384900385131615611673576116736116c4565b600160ff1b839003841281161561168c5761168c6116c4565b50500190565b600082198211156116a5576116a56116c4565b500190565b6000600160ff1b8214156116c0576116c06116c4565b0390565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220fa008419210cfd674003d167a7fbb741dc5fe7506919eb9678415909d3050d1764736f6c63430008040033";

type CurveManagerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CurveManagerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CurveManager__factory extends ContractFactory {
  constructor(...args: CurveManagerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<CurveManager> {
    return super.deploy(overrides || {}) as Promise<CurveManager>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): CurveManager {
    return super.attach(address) as CurveManager;
  }
  override connect(signer: Signer): CurveManager__factory {
    return super.connect(signer) as CurveManager__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CurveManagerInterface {
    return new utils.Interface(_abi) as CurveManagerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CurveManager {
    return new Contract(address, _abi, signerOrProvider) as CurveManager;
  }
}
