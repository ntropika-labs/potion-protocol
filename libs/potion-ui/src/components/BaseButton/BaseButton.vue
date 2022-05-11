<script lang="ts">
import { computed, defineComponent } from "vue";
import { ButtonSize, ButtonPalette, ButtonWeight } from "../../types";

const baseClasses =
  "whitespace-nowrap justify-center items-center relative z-1 overflow-hidden font-poppins uppercase transition-shadow duration-300 rounded-full shadow-none  focus:outline-none disabled:(opacity-50 cursor-not-allowed)";
const btnSolidClasses =
  "before:(content-none absolute top-0 left-0 w-double h-full transition-transform duration-300 -z-1) hover:before:translate-x-[-50%]";
const btnOutlineClasses = "ring-2 transition-all hover:ring-4";

// prettier-ignore
export const buttonPaletteMap: Map<ButtonPalette, string> = new Map([
  [ButtonPalette.primary,         btnSolidClasses   + " text-dwhite-300 hover:shadow-primary before:(bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600)"],
  [ButtonPalette.secondary,       btnSolidClasses   + " text-dwhite-300 hover:shadow-secondary before:(bg-gradient-to-r from-secondary-500 via-secondary-400 to-secondary-600)"],
  [ButtonPalette.accent,          btnSolidClasses   + " text-dwhite-300 hover:shadow-accent before:(bg-gradient-to-r from-accent-500 via-accent-400 to-accent-600)"],
  [ButtonPalette.tertiary,        btnSolidClasses   + " text-dwhite-300 hover:shadow-tertiary before:(bg-gradient-to-r from-tertiary-500 via-tertiary-400 to-tertiary-600)"],
  [ButtonPalette.white,           btnSolidClasses   + " text-deep-black-900 hover:shadow-deep-black-800 before:(bg-dwhite-300)"],
  [ButtonPalette["primary-o"],    btnOutlineClasses + " ring-primary-500 text-dwhite-300 hover:(shadow-primary ring-primary-500)"],
  [ButtonPalette["secondary-o"],  btnOutlineClasses + " ring-secondary-500 text-dwhite-300 hover:(shadow-secondary from-secondary-400 to-secondary-500 ring-secondary-500)"],
  [ButtonPalette["accent-o"],     btnOutlineClasses + " ring-accent-500 text-dwhite-300 hover:(shadow-accent from-accent-400 to-accent-500 ring-accent-500)"],
  [ButtonPalette["white-o"],      btnOutlineClasses + " ring-dwhite-300 text-dwhite-300 hover:(shadow-primary ring-dwhite-300)"],
  [ButtonPalette["filter"],       "bg-transparent ring-1 ring-white ring-opacity-10 transition hover:(bg-white bg-opacity-10)"],
  [ButtonPalette["warning"],      "btn-warning"],
  [ButtonPalette["error"],        "btn-error"],
  [ButtonPalette.transparent,     "transition-all text-dwhite-300 hover:(shadow-sm bg-dwhite-300 bg-opacity-10)"],
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
}

const props = withDefaults(defineProps<Props>(), {
  size: ButtonSize.md,
  palette: ButtonPalette.primary,
  weight: ButtonWeight.medium,
  inline: false,
  type: "button",
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
    :disabled="props.disabled"
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
    <slot name="pre-icon"></slot>
    <span class="leading-none">
      {{ label }}
    </span>
    <slot name="post-icon"></slot>
  </button>
</template>
