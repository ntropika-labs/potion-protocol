<script lang="ts">
import { computed, defineComponent, onMounted } from "vue";
import type { Token } from "dapp-types";
export default defineComponent({
  name: "OTokenClaimTable",
});
</script>
<script lang="ts" setup>
import { ref } from "vue";
import { uniqBy as _uniqBy } from "lodash-es";
import { BaseCard, BaseButton } from "potion-ui";

export interface Props {
  underlyings?: Array<any>;
  priceMap?: { [key: string]: any };
}

const props = withDefaults(defineProps<Props>(), {
  underlyings: () => [],
  priceMap: () => {
    return {};
  },
});
const emits = defineEmits(["claim-otoken"]);

const activeTab = ref("PoolExpiredOTokens");
const underlyingsAddressSelected = ref<Array<string>>([]);

const oTokens = computed(() => {
  const result: { active: Array<any>; expired: Array<any> } = {
    active: [],
    expired: [],
  };
  selectedUnderlyings.value.forEach((underlying: any) => {
    underlying.activeOTokens.forEach((otoken: Token) =>
      result.active.push({
        ...otoken,
        symbol: underlying.symbol,
        currentPrice: props.priceMap[underlying.address],
      })
    );
    underlying.expiredOTokens.forEach((otoken: Token) =>
      result.expired.push({ ...otoken, symbol: underlying.symbol })
    );
  });
  return result;
});
const uniqueUnderlyings = computed(() => _uniqBy(props.underlyings, "address"));
const selectedUnderlyings = computed(() => {
  return uniqueUnderlyings.value.filter((und: Token) =>
    underlyingsAddressSelected.value.includes(und.address)
  );
});
const dynamicProps = computed(() => {
  if (activeTab.value === "PoolActiveOTokens") {
    return { oTokens: oTokens.value.active };
  } else {
    return { oTokens: oTokens.value.expired };
  }
});

const selectAllUnderlyings = () => {
  underlyingsAddressSelected.value = uniqueUnderlyings.value.map(
    (x) => x.address
  );
};
const deselectAllUnderlyings = () => {
  underlyingsAddressSelected.value = new Array<string>();
};
const toggleAllUnderlyings = () => {
  if (underlyingsAddressSelected.value.length === 0) {
    selectAllUnderlyings();
  } else {
    deselectAllUnderlyings();
  }
};
const toggleUnderlying = (address: string) => {
  if (!underlyingsAddressSelected.value.includes(address)) {
    underlyingsAddressSelected.value.push(address);
  } else {
    underlyingsAddressSelected.value.splice(
      underlyingsAddressSelected.value.indexOf(address),
      1
    );
  }
};
const underlyingIsActive = (address: string) => {
  return underlyingsAddressSelected.value.includes(address);
};

const claimOtoken = (oToken: any) => {
  emits("claim-otoken", oToken);
};
onMounted(() => selectAllUnderlyings());
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
          class="cursor-pointer w-1/2 py-4 text-center border-b-2 uppercase transition"
          :class="
            activeTab === 'PoolExpiredOTokens'
              ? 'border-primary-500'
              : 'border-white border-opacity-10'
          "
          @click="activeTab = 'PoolExpiredOTokens'"
        >
          Expired Put Options
        </div>

        <div
          class="cursor-pointer w-1/2 py-4 border-b-2 text-center uppercase transition"
          :class="
            activeTab === 'PoolActiveOTokens'
              ? 'border-primary-500'
              : 'border-white border-opacity-10'
          "
          @click="activeTab = 'PoolActiveOTokens'"
        >
          Active Put Options
        </div>
      </div>
      <div class="py-4 px-5 radial-bg-glass">
        <div class="font-poppins font-medium text-md">
          Underlying Pool Assets
        </div>

        <div class="flex space-x-3 mt-4">
          <BaseButton
            v-if="uniqueUnderlyings.length > 1"
            label="All"
            size="xs"
            class="!capitalize"
            :color="
              underlyingsAddressSelected.length === 0 ? 'filter' : 'primary'
            "
            @click="toggleAllUnderlyings()"
          />
          <BaseButton
            v-for="(underlying, index) in uniqueUnderlyings"
            :key="`underlying-filter-${index}`"
            :color="underlyingIsActive(underlying.address)"
            :label="underlying.symbol"
            size="xs"
            class="!capitalize"
            @click="toggleUnderlying(underlying.address)"
          />
        </div>
        <component
          :is="activeTab"
          class="mt-6"
          v-bind="dynamicProps"
          @claim-otoken="claimOtoken"
        />
      </div>
    </div>
  </BaseCard>
</template>
