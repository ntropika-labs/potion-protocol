<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TippyTooltip",
});
</script>

<script lang="ts" setup>
import { onMounted, nextTick, ref } from "vue";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/translucent.css";

export interface Props {
  message: string;
  iconWeight?: "thin" | "light" | "regular" | "bold";
}

const classWeightMap = new Map<string, string>([
  ["thin", "i-ph-question-thin"],
  ["light", "i-ph-question-light"],
  ["regular", "i-ph-question"],
  ["bold", "i-ph-question-bold"],
]);

const props = withDefaults(defineProps<Props>(), {
  iconWeight: "regular",
});

const tippyDomRef = ref<HTMLDivElement | null>(null);

const mountTippy = () => {
  tippy(tippyDomRef.value, {
    allowHTML: true,
    content: props.message,
    theme: "translucent",
  });
};

onMounted(() => nextTick(mountTippy));
</script>

<template>
  <i
    ref="tippyDomRef"
    class="h-4 hover:cursor-help inline-block"
    :class="classWeightMap.get(props.iconWeight)"
  ></i>
</template>
