<script lang="ts">
import type { SrcsetEnum } from "dapp-types";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseToast",
});
</script>
<script lang="ts" setup>
import PictureSet from "../PictureSet/PictureSet.vue";
export interface Props {
  title: string;
  body: string;
  srcsetMap: Map<SrcsetEnum, string>;
  cta?: {
    label?: string;
    url: string;
  };
}
const props = withDefaults(defineProps<Props>(), {
  cta: undefined,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
<template>
  <div
    class="relative w-[90%] sm:w-80 shadow-g border border-primary-500 bg-gradient-to-br from-[#262140] to-[#2e284f] rounded-2xl"
  >
    <div
      class="w-full grid grid-cols-4 py-3 pl-4 px-10 divide-x divide-white/10 gap-2"
    >
      <div class="text-center self-start mt-2">
        <PictureSet :srcset-map="props.srcsetMap" />
      </div>

      <div
        class="col-span-3 font-medium leading-none text-white self-stretch flex flex-col gap-2 justify-around break-words pl-2"
      >
        <p class="text-lg">{{ props.title }}</p>
        <p class="text-sm">{{ props.body }}</p>
        <a
          v-if="props.cta"
          class="inline-flex items-center self-start bg-white bg-opacity-10 font-normal text-xs uppercase py-0.5 px-1 rounded text-xs"
          target="_blank"
          :href="props.cta.url"
          >{{ props.cta.label || "view on etherscan"
          }}<i class="h-2 ml-2 i-ph-caret-right"></i
        ></a>
      </div>
    </div>
    <button
      class="absolute outline-none focus:outline-none right-4 top-4 text-dwhite-400"
      @click="emit('click')"
    >
      <i class="i-ph-x"></i>
    </button>
  </div>
</template>
