<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TokenSelection",
});
</script>

<script lang="ts" setup>
//import { computed, ref, watch } from "vue";
import { Token } from "@uniswap/sdk-core";
import type { SwapRoute } from "@uniswap/smart-order-router";
// import { ChainId, type SwapRoute } from "@uniswap/smart-order-router";

// import { useAlphaRouter } from "@/composables/useAlphaRouter";
// import { BaseButton } from "potion-ui";

export interface Props {
  tokenInput: Token;
  tokenOutput: Token;
  inputAmountToSwap: number;
  recipientAddress: string;
  routeData: SwapRoute | null;
  routerLoading: boolean;
}

const props = defineProps<Props>();

// const routePollingEnabled = ref(
//   Number.isSafeInteger(props.pollingIntervalSecs)
// );
// let pollingIntervalId: any = null;

// 
const emit = defineEmits<{
  (e: "swap-available"): void;
  (e: "swap-selected", selectedSwap: any): void;
}>();

console.log(emit);
</script>

<template>
  <div test-token-swap-wrap>
    <p v-if="routerLoading">Loading route...</p>
    <div v-else-if="props.routeData">
      <div>
        <h2>Routes</h2>
        <div v-for="(uniRoute, index) in props.routeData.route" :key="index">
          <p>Percent: {{ uniRoute.percent }}</p>
          <p>Pool addresses: {{ uniRoute.poolAddresses }}</p>

          <p>Amount:</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ uniRoute.amount.toFixed(6) }}</pre
          >
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniRoute.amount.currency, null, 2) }}</pre
          >

          <p>Token path:</p>
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
          <p>Route:</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniRoute.route, null, 2) }}</pre
          >
          <p>token path:</p>
          <pre
            class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
            >{{ JSON.stringify(uniRoute.tokenPath, null, 2) }}</pre
          >

          <!-- <pre
              class="bg-dark broder-1 border-white rounded-lg m-2 p-4 break-all whitespace-pre-wrap"
              >{{ JSON.stringify(uniswapRouteData.route, null, 2) }}</pre
            > -->
        </div>
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
