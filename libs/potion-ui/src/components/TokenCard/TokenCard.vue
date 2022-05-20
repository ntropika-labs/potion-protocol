<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TokenCard",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import BaseCard from "../BaseCard/BaseCard.vue";
import TokenIcon from "../TokenIcon/TokenIcon.vue";
export interface Props {
  address: string;
  image: string;
  name: string;
  symbol: string;
  selected?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  selected: false,
});

const emit = defineEmits<{
  (e: "token-selected", address: string): void;
}>();

let color = computed(() =>
  props.selected ? "primary-radial" : "primary-radial-inactive"
);
</script>

<template>
  <BaseCard
    test-token-card
    rounded="internal"
    class="items-center px-4 py-3 cursor-pointer w-20"
    :color="color"
    @click="emit('token-selected', props.address)"
  >
    <TokenIcon size="lg" :name="props.name" :image="props.image" class="mb-4" />
    <span class="text-sm text-white leading-none">{{ props.symbol }}</span>
  </BaseCard>
</template>
