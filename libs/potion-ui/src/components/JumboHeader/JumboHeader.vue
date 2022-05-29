<script lang="ts">
import type { SrcsetEnum } from "dapp-types";
import { defineComponent } from "vue";

export default defineComponent({
  name: "JumboCard",
});
</script>
<script lang="ts" setup>
import BaseCard from "../BaseCard/BaseCard.vue";
import PictureSet from "../PictureSet/PictureSet.vue";
import BaseButton from "../BaseButton/BaseButton.vue";

export interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  iconSrcset?: Map<SrcsetEnum, string>;
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  ctaLabel: undefined,
  iconSrcset: undefined,
});

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>
<template>
  <BaseCard :full-height="false" class="relative overflow-hidden p-8">
    <h3
      v-if="subtitle"
      class="inline-block bg-gradient-to-r from-secondary-600 to-secondary-400 text-transparent bg-clip-text uppercase text-sm font-semibold"
    >
      {{ props.subtitle }}
    </h3>
    <h2 class="my-3 w-3/4 font-extrabold text-3xl">
      {{ props.title }}
    </h2>
    <slot></slot>
    <div>
      <BaseButton
        v-if="props.ctaLabel"
        test-card-cta
        :label="props.ctaLabel"
        palette="secondary"
        size="sm"
        @click="emit('click')"
      ></BaseButton>
    </div>

    <div class="absolute w-auto h-full top-0 right-0 z-0 overflow-hidden">
      <PictureSet
        v-if="props.iconSrcset"
        class="h-full w-full flex justify-end"
        :srcset-map="props.iconSrcset"
      ></PictureSet>
    </div>
  </BaseCard>
</template>
