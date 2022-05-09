import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "middle",
        // ...
      },
    }),
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
    colors: {
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
      "dirty-white": {
        300: "#FCFAFA",
        400: "#EEEAFD",
      },
      "deep-black": {
        1000: "#141023",
        900: "#1A152E",
        800: "#242038",
        700: "#342E56",
        600: "#433C68",
        500: "#887DB5",
      },
    },
    fontFamily: {
      serif: ['"Roboto Slab"', "serif"],
      sans: ['"Hind"', "sans-serif"],
    },
  },
});
