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
import { useI18n } from "vue-i18n";
import { contractsAddresses } from "@/helpers/contracts";

import type { OtokenDataset } from "dapp-types";
import type { PoolRecordOtokenInfoFragment } from "subgraph-queries/generated/operations";

interface Props {
  otokens: PoolRecordOtokenInfoFragment[];
  payoutMap: Map<string, number>;
  claimedOtokens: string[];
  claimCollateralLoading: boolean;
}

const props = defineProps<Props>();

const { t } = useI18n();
const { symbol: currency } = useTokenList(
  contractsAddresses.USDC.address.toLowerCase()
);

const calcProfitAndLoss = (
  premium: number,
  collateral: number,
  reclaimable: number
) => (premium + collateral - reclaimable) / collateral;

const dataset = computed<OtokenDataset>(() => {
  return props.otokens.map((item) => {
    const id = item?.otoken.id ?? "";
    const address = item?.otoken.underlyingAsset.address ?? "";
    const { symbol } = useTokenList(address);

    const payout = props.payoutMap.get(id) ?? 0;
    const isReclaimable = payout > 0;

    const returned = parseFloat(item?.returned ?? "0");
    const premium = parseFloat(item.premiumReceived);
    const strikePrice = parseFloat(item.otoken.strikePrice);
    const collateral = parseFloat(item.collateral);

    if (props.claimedOtokens.includes(id)) {
      const pnl = calcProfitAndLoss(premium, collateral, payout) * 100;

      return [
        { value: symbol },
        { value: dateFormatter(item.otoken.expiry, true) },
        { value: shortCurrencyFormatter(premium, currency) },
        { value: shortCurrencyFormatter(strikePrice, currency) },
        { value: shortCurrencyFormatter(0, currency) },
        { value: shortCurrencyFormatter(payout, currency) },
        { value: pnlFormatter(pnl), color: getPnlColor(pnl) },
        {
          button: true,
          claimable: false,
          value: t("claimed"),
          color: "secondary",
        },
      ];
    } else {
      const reclaimable = payout > 0 ? payout : returned;
      const pnl = calcProfitAndLoss(premium, collateral, reclaimable) * 100;

      return [
        {
          button: true,
          claimable: isReclaimable,
          value: isReclaimable ? t("claim") : t("claimed"),
          color: isReclaimable ? "secondary-o" : "secondary",
        },
        { value: symbol },
        { value: dateFormatter(item.otoken.expiry, true) },
        { value: shortCurrencyFormatter(strikePrice, currency) },
        { value: pnlFormatter(pnl), color: getPnlColor(pnl) },
        { value: shortCurrencyFormatter(premium, currency) },
        { value: shortCurrencyFormatter(payout, currency) },
        { value: shortCurrencyFormatter(returned, currency) },
      ];
    }
  });
});

const headings = [
  t("action"),
  t("asset"),
  t("expiration_date"),
  t("strike_price"),
  t("pnl"),
  t("premium"),
  t("claimable"),
  t("claimed"),
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
      :loading="claimCollateralLoading"
      @button-pressed="onButtonPressed"
    />
  </div>
</template>
