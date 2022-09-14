<script setup lang="ts">
import { ref, computed } from "vue";
import { $fetch } from "ohmyfetch";

import type { SelectableToken } from "dapp-types";
import { Oracle__factory, type Oracle } from "potion-contracts/typechain";

import { BaseButton, InputNumber } from "potion-ui";
import TokenCard from "potion-ui/src/components/TokenCard/TokenCard.vue";

import { useTokenList } from "@/composables/useTokenList";
import { useEthersContract } from "@/composables/useEthersContract";
import { getTokenList } from "potion-tokenlist";

interface BenchmarkDataPoint {
  timestamp: number;
  totalTokens: number;
  totalTimeCoingecko: number;
  totalTimeOracle: number;
  totalTimeOracleContractInitialized: number;
  totalTimeOracleSingleToken: number;
  bestTime?: "oracle" | "coingecko";
  pending: boolean;
  concurrentRequests: number;
}

const availabletokensAddresses = getTokenList(
  import.meta.env.VITE_ETHEREUM_NETWORK
).map((el) => el.address);

const endpoint = import.meta.env.VITE_COINGECKO_API_ENDPOINT;
const ORACLE_MAINNET_ADDRESS = "0x789cD7AB3742e23Ce0952F6Bc3Eb3A73A0E08833";
const currency = "usd";
const markerOraclePrices = "prices-marker-oracle";
const markerOracleSinglePrice = "prices-marker-oracle-single";
const markerOraclePricesContractInitialized =
  "prices-marker-oracle-contract-initialized";
const markerCoingeckoPrices = "prices-marker-coingecko";
const benchmarks = ref<Map<number, BenchmarkDataPoint>>(new Map());
const currentBenchmarkTimestamp = ref(0);
const totalConcurrentTests = ref(1);
const oracleTokenPrices = ref<Map<string, string>>(new Map());
const coingeckoTokenPrices = ref<Map<string, string>>(new Map());
const { initContract } = useEthersContract();
const initContractProvider = () => {
  return initContract(
    false,
    false,
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
  image: "",
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
  }
};
const totalSelectedTokens = computed(() => {
  return availableTokens.value.filter((t) => t.selected).length;
});

