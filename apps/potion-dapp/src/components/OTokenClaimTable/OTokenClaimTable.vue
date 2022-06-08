<script lang="ts" setup>
import { computed, ref, onMounted, watch } from "vue";
import { uniqBy as _uniqBy } from "lodash-es";
import { BaseCard, BaseButton } from "potion-ui";

import { usePoolOtokens } from "@/composables/usePoolRecords";
import { useEthersProvider } from "@/composables/useEthersProvider";
import { usePotionLiquidityPoolContract } from "@/composables/usePotionLiquidityPoolContract";

import PoolExpiredOTokens from "./PoolExpiredOTokens.vue";
import PoolActiveOTokens from "./PoolActiveOTokens.vue";

import type { Token } from "dapp-types";

enum tabs {
  active = "active",
  expired = "expired",
}

interface Props {
  lpId: string;
  poolId: number;
  poolIdentifier: string;
  underlyings: Array<Token>;
  priceMap: Map<string, string>;
}

const props = defineProps<Props>();
const emits = defineEmits(["claim-otoken"]);

const payoutMap = ref<Map<string, number>>(new Map());

const { getOutstandingSettlements } = usePotionLiquidityPoolContract();
const { blockTimestamp, getBlock, loading: loadingBlock } = useEthersProvider();

const activeTab = ref(tabs.expired);
const selectedUnderlyings = ref<Map<string, boolean>>(new Map());
const totalSelectedUnderlyings = computed(
  () => Array.from(selectedUnderlyings.value.values()).filter(Boolean).length
);

const { poolOtokens } = usePoolOtokens(props.poolIdentifier);
const filteredOtokens = computed(() =>
  poolOtokens.value.filter(({ otoken }) =>
    selectedUnderlyings.value.get(otoken.underlyingAsset.address)
  )
);
const activeOtokens = computed(() =>
  filteredOtokens.value.filter(
    ({ otoken }) =>
      !loadingBlock.value && parseInt(otoken.expiry) > blockTimestamp.value
  )
);
const expiredOtokens = computed(() =>
  filteredOtokens.value.filter(
    ({ otoken }) =>
      !loadingBlock.value && parseInt(otoken.expiry) <= blockTimestamp.value
  )
);

const uniqueUnderlyings = computed(() => _uniqBy(props.underlyings, "address"));

const setUnderlying = (key: string, value: boolean) =>
  selectedUnderlyings.value.set(key, value);
const toggleUnderlying = (key: string) =>
  setUnderlying(key, !selectedUnderlyings.value.get(key));
const isActive = (key: string) => selectedUnderlyings.value.get(key);

// bulk operations
const setAllUnderlyings = (v: boolean) =>
  uniqueUnderlyings.value.forEach(({ address }) => setUnderlying(address, v));
const selectAllUnderlyings = () => setAllUnderlyings(true);
const deselectAllUnderlyings = () => setAllUnderlyings(false);

const toggleAllUnderlyings = () => {
  if (totalSelectedUnderlyings.value === 0) {
    selectAllUnderlyings();
  } else {
    deselectAllUnderlyings();
  }
};

const getActiveTabColors = (active: boolean) =>
  active ? "border-primary-500" : "border-white/10";
const getButtonColor = (active: boolean) => (active ? "primary" : "filter");

const claimOtoken = (index: number) => emits("claim-otoken", index);

onMounted(() => {
  selectAllUnderlyings();
  getBlock("latest");
});

watch(expiredOtokens, async () => {
  const otokens = expiredOtokens.value.map(({ otoken }) => otoken.id);
  payoutMap.value = await getOutstandingSettlements(otokens, {
    lp: props.lpId,
    poolId: props.poolId,
  });
});
</script>
<template>
  <BaseCard
    :full-height="false"
    color="clean"
    class="border border-white border-opacity-10"
  >
    <div class="">
      <div
        class="flex flex-wrap radial-bg-glass font-poppins font-semibold text-xs rounded-t-2xl"
      >
        <div
          class="cursor-pointer w-1/2 py-4 border-b-2 text-center uppercase transition"
          :class="getActiveTabColors(activeTab === tabs.expired)"
          @click="activeTab = tabs.expired"
        >
          Expired Put Options
        </div>

        <div
          class="cursor-pointer w-1/2 py-4 border-b-2 text-center uppercase transition"
          :class="getActiveTabColors(activeTab === tabs.active)"
          @click="activeTab = tabs.active"
        >
          Active Put Options
        </div>
      </div>
      <div class="py-4 px-5 radial-bg-glass">
        <div class="font-poppins font-medium text-md">
          Underlying Pool Assets
        </div>

        <div class="flex gap-3 mt-4 mb-6">
          <BaseButton
            v-if="uniqueUnderlyings.length > 1"
            label="All"
            size="xs"
            class="!capitalize"
            :palette="getButtonColor(totalSelectedUnderlyings === 0)"
            @click="toggleAllUnderlyings"
          />
          <BaseButton
            v-for="(underlying, index) in uniqueUnderlyings"
            :key="`underlying-filter-${index}`"
            :palette="getButtonColor(isActive(underlying.address))"
            :label="underlying.symbol"
            size="xs"
            class="!capitalize"
            @click="toggleUnderlying(underlying.address)"
          />
        </div>
        <PoolActiveOTokens
          v-if="activeTab === tabs.active"
          :otokens="activeOtokens"
          :underlyings="underlyings"
          :price-map="priceMap"
        ></PoolActiveOTokens>
        <PoolExpiredOTokens
          v-else
          :otokens="expiredOtokens"
          :underlyings="underlyings"
          :payout-map="payoutMap"
          @claim-otoken="claimOtoken"
        >
        </PoolExpiredOTokens>
      </div>
    </div>
  </BaseCard>
</template>
