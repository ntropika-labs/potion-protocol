<script setup lang="ts">
import { ref, computed } from "vue";
import { $fetch } from "ohmyfetch";

import type { SelectableToken } from "dapp-types";
import { Oracle__factory, type Oracle } from "potion-contracts/typechain";

import { BaseButton, InputNumber, TokenCard } from "potion-ui";

import { useTokenList } from "@/composables/useTokenList";
import { getTokenList } from "potion-tokenlist";
import { JsonRpcProvider } from "@ethersproject/providers";
import { alchemyRpcUrl, ankrRpcUrl, infuraRpcUrl } from "@/constants";

type OracleEndpoint = "alchemy" | "ankr" | "infura";
type TokenPriceEndpoint = "coingecko" | OracleEndpoint;

interface ProviderBenchmark {
  totalTime: number;
  success: boolean;
}

interface BenchmarkDataPoint {
  dateTimestamp: string;
  timestamp: string;
  totalTokens: number;
  measures: Map<TokenPriceEndpoint, ProviderBenchmark>;
  bestTime: { provider?: TokenPriceEndpoint; time: number };
  pending: boolean;
  concurrentRequests: number;
}

interface PriceDataPoint {
  timestamp: string;
  dateTimestamp: string;
  address: string;
  name: string;
  symbol: string;
  prices: Map<TokenPriceEndpoint, number | string>;
}

const availabletokensAddresses = getTokenList(
  import.meta.env.VITE_ETHEREUM_NETWORK
).map((el) => el.address);

// CONST
const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;
const ORACLE_MAINNET_ADDRESS = "0x789cD7AB3742e23Ce0952F6Bc3Eb3A73A0E08833";
const currency = "usd";
const oracleEndpointUrl = new Map<OracleEndpoint, string>([
  ["alchemy", alchemyRpcUrl],
  ["ankr", ankrRpcUrl],
  ["infura", infuraRpcUrl],
]);

// Maps a performance timestamp to a data point
const benchmarks = ref<Map<string, BenchmarkDataPoint>>(new Map());
// Maps an id in the form of 'performance timestamp@address' to a data point
const tokenPrices = ref<Map<string, PriceDataPoint>>(new Map());
const currentBenchmarkTimestamp = ref(0);
const providers = ref<
  { name: TokenPriceEndpoint; selected: boolean; image: string }[]
>([
  {
    name: "coingecko",
    selected: false,
    image:
      "https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png",
  },
  {
    name: "alchemy",
    selected: false,
    image:
      "https://assets-global.website-files.com/5f973c970bea5548ad4287ef/612fbe6536e6150b18b5d1d5_webclip-alchemy.png",
  },
  {
    name: "ankr",
    selected: false,
    image: "https://www.ankr.com/static/favicon/apple-touch-icon.png",
  },
  {
    name: "infura",
    selected: false,
    image: "https://infura.io/favicon/apple-touch-icon.png",
  },
]);
const totalConcurrentTests = ref(1);
const pollingTimer = ref<unknown | null>(null);

// LOGIC
const initProvider = (rpcUrl: string): JsonRpcProvider => {
  try {
    return new JsonRpcProvider(rpcUrl);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("cannot initialize the ethers provider");
    }
  }
};
const initContract = (
  rpcUrl: string,
  typechainContractFactory: any,
  contractAddress: string
) => {
  try {
    return typechainContractFactory.connect(
      contractAddress,
      initProvider(rpcUrl)
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("cannot initialize the ethers contract");
    }
  }
};
const initContractProvider = (rpcUrl: string) => {
  return initContract(
    rpcUrl,
    Oracle__factory,
    ORACLE_MAINNET_ADDRESS
  ) as Oracle;
};

// Token selection
const tokenToSelectableToken = (
  address: string,
  decimals = 18,
  selected = false
): SelectableToken => {
  const { name, symbol, image } = useTokenList(address);
  return {
    address,
    decimals,
    name,
    symbol,
    image,
    selected,
  };
};

