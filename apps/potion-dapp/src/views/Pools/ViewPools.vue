<template>
  <BaseCard>
    <div class="grid md:grid-cols-4 p-4">
      <p class="text-xl uppercase">{{ t("my_summary") }}</p>
      <LabelValue
        :title="t('total_pools')"
        :value="summaryData.totalPools.toString()"
      />
      <LabelValue
        :title="t('average_pnl')"
        :value="summaryData.averagePnl.toString()"
        symbol="%"
      />
      <LabelValue
        :title="t('total_liquidity')"
        :value="summaryData.totalLiquidity.toString()"
        symbol="USDC"
      />
    </div>
  </BaseCard>
  <InnerNav v-bind="innerNavProps" class="mt-5" />
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
    <router-link to="/custom-pool-creation">
      <CardNewItem
        class="min-h-[300px] md:min-h-auto"
        :label="t('create_pool')"
      />
    </router-link>
    <template v-if="pools.length > 0">
      <PoolCard
        v-for="(pool, index) in pools"
        :key="`${pool.id}${index}`"
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
import { PoolCard, CardNewItem, BaseCard, LabelValue } from "potion-ui";
import { useOnboard } from "@onboard-composable";
import { computed, ref, onMounted } from "vue";
import { useTokenList } from "@/composables/useTokenList";
import InnerNav from "@/components/InnerNav.vue";
import { useRoute } from "vue-router";
import type {
  TokenInfoFragment,
  GetPoolsFromUserQuery,
} from "subgraph-queries/generated/operations";

type SubgraphPools = GetPoolsFromUserQuery["pools"];

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
const pools = ref<SubgraphPools>([]);
const alreadyFetchedIds = computed<string[]>(() =>
  [""].concat(pools.value.map(({ id }) => id))
);

const queryVariables = computed(() => {
  return {
    lp: connectedWallet.value?.accounts[0].address ?? "",
    ids: alreadyFetchedIds.value,
  };
});
const { data, executeQuery } = useGetPoolsFromUserQuery({
  variables: queryVariables,
  pause: true,
});

const loadMorePools = async () => {
  await executeQuery();
  pools.value = pools.value.concat(data.value?.pools ?? []);
};

const summaryData = computed(() => {
  const accPnl = pools.value.reduce(
    (acc, pool) => acc + parseFloat(pool.pnlPercentage),
    0
  );
  const averagePnl = accPnl > 0 ? accPnl / pools.value.length : 0;

  const totalLiquidity = pools.value.reduce(
    (acc, pool) => acc + parseFloat(pool.size),
    0
  );
  return {
    totalPools: pools.value.length ?? 0,
    averagePnl: averagePnl,
    totalLiquidity: totalLiquidity,
  };
});

const getTokens = (criterias: TemplateCriteria[]) =>
  criterias.map(({ criteria }) => {
    const address = criteria.underlyingAsset.address;
    const { name, symbol, image } = useTokenList(address);
    return { address, name, symbol, image };
  });

onMounted(loadMorePools);
</script>
