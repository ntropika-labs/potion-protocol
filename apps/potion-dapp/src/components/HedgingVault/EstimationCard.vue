<template>
  <BaseCard class="p-4">
    <div class="grid grid-cols-2 items-center justify-items-between">
      <p>{{ t("last_round_vault_size") }}</p>
      <p>
        {{ totalUnderlyingsAtRoundEnd.toFixed(2) + " " + underlyingSymbol }}
      </p>
      <p>{{ t("estimated_vault_size") }}</p>
      <p>{{ estimatedVaultSize.formatted }}</p>
      <p class="text-secondary-500 mt-10">{{ t("your_vault_share") }}</p>
      <p class="text-secondary-500 text-2xl mt-10">
        {{ userVaultRelativeShares.toFixed(2) }}%
      </p>
      <p class="text-secondary-500">{{ t("estimated_share_value") }}</p>
      <p class="text-secondary-500 text-2xl">
        {{ userEstimatedSharesToUnderlying.formatted }}
      </p>
    </div>
  </BaseCard>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseCard } from "potion-ui";
import {
  calculateCurrentShareToUnderlyingRate,
  calculateTotalRemainingShares,
} from "hedging-vault-sdk";
import type { DepositTicket } from "hedging-vault-sdk";
const { t } = useI18n();
interface Props {
  underlyingSymbol: string;
  totalUnderlyingsAtRoundEnd: number;
  usdcBalanceActionContract: number;
  underlyingBalanceActionContract: number;
  underlyingPrice: number;
  strikePrice: number;
  potionsQuantity: number;
  investmentVaultContractShares: number;
  depositTickets?: DepositTicket[] | null;
}

const props = withDefaults(defineProps<Props>(), {
  totalUnderlyingsAtRoundEnd: 0,
  usdcBalanceActionContract: 0,
  underlyingBalanceActionContract: 0,
  underlyingPrice: 0,
  strikePrice: 0,
  potionsQuantity: 0,
  investmentVaultContractShares: 0,
  depositTickets: null,
});

const currentShareToAssetRate = computed(() => {
  const currentShareToAssetRate = calculateCurrentShareToUnderlyingRate(
    props.usdcBalanceActionContract,
    props.underlyingBalanceActionContract,
    props.underlyingPrice,
    props.strikePrice,
    props.potionsQuantity,
    props.investmentVaultContractShares
  );
  return {
    num: currentShareToAssetRate,
    formatted: currentShareToAssetRate.toFixed(2),
  };
});

const estimatedVaultSize = computed(() => {
  const result =
    props.investmentVaultContractShares * currentShareToAssetRate.value.num;
  return {
    num: result,
    formatted: result.toFixed(2) + " " + props.underlyingSymbol,
  };
});

const userVaultRelativeShares = computed(() => {
  const totalRemainingShares = calculateTotalRemainingShares(
    props.depositTickets ?? []
  );

  return (100 * totalRemainingShares) / props.investmentVaultContractShares;
});

const userEstimatedSharesToUnderlying = computed(() => {
  const result =
    (userVaultRelativeShares.value * estimatedVaultSize.value.num) / 100;
  return {
    num: result,
    formatted: result.toFixed(2) + " " + props.underlyingSymbol,
  };
});
</script>
