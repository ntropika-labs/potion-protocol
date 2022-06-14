<template>
  <button
    :disabled="props.disabled"
    class="relative w-full flex justify-between items-center transition px-4 py-2 text-dwhite-300 ring-1 rounded-xl bg-transparent cursor-pointer outline-none focus:( outline-none ring-primary-500 ) disabled:( opacity-60 cursor-not-allowed ) last:children:hover-opacity-100 z-300"
    :class="
      props.selected
        ? 'ring-primary-500'
        : 'ring-white/10 hover:( ring-white/20 )'
    "
    @click="$emit('click')"
  >
    <div class="flex gap-2 z-200 items-center">
      <PictureSet
        v-if="props.iconSrcset"
        class="h-full w-full flex justify-end h-8 w-8"
        :srcset-map="props.iconSrcset"
      >
      </PictureSet>
      <p class="font-normal text-sm lg:text-xs capitalize">{{ props.title }}</p>
    </div>
    <slot class="z-200 text-sm g:text-xs" />
    <div
      class="absolute inset-0 w-full h-full transition bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl z-100"
      :class="props.selected ? 'opacity-100' : 'opacity-0'"
    ></div>
    <div
      class="z-100 absolute inset-0 w-full h-full transition opacity-0 bg-radial-glass rounded-xl"
    ></div>
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SidebarLink",
});
</script>
<script lang="ts" setup>
import type { SrcsetEnum } from "dapp-types";
import PictureSet from "../PictureSet/PictureSet.vue";

export interface Props {
  title?: string;
  iconSrcset?: Map<SrcsetEnum, string>;
  selected: boolean;
  disabled: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  iconSrcset: undefined,
  title: "Title",
});
</script>
