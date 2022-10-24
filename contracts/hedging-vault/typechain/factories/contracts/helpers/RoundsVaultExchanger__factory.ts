/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  RoundsVaultExchanger,
  RoundsVaultExchangerInterface,
} from "../../../contracts/helpers/RoundsVaultExchanger";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IBaseRoundsVault",
        name: "inputVault",
        type: "address",
      },
      {
        internalType: "contract IBaseRoundsVault",
        name: "outputVault",
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
    ],
    name: "exchangeInputForOutput",
    outputs: [
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
        internalType: "contract IBaseRoundsVault",
        name: "inputVault",
        type: "address",
      },
      {
        internalType: "contract IBaseRoundsVault",
        name: "outputVault",
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
    ],
    name: "exchangeInputForOutputBatch",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506109d2806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633a30bab71461003b5780633e61c57c14610060575b600080fd5b61004e610049366004610766565b610073565b60405190815260200160405180910390f35b61004e61006e3660046107fb565b6101ea565b6000806001600160a01b038816631c8af6608787878730336040518763ffffffff1660e01b81526004016100ac96959493929190610877565b6020604051808303816000875af11580156100cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100ef91906108c5565b905061015d886001600160a01b0316635898ec3b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610132573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061015691906108de565b888361036c565b6001600160a01b038716636e553f6582336040516001600160e01b031960e085901b16815260048101929092526001600160a01b031660248201526044016020604051808303816000875af11580156101ba573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101de91906108c5565b98975050505050505050565b60408051639ce56ebf60e01b81526004810184905260248101839052306044820152336064820152905160009182916001600160a01b03881691639ce56ebf916084808301926020929190829003018187875af115801561024f573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061027391906108c5565b90506102e1866001600160a01b0316635898ec3b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156102b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102da91906108de565b868361036c565b6001600160a01b038516636e553f6582336040516001600160e01b031960e085901b16815260048101929092526001600160a01b031660248201526044016020604051808303816000875af115801561033e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061036291906108c5565b9695505050505050565b8015806103e65750604051636eb1769f60e11b81523060048201526001600160a01b03838116602483015284169063dd62ed3e90604401602060405180830381865afa1580156103c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103e491906108c5565b155b6104565760405162461bcd60e51b815260206004820152603660248201527f5361666545524332303a20617070726f76652066726f6d206e6f6e2d7a65726f60448201527520746f206e6f6e2d7a65726f20616c6c6f77616e636560501b60648201526084015b60405180910390fd5b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b1790526104a89084906104ad565b505050565b6000610502826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b031661057f9092919063ffffffff16565b8051909150156104a8578080602001905181019061052091906108fb565b6104a85760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161044d565b606061058e8484600085610598565b90505b9392505050565b6060824710156105f95760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161044d565b6001600160a01b0385163b6106505760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161044d565b600080866001600160a01b0316858760405161066c919061094d565b60006040518083038185875af1925050503d80600081146106a9576040519150601f19603f3d011682016040523d82523d6000602084013e6106ae565b606091505b50915091506106be8282866106c9565b979650505050505050565b606083156106d8575081610591565b8251156106e85782518084602001fd5b8160405162461bcd60e51b815260040161044d9190610969565b6001600160a01b038116811461071757600080fd5b50565b60008083601f84011261072c57600080fd5b50813567ffffffffffffffff81111561074457600080fd5b6020830191508360208260051b850101111561075f57600080fd5b9250929050565b6000806000806000806080878903121561077f57600080fd5b863561078a81610702565b9550602087013561079a81610702565b9450604087013567ffffffffffffffff808211156107b757600080fd5b6107c38a838b0161071a565b909650945060608901359150808211156107dc57600080fd5b506107e989828a0161071a565b979a9699509497509295939492505050565b6000806000806080858703121561081157600080fd5b843561081c81610702565b9350602085013561082c81610702565b93969395505050506040820135916060013590565b81835260006001600160fb1b0383111561085a57600080fd5b8260051b8083602087013760009401602001938452509192915050565b60808152600061088b60808301888a610841565b828103602084015261089e818789610841565b6001600160a01b039586166040850152939094166060909201919091525095945050505050565b6000602082840312156108d757600080fd5b5051919050565b6000602082840312156108f057600080fd5b815161059181610702565b60006020828403121561090d57600080fd5b8151801515811461059157600080fd5b60005b83811015610938578181015183820152602001610920565b83811115610947576000848401525b50505050565b6000825161095f81846020870161091d565b9190910192915050565b602081526000825180602084015261098881604085016020870161091d565b601f01601f1916919091016040019291505056fea26469706673582212204a5939fe7f29342b48355be0033a3ffc13ed38cbe60612752840271c250f9b5464736f6c634300080e0033";

type RoundsVaultExchangerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RoundsVaultExchangerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RoundsVaultExchanger__factory extends ContractFactory {
  constructor(...args: RoundsVaultExchangerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RoundsVaultExchanger> {
    return super.deploy(overrides || {}) as Promise<RoundsVaultExchanger>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RoundsVaultExchanger {
    return super.attach(address) as RoundsVaultExchanger;
  }
  override connect(signer: Signer): RoundsVaultExchanger__factory {
    return super.connect(signer) as RoundsVaultExchanger__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RoundsVaultExchangerInterface {
    return new utils.Interface(_abi) as RoundsVaultExchangerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RoundsVaultExchanger {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RoundsVaultExchanger;
  }
}
