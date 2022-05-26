<script lang="ts">
import type { SrcsetEnum } from "dapp-types";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseToast",
});
</script>
<script lang="ts" setup>
import PictureSet from "../PictureSet/PictureSet.vue";
import { ref, onUnmounted } from "vue";
export interface Props {
  title: string;
  body: string;
  srcsetMap: Map<SrcsetEnum, string>;
  cta?: {
    label?: string;
    url: string;
  };
  timeout?: number;
}
const props = withDefaults(defineProps<Props>(), {
  cta: undefined,
  timeout: 20000,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
const progress = ref(0);
const ticker = ref(0);
const resolution = 50;
const interval = setInterval(function () {
  ticker.value += resolution;
  progress.value = (100 * ticker.value) / props.timeout;
  if (ticker.value === props.timeout) {
    clearInterval(interval);
  }
}, resolution);
onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <div
    class="relative sm:w-80 shadow-g border-2 border-primary-600/50 bg-gradient-to-br from-deepBlack-800/50 to-deepBlack-600/50 rounded-t-2xl rounded-b-sm backdrop-filter backdrop-blur"
  >
    <div
      class="w-full grid grid-cols-4 py-3 pl-4 px-10 divide-x divide-white/10 gap-2"
    >
      <div class="text-center self-center mt-2">
        <PictureSet :srcset-map="props.srcsetMap" />
      </div>

      <div
        class="col-span-3 font-medium leading-none text-white self-stretch flex flex-col gap-2 justify-around break-words pl-2"
      >
        <p class="text-sm">{{ props.title }}</p>
        <p class="text-xs">{{ props.body }}</p>
        <a
          v-if="props.cta"
          class="transition hover:bg-white/20 inline-flex items-center self-start bg-white/10 font-normal text-xs uppercase py-2 px-2 rounded leading-none"
          target="_blank"
          :href="props.cta.url"
          >{{ props.cta.label || "view on etherscan"
          }}<i class="h-2 ml-2 i-ph-caret-right"></i
        ></a>
      </div>
    </div>
    <button
      class="absolute outline-none leading-none focus:outline-none right-4 top-4 text-dwhite-400 transition hover:scale-120 rounded-full hover:bg-white/10 h-5 w-5 flex items-center justify-center"
      @click="emit('click')"
    >
      <i class="i-ph-x"></i>
    </button>
    <div class="rounded-full w-full bg-deepBlack-600 h-1">
      <div
        class="rounded-full h-1 bg-accent-500/60"
        :style="`width: ${progress}%`"
      ></div>
    </div>
  </div>
</template>
