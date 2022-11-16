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

var tokenNamesList = ["WETH", "WBTC", "USDC"];
//                         Custom wETH pricer                         Custom wBTC pricer                         Custom USDC pricer
var pricerAddressString =
    "0x54235B44Ebb8F8Bf1bc248339ebAF06f7829307C,0xb64c7dE03c87DcA86bb9d8f2a6ee00ced1a5bd5F,0x29D3bbB8088d3962B80ca06cE04EE43db46B2AEc";
//                       Custom wETH Contract                       Custom wBTC Contract                       Custom USDC Contract
var pricerAssetString =
    "0x9889DfADE1d68488590DF17bbA882914535a8F92,0x667c04420C2B8D319ac24f6E605dCC28759C55f4,0x786A7c36d8b3acE2AE2A62c00D915C9f84eaAcB7";
//                             ETH/USD aggregator                         BTC/USD aggregator                         Custom USDC/USDC Aggregator
var aggregatorAddressString =
    "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e,0xA39434A63A52E749F02807ae27335515BA4b07F7,0x5fea417c193828eCF578933121De0B943E356a92";

const AddressBookAbi = JSON.parse(AddressBookAbiString);
const OracleAbi = JSON.parse(OracleAbiString);
const ChainlinkPricerAbi = JSON.parse(ChainlinkPricerAbiString);
const AggregatorInterfaceAbi = JSON.parse(AggregatorInterfaceAbiString);

// Entrypoint for the Autotask
exports.handler = async function (credentials) {
    // config
    const relayerAddress = "0x3a0000fc364d0a73407e5edbb8da777c183e1a22"; // Relayer address
    const addressbookAddress = "0x1B6e08713D2853e20f1F3370B9F809d3B20944Bd"; // AddressBook module
    const pricerAddress = pricerAddressString.split(","); // [wbtc, weth, usdc]
    const pricerAsset = pricerAssetString.split(","); // [wbtc, weth, usdc]
    const chainlinkAggregatorAddress = aggregatorAddressString.split(","); // [wbtc, weth, usdc]

    console.log("Starting Autotask!");

    // Initialize default provider and defender relayer signer
    const provider = new DefenderRelayProvider(credentials);
    const signer = new DefenderRelaySigner(credentials, provider, {
        speed: "fast",
        from: relayerAddress,
    });

    // addressbook instance
    console.log("Connecting AddressBook instance...");
    const addressbook = new ethers.Contract(addressbookAddress, AddressBookAbi, signer);
    console.log(`...connected at address ${addressbook.address}`);

    // oracle address
    console.log("Getting Oracle");
    const oracleAddress = await addressbook.getOracle();
    // oracle instance
    console.log("Connecting Oracle instance...");
    const oracle = new ethers.Contract(oracleAddress, OracleAbi, signer);
    console.log(`...connected at address ${oracle.address}`);

    // Otoken expiry hour in UTC
    const expiryHour = 8;

    // set expiry timestamp
    let expiryTimestamp = new Date();
    expiryTimestamp.setHours(expiryHour);
    expiryTimestamp.setMinutes(0);
    expiryTimestamp.setSeconds(0);
    expiryTimestamp = Math.floor(expiryTimestamp.getTime() / 1000);

    // current timestamp in UTC seconds
    let currentTimestamp = new Date();
    const hour = currentTimestamp.getHours();
    const weekday = currentTimestamp.toLocaleString("default", { weekday: "long" });
    currentTimestamp = Math.floor(currentTimestamp.getTime() / 1000);

    console.log("Expiry timestamp: ", expiryTimestamp.toString());
    console.log("Current timestamp: ", currentTimestamp);
    console.log("Current hour: ", hour);
    console.log("Current dat: ", weekday);

    if (hour >= expiryHour) {
        for (let i = 0; i < pricerAddress.length; i++) {
            const tokenName = tokenNamesList[i];

            console.log("-----------------------------------------");
            console.log(`       Processing ${tokenName} token`);
            console.log("-----------------------------------------");

            // pricer instance
            const pricer = new ethers.Contract(pricerAddress[i], ChainlinkPricerAbi, signer);
            // chainlink price feed instance
            const chainlinkAggregator = new ethers.Contract(
                chainlinkAggregatorAddress[i],
                AggregatorInterfaceAbi,
                signer,
            );

            console.log("Pricer: ", pricer.address);
            console.log("Pricer asset: ", pricerAsset[i]);
            console.log("Chainlink aggregator: ", chainlinkAggregator.address);

            let expiryPrice = await oracle.getExpiryPrice(pricerAsset[i], expiryTimestamp);
            let isDisputePeriodOver = await oracle.isDisputePeriodOver(pricerAsset[i], expiryTimestamp);
            let isLockingPeriodOver = await oracle.isLockingPeriodOver(pricerAsset[i], expiryTimestamp);

            console.log("Oracle expiry price: ", expiryPrice[0].toString());
            console.log("Is dispute period over: ", isDisputePeriodOver);
            console.log("Is locking period over: ", isLockingPeriodOver);

            if (expiryPrice[0].toString() == "0" && isLockingPeriodOver) {
                if (tokenName !== "USDC") {
                    // round id for expiry timestamp
                    let priceRoundId = await chainlinkAggregator.latestRound();
                    let priceRoundTimestamp = await chainlinkAggregator.getTimestamp(priceRoundId);
                    // round id before price round id
                    let previousRoundId;
                    let previousRoundTimestamp;

                    // check if otoken price is not on-chain, and latest chainlink round timestamp is greater than otoken expiry timestamp and locking period over
                    if (priceRoundTimestamp.toString() >= expiryTimestamp) {
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

                        let newPrice = await oracle.getExpiryPrice(pricerAsset[i], expiryTimestamp);
                        console.log("New price set: ", newPrice[0].toString());
                    } else {
                        console.log(
                            `Chainlink latest round timestamp ${priceRoundTimestamp} is not grater than or equal the expiry timestamp `,
                        );
                    }
                } else {
                    console.log("Setting expiry price in Oracle for USDC");
                    let tx = await pricer.setExpiryPriceInOracle(expiryTimestamp, 0, { gasLimit: "1000000" });
                    console.log("Tx hash: ", tx.hash);
                    await tx.wait();

                    let newPrice = await oracle.getExpiryPrice(pricerAsset[i], expiryTimestamp);
                    console.log("New price set: ", newPrice[0].toString());
                }
            }
        }
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
