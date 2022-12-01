<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { InputNumber } from "potion-ui";

// import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, watch } from "vue";
// import { useOracleContract } from "@/composables/useOracleContract";
import { useUserDataStore } from "@/stores/useUserDataStore";
import { storeToRefs } from "pinia";
import { useGetHedgingVaultsUnderlyingsQuery } from "subgraph-queries-hv/generated/urql";
import { contractsAddresses } from "@/helpers/contracts";

import type { ERC20Upgradeable } from "@potion-protocol/core/typechain";
import { formatUnits } from "@ethersproject/units";
import { ERC20Upgradeable__factory } from "@potion-protocol/core/typechain";
import { useEthersContract } from "@/composables/useEthersContract";

interface Token {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
}
const { initContract } = useEthersContract();

//Provider initialization

const initContractProvider = (address: string) => {
  return initContract(
    false,
    false,
    ERC20Upgradeable__factory,
    address
  ) as ERC20Upgradeable;
};

const getTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  decimal: number
) => {
  try {
    const provider = initContractProvider(tokenAddress);
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
const { data: underlyings, executeQuery } = useGetHedgingVaultsUnderlyingsQuery(
  {
    pause: true,
    context: {
      url: import.meta.env.VITE_SUBGRAPH_HV_ADDRESS,
    },
  }
);

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
const balances = ref<Map<string, string>>(new Map());
const amountIn = ref<number>(1);
const selectedTokenIn = computed(() => {
  return tokens.value.find((token) => token.id === tokenIn.value) ?? null;
});
const selectedTokenOut = computed(() => {
  return tokens.value.find((token) => token.id === tokenOut.value) ?? null;
});
onMounted(async () => {
  await executeQuery();
  if (tokens.value.length > 0) {
    tokenIn.value = tokens.value[0].id;
    tokenOut.value = tokens.value[1].id;
  }
  if (walletAddress.value) {
    const balancesMap = await getTokensBalance(
      walletAddress.value,
      tokens.value
    );
    balances.value = balancesMap;
  }
});
watch(walletAddress, async () => {
  await userStore.fetchUserData();
  if (walletAddress.value) {
    const balancesMap = await getTokensBalance(
      walletAddress.value,
      tokens.value
    );
    balances.value = balancesMap;
  }
});
</script>
<template>
  <div>Swappamole</div>
  <!-- <div>{{ tokens }}</div> -->
  <div v-if="tokens.length > 0" class="grid grid-cols-2 gap-5">
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
  <div class="mt-10">
    <InputNumber
      v-model="amountIn"
      :title="`swap ${selectedTokenIn?.symbol} for ${selectedTokenOut?.symbol}`"
      :min="0.01"
      :step="0.01"
      :max="parseFloat(balances.get(selectedTokenIn?.id ?? '') ?? '0')"
      :unit="selectedTokenIn?.symbol"
    />
  </div>
</template>
