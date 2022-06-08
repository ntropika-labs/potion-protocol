<script lang="ts" setup>
import { computed } from "vue";
import {
  PutOptionsTable,
  getPnlColor,
  dateFormatter,
  pnlFormatter,
  shortCurrencyFormatter,
} from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";

import type { OtokenDataset } from "dapp-types";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

interface Props {
  otokens: PoolRecordOtokenInfoFragment[];
  payoutMap: Map<string, number>;
}

const props = defineProps<Props>();

const currency = "USDC";

const calcProfitAndLoss = (
  premium: number,
  collateral: number,
  reclaimable: number
) => (premium + collateral - reclaimable) / collateral;

const dataset = computed<OtokenDataset>(() => {
  return props.otokens.map((item) => {
    const address = item?.otoken.underlyingAsset.address ?? "";
    const { symbol } = useTokenList(address);

    const reclaimableAmount = props.payoutMap.get(address) ?? 0;
    const isReclaimable = reclaimableAmount > 0;
    const premium = parseFloat(item.premiumReceived);
    const strikePrice = parseFloat(item.otoken.strikePrice);
    const collateral = parseFloat(item.collateral);

    const pnl = calcProfitAndLoss(premium, collateral, reclaimableAmount) * 100;

    return [
      { value: symbol },
      { value: dateFormatter(item.otoken.expiry, true) },
      { value: shortCurrencyFormatter(premium, currency) },
      { value: shortCurrencyFormatter(strikePrice, currency) },
      { value: shortCurrencyFormatter(reclaimableAmount, currency) },
      { value: pnlFormatter(pnl), color: getPnlColor(pnl) },
      {
        button: true,
        claimable: isReclaimable,
        value: isReclaimable ? "Claim" : "Claimed",
        color: isReclaimable ? "secondary-o" : "secondary",
      },
    ];
  });
});

const headings = [
  "Asset",
  "Exp. Date",
  "Premium",
  "Strike Price",
  "Reclaimable",
  "P&L",
  "Action",
];

const emits = defineEmits<{
  (e: "claim-otoken", index: number): void;
}>();

const onButtonPressed = (index: number, cellIndex: number) => {
  const row = dataset.value[index];
  if (row[cellIndex].claimable) {
    emits("claim-otoken", index);
  }
};
</script>
<template>
  <div class="border border-white/10 rounded-3xl">
    <PutOptionsTable
      :headings="headings"
      :dataset="dataset"
      @button-pressed="onButtonPressed"
    />
  </div>
</template>
