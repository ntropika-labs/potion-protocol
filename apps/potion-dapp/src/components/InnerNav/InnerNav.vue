<template>
  <div test-inner-nav class="flex w-full space-x-4 uppercase font-bold text-xs">
    <template v-for="route in props.routes">
      <router-link
        v-if="route.enabled"
        :key="`enabled-${route.name}`"
        class="text-dirty-white-300"
        :test-route-link="route.name"
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
        :test-disabled-route="route.name"
        class="text-dwhite-300/30 cursor-not-allowed"
        >{{ route.label }}</span
      >
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { RouteRecordName, RouteParams } from "vue-router";

interface InnerNavRoute {
  enabled: boolean;
  label: string;
  name: string;
  params?: RouteParams;
}

interface Props {
  currentRoute: RouteRecordName | string | null | undefined;
  routes: InnerNavRoute[];
}
const props = defineProps<Props>();
</script>
