// Autogenerated by the deployments script
export * as Typechain from "../typechain";
export const Deployments = {
    ganache: {
        collateralTokenAddress: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
        opynAddressBookAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        potionLiquidityPoolAddress: "0x59b670e9fA9D0A427751Af201D676719a970857b",
        curveManagerAddress: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
        criteriaManagerAddress: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
        marginVaultLibAddress: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        otokenFactoryAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
        whitelistAddress: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        network: "ganache",
        sampleUnderlyingTokenAddress: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
        oracleIsMock: true,
    },
    "kovan.demo": {
        collateralTokenAddress: "0x7e6edA50d1c833bE936492BF42C1BF376239E9e2",
        opynAddressBookAddress: "0x8812f219f507e8cfe9d2f1e790164714c5e06a73",
        potionLiquidityPoolAddress: "0xaf3DE2609F8b324122037071C2B56bFFB831C64f",
        curveManagerAddress: "0x376F8c85F43DA126A65C376F0612797695e806Da",
        criteriaManagerAddress: "0xD4aA9ED730730272572371EFB2a8f49B6D3f17Ca",
        otokenFactoryAddress: "0xb9D17Ab06e27f63d0FD75099d5874a194eE623e2",
        whitelistAddress: "0x9164eB40a1b59512F1803aB4C2d1dE4B89627A93",
        network: "kovan",
    },
    "kovan.independent": {
        collateralTokenAddress: "0x889805Cc6488818Bb8fc2A7bF66B842061A72960",
        opynAddressBookAddress: "0x1BD00a30827768b9B6fC5E4A42F424cF57d5FE99",
        potionLiquidityPoolAddress: "0x6c2d4fAe8d7DB2bAe9802dBd637A09844dc283f9",
        curveManagerAddress: "0xfE5858dfDa11ea758AFd576DCF844A49d51E4e9f",
        criteriaManagerAddress: "0xb0aA715aa80aeCe6a1e9EBB7628dc0a0E23559e6",
        marginVaultLibAddress: "0xf74C4411caff2E65435Ab494e454f49A71B4A1D6",
        otokenFactoryAddress: "0x415789d11409533410699Cf464E6bC540E85b9D9",
        whitelistAddress: "0xAcbc7baF72b1a5E97b1e3111D5b60aE6fF19cA01",
        network: "kovan.independent",
        sampleUnderlyingTokenAddress: "0x3bDC381232F72bC3c4844666c91741551268252a",
        oracleIsMock: true,
    },
    kovan: {
        collateralTokenAddress: "0x7e6edA50d1c833bE936492BF42C1BF376239E9e2",
        opynAddressBookAddress: "0x8812f219f507e8cfe9d2f1e790164714c5e06a73",
        potionLiquidityPoolAddress: "0xfaFe702Dd55217350E8CA97f2F69Dfac632D95E2",
        curveManagerAddress: "0xe6aDc4445c6b82936DC01aBaDF63387C85DD628d",
        criteriaManagerAddress: "0x09AC85e8939C43eD63CBEE442d8C70FaD5E43100",
        otokenFactoryAddress: "0xb9D17Ab06e27f63d0FD75099d5874a194eE623e2",
        whitelistAddress: "0x9164eB40a1b59512F1803aB4C2d1dE4B89627A93",
        network: "kovan",
    },
    localhost: {
        timestamp: 1658831011,
        network: "localhost",
        contracts: {
            AddressBook: {
                address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                blockNumber: 1,
            },
            Otoken: {
                address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                blockNumber: 2,
            },
            Oracle: {
                address: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
                blockNumber: 3,
            },
            MarginCalculator: {
                address: "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0",
                blockNumber: 67,
            },
            OtokenFactory: {
                address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                blockNumber: 5,
            },
            Whitelist: {
                address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
                blockNumber: 6,
            },
            MarginPool: {
                address: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
                blockNumber: 7,
            },
            MarginVault: {
                address: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
                blockNumber: 8,
            },
            Controller: {
                address: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
                blockNumber: 10,
            },
            PotionTestUSD: {
                address: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
                blockNumber: 18,
            },
            USDC: {
                address: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE",
                blockNumber: 0,
            },
            CurveManager: {
                address: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
                blockNumber: 19,
            },
            CriteriaManager: {
                address: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
                blockNumber: 20,
            },
            PotionLiquidityPool: {
                address: "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1",
                blockNumber: 23,
            },
            SampleUnderlyingToken: {
                address: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
                blockNumber: 25,
            },
            MockOracle: {
                address: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575",
                blockNumber: 63,
            },
        },
    },
};
