<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { TokenSelection } from "potion-ui";
import type { SelectableToken } from "dapp-types";

interface Props {
  tokens: SelectableToken[];
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: "token-selected", address: string): void;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="w-full xl:col-span-2">
    <TokenSelection
      v-if="props.tokens.length > 0"
      :tokens="props.tokens"
      @token-selected="(address) => emits('token-selected', address)"
    />
    <div v-else class="text-center">
      <p class="text-white/40 text-3xl uppercase">
        {{ t("no_underlying_asset_found") }}
      </p>
    </div>
  </div>
</template>
