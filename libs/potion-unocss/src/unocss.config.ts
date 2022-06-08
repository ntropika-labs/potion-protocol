import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

const preset = presetUno();

export default defineConfig({
  presets: [
    preset,
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: ["Poppins:100,200,300,400,500,600,700,800,900"],
        serif: ["Bitter:100,200,300,400,500,600,700,800,900"],
        mono: ["Fira Code", "Fira Mono:100,200,300,400,500,600,700,800,900"],
      },
    }),
    presetIcons({
      prefix: "i-",
      extraProperties: {
        display: "inline-flex",
        width: "1rem",
        height: "1rem",
        flex: "none",
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    "h-screen",
    "p-5",
    "font-sans",
    "text-dwhite-300",
    "bg-gradient-to-br",
    "from-deepBlue",
    "to-deepBlack-900",
    "font-medium",
    "text-accent-400",
    "text-error-400",
  ],
  rules: [
    [
      "bg-radial-glass",
      {
        background: `radial-gradient(
    77.23% 77.23% at 13.57% 18.81%,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0) 100%
  )`,
      },
    ],
  ],
  shortcuts: {
    "bg-radial-secondary":
      'relative z-10 overflow-hidden hover:shadow-secondary transition-shadow duration-300 before:(content-[""] absolute top-0 left-0 w-[200%] h-double transition-transform duration-300 -z-1 bg-gradient-to-br from-secondary-500 via-secondary-400 to-secondary-600) hover:before:(-translate-x-1/2 -translate-y-1/2)',
    "bg-radial-neutral": "bg-white bg-opacity-5",
    "bg-radial-primary":
      "relative z-10 overflow-hidden hover:shadow-primary transition-shadow duration-300 before:(content-[''] absolute top-0 left-0 w-double h-double transition-transform duration-300 -z-1 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600)",
    "bg-radial-primary-inactive":
      'relative z-10 overflow-hidden border border-white border-opacity-10 before:(content-[""] absolute top-0 left-0 w-full h-full transition-opacity duration-300 opacity-0 -z-1 bg-gradient-to-br from-primary-500 via-primary-400 to-primary-600) hover:before:(opacity-100)',
  },
  theme: {
    screens: {
      "2xl": "1536px",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",

      primary: {
        600: "#5837CC",
        500: "#724CF9",
        400: "#8E6EFD",
      },
      secondary: {
        600: "#C11E71",
        500: "#FA198B",
        400: "#E373AC",
      },
      accent: {
        600: "#0ea061",
        500: "#3DDC97",
        400: "#66C49C",
      },
      tertiary: {
        600: "#d8913f",
        500: "#ECBA82",
        400: "#FFDFBC",
      },
      dwhite: {
        300: "#FCFAFA",
        400: "#EEEAFD",
      },
      deepBlack: {
        1000: "#141023",
        900: "#1A152E",
        800: "#242038",
        700: "#342E56",
        600: "#433C68",
        500: "#887DB5",
      },
      deepBlue: "#231b4b",
      //@ts-expect-error - no type for iterable
      error: preset.theme?.colors?.red[500],
      //@ts-expect-error - no type for iterable
      warning: preset.theme?.colors?.yellow[500],

      black: preset.theme?.colors?.black,
      white: preset.theme?.colors?.white,
      gray: preset.theme?.colors?.coolGray,
      red: preset.theme?.colors?.red,
      yellow: preset.theme?.colors?.amber,
      green: preset.theme?.colors?.emerald,
      blue: preset.theme?.colors?.blue,
      indigo: preset.theme?.colors?.indigo,
      purple: preset.theme?.colors?.violet,
      pink: preset.theme?.colors?.pink,
    },
    boxShadow: {
      primary: "0px 4px 20px 4px rgba(114, 76, 249, 0.35) ",
      secondary: "0 4px 20px 4px rgba(250, 25, 139, 0.35)",
      accent: "0 4px 20px 4px rgba(61, 220, 151, 0.35)",
      tertiary: "0 4px 20px 4px rgba(236, 186, 130, 0.35)",
      "deep-black-800": "0 4px 20px 4px rgba(36, 32, 56, 0.20)",
    },

    width: {
      double: "200%",
    },
    height: {
      double: "200%",
    },
  },
});
