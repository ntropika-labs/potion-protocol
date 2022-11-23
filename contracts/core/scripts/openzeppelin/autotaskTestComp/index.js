// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ethers } = require("ethers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DefenderRelaySigner, DefenderRelayProvider } = require("defender-relay-client/lib/ethers");

// Cli Gamma Sync Information = null performed sync using autoclient on Wed Feb 02 2022 12:37:16 GMT+0100 (West Africa Standard Time);

var AddressBookAbiString =
    '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":false,"internalType":"address","name":"add","type":"address"}],"name":"AddressAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"id","type":"bytes32"},{"indexed":false,"internalType":"address","name":"proxy","type":"address"}],"name":"ProxyCreated","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getOtokenImpl","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOtokenFactory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getWhitelist","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getController","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarginPool","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMarginCalculator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidationManager","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_otokenImpl","type":"address"}],"name":"setOtokenImpl","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_otokenFactory","type":"address"}],"name":"setOtokenFactory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_whitelist","type":"address"}],"name":"setWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_controller","type":"address"}],"name":"setController","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_marginPool","type":"address"}],"name":"setMarginPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_marginCalculator","type":"address"}],"name":"setMarginCalculator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_liquidationManager","type":"address"}],"name":"setLiquidationManager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oracle","type":"address"}],"name":"setOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"}],"name":"getAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_key","type":"bytes32"},{"internalType":"address","name":"_address","type":"address"}],"name":"setAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_id","type":"bytes32"},{"internalType":"address","name":"_newAddress","type":"address"}],"name":"updateImpl","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
var OracleAbiString =
    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newDisputer","type":"address"}],"name":"DisputerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":true,"internalType":"uint256","name":"expiryTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"disputedPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"disputeTimestamp","type":"uint256"}],"name":"ExpiryPriceDisputed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":true,"internalType":"uint256","name":"expirtyTimestamp","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"onchainTimestamp","type":"uint256"}],"name":"ExpiryPriceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pricer","type":"address"},{"indexed":false,"internalType":"uint256","name":"disputePeriod","type":"uint256"}],"name":"PricerDisputePeriodUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pricer","type":"address"},{"indexed":false,"internalType":"uint256","name":"lockingPeriod","type":"uint256"}],"name":"PricerLockingPeriodUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"address","name":"pricer","type":"address"}],"name":"PricerUpdated","type":"event"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"}],"name":"getExpiryPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"}],"name":"getPricer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDisputer","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pricer","type":"address"}],"name":"getPricerLockingPeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pricer","type":"address"}],"name":"getPricerDisputePeriod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"}],"name":"isLockingPeriodOver","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"}],"name":"isDisputePeriodOver","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"address","name":"_pricer","type":"address"}],"name":"setAssetPricer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pricer","type":"address"},{"internalType":"uint256","name":"_lockingPeriod","type":"uint256"}],"name":"setLockingPeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_pricer","type":"address"},{"internalType":"uint256","name":"_disputePeriod","type":"uint256"}],"name":"setDisputePeriod","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_disputer","type":"address"}],"name":"setDisputer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"disputeExpiryPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"setExpiryPrice","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
var ChainlinkPricerAbiString =
    '[{"inputs":[{"internalType":"address","name":"_asset","type":"address"},{"internalType":"address","name":"_aggregator","type":"address"},{"internalType":"address","name":"_oracle","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"aggregator","outputs":[{"internalType":"contract AggregatorInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"asset","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracle","outputs":[{"internalType":"contract OracleInterface","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expiryTimestamp","type":"uint256"},{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"setExpiryPriceInOracle","outputs":[],"stateMutability":"nonpayable","type":"function"}]';
