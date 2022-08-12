<template>
  <div class="flex w-full space-x-4 uppercase font-bold text-xs">
    <template v-for="route in props.routes">
      <router-link
        v-if="route.enabled"
        :key="`enabled-${route.name}`"
        class="text-dirty-white-300"
        :to="route"
      >
        {{ route.label }}
        <div
          v-if="currentRoute === route.name"
          class="w-1/2 mt-2 h-[3px] bg-primary-500 bg-opacity-100"
        ></div>
      </router-link>
      <span
        v-else
        :key="`disabled-${route.name}`"
        class="text-dwhite-300/30 cursor-not-allowed"
        >{{ route.label }}</span
      >
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { RouteRecordName } from "vue-router";
interface Props {
  currentRoute: RouteRecordName | string | null | undefined;
  routes: {
    enabled: boolean;
    label: string;
    name: string;
    params: unknown;
  }[];
}
const props = defineProps<Props>();
</script>
