import {
  defineConfig,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

const preset = presetUno();

export default defineConfig({
  presets: [
    preset,
    presetTypography(),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: ["Hind:300,400,500,600,700"],
        serif: ["Roboto Slab:200,300,400,500,600,700"],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: "prose prose-sm m-auto text-left".split(" "),
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
      error: preset.theme.colors.red[500],
      warning: preset.theme.colors.yellow[500],

      black: preset.theme.colors.black,
      white: preset.theme.colors.white,
      gray: preset.theme.colors.coolGray,
      red: preset.theme.colors.red,
      yellow: preset.theme.colors.amber,
      green: preset.theme.colors.emerald,
      blue: preset.theme.colors.blue,
      indigo: preset.theme.colors.indigo,
      purple: preset.theme.colors.violet,
      pink: preset.theme.colors.pink,
    },

    width: {
      double: "200%",
    },
  },
});
