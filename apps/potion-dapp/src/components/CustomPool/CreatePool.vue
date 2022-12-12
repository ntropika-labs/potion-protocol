<template>
  <div class="grid gap-5 lg:grid-cols-12">
    <PoolSettingsCard
      :pool-id="props.poolId"
      :liquidity="props.liquidity"
      :criterias="props.criterias"
      :disable-navigation-next="props.disableAction"
      :navigate-next-label="props.actionLabel"
      :action-loading="actionLoading"
      class="lg:col-span-4 xl:col-span-3 self-start"
      @navigate:back="emits('navigate:back')"
      @navigate:next="emits('deployPool')"
    />
    <CurvesChart
      :bonding-curve-params="props.bondingCurveParams"
      :emerging-curves="props.emergingCurves"
      :unselected-tokens="props.unselectedTokens"
    />
  </div>
</template>
<script lang="ts" setup>
import type {
  ContractTransaction,
  ContractReceipt,
} from "@ethersproject/contracts";
import type {
  Criteria,
  BondingCurveParams,
  EmergingCurvePoints,
} from "dapp-types";

import CurvesChart from "@/components/CurvesChart.vue";
import PoolSettingsCard from "@/components/CustomPool/PoolSettingsCard.vue";

const emits = defineEmits(["deployPool", "navigate:back"]);
interface Props {
  transaction: ContractTransaction | null;
  receipt: ContractReceipt | null;
  actionLabel: string;
  liquidity: string;
  poolId: number;
  criterias: Criteria[];
  disableAction: boolean;
  bondingCurveParams: BondingCurveParams;
  actionLoading: boolean;
  emergingCurves?: EmergingCurvePoints[];
  unselectedTokens: string[];
}
const props = defineProps<Props>();
</script>
