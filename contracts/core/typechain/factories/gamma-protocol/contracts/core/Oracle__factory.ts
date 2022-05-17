/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Oracle, OracleInterface } from "../../../../gamma-protocol/contracts/core/Oracle";

const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "newDisputer",
                type: "address",
            },
        ],
        name: "DisputerUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "asset",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "expiryTimestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "disputedPrice",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newPrice",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "disputeTimestamp",
                type: "uint256",
            },
        ],
        name: "ExpiryPriceDisputed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "asset",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "expiryTimestamp",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "onchainTimestamp",
                type: "uint256",
            },
        ],
        name: "ExpiryPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pricer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "disputePeriod",
                type: "uint256",
            },
        ],
        name: "PricerDisputePeriodUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pricer",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "lockingPeriod",
                type: "uint256",
            },
        ],
        name: "PricerLockingPeriodUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "asset",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "pricer",
                type: "address",
            },
        ],
        name: "PricerUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "asset",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "price",
                type: "uint256",
            },
        ],
        name: "StablePriceUpdated",
        type: "event",
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
        name: "disputeExpiryPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "endMigration",
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
        inputs: [],
        name: "getDisputer",
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
                name: "_asset",
                type: "address",
            },
            {
                internalType: "uint256[]",
                name: "_expiries",
                type: "uint256[]",
            },
            {
                internalType: "uint256[]",
                name: "_prices",
                type: "uint256[]",
            },
        ],
        name: "migrateOracle",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
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
        name: "renounceOwnership",
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
                name: "_disputer",
                type: "address",
            },
        ],
        name: "setDisputer",
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
        name: "setStablePrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const _bytecode =
    "0x608060405234801561001057600080fd5b5060006100246001600160e01b0361007316565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350610077565b3390565b6116a8806100866000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c8063715018a6116100b8578063b7e1d1451161007c578063b7e1d1451461047c578063d2f3b4e8146104a2578063def3cb05146104ce578063ee531409146104d6578063f19ae73414610508578063f2fde38b1461053457610137565b8063715018a6146103f45780638b3cddaf146103fc5780638da5cb5b146104285780638ee5074d146104305780639c7fe9d61461045657610137565b806341976e09116100ff57806341976e091461031657806357a37dca1461034e5780635fdc714914610380578063601407eb146103c05780636c525d04146103ec57610137565b806301957f811461013c5780631b85462d146101815780632e4cf6ea146101d25780632ecd8857146102a65780633fd3ec8f146102e8575b600080fd5b6101686004803603604081101561015257600080fd5b506001600160a01b03813516906020013561055a565b6040805192835290151560208301528051918290030190f35b6101b96004803603604081101561019757600080fd5b5080356001600160a01b0316906020013569ffffffffffffffffffff166105ba565b6040805192835260208301919091528051918290030190f35b6102a4600480360360608110156101e857600080fd5b6001600160a01b03823516919081019060408101602082013564010000000081111561021357600080fd5b82018360208201111561022557600080fd5b8035906020019184602083028401116401000000008311171561024757600080fd5b91939092909160208101903564010000000081111561026557600080fd5b82018360208201111561027757600080fd5b8035906020019184602083028401116401000000008311171561029957600080fd5b5090925090506106d7565b005b6102cc600480360360208110156102bc57600080fd5b50356001600160a01b031661087c565b604080516001600160a01b039092168252519081900360200190f35b6102a4600480360360408110156102fe57600080fd5b506001600160a01b038135811691602001351661089a565b61033c6004803603602081101561032c57600080fd5b50356001600160a01b03166109e3565b60408051918252519081900360200190f35b6102a46004803603606081101561036457600080fd5b506001600160a01b038135169060208101359060400135610ada565b6103ac6004803603604081101561039657600080fd5b506001600160a01b038135169060200135610c3a565b604080519115158252519081900360200190f35b6102a4600480360360408110156103d657600080fd5b506001600160a01b038135169060200135610d01565b6102a4610e04565b6102a4610e71565b6102a46004803603604081101561041257600080fd5b506001600160a01b038135169060200135610f13565b6102cc610fbf565b6102a46004803603602081101561044657600080fd5b50356001600160a01b0316610fce565b61033c6004803603602081101561046c57600080fd5b50356001600160a01b0316611070565b61033c6004803603602081101561049257600080fd5b50356001600160a01b031661108b565b6103ac600480360360408110156104b857600080fd5b506001600160a01b0381351690602001356110a6565b6102cc61110c565b6102a4600480360360608110156104ec57600080fd5b506001600160a01b03813516906020810135906040013561111b565b6102a46004803603604081101561051e57600080fd5b506001600160a01b0381351690602001356112b0565b6102a46004803603602081101561054a57600080fd5b50356001600160a01b031661135c565b6001600160a01b03821660009081526006602052604081205481906001816105af576001600160a01b038616600090815260056020908152604080832088845290915290205491506105ac8686610c3a565b90505b909590945092505050565b6001600160a01b038216600090815260066020526040812054819042816105af576001600160a01b03868116600090815260046020526040902054166106315760405162461bcd60e51b81526004018080602001828103825260258152602001806115316025913960400191505060405180910390fd5b6001600160a01b038087166000908152600460208190526040918290205482516303bb0ddf60e61b815269ffffffffffffffffffff8a1692810192909252825193169263eec377c092602480840193919291829003018186803b15801561069757600080fd5b505afa1580156106ab573d6000803e3d6000fd5b505050506040513d60408110156106c157600080fd5b5080516020909101519097909650945050505050565b6106df611454565b6000546001600160a01b0390811691161461072f576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b600154600160a01b900460ff161561078e576040805162461bcd60e51b815260206004820152601e60248201527f4f7261636c653a206d6967726174696f6e20616c726561647920646f6e650000604482015290519081900360640190fd5b8281146107e2576040805162461bcd60e51b815260206004820152601e60248201527f4f7261636c653a20696e76616c6964206d6967726174696f6e20646174610000604482015290519081900360640190fd5b60005b8381101561087457604051806040016040528084848481811061080457fe5b9050602002013581526020014281525060056000886001600160a01b03166001600160a01b03168152602001908152602001600020600087878581811061084757fe5b602090810292909201358352508181019290925260400160002082518155910151600191820155016107e5565b505050505050565b6001600160a01b039081166000908152600460205260409020541690565b6108a2611454565b6000546001600160a01b039081169116146108f2576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001600160a01b0381166109375760405162461bcd60e51b81526004018080602001828103825260278152602001806116186027913960400191505060405180910390fd5b6001600160a01b0382166000908152600660205260409020541561098c5760405162461bcd60e51b815260040180806020018281038252602f8152602001806115e9602f913960400191505060405180910390fd5b6001600160a01b0382811660008181526004602052604080822080546001600160a01b0319169486169485179055517fac44f446a94cf337a8403cfa1764d3ab060f166e1e6d0fb2e7ccbb4889ce948d9190a35050565b6001600160a01b03811660009081526006602052604081205480610ad4576001600160a01b0383811660009081526004602052604090205416610a575760405162461bcd60e51b81526004018080602001828103825260258152602001806115316025913960400191505060405180910390fd5b6001600160a01b03808416600090815260046020818152604092839020548351634c6afee560e11b815293519416936398d5fdca938084019390829003018186803b158015610aa557600080fd5b505afa158015610ab9573d6000803e3d6000fd5b505050506040513d6020811015610acf57600080fd5b505190505b92915050565b6001546001600160a01b03163314610b235760405162461bcd60e51b81526004018080602001828103825260228152602001806114d46022913960400191505060405180910390fd5b610b2d8383610c3a565b15610b7f576040805162461bcd60e51b815260206004820152601b60248201527f4f7261636c653a206469737075746520706572696f64206f7665720000000000604482015290519081900360640190fd5b6001600160a01b038316600090815260056020908152604080832085845290915290206001810154610be25760405162461bcd60e51b815260040180806020018281038252602781526020018061157c6027913960400191505060405180910390fd5b805482825560408051828152602081018590524281830152905185916001600160a01b038816917f4c65ea297e9cdfe46f796ae9f245f80e9952cc9ee0544e9c5e5384e06e396ee09181900360600190a35050505050565b6001600160a01b03821660009081526006602052604081205480610cf757610c606114b9565b506001600160a01b038416600090815260056020908152604080832086845282529182902082518084019093528054835260010154908201819052610caa57600092505050610ad4565b6001600160a01b0380861660009081526004602090815260408083205490931680835260038252929091205490830151610cea908263ffffffff61145816565b4211945050505050610ad4565b5060019392505050565b610d09611454565b6000546001600160a01b03908116911614610d59576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001600160a01b038281166000908152600460205260409020541615610db05760405162461bcd60e51b815260040180806020018281038252603b8152602001806114f6603b913960400191505060405180910390fd5b6001600160a01b038216600081815260066020908152604091829020849055815184815291517f4e5ecd60f0bbcaa2960ee093d3c7a8bf1e265338cae3032cc13adf65e95fa3259281900390910190a25050565b610e0c611454565b6000546001600160a01b03908116911614610e5c576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001805460ff60a01b1916600160a01b179055565b610e79611454565b6000546001600160a01b03908116911614610ec9576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600080546001600160a01b0319169055565b610f1b611454565b6000546001600160a01b03908116911614610f6b576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001600160a01b038216600081815260036020908152604091829020849055815184815291517ff43f15b56789f3f735684531c1885129263b256f59dc4c71b211722a2f954d969281900390910190a25050565b6000546001600160a01b031690565b610fd6611454565b6000546001600160a01b03908116911614611026576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0383169081179091556040517fc0c3569eac4e1b890a966a247a7b7f0d496af49f2fc482b2959899b634693cfd90600090a250565b6001600160a01b031660009081526003602052604090205490565b6001600160a01b031660009081526002602052604090205490565b6001600160a01b03821660009081526006602052604081205480610cf7576001600160a01b03808516600090815260046020908152604080832054909316808352600290915291902054611100858263ffffffff61145816565b42119350505050610ad4565b6001546001600160a01b031690565b6001600160a01b038381166000908152600460205260409020541633146111735760405162461bcd60e51b815260040180806020018281038252603481526020018061163f6034913960400191505060405180910390fd5b61117d83836110a6565b6111b85760405162461bcd60e51b81526004018080602001828103825260268152602001806115c36026913960400191505060405180910390fd5b6001600160a01b038316600090815260056020908152604080832085845290915290206001015415611231576040805162461bcd60e51b815260206004820152601e60248201527f4f7261636c653a206469737075746520706572696f6420737461727465640000604482015290519081900360640190fd5b6040805180820182528281524260208083018281526001600160a01b0388166000818152600584528681208982528452869020945185559051600190940193909355835185815290810191909152825185937f0160752083b78189f1650efb0abdaa0dd2110e5782f553c825705746ac2a5718928290030190a3505050565b6112b8611454565b6000546001600160a01b03908116911614611308576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001600160a01b038216600081815260026020908152604091829020849055815184815291517fa8c3fc8bc370addd6cd25f335fb22ea56d17079376e28f460ca770f6d46b2c599281900390910190a25050565b611364611454565b6000546001600160a01b039081169116146113b4576040805162461bcd60e51b815260206004820181905260248201526000805160206115a3833981519152604482015290519081900360640190fd5b6001600160a01b0381166113f95760405162461bcd60e51b81526004018080602001828103825260268152602001806115566026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a3600080546001600160a01b0319166001600160a01b0392909216919091179055565b3390565b6000828201838110156114b2576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b60405180604001604052806000815260200160008152509056fe4f7261636c653a2063616c6c6572206973206e6f74207468652064697370757465724f7261636c653a20636f756c64206e6f742073657420737461626c6520707269636520666f7220616e2061737365742077697468207072696365724f7261636c653a2050726963657220666f722074686973206173736574206e6f74207365744f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734f7261636c653a20707269636520746f206469737075746520646f6573206e6f742065786973744f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65724f7261636c653a206c6f636b696e6720706572696f64206973206e6f74206f766572207965744f7261636c653a20636f756c64206e6f742073657420612070726963657220666f7220737461626c652061737365744f7261636c653a2063616e6e6f74207365742070726963657220746f20616464726573732830294f7261636c653a2063616c6c6572206973206e6f7420617574686f72697a656420746f2073657420657870697279207072696365a2646970667358221220c569b77d3c04825ddd5622b5be12041573ccae3262f0a0217b2d8095094be0c364736f6c634300060a0033";

type OracleConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: OracleConstructorParams): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Oracle__factory extends ContractFactory {
    constructor(...args: OracleConstructorParams) {
        if (isSuperArgs(args)) {
            super(...args);
        } else {
            super(_abi, _bytecode, args[0]);
        }
    }

    override deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<Oracle> {
        return super.deploy(overrides || {}) as Promise<Oracle>;
    }
    override getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
        return super.getDeployTransaction(overrides || {});
    }
    override attach(address: string): Oracle {
        return super.attach(address) as Oracle;
    }
    override connect(signer: Signer): Oracle__factory {
        return super.connect(signer) as Oracle__factory;
    }

    static readonly bytecode = _bytecode;
    static readonly abi = _abi;
    static createInterface(): OracleInterface {
        return new utils.Interface(_abi) as OracleInterface;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): Oracle {
        return new Contract(address, _abi, signerOrProvider) as Oracle;
    }
}
