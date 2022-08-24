<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TokenIcon",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";

const sizeToClasses = new Map<string, string>([
  ["sm", "w-4 h-4"],
  ["base", "w-5 h-5"],
  ["md", "w-6 h-6"],
  ["lg", "w-7 h-7"],
  ["xl", "w-8 h-8"],
  ["2xl", "w-10 h-10"],
]);

const keys = Array.from(sizeToClasses.keys());
type TokenSizes = typeof keys[number];

const props = withDefaults(
  defineProps<{
    name: string;
    image?: string;
    size?: TokenSizes;
    isLoading?: boolean;
  }>(),
  {
    image:
      "https://s.gravatar.com/avatar/da32ff79613d46d206a45e5a3018acf3?size=496&default=retro",
    size: "md",
    isLoading: false,
  }
);

const size = computed(() => sizeToClasses.get(props.size));
</script>

<template>
  <span
    v-if="isLoading"
    class="object-cover rounded-full bg-white bg-opacity-60 animate-pulse"
    :class="size"
  ></span>
  <img
    v-else
    test-token-icon
    class="object-cover rounded-full"
    :src="props.image"
    :alt="props.name"
    :class="size"
  />
</template>
