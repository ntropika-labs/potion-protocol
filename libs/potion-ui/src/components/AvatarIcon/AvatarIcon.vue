<template>
  <div>
    <div
      v-if="!props.loaded"
      class="h-10 w-10 animated animate-flash animate-loop bg-white bg-opacity-10 animate-duration-6000 rounded-full"
    ></div>
    <img
      v-else-if="props.avatarUrl"
      class="h-10 w-10 rounded-full shadow-xl"
      :src="avatarUrl"
      alt=""
    />
    <span
      v-else-if="props.fallbackImageIcon"
      v-html="props.fallbackImageIcon"
    ></span>
  </div>
</template>

<script lang="ts" setup>
export interface Props {
  loaded?: boolean;
  avatarUrl: string;
  fallbackImageIcon?: string;
}
const props = withDefaults(defineProps<Props>(), {
  loaded: false,
  avatarUrl: "",
  fallbackImageIcon: "",
});
</script>
