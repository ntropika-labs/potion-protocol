# Price benchmark

This project contains the source code for an analysis conducted internally to evaluate the stability and performance of the sources used to fetch token prices.

## Quickstart

1. Define the following environment variables in your `.env` file:

   ```bash
   # editing .env in the root folder
   ...
   VITE_ETHEREUM_NETWORK="mainnet"
   VITE_ALCHEMY_KEY="your Alchemy key"
   VITE_INFURA_KEY="your Infura key"
   VITE_ORACLE_ADDRESS="0x789cD7AB3742e23Ce0952F6Bc3Eb3A73A0E08833" # opyn oracle address for mainnet
   ...
   ```

   - `VITE_ETHEREUM_NETWORK` - One of the networks available for the Opyn Gamma protocol. The updated list is also available [here](https://opyn.gitbook.io/opyn/getting-started/abis-smart-contract-addresses)
   - `VITE_ALCHEMY_KEY` - API key for [`Alchemy`](https://docs.alchemy.com/alchemy/introduction/getting-started)
   - `VITE_INFURA_KEY` - API key for [`Infura`](https://docs.infura.io/infura/getting-started)
   - `VITE_ORACLE_ADDRESS` - This is the [oracle contract](../../contracts/gamma-protocol/contracts/core/Oracle.sol) address for the Opyn Gamma protocol [Oracle](https://opyn.gitbook.io/opyn/contracts/oracle). You can find the address for your network at [Smart Contract Addresses](https://opyn.gitbook.io/opyn/getting-started/abis-smart-contract-addresses).

2. Start the benchmark app

   ```bash
   yarn dev price-source-benchmark
   ```

3. Navigate to `http://localhost:5173/`

4. Scroll down to the `Benchmarks` section and configure the benchmark according to your requirements:

   - Select the providers you intend to test
   - Select the tokens to be queried on each request.  
     The `FAKE` token is a bogus one and is used to test reliability and error handling.
   - Click the `run benchmark` button tu run the benchmark
   - The results of the benchmark will appear in `All benchmarks` and the token prices will appear in `All prices`. By default the tables show only the last entry for each selected token, to show all entries click the `show all` checkbox.

5. To Enable price polling (configured with a resolution of 30 seconds), select the `toggle polling` checkbox

6. If you wish to export your data you can use the `export` button displayed above the tables.

## Providers

- Coingecko
- Alchemy
- Ankr
- Infura

## Features

Feature table was last updated on 16/09/2022

| Feature                                        | CoinGecko                              | Alchemy Oracle                                    | Ankr Oracle          | Infura Oracle          |
| ---------------------------------------------- | -------------------------------------- | ------------------------------------------------- | -------------------- | ---------------------- |
| Rate limit                                     | Yes 50 calls/minute (varies) free plan | Yes https://docs.alchemy.com/reference/throughput | Yes 1M for free plan | Yes 100k/day free plan |
| Number of tokens affects rate limit            | No                                     | Yes                                               | Yes                  | Yes                    |
| Query multiple tokens at once                  | Yes                                    | No                                                | No                   | No                     |
| Contract events                                | No                                     | Yes                                               | No                   | Yes                    |
| Exposes additional info                        | Yes                                    | No                                                | No                   | No                     |
| Customise currency without further conversions | Yes                                    | No                                                | No                   | No                     |
| Requires attribution                           | Not in PRO plan                        | No                                                | No                   | No                     |
| Leverages HTTP cache                           | Yes                                    | No                                                | No                   | No                     |

### Oracle

- Batch requests (**[https://docs.alchemy.com/reference/batch-requests](https://docs.alchemy.com/reference/batch-requests)**)
- Exposes
  ```
  Event StablePriceUpdated(address asset, uint256 price)
  ```

## Test suite

- Perform sequential network requests for each provider, so that each provider can be tested in isolation
- Perform parallel network requests (required only for oracles) for each token, so that a real use case can be tested
- Query different amounts of tokens to evaluate how this affects providers
- Query a token address not matched to any existing token to test reliability and error handling
- Perform stress tests with varying amounts of concurrent benchmarks to measure the impact of resource constrains on different providers
- Use the browsers native `Performance API` to measure the exact amount of time spent within functions.
  For oracle providers it is not possible to capture the exact amount of time spent on batch requests, so we measure the time spent requesting each token and show its average.
