<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { MaxUint256 } from "@ethersproject/constants";
import { InputNumber } from "potion-ui";
import { parseUnits } from "@ethersproject/units";
// import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, watch } from "vue";
// import { useOracleContract } from "@/composables/useOracleContract";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { storeToRefs } from "pinia";
import { useGetHedgingVaultsUnderlyingsQuery } from "subgraph-queries-hv/generated/urql";
import { contractsAddresses } from "@/helpers/contracts";
// import { hedgingVaultContracts } from "@/helpers/hedgingVaultContracts";
import { useOracleContract } from "@/composables/useOracleContract";

import type { ERC20Upgradeable } from "@potion-protocol/core/typechain";
import { formatUnits } from "@ethersproject/units";
import { ERC20Upgradeable__factory } from "@potion-protocol/core/typechain";
import { useEthersContract } from "@/composables/useEthersContract";
import { MockRouterWithOracle__factory } from "@potion-protocol/hedging-vault/typechain";
import type { MockRouterWithOracle } from "@potion-protocol/hedging-vault/typechain";
import { getContractsFromVault } from "@/helpers/hedgingVaultContracts";

interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}
const { initContract } = useEthersContract();
// const swapperAddress = getContractsFromVault(underlyings.value[0].id).UniswapV3Router;
//Provider initialization

const initContractProviderErc20 = (address: string) => {
  return initContract(
    true,
    false,
    ERC20Upgradeable__factory,
    address
  ) as ERC20Upgradeable;
};
const initContractProviderMockRouterWithOracle = () => {
  return initContract(
    true,
    false,
    MockRouterWithOracle__factory,
    swapperAddress.value
  ) as MockRouterWithOracle;
};

const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  decimal: number
) => {
  try {
    const provider = initContractProviderErc20(tokenAddress);
    const balance = await provider.balanceOf(walletAddress);
    return formatUnits(balance, decimal);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get token balance: ${error.message}`);
    } else {
      throw new Error("Cannot get token balance");
    }
  }
};

const infiniteApproval = async (tokenAddress: string) => {
  try {
    const provider = initContractProviderErc20(tokenAddress);
    const tx = await provider.approve(swapperAddress.value, MaxUint256);
    return tx.wait();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`cannot approve: ${error.message}`);
    } else {
      throw new Error("cannot approve");
    }
  }
};

const getAllowance = async (tokenAddress: string, spenderAddress: string) => {
  try {
    const provider = initContractProviderErc20(tokenAddress);
    const allowance = await provider.allowance(
      walletAddress.value,
      spenderAddress
    );
    return allowance;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get token allowance: ${error.message}`);
    } else {
      throw new Error("Cannot get token allowance");
    }
  }
};

