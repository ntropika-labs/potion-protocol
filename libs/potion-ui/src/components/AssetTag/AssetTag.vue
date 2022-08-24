<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "AssetTag",
});

type LabelSize = "sm" | "md" | "lg" | "xl" | "2xl";
// prettier-ignore
const labelSizeMap: Map<LabelSize, string> = new Map([
  ["sm", "text-xs"],
  ["md", "text-sm"],
  ["lg", "text-base"],
  ["xl", "text-lg"],
  ["2xl", "text-xl font-semibold"],
]);
</script>
<script lang="ts" setup>
import TokenIcon from "../TokenIcon/TokenIcon.vue";
import type { Token } from "dapp-types";

export interface Props {
  title: string;
  tokens?: Token[];
  token?: Token;
  size?: LabelSize;
  isLoading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  tokens: undefined,
  token: undefined,
  size: "md",
  isLoading: false,
});
const sizeClass = computed(() => labelSizeMap.get(props.size));
</script>
<template>
  <div>
    <h5 class="mb-2 font-medium" :class="sizeClass">{{ props.title }}</h5>
    <div v-if="props.tokens" class="flex flex-wrap">
      <TokenIcon
        v-for="(tkn, index) in props.tokens"
        :key="`card-tokens-${index}`"
        class="rounded-full bg-deep-black-700 -mr-2"
        :address="tkn.address"
        :name="tkn.name"
        :image="tkn.image"
        :is-loading="props.isLoading"
      />
    </div>
    <div v-else-if="props.token" class="flex flex-wrap items-center">
      <TokenIcon
        class="rounded-full bg-deep-black-700 mr-2"
        :address="props.token.address"
        :name="props.token.name"
        :image="props.token.image"
        :is-loading="props.isLoading"
      />
      <p class="text-dwhite-300 font-bold uppercase">
        {{ props.token.symbol }}
      </p>
    </div>
  </div>
</template>
