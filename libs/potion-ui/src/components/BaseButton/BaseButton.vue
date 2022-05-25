<script lang="ts">
import { computed, defineComponent } from "vue";
import { ButtonSize, ButtonPalette, ButtonWeight } from "../../types";

const baseClasses =
  "whitespace-nowrap justify-center items-center relative z-1 overflow-hidden font-sans transition-shadow duration-300 rounded-full shadow-none  focus:outline-none disabled:(opacity-50 cursor-not-allowed)";
const btnSolidClasses =
  "before:(content-none absolute top-0 left-0 w-double h-full transition-transform duration-300 -z-1) hover:before:translate-x-[-50%]";
const btnOutlineClasses = "ring-2 transition-all hover:ring-4";

// prettier-ignore
export const buttonPaletteMap: Map<ButtonPalette, string> = new Map([
  [ButtonPalette.primary,         btnSolidClasses   + " uppercase text-dwhite-300 hover:shadow-primary before:(bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600)"],
  [ButtonPalette.secondary,       btnSolidClasses   + " uppercase text-dwhite-300 hover:shadow-secondary before:(bg-gradient-to-r from-secondary-500 via-secondary-400 to-secondary-600)"],
  [ButtonPalette.accent,          btnSolidClasses   + " uppercase text-dwhite-300 hover:shadow-accent before:(bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600)"],
  [ButtonPalette.tertiary,        btnSolidClasses   + " uppercase text-dwhite-300 hover:shadow-tertiary before:(bg-gradient-to-r from-tertiary-500 via-tertiary-400 to-tertiary-600)"],
  [ButtonPalette.white,           btnSolidClasses   + " uppercase text-deepBlack-900 hover:shadow-deep-black-800 before:(bg-dwhite-300)"],
  [ButtonPalette["primary-o"],    btnOutlineClasses + " uppercase ring-primary-500 text-dwhite-300 hover:(shadow-primary ring-primary-500)"],
  [ButtonPalette["secondary-o"],  btnOutlineClasses + " uppercase ring-secondary-500 text-dwhite-300 hover:(shadow-secondary from-secondary-400 to-secondary-500 ring-secondary-500)"],
  [ButtonPalette["accent-o"],     btnOutlineClasses + " uppercase ring-accent-500 text-dwhite-300 hover:(shadow-accent from-accent-400 to-accent-500 ring-accent-500)"],
  [ButtonPalette["white-o"],      btnOutlineClasses + " uppercase ring-dwhite-300 text-dwhite-300 hover:(shadow-primary ring-dwhite-300)"],
  [ButtonPalette["filter"],       "bg-transparent ring-1 ring-white ring-opacity-10 transition hover:(bg-white bg-opacity-10)"],
  [ButtonPalette["warning"],      "btn-warning"],
  [ButtonPalette["error"],        "btn-error"],
  [ButtonPalette.transparent,     "uppercase transition-all text-dwhite-300 hover:(shadow-sm bg-dwhite-300 bg-opacity-10)"],
  [ButtonPalette.flat,            "ring-0 ring-transparent text-center"]
]);

// prettier-ignore
export const buttonSizeMap: Map<ButtonSize, string> = new Map([
  [ButtonSize.icon,       "p-2"],
  [ButtonSize.xs,         "px-4 py-2 text-xs"],
  [ButtonSize.sm,         "px-4 py-3 text-xs tracking-widest"],
  [ButtonSize.md,         "px-6 py-4 text-md tracking-wider"],
  [ButtonSize.lg,         "px-8 py-5 text-lg tracking-wide"],
]);

// prettier-ignore
export const buttonWeightMap: Map<ButtonWeight, string> = new Map([
  [ButtonWeight.medium,    "font-medium"],
  [ButtonWeight.bold,      "font-bold"],
]);

export default defineComponent({
  name: "BaseButton",
});

type ButtonType = "button" | "submit";
</script>

<script lang="ts" setup>
export interface Props {
  label: string;
  size?: string;
  palette?: string;
  weight?: string;
  disabled?: boolean;
  inline?: boolean;
  type?: ButtonType;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: ButtonSize.md,
  palette: ButtonPalette.primary,
  weight: ButtonWeight.medium,
  inline: false,
  type: "button",
  loading: false,
});
const emit = defineEmits<{
  (e: "click"): void;
}>();

const sizeClass = computed(() => buttonSizeMap.get(props.size as ButtonSize));
const paletteClass = computed(() =>
  buttonPaletteMap.get(props.palette as ButtonPalette)
);
const weightClass = computed(() =>
  buttonWeightMap.get(props.weight as ButtonWeight)
);
</script>

<template>
  <button
    :title="props.label"
    :disabled="props.disabled || props.loading"
    :class="[
      baseClasses,
      paletteClass,
      sizeClass,
      weightClass,
      props.inline ? 'inline-flex' : 'flex',
    ]"
    :type="props.type"
    @click="emit('click')"
  >
    <slot v-if="!props.loading" name="pre-icon"></slot>
    <template v-else>
      <i class="i-eos-icons-loading mr-2"></i>
    </template>
    <p class="leading-none">
      {{ label }}
    </p>
    <slot name="post-icon"></slot>
  </button>
</template>