const fakeToken = {
  address: "0x_TEST_FAKE_TOKEN",
  decimals: 0,
  name: "Bogus",
  symbol: "FAKE",
  selected: false,
};
const availableTokens = ref(
  availabletokensAddresses
    .map((address) => tokenToSelectableToken(address))
    .concat(fakeToken)
);
const toggleToken = async (address: string) => {
  const token = availableTokens.value.find((u) => u.address === address);
  if (token) {
    token.selected = !token.selected;
    if (token.selected) {
      selectedTokensAddressesForPrice.value.add(token.address.toLowerCase());
    } else {
      selectedTokensAddressesForPrice.value.delete(token.address.toLowerCase());
    }
  }
};

const selectedTokens = computed(() => {
  return availableTokens.value.filter((t) => t.selected);
});

// Prices
const fetchOracleTokenPrice = async (
  oracleEndpoint: OracleEndpoint,
  benchtime: number,
  token: SelectableToken
) => {
  const measureId = getMarkId(benchtime, oracleEndpoint);
  const rpcUrl = oracleEndpointUrl.get(oracleEndpoint);
  if (!rpcUrl) {
    throw new Error("No rpc url found");
  }
  performance.mark(measureId);
  const provider = initContractProvider(rpcUrl);
  let price = -1;
  try {
    let oraclePriceBN = await provider.getPrice(token.address);
    oraclePriceBN = oraclePriceBN.div(10 ** 8);
    performance.measure(measureId, measureId);
    price = oraclePriceBN.toNumber();
  } catch (e) {
    console.log(e);
  }

  return price;
};

const fetchCoingeckoTokenPrices = async (
  benchtime: number,
  tokens: SelectableToken[]
) => {
  const measureId = getMarkId(benchtime, "coingecko");
  const addresses = tokens.map((t) => t.address).join(",");
  performance.mark(measureId);
  const response = await $fetch(
    endpoint.concat("/simple/token_price/ethereum"),
    {
      params: {
        contract_addresses: addresses,
        vs_currencies: currency,
      },
    }
  );

  performance.measure(measureId, measureId);

  return response;
};

const fetchOracleTokenPrices = async (
  oracleEndpoint: OracleEndpoint,
  benchtime: number,
  tokens: SelectableToken[]
) => {
  const measureId = getMarkId(benchtime, oracleEndpoint);
  performance.mark(measureId);
  const promises = tokens.map((t) => {
    return fetchOracleTokenPrice(oracleEndpoint, benchtime, t);
  });

  const settledPromises = await Promise.allSettled(promises);

  performance.measure(measureId, measureId);

  return tokens.reduce((prices: { [key: string]: number }, token, index) => {
    if (settledPromises[index].status === "fulfilled") {
      // eslint-disable-next-line no-undef
      const promise = settledPromises[index] as PromiseFulfilledResult<number>;
      prices[token.address] = promise.value;
    }

    return prices;
  }, {});
};

// Performance measurements
const getMarkId = (
  seed: number | string,
  provider: TokenPriceEndpoint | string
) => `${seed}@${provider}`;

// const updatePerformanceMeasurements = (
//   timestamp: number,
//   entries: PerformanceEntry[]
// ) => {
//   console.log(entries);
//   const currentBenchmark = benchmarks.value.get(timestamp);

//   if (currentBenchmark) {
//     entries.forEach((perf) => {
//       const perfData = perf.name.split("@");

//       const perfName = perfData.pop() as TokenPriceEndpoint;
//       const perfBenchmarkTime = perfData.pop();

//       console.log(perfData, perfName, perfBenchmarkTime);
//       if (timestamp.toString() !== perfBenchmarkTime || !perfName || !perfName)
//         return;

//       const providerBench = currentBenchmark.measures.get(perfName) || {
//         totalTime: 0,
//         success: true,
//       };
//       providerBench.totalTime += perf.duration;
//       providerBench.success = true;
//       currentBenchmark.measures.set(perfName, providerBench);

//       const bestTime = currentBenchmark.bestTime.time;
//       currentBenchmark.measures.forEach((m, provider) => {
//         if (m.totalTime < bestTime) {
//           currentBenchmark.bestTime = {
//             provider,
//             time: m.totalTime,
//           };
//         }
//       });

