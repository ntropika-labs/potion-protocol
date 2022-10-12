<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import _uniqBy from "lodash.uniqby";
import { useI18n } from "vue-i18n";
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
  claimedOtokens: string[];
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "otoken-claimed", id: string): void;
}>();

const { t } = useI18n();

const activeTab = ref(tabs.expired);
const uniqueUnderlyings = computed(() => _uniqBy(props.underlyings, "address"));
const selectedUnderlyings = ref<Set<string>>(new Set());

const filterOtokens = (otokens: PoolRecordOtokenInfoFragment[]) => {
  if (
    selectedUnderlyings.value.size > 0 &&
    selectedUnderlyings.value.size < uniqueUnderlyings.value.length
  ) {
    return otokens.filter(({ otoken }) =>
      selectedUnderlyings.value.has(otoken.underlyingAsset.address)
    );
  } else {
    return otokens;
  }
};

const filteredActiveOtokens = computed(() =>
  filterOtokens(props.activeOtokens)
);
const filteredExpiredOtokens = computed(() =>
  filterOtokens(props.expiredOtokens)
);

const setUnderlying = (key: string, state: boolean) => {
  if (state === true) {
    selectedUnderlyings.value.add(key);
  } else {
    selectedUnderlyings.value.delete(key);
  }
};
const toggleUnderlying = (key: string) =>
  setUnderlying(key, !selectedUnderlyings.value.has(key));
const isActive = (key: string) => selectedUnderlyings.value.has(key);

// bulk operations
const setAllUnderlyings = (desiredState: boolean) => {
  if (desiredState === true)
    selectedUnderlyings.value = new Set(
      uniqueUnderlyings.value.map((u) => u.address)
    );
  else selectedUnderlyings.value.clear();
};
const selectAllUnderlyings = () => setAllUnderlyings(true);
const deselectAllUnderlyings = () => setAllUnderlyings(false);

const toggleAllUnderlyings = () => {
  if (selectedUnderlyings.value.size === 0) {
    selectAllUnderlyings();
  } else {
    deselectAllUnderlyings();
  }
};

const getActiveTabColors = (active: boolean) =>
  active ? "border-primary-500" : "border-white/10";
const getButtonColor = (active: boolean) => (active ? "primary" : "filter");

const claimOtoken = (index: number) => {
  if (filteredExpiredOtokens.value[index]) {
    emits("otoken-claimed", filteredExpiredOtokens.value[index].otoken.id);
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
          test-claim-table-expired-tab-switch
          class="cursor-pointer w-1/2 py-4 border-b-2 text-center uppercase transition"
          :class="getActiveTabColors(activeTab === tabs.expired)"
          @click="activeTab = tabs.expired"
        >
          {{ t("expired_options") }}
        </div>

        <div
          test-claim-table-active-tab-switch
          class="cursor-pointer w-1/2 py-4 border-b-2 text-center uppercase transition"
          :class="getActiveTabColors(activeTab === tabs.active)"
          @click="activeTab = tabs.active"
        >
          {{ t("active_options") }}
        </div>
      </div>
      <div class="py-4 px-5 radial-bg-glass">
        <div class="font-poppins font-medium text-md">
          {{ t("pool_underlyings") }}
        </div>

        <div class="flex gap-3 mt-4 mb-6">
          <BaseButton
            v-if="uniqueUnderlyings.length > 1"
            label="All"
            size="xs"
            class="!capitalize"
            test-claim-table-toggle-all-button
            :palette="getButtonColor(selectedUnderlyings.size === 0)"
            @click="toggleAllUnderlyings"
          />
          <BaseButton
            v-for="(underlying, index) in uniqueUnderlyings"
            :key="`underlying-filter-${index}`"
            :palette="getButtonColor(isActive(underlying.address))"
            :label="underlying.symbol"
            size="xs"
            class="!capitalize"
            test-claim-table-toggle-asset-button
            @click="toggleUnderlying(underlying.address)"
          />
        </div>
        <PoolActiveOTokens
          v-if="activeTab === tabs.active"
          :otokens="filteredActiveOtokens"
          :underlyings="underlyings"
          :price-map="priceMap"
          test-claim-table-active-options
        ></PoolActiveOTokens>
        <PoolExpiredOTokens
          v-else
          :otokens="filteredExpiredOtokens"
          :underlyings="underlyings"
          :payout-map="props.payoutMap"
          :claimed-otokens="props.claimedOtokens"
          test-claim-table-expired-options
          @claim-otoken="claimOtoken"
        >
        </PoolExpiredOTokens>
      </div>
    </div>
  </BaseCard>
</template>
