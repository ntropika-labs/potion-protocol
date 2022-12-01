// Autogenerated by the deployments script
import remotePly_mumbaiPrepare_testcomp from "../deployments/remote/remote.ply-mumbai.prepare-testcomp.json";
import remotePly_mumbaiTestcomp_1 from "../deployments/remote/remote.ply-mumbai.testcomp-1.json";
import remotePly_mumbaiTestcomp_2 from "../deployments/remote/remote.ply-mumbai.testcomp-2.json";
import remotePly_mumbaiTestcomp_3 from "../deployments/remote/remote.ply-mumbai.testcomp-3.json";

export const Deployments = {
    "ply-mumbai.prepare-testcomp": remotePly_mumbaiPrepare_testcomp,
    "ply-mumbai.testcomp-1": remotePly_mumbaiTestcomp_1,
    "ply-mumbai.testcomp-2": remotePly_mumbaiTestcomp_2,
    "ply-mumbai.testcomp-3": remotePly_mumbaiTestcomp_3,
    goerli: {
        timestamp: 1662477222,
        network: "goerli",
        contracts: {
            PotionBuyAction: {
                address: "0x8C993aD2806F38Cae4d58631cDb9cd89D99cbBe3",
                blockNumber: 7541791,
            },
            InvestmentVault: {
                address: "0x7488e98ac657e57DBAf9906b6E6303f4D9Ef6974",
                blockNumber: 7541801,
            },
            HedgingVaultOrchestrator: {
                address: "0x646486d149528B55285aDB62869151cc6698Eec7",
                blockNumber: 7541812,
            },
        },
    },
    "localhost.goerli": {
        timestamp: 1662461323,
        network: "localhost",
        contracts: {
            USDC: {
                address: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7",
                blockNumber: 0,
            },
            UnderlyingAsset: {
                address: "0x9889DfADE1d68488590DF17bbA882914535a8F92",
                blockNumber: 0,
            },
            PotionLiquidityPool: {
                address: "0x8a450F4C1aF53a5b41F6ec8f05036bE1F7383fEc",
                blockNumber: 0,
            },
            OpynAddressBook: {
                address: "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd",
                blockNumber: 0,
            },
            OpynController: {
                address: "0x540135Aa6aB61D6201c60d0F10A7626038Bd7d99",
                blockNumber: 0,
            },
            OpynFactory: {
                address: "0x41D4Fe19c8C41Dc60638B5d12Cf32d59CFbac73a",
                blockNumber: 0,
            },
            OpynOracle: {
                address: "0x5c26B53A6e8E50478AfEa123a3726E7188d1558B",
                blockNumber: 0,
            },
            SwapRouter: {
                address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                blockNumber: 0,
            },
            PotionBuyAction: {
                address: "0x70dd934556FcF69C89c7393f1024E5B1fcfaC675",
                blockNumber: 7540706,
            },
            InvestmentVault: {
                address: "0x0B15205C2ADb8C007597c13d98FEA3e7e46bA27B",
                blockNumber: 7540714,
            },
            HedgingVaultOrchestrator: {
                address: "0x5333328a62F56df4CAaaAEd449a821Be43A203Fe",
                blockNumber: 7540719,
            },
        },
    },
    "localhost.hedging": {
        timestamp: 1666966171,
        network: "develop",
        contracts: {
            USDC: {
                address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
                blockNumber: 0,
            },
            UnderlyingAsset: {
                address: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
                blockNumber: 0,
            },
            PotionLiquidityPool: {
                address: "0x59b670e9fA9D0A427751Af201D676719a970857b",
                blockNumber: 0,
            },
            OpynAddressBook: {
                address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                blockNumber: 0,
            },
            OpynController: {
                address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
                blockNumber: 0,
            },
            OpynFactory: {
                address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                blockNumber: 0,
            },
            OpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            MockOpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            UniswapV3Router: {
                address: "0x19cEcCd6942ad38562Ee10bAfd44776ceB67e923",
                blockNumber: 162,
            },
            HedgingVaultOrchestrator: {
                address: "0x927b167526bAbB9be047421db732C663a0b77B11",
                blockNumber: 165,
            },
            PotionBuyAction: {
                address: "0x02b0B4EFd909240FCB2Eb5FAe060dC60D112E3a4",
                blockNumber: 168,
            },
            SwapToUSDCAction: {
                address: "0x6C2d83262fF84cBaDb3e416D527403135D757892",
                blockNumber: 170,
            },
            InvestmentVault: {
                address: "0xa6e99A4ED7498b3cdDCBB61a6A607a4925Faa1B7",
                blockNumber: 172,
            },
            RoundsInputVault: {
                address: "0x0ed64d01D0B4B655E410EF1441dD677B695639E7",
                blockNumber: 174,
            },
            RoundsOutputVault: {
                address: "0x40a42Baf86Fc821f972Ad2aC878729063CeEF403",
                blockNumber: 176,
            },
            RoundsVaultExchanger: {
                address: "0x96F3Ce39Ad2BfDCf92C0F6E2C2CAbF83874660Fc",
                blockNumber: 177,
            },
        },
    },
    "localhost.multivaultA": {
        timestamp: 1669886962,
        network: "develop",
        contracts: {
            USDC: {
                address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
                blockNumber: 0,
            },
            UnderlyingAsset: {
                address: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
                blockNumber: 0,
            },
            PotionLiquidityPool: {
                address: "0x59b670e9fA9D0A427751Af201D676719a970857b",
                blockNumber: 0,
            },
            OpynAddressBook: {
                address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                blockNumber: 0,
            },
            OpynController: {
                address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
                blockNumber: 0,
            },
            OpynFactory: {
                address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                blockNumber: 0,
            },
            OpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            MockOpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            ChainlinkAggregatorUSDC: {
                address: "0x202CCe504e04bEd6fC0521238dDf04Bc9E8E15aB",
                blockNumber: 99,
            },
            ChainlinkAggregatorUnderlyingAsset: {
                address: "0xf4B146FbA71F41E0592668ffbF264F1D186b2Ca8",
                blockNumber: 100,
            },
            UniswapV3Router: {
                address: "0x172076E0166D1F9Cc711C77Adf8488051744980C",
                blockNumber: 101,
            },
            HedgingVaultOrchestrator: {
                address: "0xD84379CEae14AA33C123Af12424A37803F885889",
                blockNumber: 104,
            },
            PotionBuyAction: {
                address: "0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E",
                blockNumber: 107,
            },
            SwapToUSDCAction: {
                address: "0x1c85638e118b37167e9298c2268758e058DdfDA0",
                blockNumber: 109,
            },
            InvestmentVault: {
                address: "0x4C2F7092C2aE51D986bEFEe378e50BD4dB99C901",
                blockNumber: 111,
            },
            RoundsInputVault: {
                address: "0x49fd2BE640DB2910c2fAb69bB8531Ab6E76127ff",
                blockNumber: 113,
            },
            RoundsOutputVault: {
                address: "0x86A2EE8FAf9A840F7a2c64CA3d51209F9A02081D",
                blockNumber: 115,
            },
            RoundsVaultExchanger: {
                address: "0xA4899D35897033b927acFCf422bc745916139776",
                blockNumber: 116,
            },
        },
    },
    "localhost.multivaultB": {
        timestamp: 1669886968,
        network: "develop",
        contracts: {
            USDC: {
                address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
                blockNumber: 0,
            },
            UnderlyingAsset: {
                address: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
                blockNumber: 0,
            },
            PotionLiquidityPool: {
                address: "0x59b670e9fA9D0A427751Af201D676719a970857b",
                blockNumber: 0,
            },
            OpynAddressBook: {
                address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                blockNumber: 0,
            },
            OpynController: {
                address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
                blockNumber: 0,
            },
            OpynFactory: {
                address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                blockNumber: 0,
            },
            OpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            MockOpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            ChainlinkAggregatorUSDC: {
                address: "0xD5ac451B0c50B9476107823Af206eD814a2e2580",
                blockNumber: 126,
            },
            ChainlinkAggregatorUnderlyingAsset: {
                address: "0xF8e31cb472bc70500f08Cd84917E5A1912Ec8397",
                blockNumber: 127,
            },
            UniswapV3Router: {
                address: "0xc0F115A19107322cFBf1cDBC7ea011C19EbDB4F8",
                blockNumber: 128,
            },
            HedgingVaultOrchestrator: {
                address: "0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A",
                blockNumber: 131,
            },
            PotionBuyAction: {
                address: "0x07882Ae1ecB7429a84f1D53048d35c4bB2056877",
                blockNumber: 132,
            },
            SwapToUSDCAction: {
                address: "0x22753E4264FDDc6181dc7cce468904A80a363E44",
                blockNumber: 133,
            },
            InvestmentVault: {
                address: "0xA7c59f010700930003b33aB25a7a0679C860f29c",
                blockNumber: 134,
            },
            RoundsInputVault: {
                address: "0xfaAddC93baf78e89DCf37bA67943E1bE8F37Bb8c",
                blockNumber: 135,
            },
            RoundsOutputVault: {
                address: "0x276C216D241856199A83bf27b2286659e5b877D3",
                blockNumber: 136,
            },
            RoundsVaultExchanger: {
                address: "0x3347B4d90ebe72BeFb30444C9966B2B990aE9FcB",
                blockNumber: 137,
            },
        },
    },
    "localhost.multivaultC": {
        timestamp: 1669886973,
        network: "develop",
        contracts: {
            USDC: {
                address: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
                blockNumber: 0,
            },
            UnderlyingAsset: {
                address: "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44",
                blockNumber: 0,
            },
            PotionLiquidityPool: {
                address: "0x59b670e9fA9D0A427751Af201D676719a970857b",
                blockNumber: 0,
            },
            OpynAddressBook: {
                address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
                blockNumber: 0,
            },
            OpynController: {
                address: "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
                blockNumber: 0,
            },
            OpynFactory: {
                address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
                blockNumber: 0,
            },
            OpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            MockOpynOracle: {
                address: "0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2",
                blockNumber: 0,
            },
            ChainlinkAggregatorUSDC: {
                address: "0x38a024C0b412B9d1db8BC398140D00F5Af3093D4",
                blockNumber: 147,
            },
            ChainlinkAggregatorUnderlyingAsset: {
                address: "0x5fc748f1FEb28d7b76fa1c6B07D8ba2d5535177c",
                blockNumber: 148,
            },
            UniswapV3Router: {
                address: "0xB82008565FdC7e44609fA118A4a681E92581e680",
                blockNumber: 149,
            },
            HedgingVaultOrchestrator: {
                address: "0x8A93d247134d91e0de6f96547cB0204e5BE8e5D8",
                blockNumber: 152,
            },
            PotionBuyAction: {
                address: "0x40918Ba7f132E0aCba2CE4de4c4baF9BD2D7D849",
                blockNumber: 153,
            },
            SwapToUSDCAction: {
                address: "0xF32D39ff9f6Aa7a7A64d7a4F00a54826Ef791a55",
                blockNumber: 154,
            },
            InvestmentVault: {
                address: "0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf",
                blockNumber: 155,
            },
            RoundsInputVault: {
                address: "0x99dBE4AEa58E518C50a1c04aE9b48C9F6354612f",
                blockNumber: 156,
            },
            RoundsOutputVault: {
                address: "0x6F6f570F45833E249e27022648a26F4076F48f78",
                blockNumber: 157,
            },
            RoundsVaultExchanger: {
                address: "0xCA8c8688914e0F7096c920146cd0Ad85cD7Ae8b9",
                blockNumber: 158,
            },
        },
    },
};
