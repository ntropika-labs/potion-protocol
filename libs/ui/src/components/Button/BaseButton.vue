<script lang="ts">
import { computed, defineComponent } from "vue";
import { ButtonSize, ButtonPalette } from "../../types";

// prettier-ignore
export const buttonPaletteMap: Map<string, string> = new Map([
  [ButtonPalette.primary,         "btn-full text-white hover:shadow-primary before:from-primary-500 before:via-primary-400 before:to-primary-600"],
  [ButtonPalette["primary-o"],    "ring-2 transition-all hover:ring-4 ring-primary-500 hover:shadow-primary hover:from-primary-400 hover:to-primary-500"],
  [ButtonPalette.secondary,       "btn-full text-white hover:shadow-secondary before:from-secondary-500 before:via-secondary-400 before:to-secondary-600"],
  [ButtonPalette["secondary-o"],  "ring-2 transition-all hover:ring-4 ring-secondary-500 hover:shadow-secondary hover:from-secondary-400 hover:to-secondary-500"],
  [ButtonPalette.transparent,     "btn-full bg-transparent hover:shadow-sm hover:bg-dirty-white-300 hover:bg-opacity-10"],
  [ButtonPalette.opaque,          "btn-full bg-dirty-white-300 bg-opacity-10 xl:bg-transparent hover:bg-opacity-30 hover:bg-dirty-white-300 hover:shadow-sm"],
]);

// prettier-ignore
export const buttonSizeMap: Map<string, string> = new Map([
  [ButtonSize.icon,       "p-2"],
  [ButtonSize.small,      "px-4 py-3 text-sm tracking-widest"],
  [ButtonSize.medium,     "px-6 py-4 text-md tracking-wider"],
  [ButtonSize.large,      "px-8 py-5 text-lg tracking-wide"],
]);

export default defineComponent({
  name: "BaseButton",
});
</script>

<script lang="ts" setup>
export interface Props {
  label: string;
  size?: string;
  palette?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: ButtonSize.medium,
  palette: ButtonPalette.primary,
});
const emit = defineEmits<{
  (e: "click"): void;
}>();
const sizeClass = computed(() => buttonSizeMap.get(props.size));
const paletteClass = computed(() => buttonPaletteMap.get(props.palette));
</script>

<template>
  <button
    :title="props.label"
    :disabled="props.disabled"
    type="button"
    class="btn cursor-pointer whitespace-nowrap text-dirty-white-300 font-bold inline-flex justify-center items-center relative z-10 overflow-hidden font-poppins uppercase transition-shadow duration-300 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:before:translate-x-[-50%]"
    :class="[paletteClass, sizeClass]"
    @click="emit('click')"
  >
    {{ props.label }}
    <slot />
  </button>
</template>

<style scoped>
.btn:hover::before {
  transform: translateX(-50%);
}

.btn.btn-full::before {
  content: "";
  @apply absolute top-0 left-0 w-[200%] h-full transition-transform duration-300 -z-1 bg-opacity-100 bg-gradient-to-r;
}
</style>
