<script lang="ts">
import { defineComponent } from "vue";
import { SrcsetEnum } from "dapp-types";

export default defineComponent({
  name: "PictureSet",
});
</script>
<script lang="ts" setup>
export interface Props {
  srcsetMap: Map<SrcsetEnum, string>;
}

const props = defineProps<Props>();
</script>
<template>
  <picture>
    <source
      v-if="props.srcsetMap.has(SrcsetEnum.AVIF)"
      type="image/avif"
      :srcset="props.srcsetMap.get(SrcsetEnum.AVIF)"
    />
    <source
      v-if="props.srcsetMap.has(SrcsetEnum.WEBP)"
      type="image/webp"
      :srcset="props.srcsetMap.get(SrcsetEnum.WEBP)"
    />
    <source
      v-if="props.srcsetMap.has(SrcsetEnum.PNG)"
      type="image/png"
      :srcset="props.srcsetMap.get(SrcsetEnum.PNG)"
    />
    <img
      class="w-full h-full object-contain"
      :src="props.srcsetMap.get(SrcsetEnum.PNG)"
    />
  </picture>
</template>
