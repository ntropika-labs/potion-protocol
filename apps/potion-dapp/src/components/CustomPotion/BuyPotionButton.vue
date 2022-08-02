<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { BaseButton } from "potion-ui";
import { useOnboard } from "@onboard-composable";

interface Props {
  balance: number;
  allowance: number;
  slippage: number;
  valid?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  valid: true,
  loading: false,
});
const emits = defineEmits<{
  (e: "buyPotions"): void;
}>();

const { t } = useI18n();
const { connectedWallet } = useOnboard();

const state = computed(() => {
  if (props.loading) {
    return {
      label: t("loading"),
      disabled: true,
    };
  }
  if (connectedWallet.value) {
    if (!props.valid) {
      return {
        label: t("invalid_potion"),
        disabled: true,
      };
    }
    if (props.balance < props.slippage) {
      return {
        label: t("not_enough_usdc"),
        disabled: true,
      };
    }

    const label =
      props.allowance >= props.slippage ? t("buy_potion") : t("approve");
    return {
      label,
      disabled: false,
    };
  }

  return {
    label: t("connect_wallet"),
    disabled: true,
  };
});
</script>
<template>
  <BaseButton
    palette="secondary"
    :label="state.label"
    :disabled="state.disabled"
    @click="emits('buyPotions')"
  />
</template>
