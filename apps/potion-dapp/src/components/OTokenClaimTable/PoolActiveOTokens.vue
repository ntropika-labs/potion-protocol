<script lang="ts" setup>
import { computed } from "vue";
import {
  PutOptionsTable,
  getPnlColor,
  pnlFormatter,
  dateFormatter,
  shortCurrencyFormatter,
} from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";

import type { OtokenDataset } from "dapp-types";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

export interface Props {
  otokens: PoolRecordOtokenInfoFragment[];
  priceMap: Map<string, string>;
}

const props = defineProps<Props>();

const currency = "USDC";

const calcProfitAndLoss = (
  premium: number,
  collateral: number,
  strikePrice: number,
  currentPrice: number
) => {
  const amountOfOtokens = collateral / strikePrice;
  const otokenValue = Math.max(strikePrice - currentPrice, 0);
  return (premium - amountOfOtokens * otokenValue) / collateral;
};

const dataset = computed<OtokenDataset>(() => {
  return props.otokens.map((item) => {
    const address = item?.otoken.underlyingAsset.address ?? "";
    const { symbol } = useTokenList(address);
    const currentPrice = props.priceMap.get(address) ?? "0";
    const premium = parseFloat(item.premiumReceived);
    const strikePrice = parseFloat(item.otoken.strikePrice);
    const collateral = parseFloat(item.collateral);

    const pnl =
      calcProfitAndLoss(
        premium,
        collateral,
        strikePrice,
        parseFloat(currentPrice)
      ) * 100;

    return [
      { value: symbol },
      { value: dateFormatter(item.otoken.expiry, true) },
      { value: shortCurrencyFormatter(premium, currency) },
      { value: shortCurrencyFormatter(strikePrice, currency) },
      { value: shortCurrencyFormatter(collateral, currency) },
      { value: pnlFormatter(pnl), color: getPnlColor(pnl) },
    ];
  });
});

const headings = [
  "Asset",
  "Exp. Date",
  "Premium",
  "Strike Price",
  "Collateral",
  "Projected P&L",
];
</script>

<template>
  <div class="border border-white/10 rounded-3xl">
    <PutOptionsTable :headings="headings" :dataset="dataset" />
  </div>
</template>
