<script lang="ts" setup>
import dayjs from "dayjs";
import { computed } from "vue";
import { PutOptionsTable } from "potion-ui";
import { useTokenList } from "@/composables/useTokenList";

interface Props {
  otokens: any[];
}

const props = withDefaults(defineProps<Props>(), {
  otokens: () => [],
});

const formatDate = (timestamp: number) => ({
  value: dayjs.unix(timestamp).format("D MMM YY"),
});

const getPnlColor = (v: number) => (v === 0 ? "white" : "green");

const formatPl = (value: number) => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toFixed(2)}%`;
};

const calcProfitAndLoss = (
  premium: number,
  collateral: number,
  reclaimable: number
) => {
  const pl = (premium + collateral - reclaimable) / collateral;
  return {
    class: getPnlColor(pl),
    value: formatPl(pl * 100),
  };
};

const dataset = computed(() =>
  props.otokens.map((record) => {
    const reclaimableAmount = record?.reclaimable ?? 0;
    const isReclaimable = reclaimableAmount > 0;
    const token = useTokenList(record?.otoken.underlyingAsset.address);
    return [
      { value: token.symbol },
      formatDate(record.otoken.expiry),
      { value: record.premiumReceived },
      { value: record.otoken.strikePrice },
      { value: reclaimableAmount },
      calcProfitAndLoss(
        parseFloat(record.premiumReceived),
        parseFloat(record.collateral),
        reclaimableAmount
      ),
      {
        button: true,
        claimable: isReclaimable,
        label: isReclaimable ? "Claim" : "Claimed",
        color: isReclaimable ? "secondary-o" : "secondary",
      },
    ];
  })
);

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
  <div class="border border-white border-opacity-10 rounded-3xl">
    <PutOptionsTable
      :headings="headings"
      :dataset="dataset"
      @button-pressed="onButtonPressed"
    />
  </div>
</template>