//       currentBenchmark.pending = false;
//     });
//     benchmarks.value.set(timestamp, currentBenchmark);
//   }
// };

const updateObserverPerformanceMeasurements = (
  observerEntries: PerformanceObserverEntryList
) => {
  const entries = observerEntries
    ? Array.from(observerEntries.getEntries().values())
    : [];

  if (!entries || !entries.length) return;

  for (let i = 0; i < entries.length; i++) {
    const perf = entries[i];

    const perfData = perf.name.split("@");

    const perfName = perfData.pop() as TokenPriceEndpoint;
    const perfBenchmarkTime = perfData.pop();
    if (!perfBenchmarkTime || !perfName) return;

    const currentBenchmark = benchmarks.value.get(perfBenchmarkTime);

    if (!currentBenchmark) return;

    const providerBench = currentBenchmark.measures.get(perfName) || {
      totalTime: 0,
      success: false,
    };
    providerBench.totalTime += perf.duration;
    currentBenchmark.measures.set(perfName, providerBench);

    const bestTime = currentBenchmark.bestTime.time;
    for (const [provider, measure] of currentBenchmark.measures.entries()) {
      if (measure.totalTime < bestTime) {
        currentBenchmark.bestTime = {
          provider,
          time: measure.totalTime,
        };
      }
    }

    currentBenchmark.pending = false;
    benchmarks.value.set(currentBenchmark.timestamp, currentBenchmark);
  }
};

let observer = new PerformanceObserver(updateObserverPerformanceMeasurements);
observer.observe({ entryTypes: ["measure"] });

const runBenchmarks = async () => {
  const promises = [];
  const selectedProviders = providers.value
    .filter((p) => p.selected)
    .map((p) => p.name);
  if (selectedProviders.length < 1) {
    throw new Error("Pick at list 1 provider");
  }

  const providersSet: Set<TokenPriceEndpoint> = new Set(selectedProviders);

  for (let i = 0; i < totalConcurrentTests.value; i++) {
    promises.push(runBenchmark(providersSet));
  }
  await Promise.allSettled(promises);
};

const runBenchmark = async (selectedProviders: Set<TokenPriceEndpoint>) => {
  const tokens = availableTokens.value.filter((t) => t.selected);
  const benchmarkTimestamp = performance.now();
  const benchmarkDateTimestamp = new Date().toISOString();

  currentBenchmarkTimestamp.value = benchmarkTimestamp;
  benchmarks.value.set(benchmarkTimestamp.toString(), {
    dateTimestamp: benchmarkDateTimestamp,
    timestamp: benchmarkTimestamp.toString(),
    totalTokens: tokens.length,
    measures: new Map(),
    pending: true,
    concurrentRequests: totalConcurrentTests.value,
    bestTime: {
      time: Number.MAX_SAFE_INTEGER,
    },
  });

  // Temporary map to match an address to a data point
  const selectedTokensPrices: Map<string, PriceDataPoint> = tokens.reduce(
    (prices, t) => {
      const lcAddress = t.address.toLowerCase();
      prices.set(lcAddress, {
        dateTimestamp: benchmarkDateTimestamp,
        timestamp: benchmarkTimestamp,
        address: lcAddress,
        name: t.name,
        symbol: t.symbol,
        prices: new Map<TokenPriceEndpoint, number | string>(),
      });

      return prices;
    },
    new Map()
  );

  if (selectedProviders.has("coingecko")) {
    const coingeckoPrices: {
      [address: string]: { [currency: string]: number };
    } = await fetchCoingeckoTokenPrices(benchmarkTimestamp, tokens);

    Object.entries(coingeckoPrices).forEach(([address, data]) => {
      const lcAddress = address.toLowerCase();
      const addressPrices = selectedTokensPrices.get(
        lcAddress
      ) as PriceDataPoint;

      addressPrices.prices.set("coingecko", data[currency].toFixed(2));
      selectedTokensPrices.set(lcAddress, addressPrices);
    });
  }

  const allProviders = Array.from(selectedProviders.values());
  const oracleProviders: Array<OracleEndpoint> = allProviders.filter(
    (p) => p !== "coingecko"
  ) as Array<OracleEndpoint>;

  for (let i = 0; i < oracleProviders.length; i++) {
    const provider = oracleProviders[i];

    const oraclePrices = await fetchOracleTokenPrices(
      provider,
      benchmarkTimestamp,
      tokens
    );
    Object.entries(oraclePrices).forEach(([address, price]) => {
      const lcAddress = address.toLowerCase();
      let addressPrices = selectedTokensPrices.get(lcAddress) as PriceDataPoint;

      addressPrices.prices.set(provider, price.toFixed(2));
      selectedTokensPrices.set(lcAddress, addressPrices);
    });
  }

  // Update main map for tokens prices
  selectedTokensPrices.forEach((data) => {
    const id = getMarkId(data.timestamp, data.address);

    tokenPrices.value.set(id, data);
  });

  for (let i = 0; i < allProviders.length; i++) {
    const prov = allProviders[i];

    //const performanceEntries = performance.getEntriesByType("measure");
    //updatePerformanceMeasurements(benchmarkTimestamp, performanceEntries);

    // reset performance measurements
    const measureId = getMarkId(benchmarkTimestamp, prov);
    performance.clearMeasures(measureId);
  }
};

