<template>
  <BaseCard>
    <div class="grid md:grid-cols-4 py-4 px-6 md:px-12 gap-4">
      <p class="text-3xl capitalize col-span-4 xl:col-span-1 font-semibold">
        {{ t("my_summary") }}
      </p>
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
  <InnerNav v-bind="innerNavProps" class="mt-10" />
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 auto-rows-fr">
    <router-link
      v-if="isSameUserConnected"
      to="/custom-pool-creation"
      class="min-h-[20rem]"
    >
      <CardNewItem :label="t('create_pool')" />
    </router-link>
    <template v-if="pools.length > 0">
      <PoolCard
        v-for="(pool, index) in pools"
        :key="`${pool.id}${index}`"
        :active="true"
        :tokens="
          getTokens(pool.template?.criteriaSet?.criterias ?? emptyCriterias)
        "
        :size="pool.size"
        :utilization="pool.utilization"
        :pnl="pool.pnlPercentage"
      >
        <template #poolLink>
          <router-link
            :to="{
              name: 'liquidity-provider-pool',
              params: {
                lp: connectedWallet?.accounts[0].address.toLowerCase(),
                id: pool.poolId,
              },
            }"
          >
            <BaseButton
              :label="t('check_pool')"
              palette="secondary"
            ></BaseButton>
          </router-link>
        </template>
      </PoolCard>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useGetPoolsFromUserQuery } from "subgraph-queries/generated/urql";
import {
  PoolCard,
  CardNewItem,
  BaseCard,
  LabelValue,
  BaseButton,
} from "potion-ui";
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

const { connectedWallet } = useOnboard();

const { t } = useI18n();
const route = useRoute();
const lpId = Array.isArray(route.params.lp)
  ? route.params.lp[0]
  : route.params.lp;

const isSameUserConnected = computed(() => {
  if (connectedWallet.value?.accounts[0].address.toLowerCase() === lpId) {
    return true;
  } else {
    return false;
  }
});
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

const pools = ref<SubgraphPools>([]);
const alreadyFetchedIds = computed<string[]>(() =>
  [""].concat(pools.value.map(({ id }) => id))
);

const queryVariables = computed(() => {
  return {
    lp: lpId,
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

const emptyCriterias = new Array<TemplateCriteria>();

onMounted(loadMorePools);
</script>
