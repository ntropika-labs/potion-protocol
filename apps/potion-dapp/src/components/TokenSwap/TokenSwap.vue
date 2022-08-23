<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TokenSelection",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import type { SwapRoute } from "@uniswap/smart-order-router";
import { useI18n } from "vue-i18n";
import { Token as UniswapToken, TradeType } from "@uniswap/sdk-core";

import type { Token } from "dapp-types";
import { AssetTag } from "potion-ui";

export interface Props {
  routeData: SwapRoute | undefined;
  routerLoading: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();

const hasRoute = computed(() => props.routeData && props.routeData.route);
const isTradeExactInput = computed(
  () => props.routeData?.trade.tradeType === TradeType.EXACT_INPUT
);
const tradeCurrency = computed(() => props.routeData?.trade.inputAmount);
const tradeCurrencyToken = computed(
  () => props.routeData?.trade.inputAmount.currency as Token
);
const quoteCurrency = computed(() => props.routeData?.trade.outputAmount);
const quoteCurrencyToken = computed(
  () => props.routeData?.trade.outputAmount.currency as Token
);
const routes = computed(() => props.routeData?.route);

const uniswapTokenAsToken = (uniToken: UniswapToken): Token =>
  uniToken as Token;
</script>

<template>
  <div test-token-swap-wrap>
    <div v-if="routerLoading" class="animate-pulse flex space-x-4">
      <div class="flex-1 space-y-6 py-1">
        <div class="h-2 bg-slate-700 rounded w-36 mb-2"></div>
        <div class="h-6 bg-slate-700 rounded"></div>
        <hr class="opacity-40 my-4" />
        <div class="space-y-3">
          <div class="h-2 bg-slate-700 rounded w-36 mb-2"></div>
          <div class="grid md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <div class="grid grid-cols-2 items-start justify-between my-2">
                <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                <div>
                  <div class="h-2 bg-slate-700 rounded w-36 mb-2"></div>
                  <div class="h-6 bg-slate-700 rounded"></div>
                </div>
              </div>
              <div class="text-center">
                <i class="i-ph-arrow-down-bold w-8 h-8 text-slate-700"></i>
              </div>
              <div class="grid grid-cols-2 items-start justify-between my-2">
                <div class="rounded-full bg-slate-700 h-10 w-10"></div>
                <div>
                  <div class="h-4 bg-slate-700 rounded w-36 mb-2"></div>
                  <div class="h-6 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
            <div
              class="pl-4 border-t-1 md:(border-t-0 border-l-1) border-white border-opacity-20 mt-2"
            >
              <div class="h-2 bg-slate-700 rounded w-36 mb-2"></div>
              <div class="h-6 bg-slate-700 rounded mb-4"></div>
              <div class="h-2 bg-slate-700 rounded w-36 mb-2"></div>
              <div class="h-6 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="hasRoute">
      <div>
        <div v-for="(uniRoute, index) in routes" :key="index">
          <p>Percent: {{ uniRoute.percent }}</p>
          <p>Pool addresses:</p>
          <pre
            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
          ><template v-for="(address) in uniRoute.poolAddresses"
          >{{ address }}</template
          ></pre>
          <hr class="opacity-40 my-4" />
          <h3 class="text-xl font-bold">Quote</h3>

          <div class="grid md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <div class="grid grid-cols-2 items-start justify-between my-2">
                <AssetTag
                  size="xl"
                  :title="t('currency')"
                  :token="tradeCurrencyToken"
                />
                <div>
                  <p>Amount</p>
                  <pre
                    class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ tradeCurrency?.toExact() }}</pre
                  >
                  <template v-if="!isTradeExactInput">
                    <p>Quote gas adjusted</p>
                    <pre
                      class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ props.routeData?.quoteGasAdjusted.toExact() }}</pre
                    >
                  </template>
                </div>
              </div>
              <div class="text-center">
                <i class="i-ph-arrow-down-bold w-8 h-8"></i>
              </div>
              <div class="grid grid-cols-2 items-start justify-between my-2">
                <AssetTag
                  size="xl"
                  :title="t('currency')"
                  :token="quoteCurrencyToken"
                />
                <div>
                  <p>Amount</p>
                  <pre
                    class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ quoteCurrency?.toExact() }}</pre
                  >
                  <template v-if="isTradeExactInput">
                    <p>Quote gas adjusted</p>
                    <pre
                      class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                      >{{ props.routeData?.quoteGasAdjusted.toExact() }}</pre
                    >
                  </template>
                </div>
              </div>
            </div>
            <div
              class="pl-4 border-t-1 md:(border-t-0 border-l-1) border-white border-opacity-20 mt-2"
            >
              <p>Estimated gas used</p>
              <pre
                class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ props.routeData?.estimatedGasUsed.toNumber() }}</pre
              >
              <p>Gas used USD</p>
              <pre
                class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ props.routeData?.estimatedGasUsedUSD.toFixed(6) }}</pre
              >
            </div>
          </div>
          <hr class="opacity-40 my-4" />
          <h3 class="text-xl font-bold">Token path</h3>
          <div class="flex items-center gap-2 justify-center p-4">
            <div
              v-for="(step, tokenIndex) in uniRoute.tokenPath"
              :key="tokenIndex"
              class="flex items-center gap-4"
            >
              <AssetTag
                size="xl"
                :title="t('token')"
                :token="uniswapTokenAsToken(step)"
                class="border-1 rounded-xl border-white border-opacity-10 p-3"
              />
              <!-- <pre
                class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ JSON.stringify(step, null, 2) }}</pre
              > -->
              <div
                v-if="tokenIndex < uniRoute.tokenPath.length - 1"
                class="flex-shrink-0"
              >
                <i class="i-ph-arrow-right-bold w-6 h-6"></i>
              </div>
            </div>
          </div>
          <hr class="opacity-40 my-4" />
          <h3 class="text-xl font-bold">Trade</h3>
          <pre
            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(props.routeData?.trade, null, 2) }}</pre
          >
          <!-- <p>token path:</p>

          <pre
              class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
              >{{ JSON.stringify(uniswapRouteData.trade, null, 2) }}</pre
            > -->
        </div>
      </div>
      <div>
        <p>Parameters</p>
        <pre
          class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
          >{{ JSON.stringify(props.routeData?.methodParameters, null, 2) }}</pre
        >
      </div>
      <!-- <div>
          <p>Trade</p>
          <pre
            class="bg-white/10 broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniswapRouteData.trade, null, 2) }}</pre
          >
        </div> -->
    </div>
    <div v-else>No quote available</div>
  </div>
</template>