const selectedTokensAddressesForPrice = ref<Set<string>>(new Set());
const showAllBenchmarkEntries = ref(false);
const showAllPriceEntries = ref(false);

const sortedBenchmarks = computed(() => {
  const entries = Array.from(benchmarks.value.values());
  const entryRange = showAllBenchmarkEntries.value
    ? entries.reverse()
    : entries.slice(-totalConcurrentTests.value).reverse();

  return entryRange;
});

const sortedPrices = computed(() => {
  let entries = Array.from(tokenPrices.value.entries());

  if (selectedTokensAddressesForPrice.value.size) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    entries = entries.filter(([_, data]) => {
      return selectedTokensAddressesForPrice.value.has(data.address);
    });
  }
  const entryRange = showAllPriceEntries.value
    ? entries.reverse()
    : entries
        .slice(
          -totalConcurrentTests.value *
            selectedTokensAddressesForPrice.value.size
        )
        .reverse();

  return entryRange;
});

const totalSelectedProviders = computed(
  () => providers.value.filter((p) => p.selected).length
);

const toggleTokenPrice = async (address: string) => {
  const token = availableTokens.value.find((u) => u.address === address);

  if (token) {
    const lcAddress = token.address.toLowerCase();
    if (selectedTokensAddressesForPrice.value.has(lcAddress)) {
      selectedTokensAddressesForPrice.value.delete(lcAddress);
    } else {
      selectedTokensAddressesForPrice.value.add(lcAddress);
    }
  }
};

const togglePricePolling = () => {
  if (pollingTimer.value) {
    clearTimeout(pollingTimer.value as any);
    pollingTimer.value = null;
  } else {
    pollingTimer.value = setInterval(async () => {
      console.log("running benchmark");

      await runBenchmarks();
    }, 30000);
  }
};

const exportTimings = () => {
  const benchmarksArray = Array.from(benchmarks.value.entries()).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, benchmark]) => {
      const csvRow: Array<number | string> = [
        benchmark.dateTimestamp,
        benchmark.totalTokens,
        benchmark.concurrentRequests,
        benchmark.bestTime.time,
      ];

      return csvRow.concat(
        Array.from(benchmark.measures.values()).map((m) => m.totalTime)
      );
    }
  );
  let header = "Timestamp,Total tokens,Concurrent req.s,Best time,";
  header = header.concat(providers.value.map((p) => p.name).join(","));
  header = header.concat("\n");

  let csvContent =
    "data:text/csv;charset=utf-8," +
    header +
    benchmarksArray.map((e) => e.join(",")).join("\n");

  exportData("benchmark_token_performances_", csvContent);
};

