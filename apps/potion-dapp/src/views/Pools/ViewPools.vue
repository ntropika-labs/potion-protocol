<template>
  <InnerNav v-bind="innerNavProps" />
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
    <router-link to="/custom-pool-creation">
      <CardNewItem :label="t('create_pool')" />
    </router-link>
    <template v-if="userPools?.pools">
      <PoolCard
        v-for="(pool, index) in userPools?.pools"
        :key="pool.id + index"
        :active="true"
        :tokens="getTokens(pool.template?.criteriaSet?.criterias ?? [])"
        :size="pool.size"
        :utilization="pool.utilization"
        :pnl="pool.pnlPercentage"
      >
        <template #poolLink>
          <router-link
            :to="{
              name: 'liquidity-provider-pool',
              params: {
                lp: connectedWallet?.accounts[0].address,
                id: pool.poolId,
              },
            }"
            class="uppercase"
            >{{ t("create_pool") }}</router-link
          >
        </template>
      </PoolCard>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useGetPoolsFromUserQuery } from "subgraph-queries/generated/urql";
import { PoolCard, CardNewItem } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { computed, ref, watch } from "vue";
import { useTokenList } from "@/composables/useTokenList";
import InnerNav from "@/components/InnerNav.vue";
import { useRoute } from "vue-router";
import type { TokenInfoFragment } from "subgraph-queries/generated/operations";
interface TemplateCriteria {
  criteria: {
    underlyingAsset: TokenInfoFragment;
  };
}
const { t } = useI18n();
const route = useRoute();
const innerNavProps = computed(() => {
  return {
    currentRoute: route.name,
    routes: [
      {
        name: "discover-templates",
        label: "Discover Templates",
        enabled: true,
        params: {},
      },
      {
        name: "liquidity-provider",
        label: "My Pools",
        enabled: connectedWallet.value?.accounts[0].address ? true : false,
        params: {
          lp: connectedWallet.value?.accounts[0].address ?? "not-valid",
        },
      },
    ],
  };
});
const { connectedWallet } = useOnboard();
const alreadyFetchedIds = ref<string[]>([""]);
const queryVariables = computed(() => {
  return {
    lp: connectedWallet.value?.accounts[0].address ?? "",
    ids: alreadyFetchedIds.value,
  };
});
const { data: userPools, executeQuery } = useGetPoolsFromUserQuery({
  variables: queryVariables,
  pause: !connectedWallet.value,
});

watch(queryVariables, () => {
  executeQuery();
});

const getTokens = (criterias: TemplateCriteria[]) =>
  criterias.map(({ criteria }) => {
    const address = criteria.underlyingAsset.address;
    const { name, symbol, image } = useTokenList(address);
    return { address, name, symbol, image };
  });
</script>
