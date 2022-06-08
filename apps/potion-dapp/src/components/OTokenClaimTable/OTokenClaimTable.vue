<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { uniqBy as _uniqBy } from "lodash-es";
import { BaseCard, BaseButton } from "potion-ui";

import PoolExpiredOTokens from "./PoolExpiredOTokens.vue";
import PoolActiveOTokens from "./PoolActiveOTokens.vue";

import type { Token } from "dapp-types";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

enum tabs {
  active = "active",
  expired = "expired",
}

interface Props {
  activeOtokens: PoolRecordOtokenInfoFragment[];
  expiredOtokens: PoolRecordOtokenInfoFragment[];
  underlyings: Array<Token>;
  priceMap: Map<string, string>;
  payoutMap: Map<string, number>;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "otoken-claimed", id: string): void;
}>();

const activeTab = ref(tabs.expired);
const selectedUnderlyings = ref<Map<string, boolean>>(new Map());
const totalSelectedUnderlyings = computed(
  () => Array.from(selectedUnderlyings.value.values()).filter(Boolean).length
);

const filterOtokens = (otokens: PoolRecordOtokenInfoFragment[]) =>
  otokens.filter(({ otoken }) =>
    selectedUnderlyings.value.get(otoken.underlyingAsset.address)
  );

const filteredActiveOtokens = computed(() =>
  filterOtokens(props.activeOtokens)
);
const filteredExpiredOtokens = computed(() =>
  filterOtokens(props.expiredOtokens)
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

const claimOtoken = (index: number) => {
  if (filteredActiveOtokens.value[index]) {
    emits("otoken-claimed", filteredActiveOtokens.value[index].otoken.id);
  }
};

watch(uniqueUnderlyings, selectAllUnderlyings);
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
          :otokens="filteredActiveOtokens"
          :underlyings="underlyings"
          :price-map="priceMap"
        ></PoolActiveOTokens>
        <PoolExpiredOTokens
          v-else
          :otokens="filteredExpiredOtokens"
          :underlyings="underlyings"
          :payout-map="props.payoutMap"
          @claim-otoken="claimOtoken"
        >
        </PoolExpiredOTokens>
      </div>
    </div>
  </BaseCard>
</template>
