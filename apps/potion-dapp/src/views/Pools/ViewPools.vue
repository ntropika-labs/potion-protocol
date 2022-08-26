<template>
  <BaseCard>
    <div class="grid md:grid-cols-4 py-4 px-6 md:px-12 gap-4">
      <p class="text-3xl capitalize col-span-4 xl:col-span-1 font-semibold">
        {{ t("my_summary") }}
      </p>
      <LabelValue
        test-total-pools
        :title="t('total_pools')"
        :value="totalPools.toString()"
      />
      <LabelValue
        test-average-pnl
        :title="t('average_pnl')"
        :value="averagePnl.toString()"
        symbol="%"
      />
      <LabelValue
        test-total-liquidity
        :title="t('total_liquidity')"
        :value="totalLiquidity.toString()"
        symbol="USDC"
      />
    </div>
  </BaseCard>
  <PoolNav />
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 auto-rows-fr">
    <router-link
      v-if="isSameUserConnected"
      test-to-custom-pool-creation-card
      to="/custom-pool-creation"
      class="min-h-[20rem]"
    >
      <CardNewItem :label="t('create_pool')" />
    </router-link>
    <template v-if="pools.length > 0">
      <PoolCard
        v-for="(pool, index) in pools"
        :key="`${pool.id}${index}`"
        test-pool-card
        :active="true"
        :tokens="getTokens(pool.id)"
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
              test-pool-card-button
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
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import {
  PoolCard,
  CardNewItem,
  BaseCard,
  LabelValue,
  BaseButton,
} from "potion-ui";

import { useOnboard } from "@onboard-composable";

import PoolNav from "@/components/InnerNav/PoolNav.vue";

import { usePersonalPools } from "@/composables/usePersonalPools";
import { useRouteLiquidityProvider } from "@/composables/useRouteLiquidityProvider";

const { connectedWallet } = useOnboard();

const { t } = useI18n();
const route = useRoute();
const { validLp, poolLp } = useRouteLiquidityProvider(route.params);

const { pools, getTokens, totalPools, averagePnl, totalLiquidity } =
  usePersonalPools(poolLp);

const isSameUserConnected = computed(
  () =>
    validLp.value &&
    connectedWallet.value?.accounts[0].address.toLowerCase() === poolLp.value
);
</script>