var AggregatorInterfaceAbiString =
    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"int256","name":"current","type":"int256"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"AnswerUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"startedBy","type":"address"},{"indexed":false,"internalType":"uint256","name":"startedAt","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[],"name":"latestAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRound","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getAnswer","outputs":[{"internalType":"int256","name":"","type":"int256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getTimestamp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';

const RelayerAddress = "0xa5b9f311ea1d9785872c5f7e538804c0cdf29249";
const AddressbookAddress = "0x0003f387d1e1428D277d1EbF9eAfBF2Dc2daDDA8"; // AddressBook module

var TokenConfigs = [
    {
        tokenName: "WETH",
        pricerAddress: "0xA9e8ca8C1A44E217667069a16d9ae1342A110AB0",
        pricerAsset: "0x4Ea6Ee9316f1E5DBf7Fc7e63DF3f65764F2b0ac0",
        aggregatorAddress: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    },
    {
        tokenName: "WBTC",
        pricerAddress: "0x700E5c824540e3Ea3eB432013eA298659b8a4Aad",
        pricerAsset: "0xb3086e79c2f6328676899E01C883B51830594A64",
        aggregatorAddress: "0x007A22900a3B98143368Bd5906f8E17e9867581b",
    },
    {
        tokenName: "LINK",
        pricerAddress: "0x90DC40A504Ca934f0fe60b321EDd530299266437",
        pricerAsset: "0xe59914ED345212190778F8e7427B0B6f73332D50",
        aggregatorAddress: "0x1C2252aeeD50e0c9B64bDfF2735Ee3C932F5C408",
    },
    {
        tokenName: "USDC",
        pricerAddress: "0xb37c503B74e9d661E94E7fC7D07DBc672C0681a6",
        pricerAsset: "0x4A9c8d8226E017e8e8da824c567cf41a9F8275C3",
        aggregatorAddress: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    },
];

const AddressBookAbi = JSON.parse(AddressBookAbiString);
const OracleAbi = JSON.parse(OracleAbiString);
const ChainlinkPricerAbi = JSON.parse(ChainlinkPricerAbiString);
const AggregatorInterfaceAbi = JSON.parse(AggregatorInterfaceAbiString);

// Entrypoint for the Autotask
exports.handler = async function (credentials) {
    // config
    // const pricerAddress = pricerAddressString.split(","); // [wbtc, weth, usdc]
    // const pricerAsset = pricerAssetString.split(","); // [wbtc, weth, usdc]
    // const chainlinkAggregatorAddress = aggregatorAddressString.split(","); // [wbtc, weth, usdc]

    console.log("Starting Autotask!");

    // Initialize default provider and defender relayer signer
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {
        speed: "fast",
        from: RelayerAddress,
    });

    // AddressBook
    console.log("Connecting AddressBook instance...");
    const addressbook = new ethers.Contract(AddressbookAddress, AddressBookAbi, signer);
    console.log(`...connected at address ${addressbook.address}`);

    // Oracle
    console.log("Connecting Oracle instance...");
    const oracleAddress = await addressbook.getOracle();
    const oracle = new ethers.Contract(oracleAddress, OracleAbi, signer);
    console.log(`...connected at address ${oracle.address}`);

    // Otoken expiry hour in UTC
    const expiryHour = 8;

    // Set expiry timestamp
    let expiryTimestamp = new Date();
    expiryTimestamp.setHours(expiryHour);
    expiryTimestamp.setMinutes(0);
    expiryTimestamp.setSeconds(0);
    expiryTimestamp = Math.floor(expiryTimestamp.getTime() / 1000);

    // Current timestamp in UTC seconds
    let currentTimestamp = new Date();
    const hour = currentTimestamp.getHours();
    const weekday = currentTimestamp.toLocaleString("default", { weekday: "long" });
    currentTimestamp = Math.floor(currentTimestamp.getTime() / 1000);

    console.log("Expiry timestamp: ", expiryTimestamp.toString());
    console.log("Current timestamp: ", currentTimestamp);
    console.log("Current hour: ", hour);
    console.log("Current dat: ", weekday);

    if (hour < expiryHour) {
        console.log("Current hour is before expiry hour, skipping...");
        return;
    }

    for (let i = 0; i < TokenConfigs.length; i++) {
        const config = TokenConfigs[i];

        console.log("-----------------------------------------");
        console.log(`       Processing ${config.tokenName} token`);
        console.log("-----------------------------------------");

        // pricer instance
        const pricer = new ethers.Contract(config.pricerAddress, ChainlinkPricerAbi, signer);
        // chainlink price feed instance
        const chainlinkAggregator = new ethers.Contract(config.aggregatorAddress, AggregatorInterfaceAbi, signer);

        console.log("Pricer: ", pricer.address);
        console.log("Pricer asset: ", config.pricerAsset);
        console.log("Chainlink aggregator: ", chainlinkAggregator.address);

        let expiryPrice = await oracle.getExpiryPrice(config.pricerAsset, expiryTimestamp);
        let isDisputePeriodOver = await oracle.isDisputePeriodOver(config.pricerAsset, expiryTimestamp);
        let isLockingPeriodOver = await oracle.isLockingPeriodOver(config.pricerAsset, expiryTimestamp);

        console.log("Oracle expiry price: ", expiryPrice[0].toString());
        console.log("Is dispute period over: ", isDisputePeriodOver);
        console.log("Is locking period over: ", isLockingPeriodOver);

        if (expiryPrice[0].toString() != "0" || !isLockingPeriodOver) {
            console.log("Oracle has already set the expiry price, skipping...");
            continue;
        }

        // round id for expiry timestamp
        let priceRoundId = await chainlinkAggregator.latestRound();
        let priceRoundTimestamp = await chainlinkAggregator.getTimestamp(priceRoundId);

        // check if otoken price is not on-chain, and latest chainlink round timestamp is greater than otoken expiry timestamp and locking period over
        if (priceRoundTimestamp.toString() < expiryTimestamp) {
            console.log(
                `Chainlink latest round timestamp ${priceRoundTimestamp} is not grater than or equal the expiry timestamp `,
            );
            continue;
        }

        // round id before price round id
        let previousRoundId;
        let previousRoundTimestamp;

        // loop and decrease round id until previousRoundTimestamp < expiryTimestamp && priceRoundTimestamp >= expiryTimestamp
        // if previous round timestamp != 0 && less than expiry timestamp then exit => price round id found
        // else store previous round id in price round id (as we are searching for the first round id that it timestamp >= expiry timestamp)
        for (let j = priceRoundId.sub(1); j > 0; j = j.sub(1)) {
            previousRoundId = j;
            previousRoundTimestamp = await chainlinkAggregator.getTimestamp(j);

            if (previousRoundTimestamp.toString() != "0") {
                if (previousRoundTimestamp.toString() < expiryTimestamp.toString()) {
                    break;
                } else {
                    priceRoundId = previousRoundId;
                    priceRoundTimestamp = previousRoundTimestamp;
                }
            }
        }

        console.log("Found round id: ", priceRoundId.toString());
        console.log("Found round timestamp: ", priceRoundTimestamp.toString());
        console.log("Expiration timestamp: ", expiryTimestamp);

        let tx = await pricer.setExpiryPriceInOracle(expiryTimestamp, priceRoundId, {
            gasLimit: "1000000",
        });

        console.log("Tx hash: ", tx.hash);

        await tx.wait();

        let newPrice = await oracle.getExpiryPrice(config.pricerAsset, expiryTimestamp);
        console.log("New price set: ", newPrice[0].toString());
    }
};

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();

    const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
    exports
        .handler({ apiKey, apiSecret })
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
