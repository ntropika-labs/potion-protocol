# Goal

The Goal of this benchmark is to assess how fast/slow is the Conigecko API compared to different Oracle implementations

## Providers

- Coingecko
- Alchemy
- Ankr
- Infura

## Features

| Feature | CoinGecko | Alchemy | Ankr | Infura |
| --- | --- | --- | --- | --- |
| Rate limit | [Yes][1] | [Yes][2]  | [Yes][3] | [Yes][4] |
| Number of tokens affects rate limit | No | Yes | Yes | Yes |
| Query multiple tokens at once | Yes | No | No | No |
| Contract events | No | Yes | No | Yes |
| Exposes additional info | Yes | No | No | No |
| Customise currency without further conversions | Yes | No | No | No |
| Requires attribution | Not in PRO plan | No | No | No |
| Leverages HTTP cache | Yes | No | No | No |

[1]: <https://www.coingecko.com/en/api/pricing> "50 calls/minute (varies) free plan"
[2]: <https://docs.alchemy.com/reference/throughput> "330 calls/minute free plan"
[3]: <https://www.ankr.com/rpc-service> "250k requests per day free plan"
[4]: <https://www.infura.io/pricing> "100k reqeusts per day free plan"

## Test suite

- Perform sequential network requests for each provider, so that each provider can be tested in isolation
- Perform parallel network requests (required only for oracles) for each token, so that a real use case can be tested
- Query different amounts of tokens to evaluate how this affects providers
- Query a token address not matched to any existing token to test reliability and whether an error also invalidates other tokens requests
- Perform stress tests with varying amounts of concurrent benchmarks to measure the impact of resource constrains on different providers
- Use the browsers native `Performance API` to measure the exact amount of time spent within functions.
For oracle providers it is not possible to capture the exact amount of time spent on batch requests, so we measure the time spent requesting each token and show its average.

## Sample data

You can find a CSV containing the [complete dataset here](./dataset.csv) and a CSV with the [grouped dataset here](./grouped.csv).

## Conclusions

Coingecko's API seems to be the most reliable and performant implementation among those we tested, offering great flexibility as well.

|  | Coingecko | Alchemy | Ankr | Infura |
| --- | --- | --- | --- | --- |
| Avg. request - 1 Token | ~250ms | ~1000ms | ~600ms | ~950ms |
| Avg. request - 7 Tokens | ~250ms | ~6000ms | ~4700ms | ~5500ms |
| p95 - 7 Tokens | ~500ms | ~7500ms | ~5800ms | ~7000ms |
| Avg. request - cached | ~30ms | - | - | - |

In terms of performance, Coingecko allows us to query multiple tokens in a single request while also taking advantage of HTTP caching to minimise the amount of requests. This gives us the best results in terms of execution time and resource utilisation.
A new request will do a full round-trip with a payload only if there is fresh data, so if we are polling an endpoint for price updates, the delay we experience if there are no updates is minimal.

To make sure that the cache was not causing stale data, we also collected pricing data to measure how fast Coingecko is compared to other providers in responding to price fluctuations. From our tests the cache is invalidated as soon as new data is available, resulting in a slightly slower request (500 ms in the worst case) but still faster than that of oracles (600 ms in the best case).

Oracle providers, on the other hand, are strongly influenced by the amount of tokens requested. Even when batch requests are used, performance is slightly better, but at the cost of spending more system resources to accomplish the same task.
