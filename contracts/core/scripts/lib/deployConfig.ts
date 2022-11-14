import { BigNumber, BigNumberish } from "ethers";
import { AccountValue, PostDeployAction } from "./postDeploy";
import {
    AllocateCollateralTokensFromFaucet,
    AllocateCollateralTokensToWalletsFromFaucet,
    AllocateCollateralTokensToWallets,
} from "./postDeployActions/AllocateCollateralTokens";
import { FastForwardDays, FastForwardPastNextActiveOtokenExpiry } from "./postDeployActions/FastForwardActions";
import {
    DeployCriteriaAndCriteriaSets,
    DeployCurves,
    generateOneCriteriaAndOneCriteriaSet,
    generateOneCurve,
    generateHedgingVaultCurves,
    generateHedgingVaultCriteriaSet,
} from "./postDeployActions/CurveAndCriteriaActions";
import {
    InitializeSamplePoolsOfCapital,
    generateHedgingVaultDeposits,
} from "./postDeployActions/InitializeSamplePoolsOfCapital";
import { InitializeMockOracle, UpdateMockOraclePrices } from "./postDeployActions/MockOracleActions";
import { WhitelistCollateral } from "./postDeployActions/WhitelistCollateral";
import { DeploySampleUnderlyingToken } from "./postDeployActions/DeploySampleUnderlyingToken";
import { CreateOtokens, InitializeSamplePurchases } from "./postDeployActions/OtokensAndPurchaseActions";
import { SettleAllExpiredOtokens } from "./postDeployActions/SettleAllExpiredOtokens";
import { priceHistory1 } from "./postDeployActions/dataForImport/priceHistory.json";
import { WhitelistUnderlying } from "./postDeployActions/WhitelistUnderlying";
import { DeployChainlinkPricer } from "./postDeployActions/DeployChainlinkPricer";

function parseUsdcAmount(dollars: BigNumberish): BigNumber {
    return BigNumber.from(dollars).mul(1e6);
}