const exportPrices = () => {
  const pricesArray = Array.from(tokenPrices.value.entries()).map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, benchmark]) => {
      const csvRow: Array<number | string> = [
        benchmark.dateTimestamp,
        `${benchmark.name}(${benchmark.symbol})`,
      ];

      return csvRow.concat(Array.from(benchmark.prices.values()));
    }
  );
  let header = "Timestamp,Name (symbol),";
  header = header.concat(providers.value.map((p) => p.name).join(","));
  header = header.concat("\n");
  let csvContent =
    "data:text/csv;charset=utf-8," +
    header +
    pricesArray.map((e) => e.join(",")).join("\n");

  exportData("benchmark_token_prices_", csvContent);
};

const exportData = (name: string, csvContent: string) => {
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    name.concat(new Date().toISOString()).concat(".csv")
  );
  document.body.appendChild(link); // Required for FF

  link.click();
};
</script>
<template>
  <table class="w-full table-fixed border">
    <thead class="bg-dark">
      <th class="px-2 py-3">Feature</th>
      <th class="px-2 py-3">CoinGecko</th>
      <th class="px-2 py-3">Alchemy</th>
      <th class="px-2 py-3">Infura</th>
      <th class="px-2 py-3">Ankr</th>
    </thead>
    <tbody class="text-center">
      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Rate limit (free tier)</td>
        <td class="text-red-400">50 calls/minute (varies)</td>
        <td class="text-orange-400">
          none
          <span class="block"
            >but Alchemy has
            <a
              href="https://docs.alchemy.com/reference/throughput"
              target="_blank"
              class="underline"
              >CUPS</a
            ></span
          >
        </td>
        <td><i class="w6 h-6 i-ph-x-circle-fill text-green-400"> </i></td>
        <td>
          <i class="w6 h-6 i-ph-x-circle-fill text-green-400"> </i> 100k
          req.s/day
        </td>
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">Number of tokens affects rate limit</td>
        <td><i class="w6 h-6 i-ph-x-circle-fill text-green-400"> </i></td>
        <td>
          <i class="w6 h-6 i-ph-check-circle-fill text-red-400"> </i>
        </td>
        <td>
          <i class="w6 h-6 i-ph-check-circle-fill text-red-400"> </i>
        </td>
        <td><i class="w6 h-6 i-ph-x-circle-fill text-green-400"> </i></td>
      </tr>
      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Query multiple tokens at once</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">Contract events</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
      </tr>

      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Exposes additional info</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">
          Customize currency without further conversions
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
      </tr>
      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Doesn't require attribution</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
          <span class="text-sm block"
            ><a
              href="https://www.coingecko.com/en/api/documentation"
              target="_blank"
              class="underline"
              >https://www.coingecko.com/en/api/documentation</a
            ></span
          >
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">Leverages HTTP cache</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i>
        </td>
      </tr>
    </tbody>
  </table>
  <hr />
  <div class="grid md:grid-cols-2 mt-8">
    <div>
      <h3 class="text-xl font-bold border-b mb-4">CoinGecko</h3>
      <ul class="list-inside list-disc"></ul>
    </div>
    <div>
      <h3 class="text-xl font-bold border-b mb-4">Oracle</h3>
      <ul class="list-inside list-disc">
        <li>
          Exposes
          <pre>Event StablePriceUpdated(address asset, uint256 price)</pre>
        </li>
        <li>
          Batch requests, eg: https://docs.alchemy.com/reference/batch-requests
        </li>
      </ul>
    </div>
  </div>

  <div>
    <h1 class="text-3xl font-bold mt-8 mb-4">Benchmarks</h1>
    <small class="text-secondary-400">
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp"
        target="_blank"
        class="underline"
      >
        Reduced precision in Firefox browser
      </a>
    </small>
    <div>
      <h4 class="text-xl font-bold mt-8 mb-4">Run benchmark</h4>

      <div class="flex flex-row items-center justify-between gap-8">
        <div>
          <h5>Select providers:</h5>
          <div class="flex-1 my-4">
            <div class="flex flex-row gap-6">
              <div
                v-for="(provider, index) of providers"
                :key="provider.name"
                :class="[
                  'flex flex-col',
                  index === availableTokens.length - 1
                    ? 'border-red border-3 rounded-3xl'
                    : '',
                ]"
              >
                <TokenCard
                  :symbol="provider.name"
                  :name="provider.name"
                  address=""
                  :image="provider.image"
                  :selected="provider.selected"
                  @token-selected="
                    () => (provider.selected = !provider.selected)
                  "
                />
              </div>
            </div>
          </div>
          <h5>Select tokens:</h5>
          <div class="flex flex-row items-center">
            <div class="flex-1 my-4">
              <div
                v-if="availableTokens.length > 0"
                class="flex flex-row gap-6"
              >
                <div
                  v-for="(token, index) of availableTokens"
                  :key="token.address"
                  :class="[
                    'flex flex-col',
                    index === availableTokens.length - 1
                      ? 'border-red border-3 rounded-3xl'
                      : '',
                  ]"
                >
                  <TokenCard
                    :symbol="token.symbol"
                    :name="token.name"
                    :address="token.address"
                    :image="token.image"
                    :selected="token.selected"
                    @token-selected="toggleToken(token.address)"
                  />
                </div>
              </div>
              <div v-else class="text-center">
                <p class="text-white/40 text-3xl uppercase">
                  No token available
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <div>
            <input
              type="checkbox"
              class=""
              @change="togglePricePolling"
            /><label>Toggle polling</label>
          </div>
          <BaseButton
            palette="primary"
            type="button"
            size="lg"
            :inline="true"
            label="Run benchmark"
            :disabled="
              selectedTokens.length === 0 || totalSelectedProviders === 0
            "
            @click="runBenchmarks"
          ></BaseButton>
          <p v-if="selectedTokens.length === 0" class="text-secondary-500">
            Select at least one token
          </p>
          <p v-if="totalSelectedProviders === 0" class="text-secondary-500">
            Select at least one provider
          </p>
          <div class="max-w-96 mt-4">
            <InputNumber
              title="concurrent tests"
              :model-value="totalConcurrentTests"
              color="no-bg"
              :min="1"
              :max="100"
              :step="1"
              unit=""
              footer-description="concurrent tests"
              @update:model-value="(value: number) => totalConcurrentTests = value"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row items-center gap-6 mt-8 mb-4">
      <div>
        <h4 class="text-xl font-bold mb-2">All benchmarks</h4>
        <input
          type="checkbox"
          class=""
          @change="(ev) => showAllBenchmarkEntries = (ev.currentTarget as HTMLInputElement).checked"
        /><label>Show all</label>
      </div>
      <BaseButton
        palette="primary"
        type="button"
        size="lg"
        :inline="true"
        label="Export"
        :disabled="benchmarks.size === 0"
        @click="exportTimings"
      ></BaseButton>
    </div>

    <table class="w-full table-auto border text-center">
      <thead class="sticky top-0 bg-dark z-30">
        <th class="px-2 py-3"><i class="i-ph-check-circle-fill"> </i></th>
        <th class="px-2 py-3">Performance Timestamp</th>
        <th class="px-2 py-3">Total tokens</th>
        <th class="px-2 py-3">Concurrent req.s</th>
        <th class="px-2 py-3">Best time</th>
        <th
          v-for="(p, index) in providers"
          :key="index"
          class="px-2 py-3 text-right"
        >
          {{ p.name }}
          <span v-if="p.name !== 'coingecko'" class="">avg. token</span>
          <span v-if="p.name !== 'coingecko'" class="text-xs block"
            >total time</span
          >
        </th>
      </thead>
      <tbody>
        <tr
          v-for="(bench, index) in sortedBenchmarks"
          :key="bench.timestamp"
          :class="[index % 2 == 0 ? 'bg-slate-800' : 'bg-slate-600']"
        >
          <td class="px-2">
            <i v-if="bench.pending" class="i-eos-icons-loading"> </i>
            <i v-else class="i-ph-check-circle-fill text-green-400"> </i>
          </td>
          <td class="px-2 py-3 text-left font-mono">
            {{ bench.dateTimestamp }}
          </td>
          <td class="px-2 py-3">{{ bench.totalTokens }}</td>
          <td class="px-2 py-3">{{ bench.concurrentRequests }}</td>
          <td class="text-green-400">{{ bench.bestTime.provider }}</td>
          <td v-for="(provider, j) in providers" :key="j" class="px-2 py-3">
            <div v-if="bench.measures.has(provider.name)">
              <div
                v-if="provider.name === 'coingecko'"
                class="flex flex-row items-center justify-end gap-2 font-mono"
              >
                {{
                  Math.fround(
                    bench.measures.get(provider.name)?.totalTime || 0
                  ).toFixed(2)
                }}
                <!-- <span v-if="!bench.measures.get(provider.name)?.success">
                  <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i
                ></span> -->
              </div>
              <div
                v-else
                class="flex flex-row items-center justify-end gap-2 font-mono"
              >
                <div>
                  {{
                    Math.fround(
                      (bench.measures.get(provider.name)?.totalTime || 0) /
                        bench.totalTokens
                    ).toFixed(2)
                  }}
                  <small class="block text-size-[0.7rem]">{{
                    Math.fround(
                      bench.measures.get(provider.name)?.totalTime || 0
                    ).toFixed(2)
                  }}</small>
                </div>

                <!-- <span v-if="!bench.measures.get(provider.name)?.success">
                  <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i
                ></span> -->
              </div>
            </div>
            <div v-else>-</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-row items-center gap-6 mt-8 mb-4">
      <div>
        <h4 class="text-xl font-bold mb-2">All prices</h4>
        <input
          type="checkbox"
          class=""
          @change="(ev) => showAllPriceEntries = (ev.currentTarget as HTMLInputElement).checked"
        /><label>Show all</label>
      </div>
      <BaseButton
        palette="primary"
        type="button"
        size="lg"
        :inline="true"
        label="Export"
        :disabled="tokenPrices.size === 0"
        @click="exportPrices"
      ></BaseButton>
      <div class="ml-auto">
        <p>Filter tokens:</p>
        <div v-if="availableTokens.length > 0" class="flex flex-row gap-6">
          <div
            v-for="(token, index) of availableTokens.slice(0, -1)"
            :key="token.address"
            :class="[
              'flex flex-col',
              index === availableTokens.length - 1
                ? 'border-red border-3 rounded-3xl'
                : '',
            ]"
          >
            <TokenCard
              :symbol="token.symbol"
              :name="token.name"
              :address="token.address"
              :image="token.image"
              :selected="
                selectedTokensAddressesForPrice.has(token.address.toLowerCase())
              "
              size="sm"
              class=""
              @token-selected="toggleTokenPrice(token.address)"
            />
          </div>
        </div>
        <div v-else class="text-center">
          <p class="text-white/40 text-3xl uppercase">No token available</p>
        </div>
      </div>
    </div>

    <table class="w-full table-auto border">
      <thead class="sticky top-0 bg-dark z-30">
        <th class="px-2 py-3"><i class="i-ph-check-circle-fill"> </i></th>
        <th class="px-2 py-3 text-left">Performance Timestamp</th>
        <th class="px-2 py-3 text-left">Name (symbol)</th>
        <th
          v-for="(p, index) in providers"
          :key="index"
          class="px-2 py-3 text-right"
        >
          {{ p.name }}
        </th>
      </thead>
      <tbody>
        <tr
          v-for="([id, price], index) in sortedPrices"
          :key="id"
          :class="[index % 2 == 0 ? 'bg-slate-800' : 'bg-slate-600']"
        >
          <td class="px-2">
            <!-- <i v-if="price.pending" class="i-eos-icons-loading"> </i>
            <i v-else class="i-ph-check-circle-fill text-green-400"> </i> -->
          </td>
          <td class="px-2 py-3 text-left font-mono">
            {{ price.dateTimestamp }}
          </td>
          <td class="px-2 py-3 text-left">
            {{ price.name }} ({{ price.symbol }})
          </td>
          <td v-for="(provider, j) in providers" :key="j" class="px-2 py-3">
            <div v-if="price.prices.has(provider.name)">
              <div
                class="flex flex-row items-center justify-end gap-2 font-mono"
              >
                {{ price.prices.get(provider.name) }}
                <!-- <span v-if="!bench.measures.get(provider.name)?.success">
                  <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i
                ></span> -->
              </div>
            </div>
            <div v-else>-</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
