<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import type { Token } from "dapp-types";
export default defineComponent({
  name: "TokenSelection",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import type { SwapRoute } from "@uniswap/smart-order-router";

import { AssetTag } from "potion-ui";

export interface Props {
  routeData: SwapRoute | null;
  routerLoading: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();

const hasRoute = computed(() => props.routeData && props.routeData.route);
const tradeCurrency = computed(() => props.routeData?.trade.inputAmount);
const tradeCurrencyToken = computed(
  () => props.routeData?.trade.inputAmount.currency as Token
);
const quoteCurrency = computed(() => props.routeData?.trade.outputAmount);
const quoteCurrencyToken = computed(
  () => props.routeData?.trade.outputAmount.currency as Token
);
const routes = computed(() => props.routeData?.route);
</script>

<template>
  <div test-token-swap-wrap>
    <p v-if="routerLoading">Loading route...</p>
    <div v-else-if="hasRoute">
      <div>
        <div v-for="(uniRoute, index) in routes" :key="index">
          <p>Percent: {{ uniRoute.percent }}</p>
          <p>Pool addresses:</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
          ><template v-for="(address) in uniRoute.poolAddresses"
          >{{ address }}</template
          ></pre>
          <h3 class="text-xl font-bold">Quote</h3>
          <hr class="opacity-40 my-4" />
          <div class="grid md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <div class="flex flex-row items-start justify-between my-2">
                <AssetTag
                  size="xl"
                  :title="t('currency')"
                  :token="tradeCurrencyToken"
                />
                <div>
                  <p>Final Quote</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ tradeCurrency?.toExact() }}</pre
                  >
                  <p>Quote gas adjusted</p>
                  <pre
                    class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                    >{{ props.routeData?.quoteGasAdjusted.toExact() }}</pre
                  >
                </div>
              </div>
              <div class="text-center">
                <i class="i-ph-arrow-down-bold w-8 h-8"></i>
              </div>
              <div class="flex flex-row items-start justify-between my-2">
                <AssetTag
                  size="xl"
                  :title="t('currency')"
                  :token="quoteCurrencyToken"
                />
                <pre
                  class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                  >{{ quoteCurrency?.toExact() }}</pre
                >
              </div>
            </div>
            <div
              class="pl-4 border-t-1 md:(border-t-0 border-l-1) border-white border-opacity-20"
            >
              <p>Estimated gas used</p>
              <pre
                class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ props.routeData?.estimatedGasUsed.toNumber() }}</pre
              >
              <p>Gas used USD</p>
              <pre
                class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ props.routeData?.estimatedGasUsedUSD.toFixed(6) }}</pre
              >
            </div>
          </div>
          <hr class="opacity-40 my-4" />
          <h3 class="text-xl font-bold">Token path</h3>
          <div class="flex items-center justify-between">
            <div
              v-for="(step, tokenIndex) in uniRoute.tokenPath"
              :key="tokenIndex"
              class="flex items-center justify-between"
            >
              <pre
                class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
                >{{ JSON.stringify(step, null, 2) }}</pre
              >
              <div
                v-if="tokenIndex < uniRoute.tokenPath.length - 1"
                class="flex-shrink-0"
              >
                ->
              </div>
            </div>
          </div>
          <hr class="opacity-40 my-4" />
          <h3 class="text-xl font-bold">Route</h3>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniRoute.route, null, 2) }}</pre
          >
          <!-- <p>token path:</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniRoute.tokenPath, null, 2) }}</pre
          >

          <pre
              class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
              >{{ JSON.stringify(uniswapRouteData.route, null, 2) }}</pre
            > -->
        </div>
      </div>
      <div>
        <p>Parameters</p>
        <pre
          class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
          >{{ JSON.stringify(props.routeData?.methodParameters, null, 2) }}</pre
        >
      </div>
      <!-- <div>
          <p>Trade</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniswapRouteData.trade, null, 2) }}</pre
          >
        </div> -->
    </div>
    <div v-else>No quote available</div>
  </div>
</template>