export interface NetworkDeployConfig {
    collateralToken?: string;
    opynAddressBook?: string;
    sampleUnderlyingToken?: string;
    postDeployActions: PostDeployAction[];
}
export interface NetworkDeployConfigMap {
    [networkName: string]: NetworkDeployConfig;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const basicDataForTesting = (): PostDeployAction[] => {
    return [
        new WhitelistCollateral(),
        new DeploySampleUnderlyingToken("WETH"),
        new DeploySampleUnderlyingToken("WBTC"),
        new DeploySampleUnderlyingToken("UNI"),
        new DeploySampleUnderlyingToken("SUSHI"),
        new DeploySampleUnderlyingToken("AAVE"),
        new DeploySampleUnderlyingToken("DPI"),
        new AllocateCollateralTokensFromFaucet(EXTERNAL_COLLATERAL_ALLOCATIONS),
        new AllocateCollateralTokensToWalletsFromFaucet(parseUsdcAmount("1000000")),
        new DeployCurves(),
        new DeployCriteriaAndCriteriaSets(),
        new FastForwardDays(2),
        new InitializeSamplePoolsOfCapital(),
        new InitializeMockOracle(1500),
        new CreateOtokens(),
        new InitializeSamplePurchases(),
        new SettleAllExpiredOtokens(),
        new FastForwardDays(60),
        new UpdateMockOraclePrices(1400),
        new SettleAllExpiredOtokens(),
        new FastForwardPastNextActiveOtokenExpiry(),
        new UpdateMockOraclePrices(1300),
        new SettleAllExpiredOtokens(),
    ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const priceHistoryData = (): PostDeployAction[] => {
    const priceHistory = priceHistory1;
    let price = 1500;
    const pdas: PostDeployAction[] = [
        new WhitelistCollateral(),
        new DeploySampleUnderlyingToken(),
        new AllocateCollateralTokensFromFaucet(EXTERNAL_COLLATERAL_ALLOCATIONS),
        new AllocateCollateralTokensToWalletsFromFaucet(parseUsdcAmount("1000000")),
        new DeployCurves(generateOneCurve),
        new DeployCriteriaAndCriteriaSets(generateOneCriteriaAndOneCriteriaSet),
        new FastForwardDays(2),
        new InitializeSamplePoolsOfCapital(),
        new InitializeMockOracle(priceHistory[0]),
    ];
    for (let i = 1; i < priceHistory.length; i++) {
        price = priceHistory[i];
        pdas.push(
            new CreateOtokens(),
            new InitializeSamplePurchases(1),
            new FastForwardPastNextActiveOtokenExpiry(),
            new UpdateMockOraclePrices(price),
            new SettleAllExpiredOtokens(),
        );
    }
    return pdas;
};

const EXTERNAL_COLLATERAL_ALLOCATIONS = [
    // Team
    new AccountValue("0x2c5eDB7F0EF80C7aBea2D2b7bF9Da96823Ec935d", parseUsdcAmount("1000000")), // G
    new AccountValue("0x46BD46A8C0DcB4Ca501c4A5624B1F09Ba86ff8F6", parseUsdcAmount("1000000")), // N
    new AccountValue("0x614B7f7Ed8E93260B6EA33BB081073036F73F9E9", parseUsdcAmount("1000000")), // E
];

const HEDGING_VAULT_TEST_ALLOCATIONS = [
    new AccountValue("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", parseUsdcAmount("1000000")), // Hardhat default test account
];

const LOCALHOST_GOERLI_ALL = [
    // Team
    new AccountValue("0x72132eE89ED8A2B8d6b2797Bbd32285832c1c87e", parseUsdcAmount("1000000")), // S
];

const newSelfContainedEcosystemConfig = {
    postDeployActions: basicDataForTesting(),
    // postDeployActions: priceHistoryData(),
};

export const config: NetworkDeployConfigMap = {
    // The default goerli network deploys Potion on top of contracts that were deployed and are controlled by Opyn
    goerli: {
        collateralToken: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
        sampleUnderlyingToken: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH
        postDeployActions: [
            new WhitelistCollateral(),
            new WhitelistUnderlying("0x9889DfADE1d68488590DF17bbA882914535a8F92"), // Custom WETH
            new WhitelistUnderlying("0x667c04420C2B8D319ac24f6E605dCC28759C55f4"), // Custom WBTC
            new DeployChainlinkPricer({
                assetName: "WETH",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WBTC
                chainlinkAggregatorAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // ETH/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "WBTC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x667c04420C2B8D319ac24f6E605dCC28759C55f4", // Custom WBTC
                chainlinkAggregatorAddress: "0xA39434A63A52E749F02807ae27335515BA4b07F7", // WBTC/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "USDC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
                chainlinkAggregatorAddress: "0x5fea417c193828eCF578933121De0B943E356a92", // Custom USDC/USD aggregator
            }),
        ],
    },

    // The goerli.independent deployment deploys Opyn and Potion from the ground up, so that we control even the Opyn contracts
    // It relies on previous deployment of the custom tokens and USDC aggregator. It also deploys the neccessary pricers
    // for the custom tokens
    "goerli.independent": {
        collateralToken: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
        sampleUnderlyingToken: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH
        postDeployActions: [
            new WhitelistCollateral(),
            new WhitelistUnderlying("0x9889DfADE1d68488590DF17bbA882914535a8F92"), // Custom WETH
            new WhitelistUnderlying("0x667c04420C2B8D319ac24f6E605dCC28759C55f4"), // Custom WBTC
            new WhitelistUnderlying("0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7"), // Custom USDC
            new DeployChainlinkPricer({
                assetName: "WETH",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WBTC
                chainlinkAggregatorAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // ETH/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "WBTC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x667c04420C2B8D319ac24f6E605dCC28759C55f4", // Custom WBTC
                chainlinkAggregatorAddress: "0xA39434A63A52E749F02807ae27335515BA4b07F7", // WBTC/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "USDC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
                chainlinkAggregatorAddress: "0x5fea417c193828eCF578933121De0B943E356a92", // Custom USDC/USD aggregator
            }),
        ],
    },
    localhost: newSelfContainedEcosystemConfig,
    "localhost.hedging": {
        postDeployActions: [
            new WhitelistCollateral(),
            new DeploySampleUnderlyingToken("WETH"),
            new AllocateCollateralTokensFromFaucet(HEDGING_VAULT_TEST_ALLOCATIONS),
            new AllocateCollateralTokensToWalletsFromFaucet(parseUsdcAmount("1000000")),
            new DeployCurves(generateHedgingVaultCurves),
            new DeployCriteriaAndCriteriaSets(generateHedgingVaultCriteriaSet),
            new FastForwardDays(2),
            new InitializeSamplePoolsOfCapital(generateHedgingVaultDeposits),
            new InitializeMockOracle(1000),
        ],
    },
    "localhost.goerli": {
        collateralToken: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
        sampleUnderlyingToken: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WETH
        postDeployActions: [
            new WhitelistCollateral(),
            new WhitelistUnderlying("0x9889DfADE1d68488590DF17bbA882914535a8F92"), // Custom WETH
            new WhitelistUnderlying("0x667c04420C2B8D319ac24f6E605dCC28759C55f4"), // Custom WBTC
            new DeployChainlinkPricer({
                assetName: "WETH",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x9889DfADE1d68488590DF17bbA882914535a8F92", // Custom WBTC
                chainlinkAggregatorAddress: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e", // ETH/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "WBTC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x667c04420C2B8D319ac24f6E605dCC28759C55f4", // Custom WBTC
                chainlinkAggregatorAddress: "0xA39434A63A52E749F02807ae27335515BA4b07F7", // WBTC/USD aggregator
            }),
            new DeployChainlinkPricer({
                assetName: "USDC",
                relayerAddress: "0x64a69e2f7643dbf511ea1636496d4af5e654e445", // OZ Relayer
                assetAddress: "0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7", // Custom USDC
                chainlinkAggregatorAddress: "0x5fea417c193828eCF578933121De0B943E356a92", // Custom USDC/USD aggregator
            }),
            new AllocateCollateralTokensToWallets([
                new AccountValue("0xc892cfd3e75Cf428BDD25576e9a42D515697B2C7", parseUsdcAmount("1000000")),
                new AccountValue("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", parseUsdcAmount("1000000")),
            ]),
        ],
    },
    "localhost.independent": {
        postDeployActions: [
            new WhitelistCollateral(),
            new DeploySampleUnderlyingToken("PTNETH"),
            new DeploySampleUnderlyingToken("PTNUNI"),
            new DeploySampleUnderlyingToken("PTNLINK"),
            new AllocateCollateralTokensFromFaucet(EXTERNAL_COLLATERAL_ALLOCATIONS),
            new AllocateCollateralTokensToWalletsFromFaucet(parseUsdcAmount("1000000")),
            new DeployCurves(),
            new DeployCriteriaAndCriteriaSets(),
            new InitializeSamplePoolsOfCapital(),
            new DeployChainlinkPricer({
                assetName: "WETH",
                relayerAddress: "0xba6b224398fc87abced124ba3b34fb2a83c13cec", // OZ Relayer
                assetAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
                chainlinkAggregatorAddress: "0x9326BFA02ADD2366b30bacB125260Af641031331", // ETH/USD aggregator
            }),
        ],
    },
    ganache: newSelfContainedEcosystemConfig,
    hardhat: newSelfContainedEcosystemConfig,
    mainnet: {
        collateralToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        opynAddressBook: "0x1E31F2DCBad4dc572004Eae6355fB18F9615cBe4",
        postDeployActions: [],
    },
};