const getTokensBalance = async (walletAddress: string, tokens: Token[]) => {
  try {
    const result = new Map<string, string>();
    const promises = tokens.map(async (token) => {
      result.set(
        token.id,
        await getTokenBalance(walletAddress, token.id, parseInt(token.decimals))
      );
    });
    await Promise.allSettled(promises);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get multiple tokens balance: ${error.message}`);
    } else {
      throw new Error("Cannot get multiple tokens balance");
    }
  }
};

// const { t } = useI18n();

const userStore = useUserDataStore();
const { walletAddress } = storeToRefs(userStore);

const usdc: Token = {
  id: contractsAddresses.USDC.address,
  name: "USD Coin",
  symbol: "USDC",
  decimals: "6",
};
const { getPrices } = useOracleContract();
const { data: underlyings, executeQuery } = useGetHedgingVaultsUnderlyingsQuery(
  {
    pause: true,
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  }
);

const swapperAddress = ref("");

const tokens = computed(() => {
  if (underlyings && underlyings.value) {
    const arrUniq = [
      ...new Map(
        underlyings.value.hedgingVaults.map((h) => [
          h.underlying.id,
          h.underlying,
        ])
      ).values(),
    ];
    arrUniq.unshift(usdc);
    return arrUniq;
  }
  return [];
});

const tokenIn = ref<string | undefined>(undefined);
const tokenOut = ref<string | undefined>(undefined);
const balancesMap = ref<Map<string, string>>(new Map());
const pricesMap = ref<Map<string, string>>(new Map());

const amountIn = ref<number>(1);
const amountOut = computed(() => {
  if (amountIn.value) {
    const priceIn = pricesMap.value.get(tokenIn.value || "");
    const priceOut = pricesMap.value.get(tokenOut.value || "");
    if (priceIn && priceOut) {
      return (amountIn.value * parseFloat(priceIn)) / parseFloat(priceOut);
    }
  }
  return 0;
});
const selectedTokenIn = computed(() => {
  return tokens.value.find((token) => token.id === tokenIn.value) ?? null;
});
const selectedTokenOut = computed(() => {
  return tokens.value.find((token) => token.id === tokenOut.value) ?? null;
});

const swap = async () => {
  const provider = initContractProviderMockRouterWithOracle();
  const allowance = await getAllowance(
    selectedTokenIn.value?.id || "",
    swapperAddress.value
  );
  // add 2% slippage
  const amountOutMin = amountOut.value * 0.98;
  const amountOutMinParsed = parseUnits(
    amountOutMin.toFixed(parseInt(selectedTokenOut.value?.decimals ?? "18")),
    selectedTokenOut.value?.decimals ?? 18
  );
  console.log(amountOutMinParsed);
  const amountInParsed = parseUnits(
    amountIn.value.toFixed(parseInt(selectedTokenIn.value?.decimals ?? "18")),
    selectedTokenIn.value?.decimals ?? 18
  );
  if (allowance.lt(amountInParsed)) {
    await infiniteApproval(selectedTokenIn.value?.id || "");
  }
  if (tokenIn.value && tokenOut.value && walletAddress.value) {
    console.log(
      tokenIn.value,
      tokenOut.value,
      amountInParsed.toString(),
      amountOutMinParsed.toString()
    );
    const tx = await provider.swap(
      tokenIn.value,
      tokenOut.value,
      amountInParsed,
      amountOutMinParsed
    );
    console.log(tx);
    tx.wait();
  }
};

onMounted(async () => {
  await executeQuery();
  swapperAddress.value = getContractsFromVault(
    underlyings?.value?.hedgingVaults[0].id ?? ""
  ).UniswapV3Router;

  if (tokens.value.length > 0) {
    tokenIn.value = tokens.value[0].id;
    tokenOut.value = tokens.value[1].id;
    pricesMap.value = await getPrices(tokens.value.map((token) => token.id));
  }
  if (walletAddress.value) {
    const result = await getTokensBalance(walletAddress.value, tokens.value);
    balancesMap.value = result;
  }
});
watch(walletAddress, async () => {
  await userStore.fetchUserData();
  if (walletAddress.value) {
    const result = await getTokensBalance(walletAddress.value, tokens.value);
    balancesMap.value = result;
  }
});
</script>
<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="pricesMap">
      <p>Prices</p>
      <div>
        <div v-for="token in tokens" :key="token.id" class="flex gap-2">
          <div class="">{{ token.symbol }}</div>
          <div class="">{{ pricesMap.get(token.id) }}</div>
        </div>
      </div>
    </div>
    <div v-if="tokens.length > 0" class="mt-10">
      <p>Token Selection</p>
      <div class="grid grid-cols-2 gap-5">
        <div>
          <p>Token In</p>
          <Listbox v-model="tokenIn">
            <div class="relative mt-1 w-full">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-transparent py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-white/10"
              >
                <span class="block truncate">{{
                  selectedTokenIn?.name ?? "select a token"
                }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <div
                    class="h-5 w-5 text-gray-400 i-mdi-chevron-down"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-transparent border border-white/10 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    v-for="token in tokens"
                    v-slot="{ active, selected }"
                    :key="token.name"
                    :value="token.id"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-secondary-500 text-white' : 'text-white',
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ token.name }}</span
                      >
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-white"
                      >
                        <div class="h-5 w-5 i-mdi-check" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
        <div>
          <p>Token Out</p>
          <Listbox v-model="tokenOut">
            <div class="relative mt-1 w-full">
              <ListboxButton
                class="relative w-full cursor-default rounded-lg bg-transparent py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-white/10"
              >
                <span class="block truncate">{{
                  selectedTokenOut?.name ?? "select a token"
                }}</span>
                <span
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <div
                    class="h-5 w-5 text-gray-400 i-mdi-chevron-down"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <transition
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
              >
                <ListboxOptions
                  class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-transparent border border-white/10 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  <ListboxOption
                    v-for="token in tokens"
                    v-slot="{ active, selected }"
                    :key="token.name"
                    :value="token.id"
                    as="template"
                  >
                    <li
                      :class="[
                        active ? 'bg-secondary-500 text-white' : 'text-white',
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                      ]"
                    >
                      <span
                        :class="[
                          selected ? 'font-medium' : 'font-normal',
                          'block truncate',
                        ]"
                        >{{ token.name }}</span
                      >
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3 text-white"
                      >
                        <div class="h-5 w-5 i-mdi-check" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>

    <div class="mt-10">
      <InputNumber
        v-model="amountIn"
        :title="`swap ${selectedTokenIn?.symbol} for ${selectedTokenOut?.symbol}`"
        :min="0.01"
        :step="0.01"
        :max="parseFloat(balancesMap.get(selectedTokenIn?.id ?? '') ?? '0')"
        :unit="selectedTokenIn?.symbol"
      />
    </div>
    <div class="mt=10">
      <button @click="swap()">SWAP</button>
    </div>
  </div>
</template>