const fetchOracleTokenPrice = async (
  benchtime: number,
  token: SelectableToken
) => {
  performance.mark(markerOracleSinglePrice);
  const provider = initContractProvider();
  let price = -1;
  try {
    let oraclePriceBN = await provider.getPrice(token.address);
    oraclePriceBN = oraclePriceBN.div(10 ** 8);
    performance.measure(
      `${benchtime}@${markerOracleSinglePrice}`,
      markerOracleSinglePrice
    );
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
  const addresses = tokens.map((t) => t.address).join(",");
  performance.mark(markerCoingeckoPrices);
  const response = await $fetch(
    endpoint.concat("/simple/token_price/ethereum"),
    {
      params: {
        contract_addresses: addresses,
        vs_currencies: currency,
      },
    }
  );

  performance.measure(
    `${benchtime}@${markerCoingeckoPrices}`,
    markerCoingeckoPrices
  );

  return response;
};

const fetchOracleTokenPrices = async (
  benchtime: number,
  tokens: SelectableToken[]
) => {
  performance.mark(markerOraclePrices);
  const promises = tokens.map((t) => {
    return fetchOracleTokenPrice(benchtime, t);
  });

  const settledPromises = await Promise.allSettled(promises);

  performance.measure(`${benchtime}@${markerOraclePrices}`, markerOraclePrices);

  return tokens.reduce((prices: { [key: string]: number }, token, index) => {
    if (settledPromises[index].status === "fulfilled") {
      // eslint-disable-next-line no-undef
      const promise = settledPromises[index] as PromiseFulfilledResult<number>;
      prices[token.address] = promise.value;
    }

    return prices;
  }, {});
};

const updatePerformanceMeasurements = (
  timestamp: number,
  entries: PerformanceEntry[]
) => {
  console.log(entries);
  const currentBenchmark = benchmarks.value.get(timestamp);

  if (currentBenchmark) {
    entries.forEach((perf) => {
      const perfBenchmarkTime = perf.name.split("@").reverse().pop();
      const perfName = perf.name.split("@").pop();

      if (timestamp.toString() !== perfBenchmarkTime) return;

      if (perfName === markerCoingeckoPrices) {
        currentBenchmark.totalTimeCoingecko = perf.duration;
      } else if (perfName === markerOraclePrices) {
        currentBenchmark.totalTimeOracle = perf.duration;
      } else if (perfName === markerOraclePricesContractInitialized) {
        currentBenchmark.totalTimeOracleContractInitialized = perf.duration;
      } else if (perfName === markerOracleSinglePrice) {
        currentBenchmark.totalTimeOracleSingleToken += perf.duration;
      }

      currentBenchmark.bestTime =
        currentBenchmark.totalTimeCoingecko < currentBenchmark.totalTimeOracle
          ? "coingecko"
          : "oracle";

      currentBenchmark.pending = false;
    });
    benchmarks.value.set(timestamp, currentBenchmark);
  }
};

//let observer = new PerformanceObserver(updatePerformanceMeasurements);
//observer.observe({ entryTypes: ["measure"] });

const runBenchmarks = async () => {
  const promises = [];

  for (let i = 0; i < totalConcurrentTests.value; i++) {
    promises.push(runBenchmark());
  }
  await Promise.allSettled(promises);
};
const runBenchmark = async () => {
  const tokens = availableTokens.value.filter((t) => t.selected);
  const benchmarkTimestamp = performance.now();

  currentBenchmarkTimestamp.value = benchmarkTimestamp;
  benchmarks.value.set(benchmarkTimestamp, {
    timestamp: Math.round(benchmarkTimestamp),
    totalTokens: tokens.length,
    totalTimeCoingecko: 0,
    totalTimeOracle: 0,
    totalTimeOracleContractInitialized: 0,
    totalTimeOracleSingleToken: 0,
    pending: true,
    concurrentRequests: totalConcurrentTests.value,
  });

  const coingeckoPrices = await fetchCoingeckoTokenPrices(
    benchmarkTimestamp,
    tokens
  );
  const oraclePrices = await fetchOracleTokenPrices(benchmarkTimestamp, tokens);

  const currentBenchmark = benchmarks.value.get(benchmarkTimestamp);
  if (currentBenchmark) {
    tokens.forEach((token) => {
      const addr = token.address.toLowerCase();
      const coingeckoPrice = coingeckoPrices[addr]
        ? coingeckoPrices[addr][currency]
        : 0;
      const oraclePrice = oraclePrices[token.address]
        ? oraclePrices[token.address]
        : 0;

      coingeckoTokenPrices.value.set(token.address, coingeckoPrice.toFixed(2));
      oracleTokenPrices.value.set(token.address, oraclePrice.toFixed(2));
    });

    const performanceEntries = performance.getEntriesByType("measure");
    updatePerformanceMeasurements(benchmarkTimestamp, performanceEntries);

    // reset performance measurements
    performance.clearMeasures(`${benchmarkTimestamp}@${markerCoingeckoPrices}`);
    performance.clearMeasures(`${benchmarkTimestamp}@${markerOraclePrices}`);
    performance.clearMeasures(
      `${benchmarkTimestamp}@${markerOracleSinglePrice}`
    );
    performance.clearMeasures(
      `${benchmarkTimestamp}@${markerOraclePricesContractInitialized}`
    );
  }
};

const sortedBenchmarks = computed(() =>
  Array.from(benchmarks.value.values()).reverse()
);
</script>
<template>
  <table class="w-full table-fixed border">
    <thead class="bg-dark">
      <th class="px-2 py-3">Feature</th>
      <th class="px-2 py-3">CoinGecko</th>
      <th class="px-2 py-3">Oracle</th>
    </thead>
    <tbody class="text-center">
      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Rate limit</td>
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
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">Number of tokens affects rate limit</td>
        <td><i class="w6 h-6 i-ph-x-circle-fill text-green-400"> </i></td>
        <td>
          <i class="w6 h-6 i-ph-check-circle-fill text-red-400"> </i>
        </td>
      </tr>
      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Query multiple tokens at once</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
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
      </tr>

      <tr class="bg-slate-600">
        <td class="px-4 py-3 text-left">Exposes additional info</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
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
      </tr>
      <tr class="bg-slate-800">
        <td class="px-4 py-3 text-left">Leverages HTTP cache</td>
        <td class="px-2 py-3">
          <i class="w6 h-6 i-ph-check-circle-fill text-green-400"> </i>
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
      <ul class="list-inside list-disc">
        <li>https://docs.alchemy.com/reference/batch-requests</li>
      </ul>
    </div>
    <div>
      <h3 class="text-xl font-bold border-b mb-4">Oracle</h3>
      <ul class="list-inside list-disc">
        <li>
          Exposes
          <pre>Event StablePriceUpdated(address asset, uint256 price)</pre>
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
      <h4>Run benchmark</h4>
      <div class="flex flex-row items-center">
        <div class="flex-1 my-4">
          <div v-if="availableTokens.length > 0" class="flex flex-row gap-6">
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
              <small class="pl-2"
                >C: {{ coingeckoTokenPrices.get(token.address) || "-" }}</small
              >
              <small class="pl-2"
                >O: {{ oracleTokenPrices.get(token.address) || "-" }}</small
              >
            </div>
          </div>
          <div v-else class="text-center">
            <p class="text-white/40 text-3xl uppercase">No underlying task</p>
          </div>
        </div>
        <div class="text-center">
          <BaseButton
            palette="primary"
            type="button"
            size="lg"
            :inline="true"
            label="Run benchmark"
            :disabled="totalSelectedTokens === 0"
            @click="runBenchmarks"
          ></BaseButton>
          <p v-if="totalSelectedTokens === 0" class="text-secondary-500">
            Select at list one token
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
    <h4>All benchmarks</h4>
    <table class="w-full table-auto border text-center">
      <thead class="sticky top-0 bg-dark z-30">
        <th class="px-2 py-3"><i class="i-ph-check-circle-fill"> </i></th>
        <th class="px-2 py-3">Performance Timestamp</th>
        <th class="px-2 py-3">Total tokens</th>
        <th class="px-2 py-3">Concurrent req.s</th>
        <th class="px-2 py-3">Best time</th>
        <th class="px-2 py-3">CoinGecko (ms)</th>
        <th class="px-2 py-3">Oracle (ms)</th>
        <th class="px-2 py-3">Oracle Avg single token (ms)</th>
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
          <td class="px-2 py-3">{{ bench.timestamp }}</td>
          <td class="px-2 py-3">{{ bench.totalTokens }}</td>
          <td class="px-2 py-3">{{ bench.concurrentRequests }}</td>
          <td class="text-green-400">{{ bench.bestTime }}</td>
          <td class="px-2 py-3">
            {{ Math.fround(bench.totalTimeCoingecko).toFixed(2) }}
          </td>
          <td class="px-2 py-3">
            {{
              Math.fround(
                bench.totalTimeOracleSingleToken || bench.totalTimeOracle
              ).toFixed(2)
            }}
          </td>
          <td class="px-2 py-3">
            <span v-if="bench.totalTimeOracleSingleToken > 0">{{
              Math.fround(
                bench.totalTimeOracleSingleToken / bench.totalTokens
              ).toFixed(2)
            }}</span>
            <span v-else>
              <i class="w6 h-6 i-ph-x-circle-fill text-red-400"> </i
            ></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
